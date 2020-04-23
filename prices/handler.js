'use strict';

const ccxt = require("./ccxt").default;
const coinmarketcap = require("./coinmarketcap").default;
const cryptocompare = require("./cryptocompare").default;

exports.ccxt = ccxt;
exports.coinmarketcap = coinmarketcap;
exports.cryptocompare = cryptocompare;