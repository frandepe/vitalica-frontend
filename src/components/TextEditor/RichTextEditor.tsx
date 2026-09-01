import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Toolbar } from "./Toolbar";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function RichTextEditor({ value, onChange, onBlur }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  useEffect(() => {
    if (!editor) return;

    const incomingContent = value || "<p></p>";
    const currentContent = editor.getHTML();

    if (currentContent !== incomingContent) {
      editor.commands.setContent(incomingContent, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="border border-slate-400 rounded-md p-3 bg-background">
      <Toolbar editor={editor} />

      <div className=" max-w-none min-h-[120px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
