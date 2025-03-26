import { useState } from "react";
import "./App.css";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
  DraftHandleValue,
} from "draft-js";
import "draft-js/dist/Draft.css";

const styleMap = {
  BOLD: {
    fontWeight: "bold",
  },
  RED_LINE: {
    color: "red",
  },
  UNDERLINE: {
    textDecoration: "underline",
  },
};

export default function EditorApp() {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("localstorage");
    if (savedContent) {
      try {
        const content = convertFromRaw(JSON.parse(savedContent));
        return EditorState.createWithContent(content);
      } catch (e) {
        console.error("Error loading saved content:", e);
      }
    }
    return EditorState.createEmpty();
  });

  const onChange = (newState: EditorState) => {
    setEditorState(newState);
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    localStorage.setItem("localstorage", JSON.stringify(raw));
  };

  const handleBeforeInput = (
    chars: string,
    editorState: EditorState
  ): DraftHandleValue => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();

    if (chars === " ") {
      if (blockText === "#") {
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );

        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-block-type"
        );

        setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
        return "handled";
      }

      if (blockText === "*") {
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );

        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-inline-style"
        );

        setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
        return "handled";
      }

      if (blockText === "**") {
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 2,
          }),
          ""
        );

        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-inline-style"
        );

        setEditorState(RichUtils.toggleInlineStyle(newEditorState, "RED_LINE"));
        return "handled";
      }

      if (blockText === "***") {
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 3,
          }),
          ""
        );

        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-inline-style"
        );

        setEditorState(
          RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE")
        );
        return "handled";
      }
    }

    return "not-handled";
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2 className="editor-title">Text editor made with draftjs.</h2>
        <button className="save-button" onClick={saveContent}>
          Save
        </button>
      </div>
      <div className="editor-content">
        <Editor
          editorState={editorState}
          onChange={onChange}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
      <div className="editor-shortcuts">
        <p>Available shortcuts:</p>
        <ul>
          <li>
            <code>#</code> + space for heading
          </li>
          <li>
            <code>*</code> + space for bold
          </li>
          <li>
            <code>**</code> + space for red text
          </li>
          <li>
            <code>***</code> + space for underline
          </li>
        </ul>
      </div>
    </div>
  );
}
