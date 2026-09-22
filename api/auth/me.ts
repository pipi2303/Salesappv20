// GET /api/auth/me — resolves the current bearer token to a user, or 401.
// This replaces AuthContext.tsx's current "read the user object back out
// of localStorage" restore-on-load with an actual backend-validated check.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { getUserFromToken, extractBearerToken } from '../../lib/auth.js';

interface ApiRequest extends IncomingMessage {
  method?: string;
  headers: IncomingMessage['headers'];
}
interface ApiResponse extends ServerResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }
  const user = await getUserFromToken(extractBearerToken(req.headers.authorization));
  if (!user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }
  res.status(200).json({ success: true, data: user });
}
