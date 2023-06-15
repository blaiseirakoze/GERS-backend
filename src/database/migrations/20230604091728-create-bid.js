
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bids', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "approved", "rejected"],
        defaultValue: "pending"
      },
      documents: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      bidder: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "users", key: "id" },
      },
      tenderId: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "tenders", key: "id" },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('bids');
  }
};