import { ipcRenderer } from "electron";
import JSONEditor from "jsoneditor";
import "./index.css";

// App state
let currentFile: string;
let isWaiting = false;
let savedJSON = {}; // Used on window close

// create the editor
const container = document.getElementById("jsoneditor");
const editor = new JSONEditor(container, {
    onChangeJSON(json: any) {
        setStatus("Edited");
    }
});

const isEmpty = (): boolean => {
    try {
        return JSON.stringify(editor.get()) === "{}";
    } catch {
        return false;
    }
};

// Insert Open / Save buttons
const mainMenu = document.querySelector(".jsoneditor-menu");
const openButton = document.createElement("button");
openButton.innerText = "OPEN";
openButton.setAttribute("type", "button");
openButton.classList.add("customButton");
openButton.addEventListener("click", () => {
    isWaiting = true;
    ipcRenderer.send("open", currentFile);
});

const saveButton = document.createElement("button");
saveButton.innerText = "SAVE";
saveButton.setAttribute("type", "button");
saveButton.classList.add("customButton");
saveButton.addEventListener("click", () => {
    isWaiting = true;
    const updatedJson = editor.get();
    ipcRenderer.send("save", currentFile, updatedJson);
});

mainMenu.prepend(saveButton);
mainMenu.prepend(openButton);

// Create status bar
const statusBar = document.createElement("div");
statusBar.innerText = "New file";
statusBar.classList.add("statusBar");
document.body.appendChild(statusBar);

const setStatus = (status: string) => {
    statusBar.innerText = status;
};

ipcRenderer.on("requestOpen", () => {
    isWaiting = true;
    ipcRenderer.send("open", currentFile);
});
ipcRenderer.on("requestSave", () => {
    isWaiting = true;
    const updatedJson = editor.get();
    ipcRenderer.send("save", currentFile, updatedJson);
});
ipcRenderer.on("requestSaveAs", () => {
    isWaiting = true;
    const updatedJson = editor.get();
    ipcRenderer.send("saveAs", currentFile, updatedJson);
});
ipcRenderer.on("loaded", (event, filepath, content) => {
    isWaiting = false;

    if (isEmpty()) {
        editor.set(content);
        editor.expandAll();
        currentFile = filepath;
        savedJSON = content;

        // Update view
        setStatus(`✅ Opened file ${filepath}`);
        document.title = `${filepath} - JSONEditor`;
    }
    else {
        ipcRenderer.send('openNewWindow', filepath, content);
    }
});
ipcRenderer.on("loadError", (event, filepath) => {
    isWaiting = false;
    setStatus(`⚠️ Failed to open file ${filepath}`);
});
ipcRenderer.on("fileAlreadyOpened", (event, filepath) => {
    isWaiting = false;
    setStatus(`⚠️ ${filepath} is already opened.`);
});
ipcRenderer.on("saved", (event, filepath, content) => {
    isWaiting = false;
    currentFile = filepath;
    savedJSON = editor.get();

    // Update view
    document.title = `${filepath} - JSONEditor`;
    setStatus(`✅ Saved to ${filepath}`);
});
ipcRenderer.on("saveError", (event, filepath) => {
    isWaiting = false;
    setStatus(`⚠️ Failed to save file ${filepath}`);
});
