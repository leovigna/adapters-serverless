# Serverless Framework Chainlink Adapters
## Description
A collection of adapters used to augment a Chainlink node's capabilities.
All adapters are meant to be used with the Serverless Framework which enables fast prototyping and deployment of Lambda functions.

## Suported FaaS Platforms
- AWS Lambda
- Apache OpenWhisk
- Serverless Local Plugin (for testing)

## Adapters
### Eth Adapters
#### Cryptography
- ecrrecover: Recover ethereum address from signed JSONRPC message (enables user signed data)
- ecrdecrypt: Decrypt encrypted data with ECIES & Diffie-Hellman (enables private requests)

### Prices
These were built with heavy inspiration from existing adapters. Just adapted to fit our standard interface.
- cryptocompare
- coinmarketcap
- ccxt: 100+ Direct Exchange API connections

### Other
#### Data Processing
- jsonmask: Mask json data (Select parts of the data)
- datastore: Creates mock data to SQL table (more tbd)
#### OAuth
- youtube: Youtube API, OAuth enabled. Stores OAuth tokens in private database mapped to signing ethereum addresses.
#### Debugging
- nodestats: Get node stats using Chainlink Api.
- slack: Notify state of job data.

## About Vulcan Link
We are a Paris-based Chainlink node operator working on actively maintaining 30+ reliable data feeds and developing decentralized applications that leverage smart contracts with external data. We believe in building trust through transparency by contributing to opensource projects. If you'd like us to add other data feeds to [feeds.link](https://feeds.link), feel free to reach out through our links below! 

Find us at online at [vulcan.link](https://vulcan.link)
Follow us on Twitter [@vulcanlink](https://twitter.com/vulcanlink) for updates on new projects like this one.
If you'd like to contribute, join us on [Telegram](https://t.me/vulcanlink) and [Discord](https://discord.gg/uGwqJJH).

## License
2020 Leo Vigna
MIT License.