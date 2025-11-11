import { NextResponse } from 'next/server';

export function GET() {
  const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  // Add detailed logging to check the environment variable in Cloud Run
  console.log(`[CONFIG API] Reading NEXT_PUBLIC_BACKEND_API_URL. Value: "${backendApiUrl}"`);

  if (!backendApiUrl) {
    console.error('[CONFIG API] CRITICAL: NEXT_PUBLIC_BACKEND_API_URL is not set on the server.');
    return NextResponse.json(
      { error: 'Backend API URL is not configured.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    backendApiUrl,
  });
}