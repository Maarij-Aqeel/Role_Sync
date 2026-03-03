"use client";

import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FileEdit } from "lucide-react";

export interface ResumeEditorHandle {
  getHTML: () => string;
  injectKeyword: (keyword: string) => void;
}

interface ResumeEditorProps {
  initialContent: string;
}

export const ResumeEditor = forwardRef<ResumeEditorHandle, ResumeEditorProps>(
  ({ initialContent }, ref) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content: initialContent,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm max-w-none focus:outline-none min-h-[500px] p-6 text-primary",
        },
      },
    });

    useEffect(() => {
      if (editor && initialContent) {
        editor.commands.setContent(initialContent);
      }
    }, [initialContent, editor]);

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
      injectKeyword: (keyword: string) => {
        if (!editor) return;

        const { doc } = editor.state;
        let bestPos = -1;
        let bestScore = -1;

        // Simple heuristic: find the "Experience" or "Skills" section heading
        const sectionKeywords = [
          "experience",
          "skills",
          "projects",
          "summary",
          "qualifications",
        ];

        doc.descendants((node, pos) => {
          if (node.isText && node.text) {
            const text = node.text.toLowerCase();
            for (const section of sectionKeywords) {
              if (text.includes(section)) {
                // Place after this section heading's paragraph
                const endOfNode = pos + node.nodeSize;
                if (endOfNode > bestScore) {
                  bestScore = endOfNode;
                  bestPos = endOfNode;
                }
              }
            }
          }
        });

        // Fallback: inject at the end of the document
        if (bestPos === -1) {
          bestPos = doc.content.size;
        }

        // Build the highlighted keyword markup
        const highlightedHTML = `<span class="bg-[#EA5455]/20 text-[#2D4059] font-bold" data-injected="true"> ${keyword}</span>`;

        // Insert at the best position by focusing and using insertContentAt
        editor.chain().focus().insertContentAt(bestPos, highlightedHTML).run();
      },
    }));

    return (
      <div className="bg-surface rounded-xl border border-primary/10 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-4 bg-primary/5 border-b border-primary/10 flex items-center gap-2 shrink-0">
          <FileEdit size={18} className="text-primary" />
          <h3 className="font-bold text-primary text-sm">Resume Editor</h3>
          <span className="ml-auto text-xs text-primary/50">
            Edit directly or click keywords to inject
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

ResumeEditor.displayName = "ResumeEditor";
