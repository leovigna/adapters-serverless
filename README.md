# Serverless Framework Chainlink Adapters
## Description
A collection of adapters used to augment a Chainlink node's capabilities.
All adapters are meant to be used with the Serverless Framework which enables fast prototyping and deployment of Lambda functions.
## Adapters
### Cryptography
- ecrrecover: Recover ethereum address from signed JSONRPC message (enables user signed data)
- ecrdecrypt: Decrypt encrypted data with ECIES & Diffie-Hellman (enables private requests)
### Data Processing
- jsonmask: Mask json data (Select parts of the data)
- datastore: Creates mock data to SQL table (more tbd)
### OAuth
- youtube: Youtube API, OAuth enabled. Stores OAuth tokens in private database mapped to signing ethereum addresses.
### Crypto Prices
These were built with heavy inspiration from existing adapters. Just adapted to fit our standard interface.
- cryptocompare
- coinmarketcap
### Debugging
- hello: "Hello world!"
- nodestats: Get node stats using Chainlink Api.
- slack: Notify state of job data.

  
  
  
  
  
  