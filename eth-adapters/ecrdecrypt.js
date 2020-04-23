// Decrypt encrypted request
// Encrypted request data using ECIES & Diffie-Helman Key Exchange
//https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
//https://en.wikipedia.org/wiki/Integrated_Encryption_Scheme

//https://github.com/bitchan/eccrypto
const eccrypto = require('eccrypto') // Security review neded !
const cbor = require('cbor');
//Use Node v10

// Could be Oracle's private key or another one
// The associated public key should be broadcasted on-chain
// Requesters use the public key to encrypt the data
const adapterPrivateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');
//const adapterPublicKey = eccrypto.getPublic(adapterPrivateKey);

module.exports.default = async ({ id, data }) => {
    const { encrypted } = data;
    if (!encrypted) {
        //Ignore
        const response = {
            jobRunID: id,
            data: data
        };
        return response;
    }

    let { iv, ephemPublicKey, ciphertext, mac } = encrypted;
    iv = Buffer.from(iv, 'hex')
    ephemPublicKey = Buffer.from(ephemPublicKey, 'hex')
    ciphertext = Buffer.from(ciphertext, 'hex')
    mac = Buffer.from(mac, 'hex')
    const opt = { iv, ephemPublicKey, ciphertext, mac }
    // Decrypt
    let decrypted = await eccrypto.decrypt(adapterPrivateKey, opt)
    console.log(decrypted.toString('ascii'))
    // Parse
    let encrypted_dtype = data.encrypted_dtype || data.encryptedDtype || "bytes";
    if (encrypted_dtype.toLowerCase() === "bytes") { //Raw bytes, dump as hex
        decrypted = decrypted.toString('hex');
    } else if (encrypted_dtype.toLowerCase() === "cbor") { //CBOR bytes, parse data
        decrypted = cbor.decode(decrypted);
    } else if (encrypted_dtype.toLowerCase() === "json") { //JSON string
        decrypted = JSON.parse(decrypted);
    }

    // Replace with decrypted data
    delete data.encrypted;
    data.decrypted = decrypted;
    const response = {
        jobRunID: id,
        data: data
    };
    return response;
};