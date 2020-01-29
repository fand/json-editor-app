import { app, Menu, shell } from "electron";
import {
    aboutMenuItem,
    activeWindow,
    debugInfo,
    is,
    openNewGitHubIssue,
    openUrlMenuItem
} from "electron-util";
import path from "path";
import config from "./config";
import { openFile } from "./io";

const helpSubmenu = [
    openUrlMenuItem({
        label: "Website",
        url: "https://github.com/fand/json-editor-app"
    }),
    openUrlMenuItem({
        label: "Source Code",
        url: "https://github.com/fand/json-editor-app"
    }),
    {
        label: "Report an Issue…",
        click() {
            const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

            openNewGitHubIssue({
                body,
                repo: "fand",
                user: "json-editor-app"
            });
        }
    }
];

if (!is.macos) {
    helpSubmenu.push(
        {
            type: "separator"
        },
        aboutMenuItem({
            icon: path.join(__dirname, "static", "icon.png"),
            text: "Created by Amagi"
        })
    );
}

const debugSubmenu = [
    {
        label: "Show Settings",
        click() {
            config.openInEditor();
        }
    },
    {
        label: "Show App Data",
        click() {
            shell.openItem(app.getPath("userData"));
        }
    },
    {
        type: "separator"
    },
    {
        label: "Delete Settings",
        click() {
            config.clear();
            app.relaunch();
            app.quit();
        }
    },
    {
        label: "Delete App Data",
        click() {
            shell.moveItemToTrash(app.getPath("userData"));
            app.relaunch();
            app.quit();
        }
    }
];

const macosTemplate = [
    {
        role: "fileMenu",
        submenu: [
            {
                accelerator: "Command+O",
                label: "Open...",
                click() {
                    openFile();
                }
            },
            {
                accelerator: "Command+S",
                label: "Save...",
                click() {
                    activeWindow().webContents.send("requestSave");
                }
            },
            {
                accelerator: "Shift+Command+S",
                label: "Save As...",
                click() {
                    activeWindow().webContents.send("requestSaveAs");
                }
            },
            {
                type: "separator"
            },
            {
                role: "close"
            }
        ]
    },
    {
        role: "editMenu"
    },
    {
        role: "viewMenu"
    },
    {
        role: "windowMenu"
    },
    {
        role: "help",
        submenu: helpSubmenu
    }
];

// Linux and Windows
const otherTemplate = [
    {
        role: "fileMenu",
        submenu: [
            {
                accelerator: "Ctrl+O",
                label: "Open...",
                click() {
                    openFile();
                }
            },
            {
                accelerator: "Ctrl+S",
                label: "Save...",
                click() {
                    activeWindow().webContents.send("requestSave");
                }
            },
            {
                accelerator: "Shift+Ctrl+S",
                label: "Save As...",
                click() {
                    activeWindow().webContents.send("requestSaveAs");
                }
            },
            {
                type: "separator"
            },
            {
                role: "quit"
            }
        ]
    },
    {
        role: "editMenu"
    },
    {
        role: "viewMenu"
    },
    {
        role: "help",
        submenu: helpSubmenu
    }
];

const template = process.platform === "darwin" ? macosTemplate : otherTemplate;

if (is.development) {
    template.push({
        label: "Debug",
        submenu: debugSubmenu
    } as any);
}

export default Menu.buildFromTemplate(template as any);
