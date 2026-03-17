// components/PaperResumeEditor.tsx
"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Mark, mergeAttributes } from "@tiptap/core";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorToolbar } from "./workspace/EditorToolbar";

interface PaperResumeEditorProps {
  content: string;
  onChange: (html: string) => void;
  highlights?: Array<{
    exactPhrase: string;
    reason: string;
    suggestedRewrite: string;
  }>;
}

export interface ResumeEditorHandle {
  getHTML: () => string;
}

// Custom TipTap Mark for Dynamic Highlights
const SuggestionHighlight = Mark.create({
  name: 'suggestionHighlight',
  addAttributes() {
    return {
      highlightIndex: {
        default: null,
        parseHTML: element => element.getAttribute('data-highlight-index'),
        renderHTML: attributes => {
          if (attributes.highlightIndex === null) return {};
          return { 'data-highlight-index': attributes.highlightIndex };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'mark[data-highlight-index]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'mark',
      mergeAttributes(HTMLAttributes, {
        class: 'bg-yellow-200/70 border-b-[2px] border-yellow-400 text-gray-900 cursor-pointer hover:bg-yellow-300 transition-colors rounded-sm py-0.5 px-0.5',
      }),
      0,
    ];
  },
});

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const A4_WIDTH_PX = 794; // 210mm at 96 DPI
const A4_HEIGHT_PX = 1123; // 297mm at 96 DPI

export const PaperResumeEditor = forwardRef<ResumeEditorHandle, PaperResumeEditorProps>(
  ({ content, onChange, highlights }, ref) => {
    const [zoomIndex, setZoomIndex] = useState(2); // Start at 1x (index 2)
    const [showHighlight, setShowHighlight] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        SuggestionHighlight, // Inject the new custom mark
      ],
      content,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
    }));

    // Sync content
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    // Dynamically apply highlights to the text
    useEffect(() => {
      if (!editor || !highlights) return;

      // Clear existing highlights
      editor.commands.unsetMark('suggestionHighlight');

      if (highlights.length === 0) return;

      const { tr } = editor.state;
      let modified = false;

      highlights.forEach((h, idx) => {
        if (!h.exactPhrase) return;
        
        // Escape regex characters so standard text matches perfectly
        const safePhrase = h.exactPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safePhrase, 'gi');

        editor.state.doc.descendants((node, pos) => {
          if (node.isText && node.text) {
            let match;
            while ((match = regex.exec(node.text)) !== null) {
              const from = pos + match.index;
              const to = from + match[0].length;
              tr.addMark(
                from, 
                to, 
                editor.schema.marks.suggestionHighlight.create({ highlightIndex: idx })
              );
              modified = true;
            }
          }
        });
      });

      if (modified) {
        editor.view.dispatch(tr);
      }
    }, [editor, highlights, content]);

    // Handle clicks on highlighted text
    const handleEditorClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const mark = target.closest('mark[data-highlight-index]');
      
      if (mark) {
        const idx = parseInt(mark.getAttribute('data-highlight-index') || '-1', 10);
        if (idx >= 0) {
          setShowHighlight(idx);
          return;
        }
      }
      setShowHighlight(null);
    };

    const currentZoom = ZOOM_LEVELS[zoomIndex];
    
    if (!editor) {
      return null;
    }

    return (
      <div className="flex flex-col h-full bg-[#f4f4f5]">
        {/* Floating Toolbar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-4 z-50 mx-auto mb-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
            {/* Formatting Tools */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive('bold') ? 'bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive('italic') ? 'bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive('underline') ? 'bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 px-3 border-r border-gray-200">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: 'left' }) ? 'bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: 'center' }) ? 'bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: 'right' }) ? 'bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 pl-3">
              <button
                onClick={() => setZoomIndex(Math.max(0, zoomIndex - 1))}
                disabled={zoomIndex === 0}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-gray-600 w-12 text-center">
                {Math.round(currentZoom * 100)}%
              </span>
              <button
                onClick={() => setZoomIndex(Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1))}
                disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomIndex(2)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action Toolbar */}
        <div className="relative z-40 mx-auto w-full max-w-[800px] mb-4">
          <EditorToolbar editor={editor} />
        </div>

        {/* Scrollable Paper Container */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto flex justify-center p-8 pb-32"
          onClick={handleEditorClick}
        >
          {/* Dynamic Scaling Wrapper - This fixes the scrollbar and page length issue */}
          <div
            style={{
              width: A4_WIDTH_PX * currentZoom,
              height: A4_HEIGHT_PX * currentZoom,
            }}
            className="transition-all duration-300 origin-top-left"
          >
            {/* The Physical Paper */}
            <motion.div
              layout
              className="bg-white shadow-2xl origin-top-left transition-transform duration-300 ring-1 ring-gray-900/5"
              style={{
                width: A4_WIDTH_PX,
                minHeight: A4_HEIGHT_PX,
                transform: `scale(${currentZoom})`,
              }}
            >
              <EditorContent 
                editor={editor} 
                className="p-[48px] h-full outline-none prose prose-slate max-w-none 
                  prose-p:leading-snug prose-p:my-1.5 
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-3 prose-h1:text-gray-900 
                  prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-4 prose-h2:mb-2 prose-h2:text-gray-800 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-1 
                  prose-ul:list-disc prose-ul:ml-6 prose-li:my-0.5"
              />
            </motion.div>
          </div>
        </div>

        {/* Highlight Tooltip */}
        <AnimatePresence>
          {showHighlight !== null && highlights?.[showHighlight] && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-5 max-w-lg z-50 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg mt-0.5">
                  <Type className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    AI Suggestion
                  </p>
                  <p className="text-sm font-medium text-slate-200 mb-3 bg-slate-800 p-2 rounded-md border border-slate-700">
                    "{highlights[showHighlight].exactPhrase}"
                  </p>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    {highlights[showHighlight].reason}
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                      Suggested Rewrite
                    </p>
                    <p className="text-sm text-emerald-300">
                      "{highlights[showHighlight].suggestedRewrite}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHighlight(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

PaperResumeEditor.displayName = "PaperResumeEditor";