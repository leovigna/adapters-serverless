const crypto = require('crypto')

const key = process.env.COINBASE_API_KEY;
const secret = process.env.COINBASE_API_SECRET;
const passphrase = process.env.COINBASE_API_PASSPHRASE;
const apiURI = process.env.COINBASE_API_URI || 'https://api.pro.coinbase.com';

const base64Secret = Buffer.from(secret, 'base64')
const axios = require('axios').create({
    baseURL: apiURI
});

async function getCoinbaseOracle() {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const request = {
        method: 'GET',
        url: '/oracle',
        headers: {}
    }

    const message = timestamp + request.method + request.url + (request.body || '')
    const hmac = crypto.createHmac('sha256', base64Secret);
    hmac.update(message)
    const signature = hmac.digest('base64')

    const headers = {
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-KEY': key,
        'CB-ACCESS-PASSPHRASE': passphrase
    }
    request.headers = headers

    try {
        const response = await axios.request(request)
        console.debug(response.data)


        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        }

    } catch (error) {
        console.error(error)
        return error
    }
}

module.exports.getCoinbaseOracle = getCoinbaseOracle