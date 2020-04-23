
const cbor = require('cbor');
const assert = require('assert');
const util = require('ethereumjs-util')

//None ? Replay protection?
module.exports.default = async ({ id, data }) => {
    const { signature, ...other } = data;
    if (!signature) {
        //Ignore
        const response = {
            jobRunID: id,
            data: data
        };
        return response;
    }

    if (signature.verified) throw new Error("Invalid signature.")

    // Encoded data back as CBOR
    const signatureData = { ...other }
    const msg = cbor.encode(signatureData);

    // Get signature    
    let res = {};
    if (signature.r && signature.s && signature.v) {
        res.r = Buffer.from(signature.r, 'hex')
        res.s = Buffer.from(signature.s, 'hex')
        res.v = Buffer.from(String(signature.v))
    } else {
        res = util.fromRpcSig(signature); //hex encoded RPC sig 
    }
    if (!res.r || !res.s || !res.v) throw new Error("Invalid signature.");

    // Compute message hash
    //From https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
    const prefix = Buffer.from("\x19Ethereum Signed Message:\n");
    const prefixedMsg = util.keccak256(
        Buffer.concat([prefix, Buffer.from(String(msg.length)), msg])
    );

    const pub = util.ecrecover(prefixedMsg, res.v, res.r, res.s);
    const addrBuf = util.pubToAddress(pub);
    const addr = util.bufferToHex(addrBuf);
    if (!addr) throw new Error("Could not recover address.")

    console.log(`CBOR Message: ${msg.toString('hex')}`);
    console.log(`Original signature: ${signature}`);
    console.log(`r: ${res.r.toString('hex')}\ns: ${res.s.toString('hex')}\nv: ${res.v}`);
    console.log(`address: ${addr}`);

    data.signature.address = addr;
    data.signature.verified = true;
    const response = {
        jobRunID: id,
        data: data
    };
    return response;
};