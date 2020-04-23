const ccxt = require('ccxt')

const handle = async ({ id, data }) => {
    const {
        ticker,
        market,
        exchangeOptions } = data;

    const ccxtExchange = new ccxt[exchange](exchangeOptions)
    await ccxtExchange.loadMarkets()
    //const prices = await ccxtExchange.market(market)
    const prices = await ccxtExchange.fetchTicker(ticker)

    console.debug(prices)
    return {
        jobRunID: id,
        data: prices
    }
};

module.exports.default = async (event) => {
    return await handle(event);
};
