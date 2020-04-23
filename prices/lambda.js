const handler = require("./handler");

const parseHTTPEventResponse = (payload) => {
    return { statusCode: 200, body: JSON.stringify(payload) }
}

const wrappedHandler = (handler) => {
    return async req => {
        const event = JSON.parse(req.body)
        try {
            const response = await handler(event)
            return parseHTTPEventResponse(response)
        } catch (error) {
            console.error(error)
            const response = {
                statusCode: 400,
                body: {
                    jobRunID: event.id,
                    status: "errored",
                    error: error
                }
            }
            return parseHTTPEventResponse(response)
        }
    }
}

exports.ccxt = wrappedHandler(handler.ccxt);
exports.coinmarketcap = wrappedHandler(handler.coinmarketcap);
exports.cryptocompare = wrappedHandler(handler.cryptocompare);