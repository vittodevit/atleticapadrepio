"use server"
import {GridFSBucket, MongoClient, ObjectId} from 'mongodb';
import sharp from "sharp";
import {getReadableStreamFromArrayBuffer, getReadableStreamFromBuffer} from "@/lib/utils";

const uri = process.env.MONGODB_URI || '';
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client between hot reloads
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!(global as unknown)._mongoClientPromise) {
    client = new MongoClient(uri);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (global as unknown)._mongoClientPromise = client.connect();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  clientPromise = (global as unknown)._mongoClientPromise; //TODO: porcata immensa!!!
} else {
  // In production, create a new client instance
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getGridFSBucket(): Promise<GridFSBucket> {
  const client = await clientPromise;
  return new GridFSBucket(client.db());
}

export async function getDownloadStream(id: string): Promise<ReadableStream<never>> {
  const objectId = new ObjectId(id);
  const client = await clientPromise;
  const bucket = new GridFSBucket(client.db());
  const dlStream = await bucket.openDownloadStream(objectId);
  return new ReadableStream({
    start(controller) {
      dlStream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      dlStream.on('end', () => {
        controller.close();
      });
      dlStream.on('error', (err) => {
        controller.error(err);
      });
    },
  });
}

export async function getFileName(id: string): Promise<string | undefined> {
  const objectId = new ObjectId(id);
  const client = await clientPromise;
  const md = await client.db().collection('fs.files').findOne({ _id: objectId });
  if (!md) {
    return undefined;
  }
  const { filename } = md;
  return filename;
}

export async function saveImage(imageFile: File): Promise<ObjectId> {
  // conversione immagine ottimizzata in webp
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

  const bucket = await getGridFSBucket();

  // strip the extension from the filename
  const fileName = imageFile.name.substring(0, imageFile.name.lastIndexOf('.')) + '.webp';
  const uploadStream = bucket.openUploadStream(fileName);
  const readable = getReadableStreamFromBuffer(webpBuffer);
  readable.pipe(uploadStream);

  return new Promise((resolve, reject) => {
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });
}

export async function saveGenericFile(file: File): Promise<ObjectId> {
  const bucket = await getGridFSBucket();
  const uploadStream = bucket.openUploadStream(file.name);
  const readable = getReadableStreamFromArrayBuffer(await file.arrayBuffer());
  readable.pipe(uploadStream);

  return new Promise((resolve, reject) => {
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });
}

export async function deleteFile(id: string): Promise<void> {
  const objectId = new ObjectId(id);
  const client = await clientPromise;
  const bucket = new GridFSBucket(client.db());
  await bucket.delete(objectId);
}