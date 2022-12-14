'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('quiz_contest_employee', {
      id :{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      quiz_contest_id : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      score : {
        allowNull : false,
        type : Sequelize.FLOAT
      },
      start_at : {
        allowNull : false,
        type : Sequelize.DATE
      },
      end_at: {
        type : Sequelize.DATE
      },
      max_time : {
        allowNull : false,
        type : Sequelize.DATE
      },
      status : {
        allowNull : false,
        type : Sequelize.ENUM('Done', 'In Progress')
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('quiz_contest_employee');
  }
};
