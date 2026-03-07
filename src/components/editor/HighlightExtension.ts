import { Mark, mergeAttributes } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';

export interface HighlightOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiHighlight: {
      setAiHighlight: () => ReturnType;
      unsetAiHighlight: () => ReturnType;
      clearAiHighlights: () => ReturnType;
      highlightPhrase: (phrase: string) => ReturnType;
    };
  }
}

export const AIFeedbackHighlight = Mark.create<HighlightOptions>({
  name: 'aiHighlight',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'bg-red-500/20 text-red-700 border-b-2 border-red-500 border-dashed cursor-pointer animate-pulse dark:bg-red-900/40 dark:text-red-400 transition-colors duration-300',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-ai-highlight]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-ai-highlight': 'true' }), 0];
  },

  addCommands() {
    return {
      setAiHighlight:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      unsetAiHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
      clearAiHighlights:
        () =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.removeMark(0, tr.doc.content.size, this.type);
          }
          return true;
        },
      highlightPhrase:
        (phrase: string) =>
        ({ editor, tr, dispatch }) => {
          if (!phrase) return false;
          
          if (dispatch) {
            // Remove previous highlights
            tr.removeMark(0, tr.doc.content.size, this.type);
            
            // Escape special regex chars
            const safePhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(safePhrase, 'gi');
            
            editor.state.doc.descendants((node, pos) => {
              // Only search within text nodes
              if (node.isText && node.text) {
                let match;
                while ((match = regex.exec(node.text)) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  tr.addMark(from, to, this.type.create());
                  
                  // Gracefully scroll the first instance into the editor viewport
                  if (match.index === regex.lastIndex - match[0].length) {
                      const selection = TextSelection.create(tr.doc, from, to);
                      tr.setSelection(selection);
                      tr.scrollIntoView();
                  }
                }
              }
            });
          }
          return true;
        },
    };
  },
});
