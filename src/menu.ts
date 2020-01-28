import { app, dialog, Menu, shell } from "electron";
import {
    aboutMenuItem,
    appMenu,
    debugInfo,
    is,
    openNewGitHubIssue,
    openUrlMenuItem
} from "electron-util";
import fs from "fs";
import path from "path";
import p from "pify";
import config from "./config";

const openFile = async () => {
    const res = await dialog.showOpenDialog({ properties: ["openFile"] });
    if (res.canceled) {
        return;
    }

    const filename = res.filePaths[0];
    const json = await p(fs.readFile)(filename, "utf8");

    const data = JSON.parse(json);
};

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
                accelerator: "Command+o",
                label: "Open...",
                click() {
                    openFile();
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
                label: "Custom"
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
