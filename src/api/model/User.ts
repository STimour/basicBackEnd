import { DataTypes, Model } from "sequelize"
import { sequelize } from "../../index";

export class User extends Model{
    id!: number;
    username!: string
    email!: string;
    password!: string
}

export const user = () => {
    User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Définir id comme clé primaire
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User'
    }    
    )
}