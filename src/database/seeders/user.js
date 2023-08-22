const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      'users',
      [
        {
          id: '9e1ce00f-75cd-4f34-8fcc-c05c46d64f44',
          username: 'admin',
          email: 'admim@user.com',
          password: bcrypt.hashSync('3XjWTMVqMe@3p/#!', 10),
          firstName: 'super',
          lastName: 'admin',
          phone: '',
          status: 'active',
          roleId: "6a233ac0-523d-4d21-b20a-8df3f508796e",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('users', null, {});
  },
};
