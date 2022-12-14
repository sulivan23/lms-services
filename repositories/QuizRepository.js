import Courses from "../db/models/Courses.js";
import Quiz from "../db/models/Quiz.js";
import QuizMultipleChoice from "../db/models/QuizMultipleChoice.js";
import QuizQuestions from "../db/models/QuizQuestions.js";
import Organization from "../db/models/Organization.js";
import QuizEmployee from "../db/models/QuizEmployee.js";
import QuizEmployeeAnswer from "../db/models/QuizEmployeeAnswer.js";
import CoursesEmployee from "../db/models/CoursesEmployee.js";
import Sequelize from "sequelize";
import { Op } from "sequelize";

export const repoCreateQuiz = async(data) => {
    await Quiz.create(data);
}

export const repoUpdateQuiz = async(data ,id) => {
    await Quiz.update(data, {
        where : {
            id : id
        }
    });
}

export const repoDeleteQuiz = async(id) => {
    await Quiz.destroy({
        where : {
            id : id
        }
    });
}

export const repoGetQuiz = async() => {
    return await Quiz.findAll({
        include : {
            model : Courses,
            foreignKey : 'course_id',
            attributes : ['course_name'],
            include : {
                model : Organization,
                foreignKey : 'organizaztion_code',
                attributes : ['organization_code', 'organization_name']
            }
        }
    });
}

export const repoGetQuizById = async(id) => {
    return await Quiz.findByPk(id,{
        include : [
            {
                model : Courses,
                foreignKey : 'course_id'
            },
            {
                model : QuizQuestions,
                foreignKey : 'quiz_id'
            }
        ]
    });
}

export const repoGetQuizByCourse = async(course) => {
    return await Quiz.findAll({
        where : {
            course_id : course
        }
    });
}

export const repoCreateQuizQuestion = async(data) => {
    const createQuizQuestion = await QuizQuestions.create(data.question);
    if(typeof data.multiple_choice != "undefined"){
        var i;
        for(i = 0; i < data.multiple_choice.length; i++){
            Object.assign(data.multiple_choice[i], { quiz_question_id : createQuizQuestion.id });
        }
        await QuizMultipleChoice.bulkCreate(data.multiple_choice);
    } 
}

export const repoDeleteQuizQuestion = async(id) => {
    const multipleChoice = QuizMultipleChoice.count({
        where : {
            quiz_question_id : id
        }
    });
    if(multipleChoice > 0){
        await QuizMultipleChoice.destroy({
            where : {
                quiz_question_id : id
            }
        })
    }
    await QuizQuestions.destroy({
        where : {
            id : id
        }
    });
}

export const repoUpdateQuizQuestion = async(data, id) => {
    if(typeof data.multiple_choice != "undefined"){
        await QuizMultipleChoice.destroy({
            where : {
                quiz_question_id : id
            }
        });
        var i;
        for(i = 0; i < data.multiple_choice.length; i++){
            Object.assign(data.multiple_choice[i], { quiz_question_id : id });
        }
        await QuizMultipleChoice.bulkCreate(data.multiple_choice);
    }
    await QuizQuestions.update(data.question, {
        where : {
            id: id
        }
    });
}

export const repoGetQuestionQuiz = async(quiz, questionNumber) => {
    const quizQuestion = await QuizQuestions.findOne({
        where : {
            quiz_id : quiz,
            question_number : questionNumber
        },
        include : [
            {
                model : QuizMultipleChoice,
                foreignKey : 'quiz_question_id',
                attributes : ['choice_type','choice_name']
            },
        ]
    });
    return quizQuestion;
}

export const repoGetQuestionQuizById = async(id) => {
    return await QuizQuestions.findOne({
        where : {
            id : id
        }
    });
}

export const repoGetQuestionByQuiz = async(quizId) => {
    return await QuizQuestions.findAll({
        where : {
            quiz_id : quizId
        }
    });
}

export const repoEnrollQuiz = async(data) => {
    return await QuizEmployee.create(data);
}

export const repoQuizAnswerQuestion = async(data) => {
    await QuizEmployeeAnswer.create(data);
}

export const repoCheckQuizEmployee = async(courseEmployeeId, quizId) => {
    return await QuizEmployee.findOne({
        include : {
            model : CoursesEmployee,
            foreignKey : 'course_employee_id'
        },
        where : {
            course_employee_id : courseEmployeeId,
            quiz_id : quizId
        }
    });
}

export const repoUnEnrollQuiz = async(quizEmployeeId) => {
    await QuizEmployee.destroy({
        where : {
            id : quizEmployeeId
        }
    });
}

export const repoGetQuizEmployeeById = async(id) => {
    return await QuizEmployee.findOne({
        include : {
            model : CoursesEmployee,
            foreignKey : 'course_employee_id'
        },
        where : {
            id : id
        }
    });
}

export const repoGetQuizEmployeeAnswer = async(quizEmployeeId, quizQuestionId) => {
    return await QuizEmployeeAnswer.findOne({
        where : {
            quiz_employee_id : quizEmployeeId,
            quiz_question_id : quizQuestionId
        }
    });
}

export const repoDeleteQuizEmployeeAnswer = async(id) => {
    await QuizEmployeeAnswer.destroy({
        where : {
            id :id
        }
    });
}

export const repoSumPointByQuizEmp = async(quizEmployeeId) => {
    return await QuizEmployeeAnswer.findOne({
        attributes : [[ Sequelize.fn('sum', Sequelize.col('point')),'total']],
        where : {
            quiz_employee_id : quizEmployeeId
        },
        raw : true
    }); 
}

export const repoUpdateQuizEmp = async(data, id) => {
    await QuizEmployee.update(data, {
        where : {
            id : id
        }
    });
}

export const repoGetMyQuiz = async(employeeId) => {
    return await Quiz.findAll({
        attributes : [
            'id',
            'title',
            'description',
            'quiz_time',
            'number_of_question'
        ],
        include : {
            model : Courses,
            foreignKey : 'course_id',
            attributes : [
                'course_name',
                [Sequelize.literal(`( SELECT b.status FROM courses_employee a JOIN quiz_employee b WHERE a.id=b.course_employee_id AND a.employee_id='${employeeId}' AND course_id=course.id)`),'status_quiz']
            ],
            include : {
                model : Organization,
                foreignKey : 'organization_code',
                attributes : ['organization_code','organization_name']
            },
            where :{
                id :{
                    [Op.in] : Sequelize.literal(`(SELECT course_id FROM courses_employee WHERE employee_id='${employeeId}')`)
                }
            }
        }
    });
}

export const repoGetQuizEmpByEmployee = async(courseId, employeeId) => {
    return await Quiz.findAll({
        attributes : ['id','title',[Sequelize.literal(`'quiz'`),'learning_type']],
        include : {
            model : Courses,
            foreignKey : 'course_id',
            attributes : [
                'course_name',
                [Sequelize.literal(`(SELECT b.status FROM courses_employee a, quiz_employee b WHERE a.id=b.course_employee_id AND a.course_id=course.id AND a.employee_id='${employeeId} ')`),'status_quiz'],
                [Sequelize.literal(`(SELECT id FROM courses_employee WHERE course_id=course.id AND employee_id='${employeeId}')`),'course_employee_id']
            ],

        },
        where : {
            course_id : courseId,
            id : {
                [Op.in] : Sequelize.literal(`(SELECT a.id FROM quiz a, courses_employee b WHERE b.course_id=a.course_id AND b.course_id=course.id AND b.employee_id='${employeeId}')`)
            }
        }
    })
}

export const repoGetQuizEmpByQuiz = async(quizId, employeeId) => {
    return await Quiz.findOne({
        include : {
            model : Courses,
            foreignKey : 'course_id',
            attributes : [
                'id',
                'course_name',
                [Sequelize.literal(`(SELECT b.status FROM courses_employee a, quiz_employee b WHERE a.id=b.course_employee_id AND a.course_id=course.id AND a.employee_id='${employeeId} ')`),'status_quiz'],
                [Sequelize.literal(`(SELECT b.score FROM courses_employee a, quiz_employee b WHERE a.id=b.course_employee_id AND a.course_id=course.id AND a.employee_id='${employeeId} ')`),'score'],
                [Sequelize.literal(`(SELECT a.id FROM courses_employee a, quiz_employee b WHERE a.id=b.course_employee_id AND a.course_id=course.id AND a.employee_id='${employeeId} ')`),'course_employee_id'],
                [Sequelize.literal(`(SELECT b.id FROM courses_employee a, quiz_employee b WHERE a.id=b.course_employee_id AND a.course_id=course.id AND a.employee_id='${employeeId} ')`),'quiz_employee_id'],
                [Sequelize.literal(`(SELECT b.max_time FROM courses_employee a, quiz_employee b WHERE a.id=b.course_employee_id AND a.course_id=course.id AND a.employee_id='${employeeId} ')`),'max_time']
            ],
        },
        where :{
            id : {
                [Op.in] : Sequelize.literal(`(SELECT a.id FROM quiz a, courses_employee b WHERE a.id='${quizId}' AND a.course_id=b.course_id AND b.course_id=course.id AND b.employee_id='${employeeId}')`)
            }
        }
    });
}

export const repoGetQuestionByQuizEmp = async(quizEmployeeId, questionNumber, result) => {
    var attributes;
    if(result == false) {
        attributes = [
            'id',
            'name_of_question',
            'question_number',
            'question_type',
            [Sequelize.literal('(SELECT answer_of_question FROM quiz_employee_answer WHERE quiz_question_id=`quiz->quiz_questions`.`id` AND quiz_employee_id='+quizEmployeeId+')'),'answer_of_question']
        ];
    }else{
        attributes = [
            'id',
            'name_of_question',
            'question_number',
            'question_type',
            ['answer_of_question','correct_answer'],
            [Sequelize.literal('(SELECT answer_of_question FROM quiz_employee_answer WHERE quiz_question_id=`quiz->quiz_questions`.`id` AND quiz_employee_id='+quizEmployeeId+')'),'answer_of_question'],
            [Sequelize.literal('(SELECT is_correct FROM quiz_employee_answer WHERE quiz_question_id=`quiz->quiz_questions`.`id` AND quiz_employee_id='+quizEmployeeId+')'),'is_correct']
        ];
    }
    return await QuizEmployee.findOne({
        where : {
            id : quizEmployeeId
        },
        include : [
            {
                model : Quiz,
                foreignKey : 'quiz_id',
                include : {
                    model : QuizQuestions,
                    foreignKey : 'quiz_id',
                    attributes : attributes,
                    where : {
                        question_number : questionNumber
                    },
                    include : {
                        model : QuizMultipleChoice,
                        foreignKey : 'quiz_question_id',
                        attributes : ['choice_name','choice_type']
                    }
                }
            },
        ]
    })
}

export const repoGetResultQuiz = async() => {
    return await QuizEmployee.findAll({
        include : [
            {
                model : CoursesEmployee,
                foreignKey : 'course_employee_id',
                attributes : ['id', 'progress', 'status'],
                include : {
                    model : Courses,
                    foreignKey : 'course_id',
                    attributes : ['id','course_name','organization_code']
                }  
            },
            {
                model : Quiz,
                foreignKey : 'quiz_id',
                attributes : ['id','title','quiz_time','number_of_question']
            }
        ]
    });
}

export const repoGetResultQuizByEmployee = async(employeeId) => {
    return await QuizEmployee.findAll({
        include : [
            {
                model : CoursesEmployee,
                foreignKey : 'course_employee_id',
                attributes : ['id', 'progress', 'status'],
                where : {
                    employee_id : employeeId
                },
                include : {
                    model : Courses,
                    foreignKey : 'course_id',
                    attributes : ['id','course_name','organization_code']
                }  
            },
            {
                model : Quiz,
                foreignKey : 'quiz_id',
                attributes : ['id','title','quiz_time','number_of_question']
            }
         ]
    });
}

export const repoGetResultQuizByOrg = async(organizationCode) => {
    return await QuizEmployee.findAll({
        include : [
            {
                model : CoursesEmployee,
                foreignKey : 'course_employee_id',
                attributes : ['id', 'progress', 'status'],
                where : {
                    employee_id : {
                        [Op.in] : Sequelize.literal(`(SELECT id FROM users WHERE organization_code='${organizationCode}')`)
                    }
                },
                include : {
                    model : Courses,
                    foreignKey : 'course_id',
                    attributes : ['id','course_name','organization_code']
                }  
            },
            {
                model : Quiz,
                foreignKey : 'quiz_id',
                attributes : ['id','title','quiz_time','number_of_question']
            }
         ]
    });
}