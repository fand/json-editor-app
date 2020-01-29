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
    let filepath: string;
    try {
        filepath = res.filePaths[0];
        const json = await p(fs.readFile)(filepath, "utf8");
        data = JSON.parse(json);
    } catch (e) {
        activeWindow().webContents.send("loadError", filepath, e);
    }

    currentFile = filepath;
    activeWindow().setTitle(`${currentFile} - JSONEditor`);
    activeWindow().webContents.send("loaded", currentFile, data);
};

export const saveFile = async (obj: any) => {
    let filepath = currentFile;
    if (filepath === undefined) {
        const res = await dialog.showSaveDialog({});
        if (res.canceled) {
            return;
        }
        filepath = res.filePath;
    }

    try {
        const json = JSON.stringify(obj);
        await p(fs.writeFile)(filepath, json, "utf8");
    } catch (e) {
        activeWindow().webContents.send("saveError", filepath, e);
    }

    currentFile = filepath;
    activeWindow().webContents.send("saved", currentFile);
};

export const saveFileAs = async (obj: any) => {
    const res = await dialog.showSaveDialog({});
    if (res.canceled) {
        return;
    }

    try {
        const json = JSON.stringify(obj);
        await p(fs.writeFile)(res.filePath, json, "utf8");
    } catch (e) {
        activeWindow().webContents.send("saveError", res.filePath, e);
    }

    currentFile = res.filePath;
    activeWindow().setTitle(`${currentFile} - JSONEditor`);
    activeWindow().webContents.send("saved", currentFile);
};
