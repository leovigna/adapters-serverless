if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const util = require('ethereumjs-util')
const cbor = require('cbor');
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider');

const wallet = new HDWalletProvider(process.env.LOCAL_HD_WALLET_MNEMONIC, process.env.LOCAL_RPC);
const web3 = new Web3(wallet)

async function test() {
    const accounts = await web3.eth.getAccounts();
    
    const data = {
        "resource": "videos",
        "action": "list",
        "params": {
            "part": "statistics",
            "maxResults": 50,
            "myRating": "like"
        }
    }
    const msg = cbor.encode(data);
    const sig = await web3.eth.sign('0x' + msg.toString('hex'), accounts[0]);
    const res = util.fromRpcSig(sig);

    const prefix = Buffer.from("\x19Ethereum Signed Message:\n");
    const prefixedMsg = util.keccak256(
        Buffer.concat([prefix, Buffer.from(String(msg.length)), msg])
    );

    const pubKey = util.ecrecover(prefixedMsg, res.v, res.r, res.s);
    const addrBuf = util.pubToAddress(pubKey);
    const addr = util.bufferToHex(addrBuf);

    console.log(`CBOR Message: ${msg.toString('hex')}`);
    console.log(`Original signature: ${sig}`);
    console.log(`r: ${res.r.toString('hex')}\ns: ${res.s.toString('hex')}\nv: ${res.v}`);
    console.log(accounts[0], addr);

}

async function main() { 
    try { await test() } catch (e) {console.error(e)}
}
main()