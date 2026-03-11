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
          class: "bg-[#04b304] text-white font-bold px-1.5 py-0.5 rounded-md mx-1 shadow-sm",
          "data-injected": "true",
        },
        HTMLAttributes
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

        // Phase 7: Holistic Rewriting String Match Strategy
        const currentHtml = editor.getHTML();
        
        // The original text might have formatting variations (e.g. TipTap wraps lines in <p>).
        // For a perfect replace, we need to match the raw text without HTML tags and replace the entire node content.
        
        // Create an aggressive regex that strips excess whitespace to find the matching HTML node roughly
        // Escape special regex chars from the AI response first
        const escapedOriginalText = modObj.original_text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Since TipTap wraps bullet points in <li><p>text</p></li> or paragraphs in <p>text</p>,
        // we can attempt a direct string replace if the AI matched exactly.
        const highlightedHtml = `<span data-injected="true">${modObj.rewritten_text}</span>`;
        
        let newHtml = currentHtml.replace(modObj.original_text, highlightedHtml);
        
        if (newHtml === currentHtml) {
           // Fallback fuzzy replace: The raw PDF text doesn't explicitly match the HTML-parsed node string 
           // (due to spacing, newlines, or lost dashes). 
           // We will try to find the first paragraph that contains a large chunk of this text
           const searchSnippet = modObj.original_text.substring(0, 30);
           const fallbackRegex = new RegExp(`(<p>|<li>)([^<]*${searchSnippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^<]*)(</p>|</li>)`, 'i');
           
           newHtml = currentHtml.replace(fallbackRegex, `$1${highlightedHtml}$3`);
        }
        
        // If even the fallback fails, just append it to the document (failsafe)
        if (newHtml === currentHtml) {
           newHtml += `<p>${highlightedHtml}</p>`;
        }

        // Remount the entire state with the replaced HTML node!
        editor.commands.setContent(newHtml);
      },
    }));

    return (
      <div 
        className="resume-canvas bg-slate-950 shadow-inner overflow-y-auto h-full w-full flex flex-col relative items-center [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full rounded-2xl"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #334155 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        <EditorToolbar editor={editor} />
        {/* Physical Paper Wrapper */}
        <div className="bg-white text-slate-900 shadow-2xl w-[800px] min-h-[1056px] mx-auto p-12 mb-20 mt-4 shrink-0">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

ResumeEditor.displayName = "ResumeEditor";
