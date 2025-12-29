import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Toolbar } from "./Toolbar";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
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
  });

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
