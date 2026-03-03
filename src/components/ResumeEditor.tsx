"use client";

import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark, mergeAttributes } from "@tiptap/core";
import { FileEdit } from "lucide-react";

import { MissingKeyword } from "./KeywordPanel";

export interface ResumeEditorHandle {
  getHTML: () => string;
  injectKeyword: (keywordObj: MissingKeyword) => void;
}

interface ResumeEditorProps {
  initialContent: string;
}

export const KeywordMark = Mark.create({
  name: "keyword",
  parseHTML() {
    return [{ tag: 'span[data-injected="true"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        {
          class: "bg-[#EA5455]/20 text-[#2D4059] font-bold px-1 rounded-md mx-1 animate-pulse",
          "data-injected": "true",
        },
        HTMLAttributes
      ),
      0,
    ];
  },
});

export const ResumeEditor = forwardRef<ResumeEditorHandle, ResumeEditorProps>(
  ({ initialContent }, ref) => {
    const editor = useEditor({
      extensions: [StarterKit, KeywordMark],
      content: initialContent,
      immediatelyRender: false,
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
      injectKeyword: (keywordObj: MissingKeyword) => {
        if (!editor) return;

        const { doc } = editor.state;
        let bestPos = -1;
        let runningBulletCount = 0;
        const targetSection = (keywordObj.target_section || "skills").toLowerCase();

        // Pass 1: Find the target section node
        let insideTargetSection = false;

        doc.descendants((node, pos) => {
          if (node.isText && node.text) {
            const text = node.text.toLowerCase();
            if (text.includes(targetSection) || text.includes(targetSection.replace("_", " "))) {
              insideTargetSection = true;
            } else if (insideTargetSection && node.text.trim().length > 0 && text.length > 20 && !text.includes(",")) {
              // Extremely basic heuristic to detect if we moved onto a new major section header
              // In a real app we'd look for H1/H2 DOM nodes instead
              if (text === "experience" || text === "education" || text === "projects") {
                  insideTargetSection = false;
              }
            }
          }

          if (insideTargetSection) {
            // Strategy: Hard Skill (usually appended to a comma-separated list)
            if (keywordObj.type === "hard_skill") {
              const endOfNode = pos + node.nodeSize;
              if (endOfNode > bestPos) {
                 bestPos = endOfNode;
              }
            } 
            // Strategy: Concept (usually bullet points)
            else if (keywordObj.type === "concept") {
              // If we are looking for a specific bullet index, count them
              if (node.type.name === "listItem") {
                 if (runningBulletCount === (keywordObj.target_bullet_index || 0)) {
                    bestPos = pos + node.nodeSize - 1; // End of this specific list item
                 }
                 runningBulletCount++;
              }
            }
          }
        });

        // Fallback: inject at the end of the document if section not found
        if (bestPos === -1) {
          bestPos = doc.content.size;
        }

        // Apply pulse animation to the keyword mark automatically
        const highlightedHTML = `<span data-injected="true">${keywordObj.suggested_injection}</span>`;

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
