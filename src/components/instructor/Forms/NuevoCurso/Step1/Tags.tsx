import { X } from "lucide-react";
import { useState } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagsInputBasic({
  value,
  onChange,
  placeholder = "Escribe una etiqueta y pulsa Enter para añadirla",
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-1">
      <div className="flex flex-wrap gap-1 p-2 border border-border rounded-lg min-h-[40px] items-center">
        {value.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs dark:bg-gray-700 dark:text-gray-200"
          >
            {tag}
            <button type="button" onClick={() => removeTag(index)}>
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <input
          className="flex-1 bg-transparent border-none outline-none text-xs"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
      {value.length > 0 && (
        <button
          type="button"
          className="text-xs text-start cursor-pointer text-gray-600 underline"
          onClick={() => onChange([])}
        >
          Limpiar etiquetas
        </button>
      )}
    </div>
  );
}
