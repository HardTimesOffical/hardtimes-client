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
        HTMLAttributes: { class: 'bg-orange-50 text-orange-900 p-4 rounded-xl font-mono my-4 border border-orange-100 whitespace-pre-wrap break-all' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-2xl shadow-md my-6 max-w-full h-auto' },
      }),
      Youtube.configure({
        width: 840,
        height: 480,
        HTMLAttributes: { class: 'rounded-2xl overflow-hidden my-6 shadow-lg max-w-full aspect-video' }
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: 'text-orange-600 underline font-bold break-all' }
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
        // Добавлен break-words и min-w-full для предотвращения сжатия
        class: 'prose prose-orange focus:outline-none min-h-[400px] p-6 md:p-10 text-gray-800 bg-white min-w-full max-w-full break-words whitespace-pre-wrap',
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

  if (!editor) return null;

  const isRequirementMet = chars >= 200;

  return (
    <div className="flex flex-col w-full min-w-full space-y-6">
      {/* Принудительный фикс ширины внутри редактора */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror { 
          width: 100% !important; 
          max-width: 100% !important; 
          word-break: break-word !important; 
        }
      `}} />

      <div className="w-full bg-white rounded-[2.5rem] border-2 border-orange-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-1 p-4 border-b border-orange-50 bg-white">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            active={editor.isActive('bold')} 
            icon={<LuBold size={20} />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={editor.isActive('italic')} 
            icon={<LuItalic size={18} />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            active={editor.isActive('underline')} 
            icon={<LuUnderline size={18} />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            active={editor.isActive('strike')} 
            icon={<LuStrikethrough size={18} />} 
          />
          
          <div className="w-[1px] h-6 bg-orange-100 mx-2" />

          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            active={editor.isActive('codeBlock')} 
            icon={<LuCode size={18} />} 
          />
          <ToolbarButton onClick={addLink} active={editor.isActive('link')} icon={<LuLink size={18} />} />
          <ToolbarButton onClick={addImage} icon={<LuImage size={18} />} />
          <ToolbarButton onClick={addYoutube} icon={<LuYoutube size={18} />} />
        </div>

        {/* EDITOR AREA */}
        <div className="w-full flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <EditorContent editor={editor} className="w-full h-full" />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex flex-col w-full md:w-auto">
          <div className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${isRequirementMet ? 'text-green-500' : 'text-orange-400'}`}>
             <span>Символов: {chars} / 200</span>
             {!isRequirementMet && <span className="animate-pulse">●</span>}
          </div>
          <div className="w-full md:w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isRequirementMet ? 'bg-green-500' : 'bg-orange-400'}`}
              style={{ width: `${Math.min((chars / 200) * 100, 100)}%` }}
            />
          </div>
        </div>

        <button 
          onClick={() => onSave(editor.getHTML())}
          disabled={!isRequirementMet}
          className={`
            relative w-full md:w-auto px-12 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] transition-all
            flex items-center justify-center gap-3
            ${isRequirementMet 
              ? 'bg-orange-500 text-white shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-95 cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70 grayscale'
            }
          `}
        >
          <LuSave size={20} />
          Сохранить всё
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
      className={`p-3 rounded-xl transition-all ${
        active 
          ? 'bg-orange-500 text-white shadow-md' 
          : 'text-gray-400 hover:bg-orange-50 hover:text-orange-500'
      }`}
    >
      {icon}
    </button>
  );
}