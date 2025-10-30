const { app, BrowserWindow } = require("electron");
const { spawn, execSync } = require("child_process");
const net = require("net");

let serverProcess = null;
let isServerRunning = false;

/**
 * Проверка, свободен ли порт
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => {
        tester.once("close", () => resolve(true)).close();
      })
      .listen(port);
  });
}

/**
 * Очистка порта (Windows)
 */
function freePort(port = 3000) {
  try {
    const result = execSync(`netstat -ano | findstr :${port}`).toString();
    const lines = result.split("\n").filter((l) => l.includes("LISTENING"));
    for (const line of lines) {
      const pid = line.trim().split(/\s+/).pop();
      if (pid) {
        execSync(`taskkill /PID ${pid} /F`);
        console.log(`🧹 Убит процесс PID=${pid}, занимавший порт ${port}`);
      }
    }
  } catch {
    console.log(`✅ Порт ${port} свободен`);
  }
}

/**
 * Создание окна
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: "#ffffff",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000");

  win.on("closed", () => {
    win.destroy();
  });
}

/**
 * Запуск сервера (только один раз)
 */
async function startServer() {
  const PORT = 3000;

  if (isServerRunning) {
    console.log("⚠️ Сервер уже запущен, пропускаем повторный старт");
    return;
  }

  // Проверяем, не занят ли порт
  const free = await checkPort(PORT);
  if (!free) {
    console.log("⚠️ Порт занят, пытаюсь очистить...");
    freePort(PORT);
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("🚀 Запуск backend-сервера...");
  serverProcess = spawn("node", ["./scripts/server.js"], {
    stdio: "inherit",
    shell: true,
  });

  isServerRunning = true;
}

/**
 * Основной запуск
 */
app.whenReady().then(async () => {
  await startServer();
  setTimeout(createWindow, 2500);
});

app.on("window-all-closed", () => {
  console.log("🧩 Остановка backend...");
  if (serverProcess) serverProcess.kill("SIGTERM");
  app.quit();
});
