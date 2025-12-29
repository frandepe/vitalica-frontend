export const QuizList = ({
  title,
  quizzes,
}: {
  title: string;
  quizzes: any[];
}) => (
  <section className="space-y-3">
    <h3 className="font-semibold">{title}</h3>

    {quizzes.map((q, i) => (
      <div key={q.id} className="border border-border rounded p-3 space-y-2">
        <p className="font-medium">
          {i + 1}. {q.question}
        </p>

        <ul className="text-sm space-y-1">
          {q.options.map((opt: string, idx: number) => (
            <li
              key={idx}
              className={`px-2 py-1 rounded ${
                idx === q.correctAnswer
                  ? "bg-green-100 font-medium"
                  : "bg-gray-100"
              }`}
            >
              {idx === q.correctAnswer ? "✔ " : ""}
              {opt}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);
// TODO: Reutilizar en las quiz del formulatrio de creacion de curso
