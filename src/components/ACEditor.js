import React from "react";
import Editor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/snippets/sh';

export default function (props) {
  return (
    <Editor
      wrapEnabled
      theme="tomorrow"
      enableBasicAutocompletion={true}
      enableSnippets={true}
      {...props}
    />
  )
}