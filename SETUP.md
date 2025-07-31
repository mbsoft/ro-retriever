# Route Optimization Request Retriever - Setup Guide

## Environment Variables Configuration

This application requires the following environment variables to be set in a `.env.local` file:

### Required Environment Variables

1. **GOOGLE_CLOUD_PROJECT_ID**
   - Your Google Cloud Project ID
   - Example: `my-route-optimization-project`

2. **GOOGLE_SERVICE_ACCOUNT_CREDENTIALS**
   - The complete JSON content of your Google Service Account key file
   - This should be the entire JSON object as a string
   - Example:
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "abc123...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
     "client_id": "123456789...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
   }
   ```

### Creating a .env.local file

1. Create a file named `.env.local` in the root directory of the project
2. Add the environment variables as follows:

```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project-id",...}
```

### Google Cloud Service Account Setup

1. Go to the Google Cloud Console
2. Navigate to IAM & Admin > Service Accounts
3. Create a new service account or use an existing one
4. Create a new key (JSON format)
5. Download the JSON key file
6. Copy the entire content of the JSON file as the value for `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`

### Required Permissions

Your service account needs the following permissions on the `nb-optimization-sgp` bucket:
- **Storage Object Viewer** (`roles/storage.objectViewer`)
- This allows reading files from the bucket

### Security Notes

- Never commit the `.env.local` file to version control
- The `.env.local` file is already included in `.gitignore`
- Keep your service account credentials secure
- Consider using Google Cloud's Application Default Credentials for production deployments

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables as described above

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a route optimization request ID in the input field
2. Click "Retrieve Request Data"
3. The application will fetch the corresponding `{requestId}-input.json` file from Google Cloud Storage
4. The JSON data will be displayed in a formatted view 