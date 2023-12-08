"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.officielGame = exports.OfficialGame = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../../index");
class OfficialGame extends sequelize_1.Model {
}
exports.OfficialGame = OfficialGame;
const officielGame = () => {
    OfficialGame.init({
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
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        prix: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        sequelize: index_1.sequelize,
        modelName: 'OfficialGame'
    });
};
exports.officielGame = officielGame;
