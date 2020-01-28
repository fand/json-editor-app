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

// Insert Open / Save buttons
const mainMenu = document.querySelector(".jsoneditor-menu");
const openButton = document.createElement("button");
openButton.innerText = "OPEN";
openButton.setAttribute("type", "button");
openButton.classList.add("customButton");
openButton.addEventListener("click", () => {
    ipcRenderer.send("open");
});

const saveButton = document.createElement("button");
saveButton.innerText = "SAVE";
saveButton.setAttribute("type", "button");
saveButton.classList.add("customButton");
saveButton.addEventListener("click", () => {
    const updatedJson = editor.get();
    ipcRenderer.send("save", updatedJson);
});

mainMenu.prepend(saveButton);
mainMenu.prepend(openButton);

ipcRenderer.on("loaded", (event, arg) => {
    editor.set(arg);
});
ipcRenderer.on("saved", (event, arg) => {
    // TODO: show message on menu bar or somewhere
    console.log("Saved to", arg);
});
