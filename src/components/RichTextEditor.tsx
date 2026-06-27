"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (action: () => void, label: string, active?: boolean) => (
    <button
      type="button"
      onClick={action}
      className={`px-2 py-1 text-sm rounded border ${
        active ? "bg-navy-900 text-white border-navy-900" : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="rounded-lg border border-zinc-300 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-zinc-200 bg-zinc-50 px-2 py-1.5">
        {btn(() => editor.chain().focus().toggleBold().run(), "B", editor.isActive("bold"))}
        {btn(() => editor.chain().focus().toggleItalic().run(), "I", editor.isActive("italic"))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2", editor.isActive("heading", { level: 2 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3", editor.isActive("heading", { level: 3 }))}
        {btn(() => editor.chain().focus().toggleBulletList().run(), "• Liste", editor.isActive("bulletList"))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), "1. Liste", editor.isActive("orderedList"))}
        {btn(() => editor.chain().focus().setParagraph().run(), "Paragraf", editor.isActive("paragraph"))}
      </div>

      {/* Editor alanı */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 min-h-[180px] focus:outline-none"
      />
    </div>
  );
}