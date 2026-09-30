"use client";

import { useState } from "react";
import { Extension, Mark, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReplaceStep } from "@tiptap/pm/transform";
import { EditorContent, useEditor } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";

const PathwayRevision = Mark.create({
  name: "pathwayRevision",
  inclusive: false,
  parseHTML() {
    return [{ tag: 'span[data-pathway-revision="inserted"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-pathway-revision": "inserted",
        class: "pathway-revision-inserted",
        style: "color: #b45309; background-color: #fff7ed;"
      }),
      0
    ];
  }
});

const TrackInsertedText = Extension.create({
  name: "trackInsertedText",
  addProseMirrorPlugins() {
    const revisionMark = this.editor.schema.marks.pathwayRevision;

    return [
      new Plugin({
        key: new PluginKey("trackInsertedText"),
        appendTransaction: (transactions, _oldState, newState) => {
          const ranges: Array<[number, number]> = [];

          transactions.forEach((transaction, transactionIndex) => {
            transaction.steps.forEach((step, stepIndex) => {
              if (!(step instanceof ReplaceStep) || step.slice.content.size === 0) return;

              let from = step.from;
              let to = step.from + step.slice.content.size;
              for (let mapIndex = stepIndex + 1; mapIndex < transaction.mapping.maps.length; mapIndex += 1) {
                from = transaction.mapping.maps[mapIndex].map(from, -1);
                to = transaction.mapping.maps[mapIndex].map(to, 1);
              }
              for (let laterIndex = transactionIndex + 1; laterIndex < transactions.length; laterIndex += 1) {
                from = transactions[laterIndex].mapping.map(from, -1);
                to = transactions[laterIndex].mapping.map(to, 1);
              }
              if (from < to) ranges.push([from, to]);
            });
          });

          if (!ranges.length) return null;

          const transaction = newState.tr;
          for (const [from, to] of ranges) {
            transaction.addMark(from, to, revisionMark.create());
          }
          return transaction.docChanged ? transaction : null;
        }
      })
    ];
  }
});

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
        renderHTML: (attributes) =>
          attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {}
      }
    };
  }
});

const extensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  FontSize,
  Color.configure({ types: ["textStyle"] }),
  FontFamily,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  PathwayRevision,
  TrackInsertedText
];

const toolbarButtonClass =
  "min-h-9 min-w-9 rounded border border-slate-300 px-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-40";
const toolbarSelectClass =
  "h-9 rounded border border-slate-300 bg-white px-2 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500";

export default function RichTextEditor({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [textColor, setTextColor] = useState("#1f2937");
  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML())
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">
      <div
        aria-label="Text formatting"
        className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 p-2"
      >
        <button
          type="button"
          title="Bold"
          aria-label="Bold"
          aria-pressed={editor.isActive("bold")}
          className={`${toolbarButtonClass} font-bold`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          title="Italic"
          aria-label="Italic"
          aria-pressed={editor.isActive("italic")}
          className={`${toolbarButtonClass} italic`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          title="Underline"
          aria-label="Underline"
          aria-pressed={editor.isActive("underline")}
          className={`${toolbarButtonClass} underline`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <span className="mx-1 h-6 border-l border-slate-300" />

        <select
          aria-label="Paragraph style"
          className={toolbarSelectClass}
          value={editor.isActive("heading", { level: 1 }) ? "1" : editor.isActive("heading", { level: 2 }) ? "2" : editor.isActive("heading", { level: 3 }) ? "3" : "paragraph"}
          onChange={(event) => {
            const level = Number(event.target.value);
            if (!level) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
          }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <select
          aria-label="Font family"
          className={toolbarSelectClass}
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) editor.chain().focus().setFontFamily(event.target.value).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
        >
          <option value="">Font</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Verdana, sans-serif">Verdana</option>
        </select>

        <select
          aria-label="Font size"
          className={toolbarSelectClass}
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) {
              editor.chain().focus().setMark("textStyle", { fontSize: event.target.value }).run();
            } else {
              editor.chain().focus().setMark("textStyle", { fontSize: null }).run();
            }
          }}
        >
          <option value="">Size</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        <label className="flex h-9 items-center gap-1 rounded border border-slate-300 bg-white px-2 text-xs text-slate-600" title="Text color">
          Color
          <input
            type="color"
            aria-label="Text color"
            className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
            value={textColor}
            onChange={(event) => {
              setTextColor(event.target.value);
              editor.chain().focus().setColor(event.target.value).run();
            }}
          />
        </label>

        <select
          aria-label="Text alignment"
          className={toolbarSelectClass}
          defaultValue="left"
          onChange={(event) => editor.chain().focus().setTextAlign(event.target.value).run()}
        >
          <option value="left">Align left</option>
          <option value="center">Center</option>
          <option value="right">Align right</option>
          <option value="justify">Justify</option>
        </select>

        <button
          type="button"
          title="Bulleted list"
          aria-label="Bulleted list"
          aria-pressed={editor.isActive("bulletList")}
          className={toolbarButtonClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          type="button"
          title="Numbered list"
          aria-label="Numbered list"
          aria-pressed={editor.isActive("orderedList")}
          className={toolbarButtonClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          type="button"
          title="Undo"
          aria-label="Undo"
          disabled={!editor.can().undo()}
          className={toolbarButtonClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </button>
        <button
          type="button"
          title="Redo"
          aria-label="Redo"
          disabled={!editor.can().redo()}
          className={toolbarButtonClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-slate min-h-72 max-w-none px-5 py-4 focus-within:outline-none [&_.tiptap]:min-h-72 [&_.tiptap]:outline-none"
      />
    </div>
  );
}
