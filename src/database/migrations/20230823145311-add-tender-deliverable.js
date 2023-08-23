
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('tenders', 'deliveryNote', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('tenders', 'receipt', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('tenders', 'contract', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('tenders', 'delivered', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ]);
  },
  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('tenders', 'deliveryNote'),
      queryInterface.removeColumn('tenders', 'receipt'),
      queryInterface.removeColumn('tenders', 'contract'),
      queryInterface.removeColumn('tenders', 'delivered')
    ]);
  }
};