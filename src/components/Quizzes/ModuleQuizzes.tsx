import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { Trash2, Plus, Loader2, ClipboardPenLine } from "lucide-react";
import { createModuleQuiz, deleteModuleQuiz, getModuleQuizzes } from "@/api";

import { UniversalModal } from "../UniversalModal";
import {
  OptionCardQuestion,
  RadioGroupQuestion,
} from "@/components/RadioGroups/RadioGroupQuestion";

interface Props {
  moduleId: string;
}

export const ModuleQuizzes = ({ moduleId }: Props) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const maxReached = quizzes.length >= 5;

  const fetchQuizzes = async () => {
    setLoading(true);
    const res = await getModuleQuizzes(moduleId);
    if (res.success) setQuizzes(res.data!);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [moduleId]);

  const handleCreateQuiz = async () => {
    if (
      !question.trim() ||
      options.some((o) => !o.trim()) ||
      correctAnswer === null
    )
      return;

    setCreating(true);

    const res = await createModuleQuiz({
      moduleId,
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

  const handleDeleteQuiz = async (quizId: string) => {
    await deleteModuleQuiz(quizId);
    fetchQuizzes();
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <ClipboardPenLine className="w-4 h-4" />
        Preguntas de evaluación del módulo ({quizzes.length}/5)
      </Button>
      <UniversalModal
        open={open}
        onOpenChange={setOpen}
        title="Evaluación del módulo"
      >
        <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-4">
          <h4 className="font-semibold">
            Preguntas de evaluación del módulo ({quizzes.length}/5)
          </h4>

          {loading && <Loader2 className="animate-spin" />}

          {quizzes.map((quiz, i) => (
            <Card key={quiz.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <p className="font-medium">
                  {i + 1}. {quiz.question}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteQuiz(quiz.id)}
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

          {!maxReached && (
            <Card className="p-4 space-y-4 border-dashed">
              <Label>Pregunta</Label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribí la pregunta"
              />

              <div className="space-y-2">
                <Label>Opciones (al finalizar seleccioná la correcta)</Label>

                <RadioGroupQuestion
                  value={
                    correctAnswer !== null
                      ? correctAnswer.toString()
                      : undefined
                  }
                  onValueChange={(v) => setCorrectAnswer(Number(v))}
                  className="grid grid-cols-2 gap-3"
                >
                  {options.map((opt, idx) => {
                    const isSelected = correctAnswer === idx;

                    return (
                      <OptionCardQuestion key={idx} value={idx.toString()}>
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
                      </OptionCardQuestion>
                    );
                  })}
                </RadioGroupQuestion>
              </div>

              <Button
                onClick={handleCreateQuiz}
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
              Máximo de 5 preguntas alcanzado para este módulo.
            </p>
          )}
        </div>
      </UniversalModal>
    </div>
  );
};

// Intentos: ✔️ sí, con 24 hs
// Quiz por módulo: ✔️ opcional, 1–5
// Quiz final: ✔️ obligatorio
// Respuesta correcta: ✔️ una sola
// Aprobación: ❌ no 100%, ✔️ 70–80%
// Reglas: las define la plataforma
