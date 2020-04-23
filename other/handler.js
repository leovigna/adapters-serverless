'use strict';

const slack = require("./adapters/slack").default;
const nodestats = require("./adapters/nodestats").default;
const jsonmask = require("./adapters/jsonmask").default;
const oauth = require("./adapters/oauth").default;
const youtube = require("./adapters/youtube").default;
const youtubeLikes = require("./adapters/youtube").likes;
const youtubeSubscriptions = require("./adapters/youtube").subscriptions;
const youtubeVideos = require("./adapters/youtube").videos;
const randomAddressID = require("./adapters/medici").randomAddressID;
const randomAddressAddress = require("./adapters/medici").randomAddressAddress;
const twitch = require("./adapters/twitch");
const proxy = require("./adapters/proxy").default;

module.exports.slack = wrappedHandler(slack)
module.exports.nodestats = wrappedHandler(nodestats)
module.exports.jsonmask = wrappedHandler(jsonmask)
module.exports.hello = wrappedHandler(hello)
module.exports.oauth = wrappedHandler(oauth)
module.exports.youtube = wrappedHandler(youtube)
module.exports.youtubeLikes = wrappedHandler(youtubeLikes)
module.exports.youtubeSubscriptions = wrappedHandler(youtubeSubscriptions)
module.exports.youtubeVideos = wrappedHandler(youtubeVideos)

module.exports.randomAddressID = wrappedHandler(randomAddressID)
module.exports.randomAddressAddress = wrappedHandler(randomAddressAddress)

module.exports.twitchOAuth = wrappedHandler(twitch.oauth)
module.exports.twitchViewReward = wrappedHandler(twitch.viewReward)
module.exports.proxy = proxy