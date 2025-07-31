import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage client
const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '{}'),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const BUCKET_NAME = 'nb-optimization-sgp';
const FOLDER_PATH = 'api-auto-sgp/internal';

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

    // Construct the file path
    const fileName = `${requestId}-input.json`;
    const filePath = `${FOLDER_PATH}/${fileName}`;

    // Get the file from Google Cloud Storage
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(filePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json(
        { error: `Request file not found: ${fileName}` },
        { status: 404 }
      );
    }

    // Download and parse the file content
    const [fileContent] = await file.download();
    const jsonData = JSON.parse(fileContent.toString('utf8'));

    return NextResponse.json({
      success: true,
      data: jsonData,
      requestId,
      fileName,
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