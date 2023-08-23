
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tenders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM,
        values: ["opened", "closed", "delivered"],
        defaultValue: "opened"
      },
      winner: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "users", key: "id" },
      },
      openDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      publishDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      closeDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      publishWinnerDate: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('tenders');
  }
};