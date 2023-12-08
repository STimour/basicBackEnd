"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.User = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../../index");
class User extends sequelize_1.Model {
}
exports.User = User;
const user = () => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true, // Définir id comme clé primaire
            autoIncrement: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize: index_1.sequelize,
        modelName: 'User'
    });
};
exports.user = user;
