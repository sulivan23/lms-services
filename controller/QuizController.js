import { calculatePointQuestion, errMsg, getProgress, lower } from "../helper/Helper.js";
import { repoCheckQuizEmployee, repoCreateQuiz, repoCreateQuizQuestion, repoDeleteQuiz, repoDeleteQuizEmployeeAnswer, repoDeleteQuizQuestion, repoEnrollQuiz, repoGetMyQuiz, repoGetQuestionByQuizEmp, repoGetQuestionQuiz, repoGetQuestionQuizById, repoGetQuiz, repoGetQuizByCourse, repoGetQuizById, repoGetQuizEmpByQuiz, repoGetQuizEmployeeAnswer, repoGetQuizEmployeeById, repoGetResultQuiz, repoGetResultQuizByEmployee, repoGetResultQuizByOrg, repoQuizAnswerQuestion, repoSumPointByQuizEmp, repoUnEnrollQuiz, repoUpdateQuiz, repoUpdateQuizEmp, repoUpdateQuizQuestion } from "../repositories/QuizRepository.js";
import moment from "moment";
import { repoUpdateCourseEmployee } from "../repositories/CourseRepository.js";
import { generateCertificate } from "./CourseController.js";

export const createQuiz = async(req, res) => {
    try {
        const data = {
            title : req.body.title,
            course_id : req.body.course_id,
            description : req.body.description,
            quiz_time : req.body.quiz_time,
            number_of_question : req.body.number_of_question,
            created_by : req.body.created_by
        };
        await repoCreateQuiz(data);
        return res.json({
            message : 'Quiz berhasil dibuat',
            is_error : false
        })
    } catch(err) {
        res.json({
            message : err,
            is_error : true
        });
    }
}

export const updateQuiz = async(req, res) => {
    try {
        const data = {
            title : req.body.title,
            course_id : req.body.course_id,
            description : req.body.description,
            quiz_time : req.body.quiz_time,
            number_of_question : req.body.number_of_question,
            created_by : req.body.created_by
        };
        await repoUpdateQuiz(data, req.params.id);
        return res.json({
            message : 'Quiz berhasil diupdate',
            is_error : false
        })
    } catch(err) {
        res.json({
            message : err,
            is_error : true
        });
    }
}

export const deleteQuiz = async(req, res) => {
    try {
        await repoDeleteQuiz(req.params.id);
        return res.json({
            message : 'Quiz berhasil dihapus',
            is_error : false
        });
    } catch(err){
        return res.json({
            message : err,
            is_error : true
        })
    }
}

export const getQuiz = async(req, res) => {
    try {
        const quiz = await repoGetQuiz();
        return res.json({
            data : quiz,
            is_error : false
        });
    }catch(err) {
        return res.json({
            message : err,
            is_error : true
        });
    }
}

export const getQuizByCourse = async(req, res) => {
    try {
        const quiz = await repoGetQuizByCourse(req.body.course_id);
        return res.json({
            data : quiz,
            is_error : false
        });
    }catch(err) {
        return res.json({
            message : err,
            is_error : true
        });
    }
}

export const getQuizById = async(req, res) => {
    try {
        const quiz = await repoGetQuizById(req.params.id);
        return res.json({
            data : quiz,
            is_error : false
        });
    }catch(err) {
        return res.json({
            message : err,
            is_error : true
        });
    }
}

export const createQuizQuestion = async(req, res) => {
    try {
        let data = {
            question : {
                quiz_id : req.body.quiz_id,
                name_of_question : req.body.name_of_question,
                question_number : req.body.question_number,
                answer_of_question : req.body.answer_of_question,
                question_type : req.body.question_type,
            }
        }
        if(req.body.question_type == "Multiple Choice"){
            let additionalData = {
                multiple_choice : req.body.multiple
            }
            data = Object.assign(data, additionalData);
        }
        await repoCreateQuizQuestion(data);
        return res.json({
            message : 'Question berhasil ditambahkan',
            is_error : false
        });
    } catch(err) {
        return res.json({
            message : err,
            is_error : true
        });
    }
}

export const updateQuizQuestion = async(req, res) => {
    try {
        let data = {
            question : {
                quiz_id : req.body.quiz_id,
                name_of_question : req.body.name_of_question,
                question_number : req.body.question_number,
                answer_of_question : req.body.answer_of_question,
                question_type : req.body.question_type,
            }
        }
        if(req.body.question_type == "Multiple Choice"){
            let additionalData = {
                multiple_choice : req.body.multiple
            }
            data = Object.assign(data, additionalData);
        }
        await repoUpdateQuizQuestion(data, req.params.id);
        return res.json({
            message : 'Question berhasil diupdate',
            is_error : false
        });
    } catch(err) {
        return res.json({
            message : err,
            is_error : true
        });
    }
}

export const deleteQuizQuestion = async(req, res) => {
    try {
        await repoDeleteQuizQuestion(req.params.id);
        return res.json({
            message : 'Question berhasil dihapus',
            is_error : false
        });
    } catch(err) {
        return res.json({
            message : err,
            is_error : true
        })
    }
}

export const getQuestionByQuiz = async(req, res) => {
    try {
        const quizQuestion = await repoGetQuestionQuiz(req.body.quiz_id, req.body.question_number);
        return res.json({
            data : quizQuestion,
            is_error : false
        })
    } catch(err) {
        return res.json({
            message : err,
            is_error : true
        });
    }
}

export const enrollQuiz = async(req, res) => {
    try {
        const courseEmployeeId = req.body.data.course_employee_id;
        const quizId = req.body.data.quiz_id;
        const startAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const status = 'In Progress';
        const quiz = await repoGetQuizById(quizId);
        if(!quiz) {
            return res.json({
                message : 'Quiz tidak ditemukan',
                is_error : true
            });
        }
        if(quiz.quiz_questions.length < quiz.number_of_question){
            return res.json({
                message : 'Quiz tidak dapat dienroll dikarenakan masih ada data yang tidak lengkap, silahkan hubungi administrator'
            })
        }
        let maxTime = moment(new Date());
        maxTime = maxTime.add(quiz.quiz_time, 'minutes');
        maxTime = maxTime.format('YYYY-MM-DD HH:mm:ss');
        const quizEmployee = await repoCheckQuizEmployee(courseEmployeeId, quizId);
        if(quizEmployee){ //jika quiz ingin di retake
            if(quizEmployee.status != 'Done'){
                return res.json({
                    message : 'Quiz sudah dimulai',
                    is_error : false
                });
            }
            await repoUnEnrollQuiz(quizEmployee.id);
            const progress = await getProgress(quiz.course_id);
            await repoUpdateCourseEmployee({
                progress : quizEmployee.courses_employee.progress - progress
            }, quizEmployee.courses_employee.id);
        }
        const data = {
            course_employee_id : courseEmployeeId,
            quiz_id : quizId,
            point : 0,
            score : 0,
            start_at : startAt,
            max_time : maxTime,
            status : status,
            progress : 0
        };
        const enroll = await repoEnrollQuiz(data);
        return res.json({
            data : {
                quiz_employee_id : enroll.id
            },
            message : 'Quiz telah dimulai dan batas submit pada '+maxTime,
            is_error : false
        });        
    } catch(err) {
        return res.json({
            message : errMsg(err),
            is_error : true
        });
    }
}

export const quizAnswerQuestion = async(req, res) => {
    try {
        const quizEmployeeId = req.body.data.quiz_employee_id;
        const quizQuestionId = req.body.data.quiz_question_id;
        const answerOfQuestion = req.body.data.answer_of_question;
        const quizEmployee = await repoGetQuizEmployeeById(quizEmployeeId);
        if(!quizEmployee){
            return res.json({
                message : 'Quiz tidak ditemukan',
                is_error : true
            });
        }
        const quizQuestion = await repoGetQuestionQuizById(quizQuestionId);
        if(!quizQuestion){
            return res.json({
                message : 'Pertanyaan quiz tidak ditemukan',
                is_error : true
            });
        }
        if(answerOfQuestion == null){
            return res.json({
                message : 'Anda belum memilih jawaban',
                is_error : true
            })
        }
        if(quizEmployee.quiz_id !== quizQuestion.quiz_id || quizEmployee.status == 'Done'){
            return res.json({
                message : 'Jawaban tidak dapat disubmit',
                is_error : true
            });
        }
        const quizEmployeeAnswer = await repoGetQuizEmployeeAnswer(quizEmployeeId, quizQuestionId);
        if(quizEmployeeAnswer){
            if(answerOfQuestion != quizEmployeeAnswer.answer_of_question){
                await repoDeleteQuizEmployeeAnswer(quizEmployeeAnswer.id);
            }else{
                return res.json({
                    message : 'Berhasil dijawab',
                    is_error : false
                });
            }
        }
        const isCorrect =  lower(quizQuestion.answer_of_question) == lower(answerOfQuestion) ? 'Y' : 'T';
        const point = await calculatePointQuestion(quizQuestionId, quizQuestion.question_type,'Quiz');
        const data = {
            quiz_employee_id : quizEmployeeId,
            quiz_question_id : quizQuestionId,
            answer_of_question : answerOfQuestion,
            is_correct : isCorrect,
            point : isCorrect == 'Y' ? point : 0
        };
        await repoQuizAnswerQuestion(data);
        return res.json({
            message : 'Berhasil dijawab',
            is_error : false
        });
    } catch(err) {
        return res.json({
            message : errMsg(err),
            is_error : true
        })
    }
}

export const quizSubmitAnswer = async(req, res) => {
    try {
        const quizEmployeeId = req.body.data.quiz_employee_id;
        const totalPoint = await repoSumPointByQuizEmp(quizEmployeeId);
        const quizEmployee = await repoGetQuizEmployeeById(quizEmployeeId);
        if(!quizEmployee){
            return res.json({
                message : 'Quiz tidak ditemukan',
                is_error : true
            });
        }
        if(quizEmployee.status == 'Done'){
            return res.json({
                message : 'Quiz sudah pernah disubmit',
                is_error : true
            });
        }
        const progress = await getProgress(quizEmployee.courses_employee.course_id);
        await repoUpdateQuizEmp({
            end_at : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            status : 'Done',
            point : 200,
            score : totalPoint.total,
            progress : progress
        }, quizEmployeeId);
        await repoUpdateCourseEmployee({
            progress : quizEmployee.courses_employee.progress + progress
        }, quizEmployee.courses_employee.id);
        if(quizEmployee.courses_employee.progress + progress >= 100) {
            await generateCertificate(quizEmployee.courses_employee.id);
        }
        return res.json({
            message : 'Quiz berhasil disubmit',
            is_error : false
        });
    } catch(err) {
        return res.json({
            message : errMsg(err),
            is_error : true
        });
    }
}

export const getMyQuiz = async(req, res) => {
    try {
        const quizEmployee = await repoGetMyQuiz(req.body.employee_id);
        return res.json({
            data : quizEmployee,
            is_error : false
        });
    } catch(err) {
        return res.json({
            message : errMsg(err),
            is_error : true
        })
    }
}

export const getMyQuizEmpByQuiz = async(req, res) =>{
    try {
        const quiz = await repoGetQuizEmpByQuiz(req.body.quiz_id, req.body.employee_id);
        return res.json({
            data : quiz,
            is_error : false
        });
    } catch(err) {
        return res.json({
            message : errMsg(err),
            is_error : true
        });
    }
}

export const getQuestionByQuizEmployee = async(req, res) => {
    try {
        var result = false;
        if(typeof req.body.result != 'undefined'){
            result = req.body.result;
        }
        const quizQuestion = await repoGetQuestionByQuizEmp(req.body.quiz_employee_id, req.body.question_number, result);
        return res.json({
            data : quizQuestion,
            is_error : false
        })
    } catch(err) {
        return res.json({
            message : errMsg(err),
            is_error : true
        });
    }
}

export const getResultQuiz = async(req, res) => {
    try {
        let result = [];
        if(req.body.type == "all"){
            result = await repoGetResultQuiz();
        }
        else if(req.body.type == "employee") {
            result = await repoGetResultQuizByEmployee(req.body.id);
        }
        else if(req.body.type == "organization") {
            result = await repoGetResultQuizByOrg(req.body.id);
        }
        return res.json({
            data : result,
            is_error : false
        })
    } catch(err) {
        return res.json({
            message : errMsg(err),
            is_error : true
        })
    }
}