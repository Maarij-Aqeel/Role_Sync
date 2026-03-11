// components/PaperResumeEditor.tsx
"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
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
import { motion } from "framer-motion";
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
      ],
      content,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: 'prose prose-slate max-w-none focus:outline-none min-h-full',
        },
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
    }));

    // Update content when prop changes
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    const currentZoom = ZOOM_LEVELS[zoomIndex];
    
    const handleZoomIn = () => {
      if (zoomIndex < ZOOM_LEVELS.length - 1) {
        setZoomIndex(zoomIndex + 1);
      }
    };

    const handleZoomOut = () => {
      if (zoomIndex > 0) {
        setZoomIndex(zoomIndex - 1);
      }
    };

    const handleResetZoom = () => {
      setZoomIndex(2);
    };

    if (!editor) {
      return null;
    }

    return (
      <div className="flex flex-col h-full">
        {/* Floating Toolbar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-4 z-50 mx-auto mb-6"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/95 backdrop-blur-sm rounded-xl shadow-lg border border-border">
            {/* Formatting Tools */}
            <div className="flex items-center gap-1 pr-3 border-r border-border">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive('bold') ? 'bg-accent text-white' : 'hover:bg-background text-text-muted hover:text-text-primary'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive('italic') ? 'bg-accent text-white' : 'hover:bg-background text-text-muted hover:text-text-primary'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive('underline') ? 'bg-accent text-white' : 'hover:bg-background text-text-muted hover:text-text-primary'
                }`}
                title="Underline"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 px-3 border-r border-border">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-white' : 'hover:bg-background text-text-muted hover:text-text-primary'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-white' : 'hover:bg-background text-text-muted hover:text-text-primary'
                }`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-white' : 'hover:bg-background text-text-muted hover:text-text-primary'
                }`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 pl-3">
              <button
                onClick={handleZoomOut}
                disabled={zoomIndex === 0}
                className="p-2 rounded-lg hover:bg-background text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-text-muted w-12 text-center">
                {Math.round(currentZoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                className="p-2 rounded-lg hover:bg-background text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-lg hover:bg-background text-text-muted hover:text-text-primary ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action Toolbar (Regenerate & LaTeX) */}
        <div className="relative z-40 mx-auto w-full max-w-[800px] mb-8">
          <EditorToolbar editor={editor} />
        </div>

        {/* Paper Container */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto flex justify-center pb-12"
          style={{
            // Checkerboard pattern for transparency effect
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%), 
              linear-gradient(-45deg, #ccc 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #ccc 75%), 
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            backgroundColor: '#e5e5e5',
          }}
        >
          {/* The Physical Paper */}
          <motion.div
            layout
            className="bg-white shadow-2xl origin-top transition-shadow duration-300"
            style={{
              width: A4_WIDTH_PX,
              minHeight: A4_HEIGHT_PX,
              transform: `scale(${currentZoom})`,
              transformOrigin: 'top center',
              marginBottom: `${(currentZoom - 1) * 300}px`, // Compensate for scale margin
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Paper Content */}
            <div className="p-[48px] text-gray-900">
              <EditorContent 
                editor={editor} 
                className="min-h-[900px] [&_p]:mb-2 [&_p]:leading-snug [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:text-gray-900 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-gray-800 [&_h2]:border-b [&_h2]:border-gray-300 [&_h2]:pb-1 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-1"
              />
            </div>

            {/* Highlight Overlays */}
            {highlights?.map((highlight, idx) => (
              <div
                key={idx}
                className="absolute bg-yellow-300/60 border-b-[2px] border-yellow-500 cursor-pointer hover:bg-yellow-400/70 transition-colors pointer-events-auto"
                onClick={() => setShowHighlight(idx)}
                style={{
                  // Position would be calculated based on text search in real implementation
                  top: `${150 + idx * 80}px`,
                  left: '48px',
                  width: '698px', // A4 width (794) - (2 * 48px padding)
                  height: '24px',
                  mixBlendMode: 'multiply',
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Highlight Tooltip */}
        {showHighlight !== null && highlights?.[showHighlight] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface border border-border shadow-xl rounded-xl p-4 max-w-md z-50"
          >
            <div className="flex items-start gap-3">
              <Type className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  Suggestion: "{highlights[showHighlight].exactPhrase}"
                </p>
                <p className="text-sm text-text-secondary mb-2">
                  {highlights[showHighlight].reason}
                </p>
                <p className="text-sm text-accent">
                  Try: "{highlights[showHighlight].suggestedRewrite}"
                </p>
              </div>
              <button
                onClick={() => setShowHighlight(null)}
                className="text-text-muted hover:text-text-primary"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }
);

PaperResumeEditor.displayName = "PaperResumeEditor";