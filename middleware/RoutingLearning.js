import { enrollCourse, getListContent } from "../controller/CourseController.js";
import { enrollExam, examAnswerQuestion, examSubmitAnswer } from "../controller/ExamController.js";
import { completedLessonContent } from "../controller/LessonController.js";
import { enrollQuizContest, quizContestAnswer, quizContestSubmit } from "../controller/QuizContestController.js";
import { enrollQuiz, quizAnswerQuestion, quizSubmitAnswer } from "../controller/QuizController.js";

export const RoutingLearning = async(req, res) => {
    switch(req.body.type){
        case 'enroll_course' :
            await enrollCourse(req, res);
        break;
        case 'completed_sub_lesson' :
            await completedLessonContent(req, res);
        break;
        case 'enroll_exam' :
            await enrollExam(req, res);
        break;
        case 'exam_answer_question' :
            await examAnswerQuestion(req, res);
        break;
        case 'exam_submit_answer' :
            await examSubmitAnswer(req, res);
        break;
        case 'enroll_quiz' :
            await enrollQuiz(req, res);
        break;
        case 'quiz_answer_question' :
            await quizAnswerQuestion(req, res);
        break;
        case 'quiz_submit_answer' :
            await quizSubmitAnswer(req, res);
        break;
        case 'enroll_quiz_contest' :
            await enrollQuizContest(req, res);
        break;
        case 'quiz_contest_answer_question' :
            await quizContestAnswer(req, res);
        break;
        case 'quiz_contest_submit_answer' :
            await quizContestSubmit(req, res);
        break;
        case 'get_list_content' : 
            await getListContent(req, res);
        break;
        default : 
            res.json({
                is_error : true,
                message : 'Command not found'
            });
        break;
    }
}