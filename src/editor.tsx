import { useState } from "react";
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
    const savedContent = localStorage.getItem("savedContent");
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
    localStorage.setItem("savedContent", JSON.stringify(raw));
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

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    if (command === "split-block") {
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const newContentState = Modifier.splitBlock(contentState, selection);

      let newEditorState = EditorState.push(
        editorState,
        newContentState,
        "split-block"
      );

      // Get the new block key
      const newBlockKey = newEditorState.getSelection().getStartKey();
      const blockSelection = newEditorState.getSelection().merge({
        anchorKey: newBlockKey,
        focusKey: newBlockKey,
        anchorOffset: 0,
        focusOffset: 0,
      });

      // Get all inline styles currently applied
      const appliedStyles = newEditorState.getCurrentInlineStyle();

      appliedStyles.forEach((style) => {
        newEditorState = EditorState.push(
          newEditorState,
          Modifier.removeInlineStyle(
            newEditorState.getCurrentContent(),
            blockSelection,
            style ?? ""
          ),
          "change-inline-style"
        );
      });

      // Reset block type of new block explicitly to 'unstyled'
      newEditorState = EditorState.forceSelection(
        newEditorState,
        newEditorState.getSelection()
      );

      if (
        newEditorState
          .getCurrentContent()
          .getBlockForKey(newBlockKey)
          .getType() !== "unstyled"
      ) {
        newEditorState = RichUtils.toggleBlockType(newEditorState, "unstyled");
      }

      setEditorState(newEditorState);
      return "handled";
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
          handleKeyCommand={handleKeyCommand}
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
