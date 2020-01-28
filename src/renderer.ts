/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import JSONEditor from "jsoneditor";
import "./index.css";

// create the editor
const container = document.getElementById("jsoneditor");
const options = {};
const editor = new JSONEditor(container, options);

// set json
const initialJson = {
    Array: [1, 2, 3],
    Boolean: true,
    Null: null as any,
    Number: 123,
    Object: { a: "b", c: "d" },
    String: "Hello World"
};
editor.set(initialJson);

// get json
const updatedJson = editor.get();

// console.log('👋 This message is being logged by 'renderer.js', included via webpack');
