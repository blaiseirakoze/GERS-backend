import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    static associate(models) {
      Request.belongsTo(models.User, {
        foreignKey: "requester",
        as: "requestedBy",
      });
      Request.hasMany(models.RequestProcess, {
        foreignKey: "requestId",
        as: "requestProcess",
      });
    }
  }

  Request.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: uuidv4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      documents: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "under review", "missing information", "review and forward", "approved", "rejected"],
        defaultValue: "pending"
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
      tenderPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: "requests",
      sequelize,
    }
  );
  return Request;
};
