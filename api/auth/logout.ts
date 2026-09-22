// POST /api/auth/logout — revokes the session behind the bearer token.
// Because sessions are opaque backend rows (not JWTs), this is a real,
// immediate revoke rather than "the client just forgets the token."
import type { IncomingMessage, ServerResponse } from 'node:http';
import { revokeSession, extractBearerToken } from '../../lib/auth.js';

interface ApiRequest extends IncomingMessage {
  method?: string;
  headers: IncomingMessage['headers'];
}
interface ApiResponse extends ServerResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }
  const token = extractBearerToken(req.headers.authorization);
  if (token) await revokeSession(token);
  res.status(200).json({ success: true });
}
