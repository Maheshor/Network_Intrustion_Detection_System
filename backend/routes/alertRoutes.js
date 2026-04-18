// backend/routes/alertRoutes.js
const express = require("express");
const router = express.Router();
const sendThreatAlert = require("../services/emailService");

// POST /api/alert/email
router.post("/email", async (req, res) => {
  try {
    const { log, userEmail } = req.body; // send email + log from frontend
    await sendThreatAlert(userEmail, log);
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;