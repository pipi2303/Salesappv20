// Production HTTP server for running this app outside Vercel (VPS via
// Portainer). Vercel's serverless runtime normally turns each api/*.ts
// file into its own function; here they're all mounted as routes on one
// long-running Express process instead. This file is NOT used by
// `vercel dev` / Vercel production (those still use api/*.ts directly) —
// it only runs inside the Docker image built for the VPS.
//
// Why this works with zero changes to any api/*.ts handler: every one of
// them already has the signature (req, res) => Promise<void> and calls
// res.status(code).json(body) — which is exactly Express's response API
// (Vercel's Node runtime modeled its response object on Express's). The
// only gap is req.query.id for dynamic routes: Vercel puts the [id]
// segment into req.query, Express puts it into req.params — toHandler()
// below merges params into query so every handler's `req.query?.id`
// pattern keeps working unmodified.
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import authLogin from './api/auth/login.js';
import authMe from './api/auth/me.js';
import authLogout from './api/auth/logout.js';
import leadsIndex from './api/leads/index.js';
import leadsById from './api/leads/[id].js';
import productsIndex from './api/products/index.js';
import productsById from './api/products/[id].js';
import opportunitiesIndex from './api/opportunities/index.js';
import opportunitiesById from './api/opportunities/[id].js';
import tasksIndex from './api/tasks/index.js';
import tasksById from './api/tasks/[id].js';
import distributorsIndex from './api/distributors/index.js';
import distributorsById from './api/distributors/[id].js';
import storesIndex from './api/stores/index.js';
import storesById from './api/stores/[id].js';
import { LOCAL_UPLOAD_DIR } from './lib/blob.js';

type VercelStyleHandler = (req: any, res: any) => Promise<void> | void;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

// Check-in photos arrive as base64 data URLs inside JSON bodies (see
// lib/blob.ts's 5MB decoded-size cap) — base64 inflates size by ~1.37x,
// so 8mb of headroom comfortably covers a 5MB photo plus the rest of the
// task payload.
app.use(express.json({ limit: '8mb' }));

function toHandler(fn: VercelStyleHandler) {
  return (req: express.Request, res: express.Response) => {
    (req as any).query = { ...req.query, ...req.params };
    Promise.resolve(fn(req, res)).catch((err) => {
      console.error('Unhandled API error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    });
  };
}

app.all('/api/auth/login', toHandler(authLogin));
app.all('/api/auth/me', toHandler(authMe));
app.all('/api/auth/logout', toHandler(authLogout));
app.all('/api/leads', toHandler(leadsIndex));
app.all('/api/leads/:id', toHandler(leadsById));
app.all('/api/products', toHandler(productsIndex));
app.all('/api/products/:id', toHandler(productsById));
app.all('/api/opportunities', toHandler(opportunitiesIndex));
app.all('/api/opportunities/:id', toHandler(opportunitiesById));
app.all('/api/tasks', toHandler(tasksIndex));
app.all('/api/tasks/:id', toHandler(tasksById));
app.all('/api/distributors', toHandler(distributorsIndex));
app.all('/api/distributors/:id', toHandler(distributorsById));
app.all('/api/stores', toHandler(storesIndex));
app.all('/api/stores/:id', toHandler(storesById));

// Bab 8 gap 2 check-in photos, when lib/blob.ts's local-disk backend is
// active (no BLOB_READ_WRITE_TOKEN set — the default for this VPS
// deployment). Mounted on the exact directory lib/blob.ts writes to, so
// a photo saved there is immediately servable at the URL it returned.
// The `checkin_photos` volume in docker-compose.yml is what makes this
// survive container recreation/redeploys.
app.use('/uploads/checkin-photos', express.static(LOCAL_UPLOAD_DIR));

// Everything else: the built Vite frontend (dist/), with an SPA fallback
// so client-side-routed URLs (if any are added later) don't 404 on
// refresh. Static files (js/css/images) are served as-is; anything that
// doesn't match a file on disk falls through to index.html.
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Sales CRM Onduline server listening on port ${port}`);
});
