'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('quiz_contest_employee', {
      fields : ['employee_id'],
      type : 'foreign key',
      name : 'FK_QuizContestEmployee_Employee',
      references : {
        table : 'users',
        field : 'id'
      },
      onDelete : 'no action',
      onUpdate : 'no action'
    });

    await queryInterface.addConstraint('quiz_contest_employee', {
      fields : ['quiz_contest_id'],
      type : 'foreign key',
      name : 'FK_QuizContestEmployee_QuizContest',
      references : {
        table : 'quiz_contest',
        field : 'id'
      },
      onDelete : 'cascade',
      onUpdate : 'no action'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('quiz_contest_employee','FK_QuizContestEmployee_Employee');
    await queryInterface.removeConstraint('quiz_contest_employee','FK_QuizContestEmployee_QuizContest');
  }
};
