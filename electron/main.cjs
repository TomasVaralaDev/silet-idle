// electron/main.cjs
const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 768,
    // Poistettu tarpeeton nodeIntegration, jos emme käytä lokaalia tallennusta.
    // Tämä on tietoturvallisempi asetus.
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    title: "Nexus Idle",
    backgroundColor: "#000000", // Estää valkoisen välähdyksen käynnistyksessä
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Valinnainen: Jos peli vaatii netin, tarkistetaan onko se päällä
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.showMessageBox({
      type: "error",
      title: "Connection Error",
      message: "Nexus Idle requires an active internet connection to play.",
    });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
