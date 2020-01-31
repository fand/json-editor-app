import { BrowserWindow, dialog } from "electron";
import { activeWindow } from "electron-util";
import fs from "fs";
import p from "pify";

export const openFile = async (currentFile: string) => {
    const res = await dialog.showOpenDialog({ properties: ["openFile"] });
    if (res.canceled) {
        activeWindow().webContents.send("loadCanceled");
        return;
    }

    const filepath = res.filePaths[0];
    if (filepath === currentFile) {
        activeWindow().webContents.send("fileAlreadyOpened", filepath);
        return;
    }

    let data;
    try {
        const json = await p(fs.readFile)(filepath, "utf8");
        data = JSON.parse(json);
    } catch (e) {
        activeWindow().webContents.send("loadError", filepath, e);
        return;
    }

    activeWindow().webContents.send("loaded", filepath, data);
};

export const saveFile = async (
    filepath: string,
    obj: any,
    saveAsAnotherFile: boolean = false
) => {
    if (filepath === undefined || saveAsAnotherFile) {
        const res = await dialog.showSaveDialog({});
        if (res.canceled) {
            activeWindow().webContents.send("saveCanceled");
            return;
        }
        filepath = res.filePath;
    }

    try {
        const json = JSON.stringify(obj, null, 2);
        await p(fs.writeFile)(filepath, json, "utf8");
    } catch (e) {
        activeWindow().webContents.send("saveError", filepath, e);
    }

    activeWindow().webContents.send("saved", filepath);
};

// Note this rejects if there are some errors
export const readFile = async (filepath: string) => {
    const json = await p(fs.readFile)(filepath, "utf8");
    return JSON.parse(json);
};
