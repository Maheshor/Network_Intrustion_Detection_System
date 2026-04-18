require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const connectDB = require("./config/db");
const Log = require("./models/Log");
const sendThreatAlert = require("./services/emailService");

const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/nids", require("./routes/nidsRoutes"));

/* ================= GLOBAL USER EMAIL ================= */
let activeUserEmail = null;

/* ================= SERVER ================= */
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

console.log("WebSocket server initialized");

/* ================= WEBSOCKET ================= */
wss.on("connection", (ws, req) => {
  console.log("🔗 Client connected");

  const params = new URLSearchParams(req.url.split("?")[1]);
  const email = params.get("email");

  // ✅ React connection sets active user
  if (email) {
    activeUserEmail = email;
    console.log(" Active User Set:", activeUserEmail);
  } else {
    console.log("Python connected (no email)");
  }

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());

      console.log(" Packet:", data);

      /* 🔥 THREAT DETECTED */
      if (data.label === "THREAT") {
        try {
          const savedLog = await Log.create({
            scanId: data.scanId,
            timestamp: new Date(),
            src: data.src,
            dst: data.dst,
            prediction_prob: data.prediction_prob,
            label: data.label,
          });

          console.log(" THREAT DETECTED");

          // ✅ SEND EMAIL TO ACTIVE USER
          if (activeUserEmail) {
            console.log(" Sending alert to:", activeUserEmail);
            await sendThreatAlert(activeUserEmail, savedLog);
          } else {
            console.log(" No active user email found");
          }

        } catch (err) {
          console.error(" DB Error:", err.message);
        }
      }

      /* 🔁 BROADCAST TO ALL CLIENTS */
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });

    } catch (err) {
      console.error(" WS Error:", err.message);
    }
  });

  ws.on("close", () => console.log(" Client disconnected"));
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("==================================");
  console.log(` Server running on PORT ${PORT}`);
  console.log("==================================");
});