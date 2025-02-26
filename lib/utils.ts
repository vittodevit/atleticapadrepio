import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Readable } from 'stream';
import { convert } from 'html-to-text';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReadableStreamFromBuffer(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Signal that the stream has ended
  return stream;
}

export function getReadableStreamFromArrayBuffer(arrayBuffer: ArrayBuffer): Readable {
  const buffer = Buffer.from(arrayBuffer);
  return getReadableStreamFromBuffer(buffer);
}

export function niceTimestamp(data: Date): string {
  const day = String(data.getDate()).padStart(2, '0');
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const year = String(data.getFullYear());
  const hours = String(data.getHours()).padStart(2, '0');
  const minutes = String(data.getMinutes()).padStart(2, '0');
  const seconds = String(data.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function dateToHtml(data: Date | null | undefined) {
  if (data === null || data === undefined) {
    return '';
  }
  return data.toISOString().split('T')[0];
}

export function toNiceDateNoTime(data: Date | undefined): string {
  if(data == undefined) {
    return '';
  }
  const day = String(data.getDate()).padStart(2, '0');
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const year = String(data.getFullYear());
  return `${day}/${month}/${year}`;
}

function stripHtml(html: string): string {
  return convert(html, {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { ignoreHref: true } },
    ],
  });
}

function ellipsize(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

export function generateEllipsizedText(htmlContent: string, maxLength: number): string {
  const plainText = stripHtml(htmlContent);
  return ellipsize(plainText, maxLength);
}