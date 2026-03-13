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
  onComplete?: (answers: QuizAnswerMap) => void;
  isPractice?: boolean;
  finalResult?: IFinalQuizResult;
  passedActionLabel?: string;
  passedActionDescription?: string;
  onPassedAction?: () => void | Promise<void>;
  passedActionLoading?: boolean;
}

export function QuizCoursePlayer({
  quizzes,
  moduleTitle,
  onComplete,
  finalResult,
  passedActionLabel,
  passedActionDescription,
  onPassedAction,
  passedActionLoading = false,
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
      return "Excelente desempeno. Dominas los conceptos clave.";
    if (percentage >= 60)
      return "Muy buen resultado. Vas por el camino correcto.";
    if (percentage >= 40)
      return "Buen intento. Te recomendamos repasar algunos contenidos.";
    return "Es importante reforzar los conceptos. Repasa las clases y vuelve a intentarlo.";
  };

  if (quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          No hay preguntas disponibles para este modulo.
        </p>
      </div>
    );
  }

  if (quizCompleted) {
    const finalScore = calculateScore();
    return (
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90">
        <div className="p-6 pb-8 text-center">
          <div className="relative mb-6 flex justify-center">
            <Trophy className="h-20 w-20 text-slate-500 drop-shadow-lg" />
          </div>
          <h1
            className={cn(
              "mb-4 text-4xl font-bold",
              finalResult?.data?.passed
                ? "bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
                : "text-foreground/70",
            )}
          >
            {finalResult?.data?.passed ? "Examen aprobado" : "Examen no aprobado"}
          </h1>
          {moduleTitle && (
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {moduleTitle}
            </p>
          )}
        </div>

        {isPractice && finalScore !== null && (
          <div className="space-y-8 p-6">
            <div className="relative rounded-2xl border border-slate-200 p-8">
              <div className="space-y-4 text-center">
                <div className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-7xl font-bold text-transparent dark:from-primary dark:to-primary-light">
                  {finalScore}/{quizzes.length}
                </div>
                <div className="text-2xl font-medium text-slate-600 dark:text-slate-300">
                  {Math.round((finalScore / quizzes.length) * 100)}% Correctas
                </div>
                <div className="mt-6 flex justify-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i}>
                      <Star
                        fill="currentColor"
                        className={`h-10 w-10 ${
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
            <div className="pt-4 text-center">
              <Button onClick={resetQuiz}>Realizar quiz de nuevo</Button>
            </div>
            <div className="mt-4 text-center text-slate-700 dark:text-slate-300">
              {getScoreMessage()}
            </div>
          </div>
        )}

        {!isPractice && finalResult?.success && (
          <div className="space-y-3 p-6 text-center text-slate-700">
            <p className="font-bold">{finalResult.message}</p>
            <p>
              Puntaje: {finalResult.data.score}% ({finalResult.data.correct}/
              {finalResult.data.total} correctas)
            </p>
            {finalResult.data.passed && passedActionDescription && (
              <p className="mx-auto max-w-xl text-sm text-muted-foreground">
                {passedActionDescription}
              </p>
            )}
            {!finalResult.data.passed && (
              <p>Intentos: {finalResult.data.attemptsUsed} / 3</p>
            )}
            {!finalResult.data.passed && finalResult.data.canRetryAt && (
              <p>
                Podes volver a intentar el:{" "}
                {formatDate(finalResult.data.canRetryAt)}
              </p>
            )}
            {finalResult.data.passed && onPassedAction && passedActionLabel && (
              <div className="pt-4">
                <Button onClick={() => void onPassedAction()}>
                  {passedActionLoading
                    ? "Actualizando progreso..."
                    : passedActionLabel}
                </Button>
              </div>
            )}
          </div>
        )}

        {!isPractice && !finalResult?.success && (
          <div className="mb-4 text-center text-slate-700">
            {finalResult?.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700/50 dark:bg-slate-800/95 dark:shadow-2xl">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            {quizzes.map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="relative transition-all duration-500">
                  <CircleQuestionMark
                    className={`h-8 w-8 transition-all duration-300 ${
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
                    <div className="absolute -right-1 -top-1">
                      {answers[index] === quizzes[index].correctAnswer ? (
                        <CheckCircle className="h-4 w-4 rounded-full bg-white text-green-500 dark:bg-slate-800" />
                      ) : (
                        <XCircle className="h-4 w-4 rounded-full bg-white text-red-500 dark:bg-slate-800" />
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

          <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/50">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary shadow-sm transition-all duration-700 ease-out dark:from-secondary dark:to-secondary-light"
              style={{
                width: `${
                  ((currentQuestion + (showFeedback ? 1 : 0)) / quizzes.length) *
                  100
                }%`,
              }}
            />
          </div>

          <h2 className="mb-6 text-2xl font-bold leading-tight text-slate-900 text-balance dark:text-slate-100">
            {quizzes[currentQuestion].question}
          </h2>

          <div className="mb-6 space-y-3">
            {quizzes[currentQuestion].options.map((option, index) => {
              let buttonClass =
                "w-full rounded-lg border-2 p-4 text-left transition-all duration-300 hover:border-primary hover:shadow-md active:scale-[0.98] dark:hover:border-primary dark:hover:shadow-lg";

              if (selectedAnswer === index) {
                buttonClass +=
                  " border-primary bg-primary-light dark:bg-primary-light";
              } else {
                buttonClass +=
                  " border-slate-200 hover:bg-slate-100/50 dark:border-slate-600/50 dark:hover:bg-slate-700/30";
              }

              let icon = null;
              if (showFeedback && isPractice) {
                if (index === quizzes[currentQuestion].correctAnswer) {
                  buttonClass +=
                    " animate-pulse border-green-500 bg-green-100/10 text-green-600 shadow-lg dark:bg-green-400/20 dark:text-green-400";
                  icon = <CheckCircle className="ml-2 h-5 w-5" />;
                } else if (index === selectedAnswer) {
                  buttonClass +=
                    " border-red-500 bg-red-100/10 text-red-600 dark:bg-red-400/20 dark:text-red-400";
                  icon = <XCircle className="ml-2 h-5 w-5" />;
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
                  <div className="flex w-full items-center justify-between">
                    <span className="text-base font-medium">{option}</span>
                    {icon}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
