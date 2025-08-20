const express = require("express");
const { RouterOSAPI } = require("node-routeros");
const app = express();
const PORT = 3000;

// Permitir receber JSON do front-end
app.use(express.json());
app.use(express.static("public"));

// Rota principal (HTML)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Rota para testar conexão com MikroTik API
app.post("/check", async (req, res) => {
  const { host, user, password, port } = req.body;

  const conn = new RouterOSAPI({
    host: host || "192.168.88.1",
    user: user || "admin",
    password: password || "",
    port: port || 8728
  });

  try {
    await conn.connect();
    const interfaces = await conn.write("/interface/print");
    res.json({ status: "conectado", interfaces });
    conn.close();
  } catch (err) {
    res.json({ status: "erro", message: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
