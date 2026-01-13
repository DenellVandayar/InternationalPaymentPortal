const helmet = require('helmet');
const crypto = require('crypto');

module.exports = function configureHelmet(app) {
  // Trust proxy for correct client IP detection
  app.set('trust proxy', 1);

  // Generate a unique nonce per request (for inline script security)
  app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
  });

  // Base security headers
  app.use(
    helmet({
      hidePoweredBy: true, // hide Express header
      hsts: process.env.NODE_ENV === 'production' ? undefined : false, // only enable HSTS in prod
      referrerPolicy: { policy: 'no-referrer' },
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
    })
  );
//  Enforce HTTP Strict Transport Security (HSTS) — production only
  if (process.env.NODE_ENV === 'production') {
    app.use(
      helmet.hsts({
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      })
    );
  }
  // Content Security Policy (CSP)
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        defaultSrc: ["'none'"],
        baseUri: ["'none'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:5173", "https://localhost:5173"],
        fontSrc: ["'self'", "data:"],
        workerSrc: ["'self'"],
        mediaSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    })
  );
    // Frameguard to prevent clickjacking
  app.use(
    helmet.frameguard({
      action: 'deny', // no framing allowed
    })
  );
  
};