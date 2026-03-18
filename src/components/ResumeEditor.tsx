"use client";

import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark, mergeAttributes } from "@tiptap/core";
import { FileEdit } from "lucide-react";

import { Modification } from "./KeywordPanel";
import { AIFeedbackHighlight } from "./editor/HighlightExtension";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { EditorToolbar } from "./workspace/EditorToolbar";

export interface ResumeEditorHandle {
  getHTML: () => string;
  injectKeyword: (modObj: Modification) => void;
}

interface ResumeEditorProps {
  initialContent: string;
  title?: string;
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
          class:
            "bg-[#04b304] text-white font-bold px-1.5 py-0.5 rounded-md mx-1 shadow-sm",
          "data-injected": "true",
        },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

export const ResumeEditor = forwardRef<ResumeEditorHandle, ResumeEditorProps>(
  ({ initialContent, title = "Resume Editor" }, ref) => {
    const { activeHighlight } = useFeedbackStore();

    const editor = useEditor({
      extensions: [StarterKit, KeywordMark, AIFeedbackHighlight],
      content: initialContent,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "prose prose-sm max-w-none focus:outline-none",
        },
      },
    });

    useEffect(() => {
      if (editor && initialContent) {
        editor.commands.setContent(initialContent);
      }
    }, [initialContent, editor]);

    useEffect(() => {
      if (!editor) return;
      if (activeHighlight) {
        editor.commands.highlightPhrase(activeHighlight);
      } else {
        editor.commands.clearAiHighlights();
      }
    }, [activeHighlight, editor]);

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
      injectKeyword: (modObj: Modification) => {
        if (!editor || !modObj.original_text || !modObj.rewritten_text) return;

        const { doc } = editor.state;

        // 1. Create a pure text map that completely ignores HTML tags
        let textContent = "";
        const posMap: number[] = [];

        doc.descendants((node, pos) => {
          if (node.isText && node.text) {
            for (let i = 0; i < node.text.length; i++) {
              textContent += node.text[i];
              posMap.push(pos + i);
            }
          } else if (node.isBlock) {
            // Use space instead of newline to make cross-block regex matching easier
            textContent += " ";
            posMap.push(pos);
          }
        });

        // 2. Clean up the search phrase (handles weird spacing from AI or PDFs)
        const normalizedOriginal = modObj.original_text
          .replace(/\s+/g, " ")
          .trim();
        if (!normalizedOriginal) return;

        // 3. Create a flexible regex that allows multiple spaces between words
        const safePhrase = normalizedOriginal
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/ /g, "(?:\\s)+");
        let regex = new RegExp(safePhrase, "i");

        let match = regex.exec(textContent);

        // Fallback: If AI slightly altered the punctuation or missed a word at the end,
        // search for the first 60% of the sentence to find the target location
        if (!match && normalizedOriginal.length > 15) {
          const snippet = normalizedOriginal.substring(
            0,
            Math.floor(normalizedOriginal.length * 0.6),
          );
          const safeSnippet = snippet
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/ /g, "(?:\\s)+");
          regex = new RegExp(safeSnippet, "i");
          match = regex.exec(textContent);
        }

        if (match !== null) {
          const startIndex = match.index;
          // Estimate full length if we had to use the fallback snippet
          const matchLength =
            match[0].length === textContent.match(regex)?.[0].length
              ? match[0].length
              : normalizedOriginal.length;

          const endIndex = Math.min(
            match.index + matchLength - 1,
            posMap.length - 1,
          );

          const from = posMap[startIndex];
          const to = posMap[endIndex] + 1;

          if (from !== undefined && to !== undefined) {
            // 4. Use TipTap's native command to securely inject the rewritten text and mark
            editor.commands.insertContentAt(
              { from, to },
              `<span data-injected="true">${modObj.rewritten_text}</span>`,
            );

            // Automatically scroll the editor to show the user the update
            editor.commands.setTextSelection(from);
            editor.commands.scrollIntoView();
            return;
          }
        }

        // 5. Failsafe if absolutely not found in the text map
        editor.commands.insertContentAt(
          doc.content.size,
          `<p><span data-injected="true">${modObj.rewritten_text}</span></p>`,
        );
        editor.commands.scrollIntoView();
      },
    }));

    return (
      <div
        className="resume-canvas bg-slate-950 shadow-inner overflow-y-auto h-full w-full flex flex-col relative items-center [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full rounded-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #334155 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <EditorToolbar editor={editor} />
        {/* Physical Paper Wrapper */}
        <div className="bg-white text-slate-900 shadow-2xl w-[800px] min-h-[1056px] mx-auto p-12 mb-20 mt-4 shrink-0">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  },
);

ResumeEditor.displayName = "ResumeEditor";
