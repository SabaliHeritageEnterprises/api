// src/main.ts
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://apps-frontend-tau.vercel.app',
      'https://apex1.up.railway.app',
      'http://localhost:3000',
      'http://localhost:4000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
});