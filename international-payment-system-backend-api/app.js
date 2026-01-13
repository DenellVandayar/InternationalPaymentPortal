const express = require("express");
const cors = require("cors");
const configureHelmet = require("./security/helmet"); // Lecturer's helmet.js
const hpp = require("hpp");

const morgan = require("morgan");

const sanitizeInput = require("./middleware/sanitize");
const { loginLimiter, registerLimiter } = require("./middleware/rateLimiter");

const authRoutes = require("./routes/auth");
const transactionsRoutes = require("./routes/transactions");

const app = express();

// Trust proxy (if behind Nginx, Heroku, etc.)
app.set("trust proxy", 1);

// Force HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Security: Helmet with CSP nonce + other hardening
configureHelmet(app);

// CORS (frontend ports)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173"],
    credentials: true,
  })
);

// Other security middleware
app.use(hpp());

app.use(sanitizeInput);

// Logging
app.use(morgan("dev"));

// JSON body parsing
app.use(express.json());

// Rate limiting
app.use("/api/auth/login/customer", loginLimiter);
app.use("/api/auth/login/employee", loginLimiter);
app.use("/api/auth/register/customer", registerLimiter);

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Root route
app.get("/", (req, res) => res.send("API is running..."));

// Dev route inspector
app.get("/__routes", (req, res) => {
  const results = [];
  const toPaths = (p) => (Array.isArray(p) ? p : [p]);

  const walk = (stack, prefix = "") => {
    if (!Array.isArray(stack)) return;
    for (const layer of stack) {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods || {}).map((m) => m.toUpperCase());
        toPaths(layer.route.path).forEach((p) =>
          results.push({ methods, path: prefix + p })
        );
      } else if (layer.handle && Array.isArray(layer.handle.stack)) {
        let mount = "";
        if (typeof layer.path === "string") mount = layer.path;
        walk(layer.handle.stack, prefix + (mount || ""));
      }
    }
  };

  try {
    walk(app._router?.stack || []);
    results.sort((a, b) => a.path.localeCompare(b.path));
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: "introspection failed", message: e.message });
  }
});

module.exports = app;