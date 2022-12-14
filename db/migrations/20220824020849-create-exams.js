'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('exams', {
      id : {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title : {
        allowNull : false,
        type : Sequelize.STRING
      },
      course_id : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      description: {
        allowNull : false,
        type : Sequelize.STRING
      },
      exam_time : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      number_of_question : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      created_by : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      passing_grade : {
        allowNull : false,
        type : Sequelize.FLOAT
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
     await queryInterface.dropTable('exams');
  }
};
