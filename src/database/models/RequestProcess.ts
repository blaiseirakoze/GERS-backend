import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

module.exports = (sequelize, DataTypes) => {
  class RequestProcess extends Model {

    static associate(models) {
      RequestProcess.belongsTo(models.Request, {
        foreignKey: "requestId",
      });
      RequestProcess.belongsTo(models.User, {
        foreignKey: "userId", as: 'createdBy'
      });
    }
  }

  RequestProcess.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: uuidv4,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "clarification needed", "approved", "rejected"],
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
    },
    {
      tableName: "requestProcess",
      sequelize,
    }
  );
  return RequestProcess;
};
