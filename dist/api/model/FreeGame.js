"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeGame = exports.FreeGame = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../../index");
class FreeGame extends sequelize_1.Model {
}
exports.FreeGame = FreeGame;
const freeGame = () => {
    FreeGame.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize: index_1.sequelize,
        modelName: 'FreeGame'
    });
};
exports.freeGame = freeGame;
