import { BlobServiceClient } from '@azure/storage-blob';

const AzureStorage = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);

export const UploadImage = async (file) => {
    const containerClient = AzureStorage.getContainerClient('images');
    const fileName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(file.buffer);
    return fileName;
};

export const DeleteImage = async (fileName) => {
    const containerClient = AzureStorage.getContainerClient('images');
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.delete();
};

export const GetImage = async (fileName) => {
    const containerClient = AzureStorage.getContainerClient('images');
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const image = await blockBlobClient.download(0);

    return image;
};
