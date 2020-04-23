const request = require('request-promise-native').defaults({ jar: true });

module.exports.default = async ({
    id,
    data
}) => {
    const email = process.env.CHAINLINK_EMAIL
    const password = process.env.CHAINLINK_PASSWORD
    const chainlink_url = process.env.CHAINLINK_URL
    const web3_url = process.env.WEB3_PROVIDER_URL

    const authorized = await request.post({ url: chainlink_url + "/sessions", body: { email, password }, json: true })
    const balances = await request.get({ url: chainlink_url + "/v2/user/balances", json: true })
    const config = await request.get({ url: chainlink_url + "/v2/config", json: true })
    const specs = await request.get({ url: chainlink_url + "/v2/specs", json: true })

    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: { balances, config, specs }
        }
    }
}