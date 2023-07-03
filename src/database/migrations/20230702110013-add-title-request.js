module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('requests', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    return queryInterface.removeColumn('requests', 'title');
  }
};
