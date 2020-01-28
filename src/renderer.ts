import { ipcRenderer } from "electron";
import JSONEditor from "jsoneditor";
import "./index.css";

// create the editor
const container = document.getElementById("jsoneditor");
const options = {};
const editor = new JSONEditor(container, options);

// set json
const initialJson = {
    Array: [1, 2, 3],
    Boolean: true,
    Null: null as any,
    Number: 123,
    Object: { a: "b", c: "d" },
    String: "Hello World"
};
editor.set(initialJson);

// get json
const updatedJson = editor.get();

ipcRenderer.on("load", (event, arg) => {
    editor.set(arg);
});

// console.log('👋 This message is being logged by 'renderer.js', included via webpack');
