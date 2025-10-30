process.env.CHCP = 65001;
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "78.40.109.60",
  user: "root",
  password: "U6zODo*%$S%0",
  database: "svoydom",
  charset: "utf8",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/api/services", async (req, res) => {
  const section = req.query.section || "Консультация";
  const filial = req.query.filial || "333";

  try {
    const [rows] = await pool.execute(
      "SELECT idB, name FROM bsrvsprav WHERE section_name = ? AND codeO = ? ORDER BY name",
      [section, filial]
    );

    res.json(rows);
  } catch (err) {
    console.error("Ошибка запроса /api/services:", err);
    res.status(500).json({ error: "Ошибка при получении данных из БД" });
  }
});
app.get("/api/houses", async (req, res) => {
  const filial = req.query.filial || "333";

  try {
    const [rows] = await pool.execute(
      "SELECT DISTINCT service_name_rus AS name FROM services WHERE codeO = ? AND svyaz = 2 ORDER BY poryadok",
      [filial]
    );
    res.json(rows);
  } catch (err) {
    console.error("Ошибка запроса /api/houses:", err);
    res.status(500).json({ error: "Ошибка при получении списка ЖК" });
  }
});
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📦 Раздача статических файлов из папки проекта
app.use(express.static(path.join(__dirname, "../")));

// 📄 Отдаём index.html при запросе корня
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут не найден: ${req.originalUrl}` });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ API сервер запущен на http://localhost:${PORT}`)
);
