// Select subset of json data at path
//https://www.npmjs.com/package/json-mask
const mask = require('json-mask');
module.exports.default = async ({
    id,
    data
}) => { 
    const { path } = data;
    if (!path) { throw Error("Missing path param."); }

    const maskedData = mask(data, path);
    return { 
        statusCode: 200, 
        body: {
            jobRunID: id,
            data: maskedData //Do not modify
        }
    }
}