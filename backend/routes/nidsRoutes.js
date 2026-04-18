const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

// Global variable to store the NIDS process
let nidsProcess = null;

// ---------------- START SCAN ----------------
router.post("/start", (req, res) => {
  try {
    if (nidsProcess) {
      return res.json({
        success: false,
        message: "NIDS is already running"
      });
    }

    console.log("Start scan API called");

    // Path to your Python NIDS script
    const scriptPath = path.join(__dirname, "../../python_ml/live_nids.py");
    console.log("Python path:", scriptPath);

    // Spawn the Python process
    nidsProcess = spawn("python", [scriptPath]);

    // Capture standard output
    nidsProcess.stdout.on("data", (data) => {
      console.log(`NIDS: ${data.toString()}`);
    });

    // Capture errors
    nidsProcess.stderr.on("data", (data) => {
      console.error(`NIDS Error: ${data.toString()}`);
    });

    // Detect when process closes
    nidsProcess.on("close", (code) => {
      console.log(`NIDS stopped with code ${code}`);
      nidsProcess = null; // reset process
    });

    res.json({
      success: true,
      message: "NIDS started"
    });

  } catch (error) {
    console.error("Start error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

// ---------------- STOP SCAN ----------------
router.post("/stop", (req, res) => {
  try {
    if (nidsProcess) {
      nidsProcess.kill(); // kill the Python process
      nidsProcess = null;

      console.log("NIDS process stopped");

      res.json({
        success: true,
        message: "NIDS stopped"
      });
    } else {
      res.json({
        success: false,
        message: "NIDS is not running"
      });
    }
  } catch (error) {
    console.error("Stop error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

module.exports = router;