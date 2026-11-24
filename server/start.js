import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');

app.use(express.static(dist));
app.use((_req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Threatline API and app listening on port ${port}`));
