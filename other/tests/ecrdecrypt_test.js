if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const assert = require('assert')
const eccrypto = require('eccrypto') // Security review neded !

async function test() {
    // Keys
    const adapterPrivateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex') || eccrypto.generatePrivate();
    const adapterPublicKey = eccrypto.getPublic(adapterPrivateKey);
    console.log(adapterPrivateKey.toString('hex'));

    // Raw data
    const data = {
        "resource": "videos",
        "action": "list",
        "params": {
            "part": "statistics",
            "maxResults": 50,
            "myRating": "like"
        }
    }
    // Plaintext
    const msg = JSON.stringify(data)
    // Requester sends encrypted message
    const encrypted = await eccrypto.encrypt(adapterPublicKey, Buffer.from(msg))
    const encryptedDisplay = { 
        iv: encrypted.iv.toString('hex'),
        ephemPublicKey: encrypted.ephemPublicKey.toString('hex'),
        ciphertext: encrypted.ciphertext.toString('hex'),
        mac: encrypted.mac.toString('hex')
    }
    console.log(encryptedDisplay)

    // Adapter decrypts message
    const decrypted = await eccrypto.decrypt(adapterPrivateKey, encrypted)
    const decryptedHex = decrypted.toString('hex');
    const decryptedString = decrypted.toString();
    
    console.log(`Original: ${msg}\nDecrypted: ${decryptedString}`);

}

async function main() { 
    try { await test() } catch (e) { console.error(e) }
}

main()