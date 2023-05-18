const SEAL = require('node-seal');
const fs = require('fs');

const stringToUint32Array = (str) => {
    const uint32Array = new Uint32Array(str.length - 1);

    for (let i = 1; i < str.length - 1; i++) {
        uint32Array[i - 1] = str.charCodeAt(i);
    }

    uint32Array[str.length - 2] = ','.charCodeAt(0);

    return [str.length, uint32Array];
}

const createContext = async (seal) => {
    const schemeType = seal.SchemeType.bfv
    const securityLevel = seal.SecurityLevel.tc128
    const polyModulusDegree = 8192
    const bitSizes = [43, 43, 44, 44, 44]
    const bitSize = 60

    const encParms = seal.EncryptionParameters(schemeType)

    // Set the PolyModulusDegree
    encParms.setPolyModulusDegree(polyModulusDegree)

    // Create a suitable set of CoeffModulus primes
    encParms.setCoeffModulus(
        seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
    )

    // Set the PlainModulus to a prime of bitSize 20.
    encParms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize))

    ////////////////////////
    // Context
    ////////////////////////
    // Create a new Context
    const context = seal.Context(
        encParms, // Encryption Parameters
        true, // ExpandModChain
        securityLevel // Enforce a security level
    )

    if (!context.parametersSet()) {
        throw new Error(
            'Could not set the parameters in the given context. Please try different encryption parameters.'
        )
    }

    return context;
}

const generateKeys = async (context, seal) => {
    // Create a new KeyGenerator (creates a new keypair internally)
    const keyGenerator = seal.KeyGenerator(context)
    const secretKey = keyGenerator.secretKey()
    const publicKey = keyGenerator.createPublicKey()
    const galoisKeys = keyGenerator.createGaloisKeys()

    return {
        secretKey: secretKey,
        publicKey: publicKey,
        galoisKeys: galoisKeys
    }
}


const loadKeys = async () => {
    const seal = await SEAL();
    const context = await createContext(seal);

    const secretData = fs.readFileSync('secretKey.txt');

    const secretKey = seal.SecretKey();
    secretKey.load(context, secretData.toString());

    const publicData = fs.readFileSync('publicKey.txt');

    const publicKey = seal.PublicKey();
    publicKey.load(context, publicData.toString());

    const keyGenerator = seal.KeyGenerator(context, secretKey, publicKey)

    const galoisKeys = keyGenerator.createGaloisKeys()

    return {
        secretKey: secretKey,
        publicKey: publicKey,
        galoisKeys: galoisKeys
    }
}

/**
 * Homomorphic Function
 * @param {string} textA
 * @param {string} textB 
 * @param {seal.Context} context 
 * @param {seal} seal 
 * @param {object} keychain 
 * @returns 
 */
const executeHomomorphic = async (cipherTextPrev, cipherTextPrevLength, text, seal, context, keychain) => {
    // Create an Evaluator which will allow HE functions to execute
    const evaluator = seal.Evaluator(context)

    const [textLength, cipherText] = await createCipherText(seal, context, keychain, text)

    // Rotate the second ciphertext to the right
    const cipherDest = evaluator.rotateRows(cipherText, -cipherTextPrevLength, keychain.galoisKeys);

    // Add the two ciphertexts element-wise
    const cipherTextD = seal.CipherText();
    evaluator.add(cipherTextPrev, cipherDest, cipherTextD);

    return [textLength + cipherTextPrevLength, cipherTextD]
}

const createCipherText = async (text) => {
    const seal = await SEAL();
    const context = await createContext(seal);
    const keychain = await generateKeys(context, seal);

    // Create a BatchEncoder (only BFV SchemeType)
    const batchEncoder = seal.BatchEncoder(context)

    // Create an Encryptor to encrypt PlainTexts
    const encryptor = seal.Encryptor(context, keychain.publicKey)

    const [textLength, text32] = stringToUint32Array(text)

    // Encode data to a PlainText
    const plainText = batchEncoder.encode(text32);
    console.log(plainText.toPolynomial());

    // Encrypt a PlainText
    const cipherText = encryptor.encrypt(plainText)

    return [textLength, cipherText]
}

const decryptCipherText = async (seal, context, keychain, cipherText) => {
    // Create a BatchEncoder (only BFV SchemeType)
    const batchEncoder = seal.BatchEncoder(context)

    // Create a Decryptor to decrypt CipherTexts
    const decryptor = seal.Decryptor(context, keychain.secretKey);

    // Decrypt a CipherText
    const plainTextD = decryptor.decrypt(cipherText)

    const decoded = batchEncoder.decode(
        plainTextD,
        true // Can be omitted since this defaults to true.
    )

    return decoded
}

const createKeyPair = async () => {
    const seal = await SEAL();
    const context = await createContext(seal);
    const keychain = await generateKeys(context, seal);
    return keychain;
}

const createSealAndContext = async () => {
    const seal = await SEAL();
    const context = await createContext(seal);

    return [seal, context];
}

const homomorphicEncryption = async (stringA, stringB) => {

    const seal = await SEAL();
    const context = await createContext(seal);

    ////////////////////////
    // Keys
    ////////////////////////
    const keychain = await generateKeys(context, seal);

    ////////////////////////
    // Homomorphic Functions
    ////////////////////////// 

    [stringALength, stringACipher] = await createCipherText(seal, context, keychain, stringA);
    [stringABLength, stringABCipher] = await executeHomomorphic(stringACipher, stringALength, stringB, seal, context, keychain);
    [stringABBLength, stringABBCipher] = await executeHomomorphic(stringABCipher, stringABLength, stringB, seal, context, keychain);

    const decoded = await decryptCipherText(seal, context, keychain, stringABBCipher);

    const dec = new TextDecoder()
    console.log('decoded concatenated text: ', JSON.parse(JSON.stringify("{" + dec.decode(new Uint8Array(decoded.buffer)) + "}")))
}

// const data = {
//     'PID': {
//         'patientName': 'John Doe',
//         'patientId': '12345',
//         'patientAddress': '123 Main St',
//         'patientPhone': '555-555-5555'
//     },
//     'OBR': {
//         'testName': 'Blood Test',
//         'testDate': '2023-05-01',
//         'testResults': {
//             'Glucose': '120',
//             'Cholesterol': '200',
//             'HDL': '60',
//             'LDL': '130'
//         }
//     },
// }
// const addData = {
//     'OBR': {
//         'testName': 'Blood Test',
//         'testDate': '2023-05-01',
//         'testResults': {
//             'Glucose': '120',
//             'Cholesterol': '200',
//             'HDL': '60',
//             'LDL': '130'
//         }
//     }
// }

// const stringA = JSON.stringify(data)
// const stringB = JSON.stringify(addData)

// homomorphicEncryption(stringA, stringB);

module.exports = {
    homomorphicEncryption,
    executeHomomorphic,
    decryptCipherText,
    createCipherText,
    createContext,
    createKeyPair,
    createSealAndContext,
    loadKeys
};