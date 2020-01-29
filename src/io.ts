import { dialog } from "electron";
import { activeWindow } from "electron-util";
import fs from "fs";
import p from "pify";

let currentFile: string | undefined;

export const openFile = async () => {
    const res = await dialog.showOpenDialog({ properties: ["openFile"] });
    if (res.canceled) {
        return;
    }

    let data;
    let filename: string;
    try {
        filename = res.filePaths[0];
        const json = await p(fs.readFile)(filename, "utf8");
        data = JSON.parse(json);
    } catch (e) {
        activeWindow().webContents.send("loadError", e);
    }

    currentFile = filename;
    activeWindow().setTitle(`${currentFile} - JSONEditor`);
    activeWindow().webContents.send("loaded", data);
};

export const saveFile = async (obj: any) => {
    if (currentFile === undefined) {
        const res = await dialog.showSaveDialog({});
        if (res.canceled) {
            return;
        }
        currentFile = res.filePath;
    }

    try {
        const json = JSON.stringify(obj);
        await p(fs.writeFile)(currentFile, json, "utf8");
    } catch (e) {
        activeWindow().webContents.send("saveError", e);
    }

    activeWindow().webContents.send("saved", currentFile);
};

export const saveFileAs = async (obj: any) => {
    const res = await dialog.showSaveDialog({});
    if (res.canceled) {
        return;
    }
    currentFile = res.filePath;

    try {
        const json = JSON.stringify(obj);
        await p(fs.writeFile)(currentFile, json, "utf8");
    } catch (e) {
        activeWindow().webContents.send("saveError", e);
    }

    activeWindow().webContents.send("saved", currentFile);
};
