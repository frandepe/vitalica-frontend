import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  GripVertical,
  Info,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createFinalQuiz,
  deleteFinalQuiz,
  getFinalQuizzes,
  reorderFinalQuizzes,
  updateCourseQuiz,
} from "@/api";
import { Badge } from "@/components/ui/badge";
import {
  OptionCardQuestion,
  RadioGroupQuestion,
} from "@/components/RadioGroups/RadioGroupQuestion";
import { SortableItem } from "@/hooks/useStep4Dnd";

interface FinalQuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
}

interface Props {
  courseId: string;
}

const EMPTY_OPTIONS = ["", "", "", ""];
const MAX_FINAL_QUIZZES = 20;

export const Step5 = ({ courseId }: Props) => {
  const [quizzes, setQuizzes] = useState<FinalQuizItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([...EMPTY_OPTIONS]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editOptions, setEditOptions] = useState([...EMPTY_OPTIONS]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState<number | null>(null);
  const [savingQuizId, setSavingQuizId] = useState<string | null>(null);

  const maxReached = quizzes.length >= MAX_FINAL_QUIZZES;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const fetchQuizzes = async () => {
    setLoading(true);
    const res = await getFinalQuizzes(courseId);
    if (res.success) {
      const sorted = [...(res.data || [])].sort((a, b) => a.order - b.order);
      setQuizzes(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const resetCreateForm = () => {
    setQuestion("");
    setOptions([...EMPTY_OPTIONS]);
    setCorrectAnswer(null);
  };

  const resetEditForm = () => {
    setEditingQuizId(null);
    setEditQuestion("");
    setEditOptions([...EMPTY_OPTIONS]);
    setEditCorrectAnswer(null);
    setSavingQuizId(null);
  };

  const handleCreate = async () => {
    if (
      maxReached ||
      !question.trim() ||
      options.length !== 4 ||
      options.some((option) => !option.trim()) ||
      correctAnswer === null
    ) {
      return;
    }

    setCreating(true);

    const res = await createFinalQuiz({
      courseId,
      question,
      options,
      correctAnswer,
    });

    if (res.success) {
      resetCreateForm();
      await fetchQuizzes();
    }

    setCreating(false);
  };

  const handleDelete = async (quizId: string) => {
    await deleteFinalQuiz(quizId);
    if (editingQuizId === quizId) {
      resetEditForm();
    }
    await fetchQuizzes();
  };

  const handleStartEdit = (quiz: FinalQuizItem) => {
    setEditingQuizId(quiz.id);
    setEditQuestion(quiz.question);
    setEditOptions([...quiz.options]);
    setEditCorrectAnswer(quiz.correctAnswer);
  };

  const handleSaveEdit = async (quizId: string) => {
    if (
      !editQuestion.trim() ||
      editOptions.length !== 4 ||
      editOptions.some((option) => !option.trim()) ||
      editCorrectAnswer === null
    ) {
      return;
    }

    setSavingQuizId(quizId);

    const res = await updateCourseQuiz(quizId, {
      question: editQuestion,
      options: editOptions,
      correctAnswer: editCorrectAnswer,
    });

    if (!res.success) {
      setSavingQuizId(null);
      return;
    }

    resetEditForm();
    await fetchQuizzes();
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

    const response = await reorderFinalQuizzes(
      courseId,
      reordered.map((quiz) => quiz.id),
    );

    if (!response.success) {
      await fetchQuizzes();
    }

    setReordering(false);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <p>
          Preguntas del examen final ({quizzes.length}/{MAX_FINAL_QUIZZES})
        </p>
        <Badge variant="info" className="mt-2">
          <Info /> El examen final es obligatorio para aprobar el curso y
          acceder al certificado. Para que el curso pueda ser evaluado y
          aprobado por el administrador, debe contar con un minimo de 5
          preguntas
        </Badge>
      </div>

      {loading && <Loader2 className="animate-spin" />}

      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3 mb-4">
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
                  <Card className={`p-4 space-y-4 ${isDragging ? "ring-1 ring-primary" : ""}`}>
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
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleStartEdit(quiz)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(quiz.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {editingQuizId === quiz.id ? (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label>Pregunta</Label>
                          <Input
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            placeholder="Escribi la pregunta"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Opciones (exactamente 4)</Label>
                          <RadioGroupQuestion
                            value={
                              editCorrectAnswer !== null
                                ? editCorrectAnswer.toString()
                                : undefined
                            }
                            onValueChange={(value) =>
                              setEditCorrectAnswer(Number(value))
                            }
                            className="grid grid-cols-2 gap-3"
                          >
                            {editOptions.map((option, idx) => {
                              const isSelected = editCorrectAnswer === idx;

                              return (
                                <OptionCardQuestion key={idx} value={idx.toString()}>
                                  <div className="flex items-center justify-between gap-2 w-full">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const nextOptions = [...editOptions];
                                        nextOptions[idx] = e.target.value;
                                        setEditOptions(nextOptions);
                                      }}
                                      placeholder={`Opcion ${idx + 1}`}
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

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveEdit(quiz.id)}
                            disabled={savingQuizId === quiz.id}
                          >
                            {savingQuizId === quiz.id && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Guardar cambios
                          </Button>
                          <Button variant="outline" onClick={resetEditForm}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ul className="list-disc ml-5 text-sm">
                        {quiz.options.map((option, idx) => (
                          <li
                            key={idx}
                            className={
                              idx === quiz.correctAnswer
                                ? "font-semibold text-primary"
                                : ""
                            }
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {!maxReached && (
        <Card className="p-4 space-y-4 border-dashed">
          <h4 className="font-medium">Agregar pregunta al examen final</h4>

          <div className="space-y-1">
            <Label>Pregunta</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribi la pregunta"
            />
          </div>

          <div className="space-y-2">
            <Label>Opciones (exactamente 4, selecciona la correcta)</Label>

            <RadioGroupQuestion
              value={
                correctAnswer !== null ? correctAnswer.toString() : undefined
              }
              onValueChange={(value) => setCorrectAnswer(Number(value))}
              className="grid grid-cols-2 gap-3"
            >
              {options.map((option, idx) => {
                const isSelected = correctAnswer === idx;

                return (
                  <OptionCardQuestion key={idx} value={idx.toString()}>
                    <div className="flex items-center justify-between gap-2 w-full">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const nextOptions = [...options];
                          nextOptions[idx] = e.target.value;
                          setOptions(nextOptions);
                        }}
                        placeholder={`Opcion ${idx + 1}`}
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
          Alcanzaste el maximo de {MAX_FINAL_QUIZZES} preguntas para el examen
          final.
        </p>
      )}
    </div>
  );
};
