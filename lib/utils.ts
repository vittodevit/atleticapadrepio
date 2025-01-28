import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Readable } from 'stream';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReadableStreamFromBuffer(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Signal that the stream has ended
  return stream;
}

export function niceTimestamp(data: Date): string {
  const day = String(data.getDate()).padStart(2, '0');
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const year = String(data.getFullYear()).slice(-2);
  const hours = String(data.getHours()).padStart(2, '0');
  const minutes = String(data.getMinutes()).padStart(2, '0');
  const seconds = String(data.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}