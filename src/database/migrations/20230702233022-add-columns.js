module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('tenders', 'requestId', {
        type: Sequelize.UUID,
        references: { model: 'requests', key: "id" }
      }),
      queryInterface.addColumn('requests', 'tenderPublished', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('tenders', 'requestId'),
      queryInterface.removeColumn('requests', 'tenderPublished')
    ]);
  }
};
