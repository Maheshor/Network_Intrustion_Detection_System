const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

/* ================================
   TEST ROUTE
================================ */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "ML route working ✅"
  });
});

/* ================================
   SCAN / PREDICT ROUTE
================================ */
router.post("/scan", (req, res) => {

  try {
    const pythonPath = path.join(
      __dirname,
      "..",
      "..",
      "python_ml",
      "predict.py"
    );

    const py = spawn("python", [pythonPath]);

    let result = "";
    let errorOutput = "";

    // Send JSON data to Python via stdin
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();

    // Capture output
    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", () => {

      if (errorOutput) {
        console.error("Python Error:", errorOutput);
        return res.json({
          success: false,
          message: "Python error occurred",
          error: errorOutput
        });
      }

      try {
        const parsed = JSON.parse(result);
        res.json(parsed);
      } catch (err) {
        res.json({
          success: false,
          message: "Prediction failed",
          raw: result
        });
      }
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }

});

module.exports = router;
