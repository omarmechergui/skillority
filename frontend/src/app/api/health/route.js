export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'skillority-frontend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

