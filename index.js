const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const chokidar = require('chokidar');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * Recursively get files and directories in a given path.
 */
function getFilesTree(dir, relativePath = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const tree = [];

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.join(relativePath, item.name);

    if (item.isDirectory()) {
      tree.push({
        name: item.name,
        type: 'dir',
        path: relPath,
        children: getFilesTree(fullPath, relPath)
      });
    } else if (item.isFile() && item.name.endsWith('.md')) {
      tree.push({
        name: item.name,
        type: 'file',
        title: path.basename(item.name, '.md'),
        path: relPath
      });
    }
  }
  return tree;
}

/**
 * Get list of all markdown pages as a tree structure.
 */
app.get('/api/pages', (req, res) => {
  try {
    const tree = getFilesTree(DATA_DIR);
    res.json(tree);
  } catch (error) {
    console.error('Error reading pages tree:', error);
    res.status(500).json({ error: 'Failed to read pages tree' });
  }
});

/**
 * Get content of a specific markdown page.
 */
app.get('/api/pages/:name', (req, res) => {
  const fileName = req.params.name;
  if (!fileName.endsWith('.md')) {
    // Try adding .md if not provided
    const nameWithExt = `${fileName}.md`;
    const filePath = path.join(DATA_DIR, nameWithExt);
    if (fs.existsSync(filePath)) {
      return sendFileContent(filePath, res);
    }
  }

  const filePath = path.join(DATA_DIR, fileName);
  if (fs.existsSync(filePath)) {
    sendFileContent(filePath, res);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

function sendFileContent(filePath, res) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file content:', error);
    res.status(500).json({ error: 'Failed to read file content' });
  }
}

// Watch for file changes in DATA_DIR
chokidar.watch(DATA_DIR).on('all', (event, filePath) => {
  console.log(`File event: ${event} on ${filePath}`);
  const fileName = path.basename(filePath);
  if (fileName.endsWith('.md')) {
    io.emit('file-changed', { event, fileName });
  }
});

server.listen(PORT, () => {
  console.log(`Local Wiki server is running on http://localhost:${PORT}`);
});
