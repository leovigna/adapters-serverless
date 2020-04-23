const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const ETH_RPC = process.env.ETH_RPC
const HD_WALLET_MNEMONIC = process.env.HD_WALLET_MNEMONIC
const GAS_LIMIT = process.env.GAS_LIMIT || 200000
const GAS_PRICE = process.env.GAS_PRICE || 50000000000

if (!ETH_RPC) throw new Error("Missing ETH_RPC!");
if (!HD_WALLET_MNEMONIC) throw new Error("Missing HD_WALLET_MNEMONIC!");

const web3 = new Web3(new HDWalletProvider(HD_WALLET_MNEMONIC, ETH_RPC));

module.exports.default = ({ id, data }) => {
    const { address, functionSelector, dataPrefix, value } = data
    const buffers = []
    if (functionSelector) buffers.push(Buffer.from(web3.utils.hexToBytes(functionSelector)))
    if (dataPrefix) {
        //Pad to 32 bytes
        const bytes = web3.utils.hexToBytes(dataPrefix);
        const paddingLength = bytes.length < 32 ? 32 - bytes.length : bytes.length % 32;
        if (paddingLength != 0) {
            console.log(paddingLength)
            const padding = new Buffer(paddingLength);
            buffers.push(Buffer.concat([padding, Buffer.from(bytes)]))
        } else {
            buffers.push(Buffer.from(bytes))
        }
    }

    if (value) buffers.push(Buffer.from(web3.utils.hexToBytes(value)))

    const txdata = Buffer.concat(buffers).toString('hex');
    console.log(txdata)

    return new Promise((resolve, reject) => {
        web3.eth.getAccounts().then((accounts) => {
            //console.log(accounts[0])
            web3.eth.sendTransaction({
                from: accounts[0],
                to: address,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
                data: '0x' + txdata
            }).on('transactionHash', function (hash) {

                delete data.address;
                delete data.functionSelector;
                delete data.dataPrefix;
                delete data.value;
                delete data.relayTx;

                data.tx = { transactionHash: hash }

                resolve({
                    jobRunID: id,
                    data: data
                })
            }).on('error', console.log)
        })
    })
}