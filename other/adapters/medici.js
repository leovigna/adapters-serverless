const Web3 = require('web3');
const web3 =  new Web3();

//Dummy data
module.exports.randomAddressID = async ({ id }) => {
    const accounts = web3.eth.accounts.wallet.create(1);
    const randAddress = accounts[0].address;

    const randString =  Math.random().toString(36)
    const randBytes = Buffer.from(randString);
    const padding = new Buffer(32 - randBytes.length);
    const randBytes32 = '0x' + Buffer.concat([padding, randBytes]).toString('hex');
    

    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: { "parameters": [randAddress, randBytes32] } //Format for web3 encoding
        }
    }
}

module.exports.randomAddressAddress = async ({ id }) => {
    const accounts = web3.eth.accounts.wallet.create(2);
    const randAddress = accounts[0].address;
    const randAddress2 = accounts[1].address;

    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: { "parameters": [randAddress, randAddress2] } //Format for web3 encoding
        }
    }
}

//authorizeUser
module.exports.authorizeUser = async ({ id, data }) => {
    const { address } = data
    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: { "parameters": [[address]] } //Format for web3 encoding
        }
    }
}

//authorizeChannel
module.exports.authorizeChannel = async ({ id, data }) => {
    const { address } = data
    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: { "parameters": [[address]] } //Format for web3 encoding
        }
    }
}

//Sync data
module.exports.syncLikes = async ({ id, data }) => {

}

module.exports.syncSubscribers = async ({ id, data }) => {

}

module.exports.syncVideos = async ({ id, data }) => {

}