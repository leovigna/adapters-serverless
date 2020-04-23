const { Sequelize, DataTypes } = require('sequelize');
const User = require("../models/User")

const db = process.env.DATABASE_URI || './db/database.sqlite'
//const sequelize = new Sequelize({ dialect: 'sqlite', storage: db });
const sequelize = new Sequelize(db)

async function connection() {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    User(sequelize, DataTypes);
    
    //await user.sync({ alter: false });

    return sequelize
}

module.exports.default = connection;