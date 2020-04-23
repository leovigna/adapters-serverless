const Web3 = require('web3');
const web3 = new Web3();

module.exports.default = async ({ id, data }) => {
    const { jsonInterface, parameters } = data

    let paramList = []
    if (Array.isArray(parameters)) {
        paramList = parameters;
    } else {
        jsonInterface.inputs.forEach((input) => {
            if (parameters[input.name]) { paramList.push(parameters[input.name]) }
        })
    }

    const value = web3.eth.abi.encodeFunctionCall(jsonInterface, paramList);
    data.value = value;

    delete data.jsonInterface; //Consume
    delete data.parameters;    //Consume

    return {
        jobRunID: id,
        data: data
    };
}