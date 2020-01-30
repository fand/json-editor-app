import { app, BrowserWindow, ipcMain, Menu } from "electron";
import path from 'path';
import { openFile, saveFile, readFile } from "./io";
import menu from "./menu";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

let filesToOpen: string[] = [];

// File association handler for macOS
app.on('open-file', (e, filepath) => {
    event.preventDefault();
    filesToOpen.push(filepath);
});

// File association handler for Windows
if (process.argv.length > 1) {
    filesToOpen = filesToOpen.concat(process.argv.slice(1));
}

// Keep global references of the window objects.
const windows: Electron.BrowserWindow[] = [];

const createWindow = async (filepath?: string) => {
    if (windows.length === 0) {
        Menu.setApplicationMenu(menu);
    }

    // Create the browser window
    const window = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: { nodeIntegration: true }
    });
    window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    windows.push(window);

    if (filepath) {
        const content = await readFile(filepath);
        window.webContents.on("did-finish-load", () => {
            window.webContents.send("loaded", filepath, content);
        });
    }

    // Remove the reference when the window is closed.
    window.on("closed", () => {
        const i = windows.indexOf(window);
        if (i !== -1) {
            windows.splice(i, 1);
        }
    });

    return window;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    if (filesToOpen.length > 0) {
        filesToOpen.forEach((filepath) => {
            const absPath = path.resolve(process.cwd(), filepath);
            createWindow(absPath);
        });
    }
    else {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // When dock icon is clicked on macOS
    if (windows.length === 0) {
        createWindow();
    }
});

ipcMain.on("open", (event, currentFile) => {
    openFile(currentFile);
});
ipcMain.on("save", (event, currentFile, data) => {
    saveFile(currentFile, data);
});
ipcMain.on("saveAs", (event, currentFile, data) => {
    saveFile(currentFile, data, true);
});
ipcMain.on("openNewWindow", async (event, filepath, content) => {
    const win = await createWindow();
    win.webContents.on("did-finish-load", () => {
        win.webContents.send("loaded", filepath, content);
    });
});
