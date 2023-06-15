
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requestProcess', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "clarification needed", "approved", "rejected"],
        defaultValue: "pending"
      },
      requestId: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "requests", key: "id" },
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
    await queryInterface.dropTable('requestProcess');
  }
};