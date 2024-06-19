"use client";
import { useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

const SqlEditor = ({ sql, setSql, post, loading }) => {
  const ctrlRef = useRef(false);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme("vs-dark");
    }
  }, [monaco]);

  const handleKeyDown = (e) => {
    if (e.key === "Control" || e.key === "Meta") {
      ctrlRef.current = true;
    } else if (e.key === "Enter" && ctrlRef.current && !loading) {
      post();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Control" || e.key === "Meta") {
      ctrlRef.current = false;
    }
  };

  const handleEditorMount = (editor, monacoInstance) => {
    // monacoInstance.editor.setTheme("vs-dark");
    monacoInstance.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#101827", // bg-gray-800 equivalent
      },
    });
    monacoInstance.editor.setTheme("custom-dark");

    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
      () => {
        if (!loading) {
          post();
        }
      }
    );

    editor.onKeyDown((e) => {
      if (
        e.keyCode === monacoInstance.KeyCode.Ctrl ||
        e.keyCode === monacoInstance.KeyCode.Meta
      ) {
        ctrlRef.current = true;
      }
    });

    editor.onKeyUp((e) => {
      if (
        e.keyCode === monacoInstance.KeyCode.Ctrl ||
        e.keyCode === monacoInstance.KeyCode.Meta
      ) {
        ctrlRef.current = false;
      }
    });
  };

  return (
    <Editor
      height="33vh"
      defaultLanguage="sql"
      value={sql}
      onChange={(value) => setSql(value)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      options={{
        fontFamily: "monospace",
        automaticLayout: true,
      }}
      onMount={handleEditorMount}
    />
  );
};

export default SqlEditor;
