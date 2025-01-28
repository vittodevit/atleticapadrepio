import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDownloadStream, getFileName } from '@/lib/gridfs';

const prisma = new PrismaClient();

export const dynamic = 'force-static';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
  }

  try {
    const image = await prisma.immagine.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const downloadStream = await getDownloadStream(image.objectId);
    const fileName = (await getFileName(image.objectId)) || `${image.objectId}.webp`;

    const headers = new Headers();
    headers.set('Content-Type', 'image/webp');
    headers.set('Content-Disposition', `inline; filename="${fileName}"`);

    return new NextResponse(downloadStream, {
      headers,
    });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}