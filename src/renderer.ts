import { ipcRenderer } from "electron";
import JSONEditor from "jsoneditor";
import "./index.css";

// create the editor
const container = document.getElementById("jsoneditor");
const editor = new JSONEditor(container, {
    onChangeJSON(json: any) {
        ipcRenderer.send("change", json);
    }
});

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

ipcRenderer.on("requestSave", (event, arg) => {
    const updatedJson = editor.get();
    ipcRenderer.send("save", updatedJson);
});
ipcRenderer.on("requestSaveAs", (event, arg) => {
    const updatedJson = editor.get();
    ipcRenderer.send("saveAs", updatedJson);
});
ipcRenderer.on("loaded", (event, arg) => {
    editor.set(arg);
    editor.expandAll();
});
ipcRenderer.on("saved", (event, arg) => {
    // TODO: show message on menu bar or somewhere
    console.log("Saved to", arg);
});
