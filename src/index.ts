import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { openFile, saveFile } from "./io";
import menu from "./menu";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

// Keep global references of the window objects.
const windows: Electron.BrowserWindow[] = [];

const createWindow = () => {
    if (windows.length === 0) {
        Menu.setApplicationMenu(menu);
    }

    // Create the browser window.
    const window = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: { nodeIntegration: true }
    });
    window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    windows.push(window);

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
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.length === 0) {
        createWindow();
    }
});

ipcMain.on("open", () => {
    openFile();
});
ipcMain.on("save", (event, arg) => {
    saveFile(arg);
});
ipcMain.on("saveAs", (event, arg) => {
    saveFile(arg, true);
});
ipcMain.on("openNewWindow", (event, filepath, content) => {
    const win = createWindow();
    win.webContents.on("did-finish-load", () => {
        win.webContents.send("loaded", filepath, content);
    });
});
