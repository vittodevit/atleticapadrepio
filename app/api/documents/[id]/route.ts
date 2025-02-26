import { NextRequest, NextResponse } from 'next/server';
import {PrismaClient, TipoSocio} from '@prisma/client';
import { getDownloadStream, getFileName } from '@/lib/gridfs';
import {auth} from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: "Database is unavailable during build" });
  }
  const prisma = new PrismaClient();

  const { id } = await params;
  const session = await auth();

  if (!id) {
    return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
  }

  if (!session) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const documento = await prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (session.user.role !== TipoSocio.ADMIN && !documento.tipoSociDestinatari.includes(session.user.role)) {
      return NextResponse.json({error: 'Forbidden'}, {status: 403});
    }

    const downloadStream = await getDownloadStream(documento.objectId);
    const fileName = (await getFileName(documento.objectId)) || `null.bin`;

    const headers = new Headers();
    headers.set('Content-Type', documento.mimeType);
    headers.set('Content-Disposition', `inline; filename="${fileName}"`);

    return new NextResponse(downloadStream, {
      headers,
    });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}