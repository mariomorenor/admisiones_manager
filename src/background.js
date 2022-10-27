"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });
  win.maximize();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  return win;
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  const window = await createWindow();

  io.on("connection", (socket) => {
    socket.on("new-client", (data) => {
      socket.data = { ...data, socket_id: socket.id };
      window.webContents.send("new-client", socket.data);
    });

    socket.on("disconnect", () => {
      window.webContents.send("remove-client", socket.data);
    });

    socket.emit("get-status");

    socket.on("status", (status) => {
      window.webContents.send();
    });
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// Data Store
const Store = require("electron-store");
const store = new Store();

// Generate Config File For first time
if (!store.get("first_time")) {
  store.set("first_time", true);
  store.set("server", {
    port: 6969,
  });
}

const server = store.get("server");

// SOCKET SERVER
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*",
  },
});

io.listen(server.port);

ipcMain.handle("clients", async (event, data) => {
  const connectedSockets = await io.fetchSockets();
  return connectedSockets.map((s) => s.data);
});

ipcMain.on("open-client-window", (event, data) => {
  io.to(data.socket_id).emit("open-window");
});

ipcMain.on("close-client-window", (event, data) => {
  io.to(data.socket_id).emit("close-window");
});

ipcMain.on("power-off", (event, data) => {
  io.to(data.socket_id).emit("power-off");
});
