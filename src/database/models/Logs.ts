import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

module.exports = (sequelize, DataTypes) => {
  class Logs extends Model {
    id?: string;
    name: string;
    action: string;
    description: string;
    module: string;
    createdBy: string;
    ip: string;
    browser: string;

    static associate(models) {
      Logs.belongsTo(models.User, {
        foreignKey: "createdBy",
      });
    }
  }

  Logs.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: uuidv4,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false
      },
      browser: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      tableName: "logs",
      sequelize,
    }
  );
  return Logs;
};
