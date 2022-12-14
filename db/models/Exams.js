import db from "../../config/database.js";
import { Sequelize } from "sequelize";
import Courses from "./Courses.js";
import ExamsQuestions from "./ExamsQuestions.js";

const Exams = db.define('exams', {
    title : {
        type : Sequelize.STRING
      },
    course_id : {
        type : Sequelize.INTEGER
    },
    description : {
        type : Sequelize.STRING
    },
    exam_time : {
        type : Sequelize.INTEGER
    },
    number_of_question : {
        type : Sequelize.INTEGER
    },
    created_by : {
        type : Sequelize.STRING
    },
    passing_grade : {
        type : Sequelize.FLOAT
    }
});

Exams.belongsTo(Courses, {
    foreignKey : 'course_id'
});

Exams.hasMany(ExamsQuestions, {
    foreignKey : 'exam_id',
});

export default Exams;