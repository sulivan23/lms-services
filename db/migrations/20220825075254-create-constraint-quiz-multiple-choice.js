'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addConstraint('quiz_multiple_choice', {
      fields : ['quiz_question_id'],
      type : 'foreign key',
      name : 'FK_QuizMultipleChoice_QuizQuestions',
      references : {
        table : 'quiz_questions',
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
  }
};
