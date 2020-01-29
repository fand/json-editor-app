import { ipcRenderer } from "electron";
import JSONEditor from "jsoneditor";
import "./index.css";

// App state
let isDirty = false;
let savedJson = {};
let isWaiting = false;

// create the editor
const container = document.getElementById("jsoneditor");
const editor = new JSONEditor(container, {
    onChange() {
        // isDirty = true;
        setStatus("Edited");
    }
});

// Insert Open / Save buttons
const mainMenu = document.querySelector(".jsoneditor-menu");
const openButton = document.createElement("button");
openButton.innerText = "OPEN";
openButton.setAttribute("type", "button");
openButton.classList.add("customButton");
openButton.addEventListener("click", () => {
    isWaiting = true;
    ipcRenderer.send("open");
});

const saveButton = document.createElement("button");
saveButton.innerText = "SAVE";
saveButton.setAttribute("type", "button");
saveButton.classList.add("customButton");
saveButton.addEventListener("click", () => {
    isWaiting = true;
    const updatedJson = editor.get();
    ipcRenderer.send("save", updatedJson);
});

mainMenu.prepend(saveButton);
mainMenu.prepend(openButton);

const statusBar = document.createElement("div");
statusBar.innerText = "New file";
statusBar.classList.add("statusBar");
document.body.appendChild(statusBar);

const setStatus = (status: string) => {
    statusBar.innerText = status;
};

ipcRenderer.on("requestSave", (event, arg) => {
    isWaiting = true;
    const updatedJson = editor.get();
    savedJson = updatedJson;
    ipcRenderer.send("save", updatedJson);
});
ipcRenderer.on("requestSaveAs", (event, arg) => {
    isWaiting = true;
    const updatedJson = editor.get();
    savedJson = updatedJson;
    ipcRenderer.send("saveAs", updatedJson);
});
ipcRenderer.on("loaded", (event, filepath, content) => {
    isWaiting = false;
    editor.set(content);
    editor.expandAll();
    setStatus(`✅ Opened file ${filepath}`);
});
ipcRenderer.on("loadError", (event, filepath) => {
    isWaiting = false;
    setStatus(`⚠️ Failed to open file ${filepath}`);
});
ipcRenderer.on("saved", (event, filepath) => {
    isWaiting = false;
    setStatus(`✅ Saved to ${filepath}`);
});
ipcRenderer.on("saveError", (event, filepath) => {
    isWaiting = false;
    setStatus(`⚠️ Failed to save file ${filepath}`);
});
