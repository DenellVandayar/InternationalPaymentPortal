require("dotenv").config();
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("MongoDB connected");

    // SSL certificate paths (for HTTPS)
    const keyPath = path.join(__dirname, "certs", "localhost-key.pem");
const certPath = path.join(__dirname, "certs", "localhost.pem");

    let serverFactory;
    let protoLabel;

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      // Use HTTPS
      const sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      serverFactory = () => https.createServer(sslOptions, app);
      protoLabel = "https";
      console.log("Using HTTPS with local SSL certificates");
    } else {
      // Fall back to HTTP (development only)
      serverFactory = () => http.createServer(app);
      protoLabel = "http";
      console.warn(
        "SSL certificates not found. HTTP is used (development only)."
      );
    }

    const server = serverFactory();
    server.listen(PORT, () =>
      console.log(`Server running at ${protoLabel}://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    process.exit(1);
  }
})();