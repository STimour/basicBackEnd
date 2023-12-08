import { DataTypes, Model } from "sequelize"
import { sequelize } from "../../index";

export class FreeGame extends Model{
        id!: number;
        name!: string;
        description!: string;
        image!: string;
    }

export const freeGame = () => { FreeGame.init(
    {   
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'FreeGame'
    }
)}

