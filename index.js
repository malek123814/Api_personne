const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes."
});

app.use(limiter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(YAML.load("./openapi.yaml")));

// ROUTES

app.get('/', (req, res) => {
  res.json("Registre de personnes!");
});

// GET all
app.get('/personnes', (req, res) => {
  db.all("SELECT * FROM personnes", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });

    res.json({ message: "success", data: rows });
  });
});

// GET by ID
app.get('/personnes/:id', (req, res) => {
  db.get("SELECT * FROM personnes WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });

    res.json({ message: "success", data: row });
  });
});

// POST (UN SEUL)
app.post('/personnes', (req, res) => {
  const { nom, adresse } = req.body;

  db.run(
    `INSERT INTO personnes (nom, adresse) VALUES (?, ?)`,
    [nom, adresse],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      res.json({
        message: "success",
        data: { id: this.lastID }
      });
    }
  );
});

// PUT
app.put('/personnes/:id', (req, res) => {
  db.run(
    `UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?`,
    [req.body.nom, req.body.adresse, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      res.json({ message: "success" });
    }
  );
});

// DELETE
app.delete('/personnes/:id', (req, res) => {
  db.run(
    `DELETE FROM personnes WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      res.json({ message: "success" });
    }
  );
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});