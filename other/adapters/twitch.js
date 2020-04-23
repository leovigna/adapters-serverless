const namehash = require('eth-ens-namehash')
const Web3 = require('web3');
const web3 = new Web3();

function bufferToBytes32(buffer) {
    const padding = new Buffer(32 - buffer.length);
    return Buffer.concat([padding, buffer])
}

function stringToBytes32(str, enc) {
    const buffer = Buffer.from(str, enc)
    return '0x' + bufferToBytes32(buffer).toString('hex')
}

function integerToBytes32(num) {
    return web3.eth.abi.encodeParameter('uint256', num);
}

module.exports.oauth = async ({
    id,
    data
}) => { 
    const { twitchId, ethAddress } = data;
    console.log(data)
    if (!twitchId) { throw Error("Missing twitchId."); }
    if (!ethAddress) { throw Error("Missing address."); }

    const address32Bytes = '0x' + bufferToBytes32(Buffer.from(web3.utils.hexToBytes(ethAddress))).toString("hex");
    const twitchId32Bytes = '0x' + bufferToBytes32(Buffer.from(twitchId, 'ascii')).toString("hex");    
    console.log(address32Bytes)
    console.log(twitchId32Bytes)



    const addressTable = namehash.hash('address')
    //assert(addressTable === '0xb160867a71bae0eb025e7a38d47b10c9ca6a2f559fa6e4118c43804c117924e0')
    const twitchIdTable = namehash.hash('twitchId')
    //assert(twitchIdTable === '0x69cadcb5ac61bf9149b90aead3b3b2bc5feddfb165339585cd96012ad68d1fb5')
    const addressTwitchIdTableDef = namehash.hash(`address.id.twitchId`)
    //assert(addressTwitchIdTableDef === '0x53050e48568738786081ca9af10911bbb94b8354c09c0e036099ab614137937f')
    const addressTwitchIdTable = namehash.hash(`address.${address32Bytes}.twitchId`)

    const batchAdd = {
        "_table":[addressTable, twitchIdTable, addressTwitchIdTableDef, addressTwitchIdTable],
        "_row": [address32Bytes, twitchId32Bytes, addressTwitchIdTable, twitchId32Bytes]
    }

    return { 
        statusCode: 200, 
        body: {
            jobRunID: id,
            data: { parameters: batchAdd }
        }
    }
}

module.exports.subscriberReward = async ({
    id,
    data
}) => { 


}

module.exports.cheerReward = async ({
    id,
    data
}) => { 

}

module.exports.viewReward = async ({
    id,
    data
}) => {
    const { twitchId, videoId, startTime, endTime } = data;

    const channel = namehash.hash(`channel`);
    const twitchIdChannelTableDef = namehash.hash(`twitchId.id.channel`);
    const twitchIdChannelViewsTableDef = namehash.hash(`twitchId.id.channel.id.views`);

    const twitchIdChannelTable = namehash.hash(`twitchId.${twitchId}.channel`);
    const twitchIdChannelViewsTable = namehash.hash(`twitchId.${twitchId}.channel.${videoId}.views`);
    const time = endTime - startTime;
    const timeEncoded = integerToBytes32(time);

    const batchAdd = {
        "_table":[channel, twitchIdChannelTable, twitchIdChannelViewsTable, twitchIdChannelViewsTableDef, twitchIdChannelTableDef],
        "_row": [stringToBytes32(videoId), stringToBytes32(videoId),  timeEncoded, twitchIdChannelViewsTable, twitchIdChannelTable]
    }

    return { 
        statusCode: 200, 
        body: {
            jobRunID: id,
            data: { parameters: batchAdd }
        }
    }
}