const connection = require("../db/connection").default

module.exports.default = async ({id, data}) => {
    const sequelize = await connection();
    const jane = await sequelize.models.User.create({ pubkey: "Jane" });
    const response = {
        statusCode: 200,
        body: {
            jobRunID: id,
            created: jane
          }
      };
    return response;
};