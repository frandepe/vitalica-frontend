import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionCard, RadioGroup } from "@/components/ui/radio-group";

import { Info, Loader2, Plus, Trash2 } from "lucide-react";

import { createFinalQuiz, getFinalQuizzes, deleteFinalQuiz } from "@/api";
import { Badge } from "@/components/ui/badge";

interface Props {
  courseId: string;
}

export const Step5 = ({ courseId }: Props) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const MAX_FINAL_QUIZZES = 20;
  const maxReached = quizzes.length >= MAX_FINAL_QUIZZES;

  const fetchQuizzes = async () => {
    setLoading(true);
    const res = await getFinalQuizzes(courseId);
    if (res.success) setQuizzes(res.data!);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const handleCreate = async () => {
    if (
      maxReached ||
      !question.trim() ||
      options.some((o) => !o.trim()) ||
      correctAnswer === null
    )
      return;

    setCreating(true);

    const res = await createFinalQuiz({
      courseId,
      question,
      options,
      correctAnswer,
    });

    if (res.success) {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(null);
      fetchQuizzes();
    }

    setCreating(false);
  };

  const handleDelete = async (quizId: string) => {
    await deleteFinalQuiz(quizId);
    fetchQuizzes();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <p>
          Preguntas del examen final ({quizzes.length}/{MAX_FINAL_QUIZZES})
        </p>
        <Badge variant="info" className="mt-2">
          <Info /> El examen final es obligatorio para aprobar el curso y
          acceder al certificado. Para que el curso pueda ser evaluado y
          aprobado por el administrador, debe contar con un mínimo de 5
          preguntas
        </Badge>
      </div>

      {/* Listado */}
      {loading && <Loader2 className="animate-spin" />}

      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3 mb-4">
        {quizzes.map((quiz, i) => (
          <Card key={quiz.id} className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <p className="font-medium">
                {i + 1}. {quiz.question}
              </p>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(quiz.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            <ul className="list-disc ml-5 text-sm">
              {quiz.options.map((o: string, idx: number) => (
                <li
                  key={idx}
                  className={
                    idx === quiz.correctAnswer
                      ? "font-semibold text-primary"
                      : ""
                  }
                >
                  {o}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Crear nueva */}
      {!maxReached && (
        <Card className="p-4 space-y-4 border-dashed">
          <h4 className="font-medium">Agregar pregunta al examen final</h4>

          <div className="space-y-1">
            <Label>Pregunta</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribí la pregunta"
            />
          </div>

          <div className="space-y-2">
            <Label>Opciones (al finalizar seleccioná la correcta)</Label>

            <RadioGroup
              value={
                correctAnswer !== null ? correctAnswer.toString() : undefined
              }
              onValueChange={(v) => setCorrectAnswer(Number(v))}
              className="grid grid-cols-2 gap-3"
            >
              {options.map((opt, idx) => {
                const isSelected = correctAnswer === idx;

                return (
                  <OptionCard key={idx} value={idx.toString()}>
                    <div className="flex items-center justify-between gap-2 w-full">
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const copy = [...options];
                          copy[idx] = e.target.value;
                          setOptions(copy);
                        }}
                        placeholder={`Opción ${idx + 1}`}
                        className="w-full border-none p-0 text-sm bg-transparent focus-visible:ring-0"
                      />

                      {isSelected && (
                        <span className="text-xs font-semibold text-primary">
                          Correcta
                        </span>
                      )}
                    </div>
                  </OptionCard>
                );
              })}
            </RadioGroup>
          </div>

          <Button
            onClick={handleCreate}
            disabled={creating}
            className="flex gap-2"
          >
            {creating ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Agregar pregunta
          </Button>
        </Card>
      )}
      {maxReached && (
        <p className="text-sm text-muted-foreground">
          Alcanzaste el máximo de {MAX_FINAL_QUIZZES} preguntas para el examen
          final.
        </p>
      )}
    </div>
  );
};
