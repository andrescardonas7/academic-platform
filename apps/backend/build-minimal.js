const fs = require('fs');
const path = require('path');

// Simple build script for minimal server
const serverContent = `const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: [
    'https://academic-platform.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Basic API endpoints
app.get('/api', (req, res) => {
  res.json({
    message: 'Academic Platform API',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// Health check for API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Search mock endpoint
app.get('/api/search', (req, res) => {
  res.json({
    data: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    filters: req.query,
  });
});

// Search filters endpoint
app.get('/api/search/filters', (req, res) => {
  res.json({
    modalidades: ["PRESENCIAL", "VIRTUAL", "HÍBRIDA"],
    instituciones: ["Universidad del Valle", "SENA", "Universidad Antonio Nariño", "Universidad Cooperativa de Colombia"],
    areas: ["INGENIERÍA", "CIENCIAS SOCIALES", "SALUD", "ADMINISTRACIÓN", "ARTES"],
    niveles: ["TÉCNICO", "TECNÓLOGO", "PROFESIONAL", "ESPECIALIZACIÓN", "MAESTRÍA"]
  });
});

// Chatbot mock endpoint
app.post('/api/chatbot/message', (req, res) => {
  res.json({
    message: "Hola, soy el chatbot de Academic Platform. Estoy en modo de mantenimiento en este momento.",
    timestamp: new Date().toISOString(),
  });
});

// Start server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(\`🚀 Backend server running on port \${PORT}\`);
      console.log(\`📊 Environment: \${process.env.NODE_ENV || 'development'}\`);
      console.log(\`🔗 Health check: http://localhost:\${PORT}/health\`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();

module.exports = app;
`;

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write the compiled server
fs.writeFileSync(path.join(distDir, 'server.minimal.js'), serverContent);

console.log('✅ Minimal server built successfully!');
console.log('📁 Output: dist/server.minimal.js');
