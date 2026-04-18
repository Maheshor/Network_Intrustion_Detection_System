const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "nidssystem@gmail.com",
    pass: "jlle hbcg iqfj jjvy",
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"NIDDS Alert" <nidssystem@gmail.com>`,
      to: "maheshorsilwal9@gmail.com", // test to yourself
      subject: "Test Email from NIDDS",
      text: "This is a test email to check nodemailer + Gmail App Password.",
    });
    console.log("📧 Email sent! MessageId:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}

testEmail();