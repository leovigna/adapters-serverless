const request = require('request-promise-native');

module.exports.default = async ({
    id,
    data
}) => {
    const endpoint = data.endpoint || 'price'
    const fsym = data.fsym || data.coin || ''
    const fsyms = data.fsyms || data.coin || ''
    const tsyms = data.tsyms || data.market || ''
    const tsym = data.tsym || data.market || ''
    const exchange = data.e || data.exchange || ''

    let url = "https://min-api.cryptocompare.com/data/";
    url = url + endpoint;
    let requestObj;

    switch (endpoint) {
        case "price":
            requestObj = {
                fsym: fsym,
                tsyms: tsyms
            };
            break;
        case "pricemulti":
        case "pricemultifull":
            requestObj = {
                fsyms: fsyms,
                tsyms: tsyms
            };
            break;
        case "generateAvg":
            requestObj = {
                fsym: fsym,
                tsym: tsym,
                e: exchange
            };
            break;
        default:
            requestObj = {
                fsym: fsym,
                tsyms: tsyms
            };
            break;
    }

    if (process.env.CRYPTO_COMPARE_API_KEY) {
        requestObj.api_key = process.env.CRYPTO_COMPARE_API_KEY
    }

    const options = {
        url: url,
        qs: requestObj,
        json: true
    };

    const response = await request(options);
    return {
        jobRunID: id,
        data: response
    }
};

