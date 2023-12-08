import { DataTypes, Model } from "sequelize"
import { sequelize } from "../../index";

export class OfficialGame extends Model{
    id!: number;
    name!: string;
    description!: string;
    prix!: number
  }
  
export const officielGame = () => {
    OfficialGame.init(
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
            type: DataTypes.STRING,
            allowNull: false
      },
        prix: {
            type: DataTypes.FLOAT,
            allowNull: false
      }
    },
    {
        sequelize,
        modelName: 'OfficialGame'
    }  
    )
}