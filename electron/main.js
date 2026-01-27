const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,       // important for security
      contextIsolation: true,       // important to allow preload to work
      enableRemoteModule: false,    // optional, for modern Electron
    },
  });

  if (isDev) {
    // Load Vite dev server
    win.loadURL("http://localhost:5173").catch((err) => console.error(err));
    // Optional: open dev tools automatically
    win.webContents.openDevTools();
  } else {
    // Load production build
    win.loadFile(path.join(__dirname, "../frontend/dist/index.html")).catch((err) => console.error(err));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
