const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nidssystem@gmail.com",
    pass: "jlle hbcg iqfj jjvy",
  },
});

async function sendThreatAlert(userEmail, log) {
  try {
    const info = await transporter.sendMail({
      from: "nidssystem@gmail.com",
      to: userEmail,
      subject: "🚨 Threat Detected",
      html: `
        <h3>Threat Detected</h3>
        <p><b>Source:</b> ${log.src}</p>
        <p><b>Destination:</b> ${log.dst}</p>
        <p><b>Status:</b> ${log.label}</p>
      `,
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (err) {
    console.error(" Email error:", err.message);
  }
}

module.exports = sendThreatAlert;