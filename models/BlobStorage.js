import { BlobServiceClient } from '@azure/storage-blob';

const BlobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);

export default BlobServiceClient;
