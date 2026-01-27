const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

router.post("/predict", (req, res) => {
  const inputData = JSON.stringify(req.body);

  const python = spawn("python", [
    "../python_ml/predict.py",
    inputData
  ]);

  let result = "";
  let error = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    error += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error });
    }

    res.json({
      prediction: result.trim()
    });
  });
});

module.exports = router;
