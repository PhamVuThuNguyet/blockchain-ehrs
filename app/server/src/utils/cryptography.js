const SEAL = require('node-seal');

function stringToUint32Array(str) {
    const uint32Array = new Uint32Array(str.length);

    for (let i = 0; i < str.length; i++) {
        uint32Array[i] = str.charCodeAt(i);
    }

    return [str.length, uint32Array];
}

async function createContext(seal) {
    const schemeType = seal.SchemeType.bfv
    const securityLevel = seal.SecurityLevel.tc128
    const polyModulusDegree = 8192
    const bitSizes = [36, 36, 37]
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

async function generateKeys(context, seal) {
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

/**
 * Homomorphic Function
 * @param {string} textA
 * @param {string} textB 
 * @param {seal.Context} context 
 * @param {seal} seal 
 * @param {object} keychain 
 * @returns 
 */
async function executeHomomorphic(cipherTextPrev, cipherTextPrevLength, text, seal, context, keychain) {
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

async function createCipherText(seal, context, keychain, text) {
    // Create a BatchEncoder (only BFV SchemeType)
    const batchEncoder = seal.BatchEncoder(context)

    // Create an Encryptor to encrypt PlainTexts
    const encryptor = seal.Encryptor(context, keychain.publicKey)

    const [textLength, text32] = stringToUint32Array(text);

    // Encode data to a PlainText
    const plainText = batchEncoder.encode(text32)

    // Encrypt a PlainText
    const cipherText = encryptor.encrypt(plainText)

    return [textLength, cipherText]
}

async function decryptCipherText(seal, context, keychain, cipherText) {
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

async function homomorphicEncryption(stringA, stringB) {

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

    const decoded = await decryptCipherText(seal, context, keychain, stringABCipher);

    const dec = new TextDecoder()
    console.log('decoded concatenated text: ', dec.decode(new Uint8Array(decoded.buffer)))

}

const stringA = "Hello, "
const stringB = "NeuralMed!"

homomorphicEncryption(stringA, stringB);