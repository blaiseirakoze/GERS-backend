module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      'roles',
      [
        {
          id: '6a233ac0-523d-4d21-b20a-8df3f508796e',
          name: 'admin',
          label: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '8027b13c-b670-4414-8f2b-a0f1ab75f5a5',
          name: 'supplier',
          label:'supplier',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '9e1ce00f-75cd-4f34-8fcc-c05c46d64f4d',
          name: 'risa',
          label:'risa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'ff05b959-2f0d-4385-ab0d-3b3748449856',
          name: 'company',
          label:'company',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '6d33b4c8-0f99-4acb-87c8-aa03b6a01e4c',
          name: 'minecofine',
          label:'minecofine',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('roles', null, {});
  },
};
