import { ipcRenderer } from "electron";
import JSONEditor from "jsoneditor";
import "./index.css";

// App state
let currentFile: string;
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
    ipcRenderer.send("open", currentFile);
    setMask(true);
    setStatus(`Opening file...`);
});

const saveButton = document.createElement("button");
saveButton.innerText = "SAVE";
saveButton.setAttribute("type", "button");
saveButton.classList.add("customButton");
saveButton.addEventListener("click", () => {
    const updatedJson = editor.get();
    ipcRenderer.send("save", currentFile, updatedJson);
    setMask(true);
    setStatus(`Saving file to ${currentFile}...`);
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

// Create waiting mask
const waitingMask = document.createElement("div");
waitingMask.classList.add("waitingMask");
document.body.appendChild(waitingMask);
const setMask = (isWaiting: boolean) => {
    waitingMask.style.setProperty("display", isWaiting ? "block" : "none");
};

ipcRenderer.on("requestOpen", () => {
    ipcRenderer.send("open", currentFile);
    setMask(true);
    setStatus(`Opening file...`);
});
ipcRenderer.on("requestSave", () => {
    const updatedJson = editor.get();
    ipcRenderer.send("save", currentFile, updatedJson);

    setMask(true);
    setStatus(`Saving file to ${currentFile}...`);
});
ipcRenderer.on("requestSaveAs", () => {
    const updatedJson = editor.get();
    ipcRenderer.send("saveAs", currentFile, updatedJson);

    setMask(true);
    setStatus(`Saving to new file...`);
});
ipcRenderer.on("loaded", (event, filepath, content) => {
    setMask(false);

    if (isEmpty()) {
        editor.set(content);
        editor.expandAll();
        currentFile = filepath;
        savedJSON = content;

        // Update view
        document.title = `${filepath} - JSONEditor`;
        setStatus(`✅ Opened file ${filepath}`);
    } else {
        ipcRenderer.send("openNewWindow", filepath, content);
        setStatus(`Opening file ${filepath} in new window`);
    }
});
ipcRenderer.on("loadError", (event, filepath) => {
    setMask(false);
    setStatus(`⚠️ Failed to open file ${filepath}`);
});
ipcRenderer.on("fileAlreadyOpened", (event, filepath) => {
    setMask(false);
    setStatus(`⚠️ ${filepath} is already opened.`);
});
ipcRenderer.on("saved", (event, filepath, content) => {
    currentFile = filepath;
    savedJSON = editor.get();

    // Update view
    document.title = `${filepath} - JSONEditor`;
    setMask(false);
    setStatus(`✅ Saved to ${filepath}`);
});
ipcRenderer.on("saveError", (event, filepath) => {
    setMask(false);
    setStatus(`⚠️ Failed to save file ${filepath}`);
});
