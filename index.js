// This file serves as a Node.js entry point for Vercel
const fs = require('fs');
const path = require('path');

// Serverless function handler for Vercel
module.exports = (req, res) => {
  // Default to serving index3.html
  const indexPath = path.join(__dirname, 'index3.html');
  
  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(content);
  } catch (error) {
    console.error('Error serving index3.html:', error);
    
    // Attempt to serve 404.html
    try {
      const notFoundPath = path.join(__dirname, '404.html');
      const notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end(notFoundContent);
    } catch (notFoundError) {
      res.statusCode = 500;
      res.end('Server Error');
    }
  }
};