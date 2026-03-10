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
import { IFinalQuizResult } from "@/types/courseProgress.types";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";
import type { QuizAnswerMap, QuizQuestion } from "@/types/quiz.types";

interface QuizCoursePlayerModuleProps {
  quizzes: QuizQuestion[];
  moduleTitle?: string;
  onComplete?: (answers: QuizAnswerMap) => void; // devuelve respuestas al finalizar
  isPractice?: boolean; // si true, muestra feedback inmediato
  finalResult?: IFinalQuizResult;
}

export function QuizCoursePlayer({
  quizzes,
  moduleTitle,
  onComplete,
  finalResult,
  isPractice = false,
}: QuizCoursePlayerModuleProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(quizzes.length).fill(null),
  );
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const selectedAnswer = answers[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (isPractice) setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(isPractice && answers[currentQuestion + 1] !== null);
    } else {
      setQuizCompleted(true);

      // Convertir array de respuestas a Record<string, number>
      const answersRecord: QuizAnswerMap = {};
      quizzes.forEach((quiz, index) => {
        if (answers[index] !== null) {
          answersRecord[quiz.id] = answers[index]!;
        }
      });

      onComplete?.(answersRecord);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowFeedback(isPractice && answers[currentQuestion - 1] !== null);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(Array(quizzes.length).fill(null));
    setQuizCompleted(false);
    setShowFeedback(false);
  };

  const calculateScore = () => {
    if (!isPractice) return null;
    return answers.reduce((total, answer, index) => {
      if (answer === quizzes[index].correctAnswer) return total! + 1;
      return total;
    }, 0);
  };

  const getScoreMessage = () => {
    const finalScore = calculateScore();
    if (finalScore === null) return "";
    const percentage = (finalScore / quizzes.length) * 100;
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
          <div className="relative mb-6 flex justify-center">
            <Trophy className="w-20 h-20 text-slate-500 drop-shadow-lg" />
          </div>
          <h1
            className={cn(
              "text-4xl font-bold mb-4",
              finalResult?.data?.passed
                ? "bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
                : "text-foreground/70",
            )}
          >
            {finalResult?.data?.passed
              ? "¡Examen aprobado!"
              : "Examen no aprobado"}
          </h1>
          {moduleTitle && (
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {moduleTitle}
            </p>
          )}
        </div>

        {isPractice && finalScore !== null && (
          <div className="space-y-8 p-6">
            <div className="relative bg-gradient-to-br rounded-2xl p-8 border border-slate-200">
              <div className="text-center space-y-4">
                <div className="text-7xl font-bold bg-gradient-to-r from-primary to-primary-light dark:from-primary dark:to-primary-light bg-clip-text text-transparent">
                  {finalScore}/{quizzes.length}
                </div>
                <div className="text-2xl text-slate-600 dark:text-slate-300 font-medium">
                  {Math.round((finalScore / quizzes.length) * 100)}% Correctas
                </div>
                <div className="flex justify-center space-x-1 mt-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i}>
                      <Star
                        fill="currentColor"
                        className={`w-10 h-10 ${
                          i < Math.ceil((finalScore / quizzes.length) * 5)
                            ? "text-yellow-400"
                            : "text-slate-300/30 dark:text-slate-600/20"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center pt-4">
              <Button onClick={resetQuiz}>Realizar Quiz de Nuevo</Button>
            </div>
            <div className="text-center mt-4 text-slate-700 dark:text-slate-300">
              {getScoreMessage()}
            </div>
          </div>
        )}

        {!isPractice && finalResult?.success && (
          <div className="p-6 text-center text-slate-700 space-y-2">
            <p className="font-bold">{finalResult.message}</p>
            <p>
              Puntaje: {finalResult.data.score}% ({finalResult.data.correct}/
              {finalResult.data.total} correctas)
            </p>
            {!finalResult.data.passed && (
              <p>Intentos: {finalResult.data.attemptsUsed} / 3</p>
            )}
            {!finalResult.data.passed && finalResult.data.canRetryAt && (
              <p>
                Podés volver a intentar el:{" "}
                {formatDate(finalResult.data.canRetryAt)}
              </p>
            )}
          </div>
        )}
        {!isPractice && !finalResult?.success && (
          <div className="text-center text-slate-700 mb-4">
            {finalResult?.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full mx-auto shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/95 rounded-lg">
        <div className="p-6">
          {/* Top progress y icons */}
          <div className="flex justify-between items-center mb-6">
            {quizzes.map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="relative transition-all duration-500">
                  <CircleQuestionMark
                    className={`w-8 h-8 transition-all duration-300 ${
                      answers[index] !== null
                        ? isPractice
                          ? answers[index] === quizzes[index].correctAnswer
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-slate-400/40 dark:text-slate-600/30"
                        : index === currentQuestion
                          ? "text-primary animate-pulse"
                          : "text-slate-400/40 dark:text-slate-600/30"
                    }`}
                  />
                  {answers[index] !== null && isPractice && (
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

          {/* Barra de avance */}
          <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-primary to-secondary dark:from-secondary dark:to-secondary-light h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{
                width: `${
                  ((currentQuestion + (showFeedback ? 1 : 0)) /
                    quizzes.length) *
                  100
                }%`,
              }}
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-balance leading-tight mb-6">
            {quizzes[currentQuestion].question}
          </h2>

          {/* Opciones */}
          <div className="space-y-3 mb-6">
            {quizzes[currentQuestion].options.map((option, index) => {
              let buttonClass =
                "w-full p-4 text-left border-2 transition-all duration-300 hover:border-primary dark:hover:border-primary hover:shadow-md dark:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] rounded-lg cursor-pointer";

              if (selectedAnswer === index) {
                buttonClass +=
                  " bg-primary-light dark:bg-primary-light border-primary";
              } else {
                buttonClass +=
                  " hover:bg-slate-100/50 dark:hover:bg-slate-700/30 border-slate-200 dark:border-slate-600/50";
              }

              let icon = null;
              if (showFeedback && isPractice) {
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
              }

              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base font-medium">{option}</span>
                    {icon}
                  </div>
                </button>
              );
            })}
          </div>

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
