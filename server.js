// app.js
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging setup
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// GET endpoint
app.get("/api/test", (req, res) => {
  req.log.info("GET request received");
  res.json({
    message: "GET request successful",
    data: { sampleKey: "sampleValue" },
  });
});

// POST endpoint
app.post("/api/test", (req, res) => {
  try {
    const data = req.body;
    req.log.info(`POST request received with data: ${JSON.stringify(data)}`);

    if (!data || !data.name) {
      return res
        .status(400)
        .json({ error: "Missing required parameter 'name'" });
    }

    res.json({
      message: "POST request successful",
      receivedData: data,
      processed: `Hello, ${data.name}!`,
    });
  } catch (error) {
    req.log.error(`Error processing POST request: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  req.log.error(`Server error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
