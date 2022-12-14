'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // nik : {
      //   allowNull : false,
      //   type : Sequelize.STRING
      // },
      name: {
        allowNull : false,
        type: Sequelize.STRING
      },
      email: {
        allowNull : false,
        type: Sequelize.STRING,
        length : 100
      },
      phone_number: {
        allowNull : false,
        type: Sequelize.STRING,
        length : 20
      },
      password: {
        allowNull : false,
        type: Sequelize.STRING,
        length : 255
      },
      organization_code: {
        type: Sequelize.STRING,
        allowNull : false,
      },
      roles : {
        type : Sequelize.STRING,
        allowNull : false
      },
      refresh_token : {
        type : Sequelize.TEXT,
        length : 500
      },
      status : {
        type : Sequelize.ENUM('Actived', 'Deactived')
      },
      position_code : {
        allowNull : false,
        type : Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};