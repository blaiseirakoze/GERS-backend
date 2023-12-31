import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

module.exports = (sequelize, DataTypes) => {
  class Tender extends Model {
    static associate(models) {
      Tender.belongsTo(models.User, {
        foreignKey: "winner", as:"supplier"
      });
      Tender.belongsTo(models.Request, {
        foreignKey: "requestId", as:"request"
      });
      Tender.hasMany(models.TenderDocument, {
        foreignKey: "tenderId", as: "tenderDocuments"
      });
    }
  }

  Tender.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: uuidv4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM,
        values: ["opened", "closed", "delivered"],
        defaultValue: "opened"
      },
      openDate: {
        allowNull: true,
        type: DataTypes.DATE
      },
      publishDate: {
        allowNull: true,
        type: DataTypes.DATE
      },
      closeDate: {
        allowNull: true,
        type: DataTypes.DATE
      },
      publishWinnerDate: {
        allowNull: true,
        type: DataTypes.DATE
      },
      deliveryNote: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      receipt: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      contract:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      delivered:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
      tableName: "tenders",
      sequelize,
    }
  );
  return Tender;
};
