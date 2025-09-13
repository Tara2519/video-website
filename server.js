const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Upload-Ordner erstellen, falls nicht vorhanden
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer konfigurieren
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Statische Dateien
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Route für Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Upload-Route
app.post("/upload", upload.single("video"), (req, res) => {
  res.redirect("/");
});

// API für alle Videos
app.get("/videos", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.json([]);
    res.json(files);
  });
});

// Server starten
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
