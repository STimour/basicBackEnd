"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlackListModel = void 0;
const sequelize_1 = require("sequelize");
const TokenBlackListModel = (sequelize) => {
    return sequelize.define('token-black-list', {
        token: sequelize_1.DataTypes.STRING,
    });
};
exports.TokenBlackListModel = TokenBlackListModel;
