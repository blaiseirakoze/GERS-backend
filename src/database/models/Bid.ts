import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    static associate(models) {
      Bid.belongsTo(models.User, {
        foreignKey: "bidder", as:"bidBy"
      });
      Bid.belongsTo(models.Tender, {
        foreignKey: "tenderId"
      });
    }
  }

  Bid.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: uuidv4,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "approved", "rejected"],
        defaultValue: "pending"
      },
      documents: {
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
      tableName: "bids",
      sequelize,
    }
  );
  return Bid;
};
