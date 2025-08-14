import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage client
const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '{}'),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const PRIMARY_BUCKET = 'nb-optimization-sgp';
const PRIMARY_FOLDER_PATH = 'api-auto-sgp/internal';
const FALLBACK_BUCKET = 'nb-optimization-oregon';
const FALLBACK_FOLDER_PATH = 'api-auto-oregon/internal';

// Map bucket names to human-readable location names
const BUCKET_LOCATIONS = {
  [PRIMARY_BUCKET]: 'SINGAPORE',
  [FALLBACK_BUCKET]: 'US-OREGON'
};

async function getFileFromBucket(bucketName: string, folderPath: string, fileName: string) {
  const bucket = storage.bucket(bucketName);
  const filePath = `${folderPath}/${fileName}`;
  const file = bucket.file(filePath);
  
  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }
  
  const [fileContent] = await file.download();
  return JSON.parse(fileContent.toString('utf8'));
}

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
      return NextResponse.json(
        { error: 'Google service account credentials not configured' },
        { status: 500 }
      );
    }

    if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
      return NextResponse.json(
        { error: 'Google Cloud project ID not configured' },
        { status: 500 }
      );
    }

    // Construct the file name
    const fileName = `${requestId}-input.json`;
    
    // First, try to get the file from the primary bucket (nb-optimization-sgp)
    let jsonData = await getFileFromBucket(PRIMARY_BUCKET, PRIMARY_FOLDER_PATH, fileName);
    let sourceBucket: string = PRIMARY_BUCKET;
    let sourceFolder = PRIMARY_FOLDER_PATH;
    
    // If not found in primary bucket, try the fallback bucket (nb-optimization-oregon)
    if (!jsonData) {
      jsonData = await getFileFromBucket(FALLBACK_BUCKET, FALLBACK_FOLDER_PATH, fileName);
      if (jsonData) {
        sourceBucket = FALLBACK_BUCKET;
        sourceFolder = FALLBACK_FOLDER_PATH;
      }
    }
    
    // If file is still not found in either bucket
    if (!jsonData) {
      return NextResponse.json(
        { 
          error: `Request file not found: ${fileName}`,
          message: `Searched in buckets: ${PRIMARY_BUCKET} and ${FALLBACK_BUCKET}`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jsonData,
      requestId,
      fileName,
      sourceBucket,
      sourceFolder,
      location: BUCKET_LOCATIONS[sourceBucket as keyof typeof BUCKET_LOCATIONS],
    });

  } catch (error) {
    console.error('Error retrieving request data:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 