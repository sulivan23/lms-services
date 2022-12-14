import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import CoursesEmployee from "./CoursesEmployee.js";
import Quiz from "./Quiz.js";

const QuizEmployee = db.define('quiz_employee', {
    course_employee_id : {
        type : Sequelize.INTEGER
    },
    quiz_id : {
        type : Sequelize.INTEGER
    },
    point : {
        type : Sequelize.FLOAT
    },
    score : {
        type : Sequelize.FLOAT
    },
    start_at : {
        type : Sequelize.DATE
    },
    end_at : {
        type : Sequelize.DATE
    },
    max_time : {
        type : Sequelize.DATE
    },
    status : {
        type : Sequelize.ENUM('Done', 'In Progress')
    },
    progress : {
        type : Sequelize.FLOAT
    },
}, {
    freezeTableName : true
});

QuizEmployee.belongsTo(CoursesEmployee, {
    foreignKey : 'course_employee_id'
});

QuizEmployee.belongsTo(Quiz, {
    foreignKey : 'quiz_id'
});

export default QuizEmployee;