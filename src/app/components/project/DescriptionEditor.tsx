'use client';
import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Youtube from '@tiptap/extension-youtube';
import { useEffect } from 'react';

import { 
  LuBold, LuItalic, LuStrikethrough, LuCode, 
  LuLink, LuImage, LuYoutube, LuSave, LuUnderline 
} from "react-icons/lu";

interface EditorProps {
  initialContent: string;
  onSave: (html: string) => void;
}

export default function DescriptionEditor({ initialContent, onSave }: EditorProps) {
  const [chars, setChars] = useState(initialContent?.length || 0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      CodeBlock.configure({
        HTMLAttributes: { 
          class: 'bg-[var(--background)] text-[var(--foreground)] p-4 rounded-md font-mono my-4 border border-[var(--border)] whitespace-pre-wrap break-all' 
        },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg shadow-md my-6 max-w-full h-auto border border-[var(--border)]' },
      }),
      Youtube.configure({
        width: 840,
        height: 480,
        HTMLAttributes: { class: 'rounded-lg overflow-hidden my-6 shadow-lg max-w-full aspect-video border border-[var(--border)]' }
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: 'text-[var(--accent)] underline font-bold break-all hover:opacity-80' }
      }),
      Placeholder.configure({
        placeholder: 'Введите описание проекта...',
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setChars(editor.getText().length);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none min-h-[450px] p-6 md:p-10 text-[var(--foreground)] bg-[var(--card)] min-w-full max-w-full break-words whitespace-pre-wrap',
      },
    },
  });

  const addLink = useCallback(() => {
    const url = window.prompt('URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Ссылка на картинку:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('Ссылка на YouTube:');
    if (url) editor?.commands.setYoutubeVideo({ src: url });
  }, [editor]);

    useEffect(() => {
  if (editor && initialContent) {
    setChars(editor.getText().length);
  }
  }, [editor, initialContent]);

  if (!editor) return null;

  const isRequirementMet = chars >= 200;

  return (
    <div className="flex flex-col w-full min-w-full space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror { 
          width: 100% !important; 
          max-width: 100% !important; 
          word-break: break-word !important; 
          color: var(--foreground) !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted);
          pointer-events: none;
          height: 0;
        }
      `}} />

      <div className="w-full bg-[var(--card)] rounded-md border border-[var(--border)] shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--surface)]">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            active={editor.isActive('bold')} 
            icon={<LuBold size={16} />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={editor.isActive('italic')} 
            icon={<LuItalic size={16} />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            active={editor.isActive('underline')} 
            icon={<LuUnderline size={16} />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            active={editor.isActive('strike')} 
            icon={<LuStrikethrough size={16} />} 
          />
          
          <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />

          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            active={editor.isActive('codeBlock')} 
            icon={<LuCode size={16} />} 
          />
          <ToolbarButton onClick={addLink} active={editor.isActive('link')} icon={<LuLink size={16} />} />
          <ToolbarButton onClick={addImage} icon={<LuImage size={16} />} />
          <ToolbarButton onClick={addYoutube} icon={<LuYoutube size={16} />} />
        </div>

        {/* EDITOR AREA */}
        <div className="w-full flex-1 overflow-x-hidden overflow-y-auto bg-[var(--card)]">
          <EditorContent editor={editor} className="w-full h-full" />
        </div>
      </div>

      {/* FOOTER */}
     <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-1  pb-2">
        <div className="flexflex-col w-full md:w-auto">
          <div className={`m-5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${isRequirementMet ? 'text-green-500' : 'text-[var(--accent)]'}`}>
              <span>Символов: {chars} / 200</span>
          </div>
          <div className="w-full m-5 md:w-64 h-1 bg-[var(--surface)] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isRequirementMet ? 'bg-green-500' : 'bg-[var(--accent)]'}`}
              style={{ width: `${Math.min((chars / 200) * 100, 100)}%` }}
            />
          </div>
        </div>

        <button 
          onClick={() => onSave(editor.getHTML())}
          disabled={!isRequirementMet}
          className={`
            px-10 py-3.5 m-5 rounded-md font-black uppercase text-[10px] tracking-[0.15em] transition-all
            flex items-center justify-center gap-3
            ${isRequirementMet 
              ? 'bg-[var(--foreground-bright)] text-[var(--background)] hover:bg-[var(--accent)] active:scale-95' 
              : 'bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed opacity-50'
            }
          `}
        >
          <LuSave size={16} />
          Сохранить описание
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, active, icon }: { onClick: () => void, active?: boolean, icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2.5 rounded-md transition-all ${
        active 
          ? 'bg-[var(--accent)] text-[var(--contrast-text)] shadow-sm' 
          : 'text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]'
      }`}
    >
      {icon}
    </button>
  );
}