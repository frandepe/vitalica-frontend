import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ClipboardPenLine, GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import {
  createModuleQuiz,
  deleteModuleQuiz,
  getModuleQuizzes,
  reorderModuleQuizzes,
} from "@/api";

import { UniversalModal } from "../UniversalModal";
import {
  OptionCardQuestion,
  RadioGroupQuestion,
} from "@/components/RadioGroups/RadioGroupQuestion";
import { SortableItem } from "@/hooks/useStep4Dnd";

interface ModuleQuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
}

interface Props {
  moduleId: string;
}

export const ModuleQuizzes = ({ moduleId }: Props) => {
  const [quizzes, setQuizzes] = useState<ModuleQuizItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const maxReached = quizzes.length >= 5;

  const fetchQuizzes = async () => {
    setLoading(true);
    const res = await getModuleQuizzes(moduleId);
    if (res.success) {
      const sorted = [...(res.data || [])].sort((a, b) => a.order - b.order);
      setQuizzes(sorted);
    }
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

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || reordering) return;

    const oldIndex = quizzes.findIndex((quiz) => quiz.id === active.id);
    const newIndex = quizzes.findIndex((quiz) => quiz.id === over.id);

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    const reordered = arrayMove(quizzes, oldIndex, newIndex).map((quiz, index) => ({
      ...quiz,
      order: index + 1,
    }));

    setQuizzes(reordered);
    setReordering(true);

    const response = await reorderModuleQuizzes(
      moduleId,
      reordered.map((quiz) => quiz.id),
    );

    if (!response.success) {
      await fetchQuizzes();
    }

    setReordering(false);
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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={quizzes.map((quiz) => quiz.id)}
              strategy={verticalListSortingStrategy}
            >
              {quizzes.map((quiz, i) => (
                <SortableItem key={quiz.id} id={quiz.id} className="mb-3">
                  {({ attributes, listeners, setActivatorNodeRef, isDragging }) => (
                    <Card className={`p-4 space-y-2 ${isDragging ? "ring-1 ring-primary" : ""}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground"
                            ref={setActivatorNodeRef}
                            {...attributes}
                            {...listeners}
                          >
                            <GripVertical className="w-4 h-4" />
                          </Button>
                          <p className="font-medium">
                            {i + 1}. {quiz.question}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>

                      <ul className="list-disc ml-5 text-sm">
                        {quiz.options.map((o, idx) => (
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
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>

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
