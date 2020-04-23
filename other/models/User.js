module.exports = (sequelize, type) => {
    return sequelize.define('User', {
        address: {
            type: type.STRING,
            primaryKey: true
        },
        youtube: {
            type: type.JSON,
            allowNull: true
        }
    });
}