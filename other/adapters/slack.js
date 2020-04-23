const request = require('request-promise-native');

module.exports.default = async ({
    id,
    data
}) => {
    const text = JSON.stringify(data); 
    const webhook = data.webhook || process.env.SLACK_WEBHOOK
    const options = {
        url: webhook,
        body: { text: `New Request ${id}:\n${text}` },
        json: true
    };

    await request.post(options);
    return { 
        statusCode: 200, 
        body: {
            jobRunID: id,
            data: data //Do not modify data
        }
    }
}