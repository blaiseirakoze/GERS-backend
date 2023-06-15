
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      documents: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      requester: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "users", key: "id" },
      },
      approver: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "users", key: "id" },
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
    await queryInterface.dropTable('requests');
  }
};