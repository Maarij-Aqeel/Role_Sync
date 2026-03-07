"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ResumeEditorHandle {
  injectKeyword: (mod: { keyword_added: string; suggested_rewrite: string }) => void;
  getHTML: () => string;
}

interface ResumeEditorProps {
  initialContent?: string;
  result?: {
    ats_score: number;
    domain_score: number;
    modifications: any[];
    resumeHTML: any;
  };
  resumeFile?: File;
  onBack?: () => void;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ editor, zoom, onZoomIn, onZoomOut, onZoomReset }: {
  editor: any;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}) {
  if (!editor) return null;

  const btn = (active: boolean, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      title={label}
      className={`
        px-2.5 py-1 text-xs rounded font-mono font-semibold transition-all
        ${active
          ? "bg-accent/20 text-accent border border-accent/30"
          : "text-primary/50 hover:text-primary hover:bg-primary/10 border border-transparent"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-primary/10 rounded-t-xl shrink-0">
      {/* Formatting controls */}
      <div className="flex items-center gap-1">
        {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "B")}
        {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "I")}
        {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "• List")}
        <div className="w-px h-4 bg-primary/10 mx-1" />
        {btn(false, () => editor.chain().focus().undo().run(), "↩ Undo")}
        {btn(false, () => editor.chain().focus().redo().run(), "↪ Redo")}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1.5">
        <button onClick={onZoomOut} className="w-6 h-6 flex items-center justify-center text-primary/50 hover:text-primary hover:bg-primary/10 rounded font-mono text-sm transition-all">−</button>
        <button onClick={onZoomReset} className="text-xs font-mono text-primary/40 hover:text-primary/70 transition-colors min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={onZoomIn} className="w-6 h-6 flex items-center justify-center text-primary/50 hover:text-primary hover:bg-primary/10 rounded font-mono text-sm transition-all">+</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const OptimizerSection = forwardRef<ResumeEditorHandle, ResumeEditorProps>(
  ({ initialContent, result }, ref) => {
    const [zoom, setZoom] = useState(1);
    
    const contentToLoad = initialContent || result?.resumeHTML || "";

    const editor = useEditor({
      extensions: [StarterKit],
      content: contentToLoad,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          // This is the actual paper — white, A4-proportioned, with deep shadow
          class: "resume-paper focus:outline-none",
        },
      },
    });

    useImperativeHandle(ref, () => ({
      injectKeyword: (mod) => {
        if (!editor) return;
        editor
          .chain()
          .focus("end")
          .insertContent(` ${mod.keyword_added}`)
          .run();
      },
      getHTML: () => editor?.getHTML() ?? "",
    }));

    const clampedZoom = Math.min(1.4, Math.max(0.5, zoom));

    return (
      <div className="flex flex-col h-full rounded-xl overflow-hidden border border-primary/10">
        <Toolbar
          editor={editor}
          zoom={clampedZoom}
          onZoomIn={() => setZoom((z) => Math.min(1.4, z + 0.1))}
          onZoomOut={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          onZoomReset={() => setZoom(1)}
        />

        {/* Dark canvas — this is the "desk" the paper sits on */}
        <div
          className="resume-canvas flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            // dot-grid work surface
            background: "#13161f",
            backgroundImage: "radial-gradient(circle, #1e2130 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
            padding: "32px 16px 56px",
          }}
        >
          {/*
            Zoom wrapper — scales the paper without affecting the scroll container.
            margin-bottom compensates so the container doesn't cut off the bottom.
          */}
          <div
            style={{
              transform: `scale(${clampedZoom})`,
              transformOrigin: "top center",
              // When zoomed out, pull up the empty space below
              marginBottom: clampedZoom < 1 ? `${-(1 - clampedZoom) * 960 * 0.5}px` : "0",
              transition: "transform 0.15s ease",
            }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Global styles for the paper and its content */}
        <style jsx global>{`
          /* ── The paper itself ── */
          .resume-paper {
            width: 680px;
            min-height: 960px;
            margin: 0 auto;
            padding: 56px 64px;
            background: #fdfcfb;
            color: #1a1a1a;
            border-radius: 2px;
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 13px;
            line-height: 1.65;

            /* Layered shadows = realistic paper depth */
            box-shadow:
              0 1px 1px rgba(0, 0, 0, 0.18),
              0 2px 2px rgba(0, 0, 0, 0.18),
              0 4px 4px rgba(0, 0, 0, 0.18),
              0 10px 20px rgba(0, 0, 0, 0.25),
              0 20px 40px rgba(0, 0, 0, 0.22);
          }

          /* ── Typography inside the paper ── */
          .resume-paper h1 {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-align: center;
            margin-bottom: 4px;
            color: #111;
          }

          .resume-paper h2 {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #111;
            margin: 20px 0 8px;
            padding-bottom: 4px;
            border-bottom: 1.5px solid #1a1a1a;
          }

          .resume-paper h3 {
            font-size: 13px;
            font-weight: 700;
            color: #111;
            margin: 0 0 2px;
          }

          .resume-paper p {
            margin: 3px 0;
            color: #333;
          }

          .resume-paper ul {
            margin: 4px 0 0 18px;
            padding: 0;
          }

          .resume-paper li {
            margin-bottom: 3px;
            color: #333;
          }

          .resume-paper strong {
            font-weight: 700;
            color: #111;
          }

          .resume-paper em {
            color: #555;
          }

          /* Tiptap removes default focus ring — we already do that via editorProps */
          .ProseMirror-focused {
            outline: none;
          }

          /* Smooth scrollbar on the canvas */
          .resume-canvas::-webkit-scrollbar { width: 6px; }
          .resume-canvas::-webkit-scrollbar-track { background: transparent; }
          .resume-canvas::-webkit-scrollbar-thumb {
            background: #2e3347;
            border-radius: 99px;
          }
        `}</style>
      </div>
    );
  }
);

OptimizerSection.displayName = "OptimizerSection";