import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

module.exports = (sequelize, DataTypes) => {
  class TenderDocument extends Model {
    static associate(models) {
      TenderDocument.belongsTo(models.Tender, {
        foreignKey: "tenderId"
      });
    }
  }
  TenderDocument.init(
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
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
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
      tableName: "tenderDocuments",
      sequelize,
    }
  );
  return TenderDocument;
};
