export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimit: {
    windowMs: 60 * 1000,        // 1 minute
    max: 100,                    // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  },
}