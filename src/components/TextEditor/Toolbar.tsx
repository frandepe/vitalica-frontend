import {
  Bold,
  Italic,
  List,
  Heading2,
  Heading1,
  Heading3,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";

export function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const normalizeUrl = (url: string) => {
    const trimmed = url.trim();

    if (!trimmed) return "";

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  };

  return (
    <div className="flex gap-2 border-b border-border mb-2 pb-2">
      <Button
        size="sm"
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Button>

      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "outline"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </Button>

      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "outline"
        }
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        <Heading2 size={16} />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "outline"
        }
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
      >
        <Heading3 size={16} />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Button>

      <AlertDialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant={editor.isActive("link") ? "default" : "outline"}
            onMouseDown={(e) => {
              e.preventDefault();

              const current = editor.getAttributes("link").href || "";
              setLinkUrl(current);
              setIsLinkDialogOpen(true);
            }}
          >
            <Link size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insertar enlace</AlertDialogTitle>
            <AlertDialogDescription>
              Pegá la URL completa del enlace.
              <br />
              El link se abrirá en una nueva pestaña.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            placeholder="https://ejemplo.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            autoFocus
          />

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setLinkUrl("");
              }}
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                const normalizedUrl = normalizeUrl(linkUrl);
                if (!normalizedUrl) return;

                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: normalizedUrl })
                  .run();

                setIsLinkDialogOpen(false);
              }}
            >
              Aplicar enlace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
