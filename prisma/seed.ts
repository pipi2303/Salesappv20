// Bootstraps the User table with real, server-hashed passwords for the
// same accounts src/app/components/Login.tsx currently authenticates
// client-side (demoAccounts). This does NOT change Login.tsx or remove
// the plaintext passwords there — that cleanup is Fase 0's job, tracked
// separately and intentionally not done in this pass. What this script
// gives you is the real-backend equivalent to switch Login.tsx over to
// once Fase 0 is ready, so nobody has to re-derive "who are the accounts
// and what roles do they have" from scratch at that point.
//
// Run with: npx prisma db seed  (needs DATABASE_URL set)
import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../lib/auth.js';

const prisma = new PrismaClient();

const demoUsers: Array<{ email: string; password: string; name: string; role: Role }> = [
  { email: 'admin@salesmonitor.com', password: 'admin123', name: 'Admin Utama', role: Role.SUPER_ADMIN },
  { email: 'manager@salesmonitor.com', password: 'manager123', name: 'Budi Santoso', role: Role.SALES_MANAGER },
  { email: 'sales@salesmonitor.com', password: 'sales123', name: 'Siti Nurhaliza', role: Role.SALES_REPRESENTATIVE },
];

// Deliberately NOT seeding the personal accounts from Login.tsx's
// demoAccounts (rivelino.hasugian@gmail.com, nikky@gmail.com, etc.) —
// those carry what look like real leaked passwords, and copying them
// into a new file would just re-create the exact Fase 0 problem this
// plan flags, in a second place. Add real accounts for those people
// through this script (or an admin UI once one exists) with fresh
// passwords they choose themselves, not by porting the old ones.

async function main() {
  for (const u of demoUsers) {
    const passwordHash = await hashPassword(u.password);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { email: u.email, name: u.name, role: u.role, passwordHash },
    });
    console.log(`Seeded ${u.email} (${u.role})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
