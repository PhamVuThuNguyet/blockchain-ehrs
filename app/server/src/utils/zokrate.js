const crypto = require('crypto');
const sha256 = require('crypto-js/sha256.js');

const reducer = Number(1e9+7);

const circuit = `
import "hashes/sha256/512bitPacked" as sha256packed;
import "utils/casts/field_to_u64" as field_to_u64;
def main(private field privateKey, private field primeDivider, private field modulus)
{
    u64 pk = field_to_u64(privateKey);
    u64 dv = field_to_u64(primeDivider);
    u64 mod = field_to_u64(modulus);
    assert(mod == (pk % dv));
    return;
}`;

const generateRandomPrime = () => {
    return crypto.generatePrimeSync(64, { bigint: true });
};

const generateInput = async (pk, randomPrime) => {
    const hashed_pk = sha256(pk);
    let privateKey = BigInt(`0x${hashed_pk}`);
    let primeDivider = randomPrime;

    privateKey = Number(privateKey) % reducer;
    primeDivider = Number(primeDivider) % reducer;
    const modulus = privateKey % primeDivider;
    const res = {
        privateKey: privateKey,
        primeDivider: primeDivider,
        modulus: modulus,
    };
    console.log('zokrate-prover/gen Input:');
    console.table(res);
    return res;
};

const generateProof = async (ownerSign, pk, randomPrime) => {
    try {
        const { initialize } = await import("zokrates-js");

        const zokratesProvider = await initialize();

        const source = circuit;

        const artifacts = zokratesProvider.compile(source);

        const keypair = zokratesProvider.setup(artifacts.program);

        const verificationKey = keypair.vk;

        let proof = null;

        const res = await generateInput(pk, randomPrime);

        try {
            const { witness, output } = zokratesProvider.computeWitness(artifacts, [`${res.privateKey}`, `${res.primeDivider}`, `${ownerSign}`]);
            proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
            return { proof, verificationKey };
        } catch (err) {
            console.log('error', err);
        }
        return { proof, verificationKey };
    } catch (err) {
        console.error('err', err);
    }
};

const verifyProof = async (verificationKey, proof) => {
    try {
        const { initialize } = await import("zokrates-js");
        const zokratesProvider = await initialize();

        const isVerified = zokratesProvider.verify(verificationKey, proof);
        
        return isVerified;
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    generateRandomPrime,
    generateInput,
    generateProof,
    verifyProof
};
