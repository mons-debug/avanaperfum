import { NextResponse } from 'next/server';

export async function GET() {
  // Get all environment variables (excluding sensitive ones)
  const envVars = Object.keys(process.env)
    .filter(key => !key.includes('SECRET') && !key.includes('KEY'))
    .reduce((acc, key) => {
      acc[key] = key === 'MONGODB_URI' ? '[HIDDEN]' : process.env[key];
      return acc;
    }, {} as Record<string, string | undefined>);

  // Check specific MongoDB-related variables
  const mongoEnv = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEXT_PUBLIC_MONGODB_URI: !!process.env.NEXT_PUBLIC_MONGODB_URI,
    MONGO_URI: !!process.env.MONGO_URI,
  };

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    mongoEnv,
    allEnvVars: envVars,
  });
} 