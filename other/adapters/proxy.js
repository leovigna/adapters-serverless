const request = require("request-promise-native");

module.exports.default = async (data) => {

    console.log(data)
    const { twitchId, ethAddress } = data.queryStringParameters

    const response = await request({
        headers: {
            'X-Chainlink-EA-AccessKey': "29fc945b88f5485daf5160d0132c0e2a",
            'X-Chainlink-EA-Secret': "HG0JaTfwm35pCQNUgcWvuksXJDazML0PDmfqByWghTWxWtLx7y7Fh4qJH5HD6grT"
        },
        method: 'POST',
        url: process.env.CHAINLINK_URL + "/v2/specs/" + process.env.JOB_OAUTH + "/runs",
        body: JSON.stringify({ twitchId, ethAddress }),
        json: true})

    return {
        statusCode: 200,
        body: response.body
    };
};
