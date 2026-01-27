import { useState } from "react";
import { Button } from "../ui/button";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleQuestionMark,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";

// Tipo que coincide con la respuesta de la API
export interface QuizQuestion {
  id: string;
  courseId: string;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  status: string;
  reviewerNotes: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface QuizCoursePlayerModuleProps {
  quizzes: QuizQuestion[];
  moduleTitle?: string;
  onComplete?: (score: number, total: number) => void;
}

export function QuizCoursePlayerModule({
  quizzes,
  moduleTitle,
  onComplete,
}: QuizCoursePlayerModuleProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(quizzes.length).fill(null),
  );

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (answerIndex === quizzes[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowFeedback(answers[currentQuestion + 1] !== null);
    } else {
      setQuizCompleted(true);
      const finalScore = calculateScore();
      onComplete?.(finalScore!, quizzes.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowFeedback(answers[currentQuestion - 1] !== null);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowFeedback(false);
    setQuizCompleted(false);
    setAnswers(Array(quizzes.length).fill(null));
  };

  const calculateScore = () => {
    return answers.reduce((total, answer, index) => {
      if (answer === quizzes[index].correctAnswer) {
        return total! + 1;
      }
      return total;
    }, 0);
  };

  const getScoreMessage = () => {
    const finalScore = calculateScore();
    const percentage = (finalScore! / quizzes.length) * 100;
    if (percentage >= 80)
      return "Excelente desempeño. Dominás los conceptos clave.";
    if (percentage >= 60)
      return "Muy buen resultado. Vas por el camino correcto.";
    if (percentage >= 40)
      return "Buen intento. Te recomendamos repasar algunos contenidos.";
    return "Es importante reforzar los conceptos. Repasá las clases y volvé a intentarlo.";
  };

  if (quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          No hay preguntas disponibles para este módulo.
        </p>
      </div>
    );
  }

  if (quizCompleted) {
    const finalScore = calculateScore();
    return (
      <div className="w-full max-w-3xl mx-auto shadow-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center pb-8 p-6">
          <div className="relative mb-6">
            <div className="relative flex justify-center">
              <Trophy className="w-20 h-20 text-slate-500 drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light dark:from-primary dark:to-primary-light bg-clip-text text-transparent mb-4">
            ¡Quiz Completado!
          </h1>
          {moduleTitle && (
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {moduleTitle}
            </p>
          )}
        </div>
        <div className="space-y-8 p-6">
          <div className="relative bg-gradient-to-br rounded-2xl p-8 border border-slate-200">
            <div className="text-center space-y-4">
              <div className="text-7xl font-bold bg-gradient-to-r from-primary to-primary-light dark:from-primary dark:to-primary-light bg-clip-text text-transparent">
                {finalScore}/{quizzes.length}
              </div>
              <div className="text-2xl text-slate-600 dark:text-slate-300 font-medium">
                {Math.round((finalScore! / quizzes.length) * 100)}% Correctas
              </div>
              <div className="flex justify-center space-x-1 mt-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <Star
                      fill="currentColor"
                      className={`w-10 h-10 ${
                        i < Math.ceil((finalScore! / quizzes.length) * 5)
                          ? "text-yellow-400"
                          : "text-slate-300/30 dark:text-slate-600/20"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block rounded-lg px-6 py-3 border border-slate-200">
              <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {getScoreMessage()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {quizzes.map((_, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border-2 transition-all duration-300 ${
                    answers[index] === quizzes[index].correctAnswer
                      ? "bg-green-100/20 dark:bg-green-400/30 border-green-500 text-green-600 dark:text-green-400"
                      : "bg-red-100/10 dark:bg-red-400/20 border-red-300/30 dark:border-red-400/40 text-red-600 dark:text-red-400"
                  }`}
                >
                  {answers[index] === quizzes[index].correctAnswer ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  P{index + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button onClick={resetQuiz}>Realizar Quiz de Nuevo</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full mx-auto shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/95 rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Pregunta {currentQuestion + 1} de {quizzes.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Puntuación: {calculateScore()}/
              {answers.filter((a) => a !== null).length}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {quizzes.map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2"
                >
                  <div
                    className={`relative transition-all duration-500 ${
                      index <= currentQuestion ? "animate-bounce" : ""
                    }`}
                  >
                    <CircleQuestionMark
                      className={`w-8 h-8 transition-all duration-300 ${
                        answers[index] !== null
                          ? answers[index] === quizzes[index].correctAnswer
                            ? "text-green-500"
                            : "text-red-500"
                          : index === currentQuestion
                            ? "text-primary animate-pulse"
                            : "text-slate-400/40 dark:text-slate-600/30"
                      }`}
                    />
                    {answers[index] !== null && (
                      <div className="absolute -top-1 -right-1">
                        {answers[index] === quizzes[index].correctAnswer ? (
                          <CheckCircle className="w-4 h-4 text-green-500 bg-white dark:bg-slate-800 rounded-full" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 bg-white dark:bg-slate-800 rounded-full" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary dark:from-secondary dark:to-secondary-light h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{
                  width: `${((currentQuestion + (showFeedback ? 1 : 0)) / quizzes.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-balance leading-tight mb-6">
            {quizzes[currentQuestion].question}
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {quizzes[currentQuestion].options.map((option, index) => {
              let buttonClass =
                "w-full p-4 text-left border-2 transition-all duration-300 hover:border-primary dark:hover:border-primary hover:shadow-md dark:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] rounded-lg cursor-pointer";
              let icon = null;

              if (showFeedback) {
                if (index === quizzes[currentQuestion].correctAnswer) {
                  buttonClass +=
                    " bg-green-100/10 dark:bg-green-400/20 text-green-600 dark:text-green-400 border-green-500 shadow-lg animate-pulse";
                  icon = <CheckCircle className="w-5 h-5 ml-2" />;
                } else if (index === selectedAnswer) {
                  buttonClass +=
                    " bg-red-100/10 dark:bg-red-400/20 text-red-600 dark:text-red-400 border-red-500";
                  icon = <XCircle className="w-5 h-5 ml-2" />;
                } else {
                  buttonClass += " opacity-50 dark:opacity-40";
                }
              } else {
                if (index === selectedAnswer) {
                  buttonClass +=
                    " bg-primary-light dark:bg-primary-light border-primary";
                } else {
                  buttonClass +=
                    " hover:bg-slate-100/50 dark:hover:bg-slate-700/30 border-slate-200 dark:border-slate-600/50";
                }
              }

              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base font-medium">{option}</span>
                    {icon}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-slate-100/50 to-slate-100/30 dark:from-slate-700/30 dark:to-slate-700/20 border border-slate-300/20 dark:border-slate-600/30">
              <div className="text-center">
                {selectedAnswer === quizzes[currentQuestion].correctAnswer ? (
                  <div className="text-success dark:text-green-400 font-medium flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>¡Correcto! ¡Bien hecho!</span>
                  </div>
                ) : (
                  <div className="text-slate-600 dark:text-slate-400">
                    La respuesta correcta es:{" "}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {
                        quizzes[currentQuestion].options[
                          quizzes[currentQuestion].correctAnswer
                        ]
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              {selectedAnswer !== null
                ? "Respuesta seleccionada"
                : "Selecciona una respuesta"}
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex items-center"
            >
              <span>
                {currentQuestion === quizzes.length - 1
                  ? "Finalizar"
                  : "Siguiente"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
