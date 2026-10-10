import { NextRequest, NextResponse } from 'next/server';
import { verifyDownloadToken } from '@/lib/token';
import { digitalProducts } from '@/data/digital-products';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ ok: false, error: 'Download token is required.' }, { status: 400 });
  }

  const { valid, slug } = verifyDownloadToken(token);

  if (!valid || !slug) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or expired download token. Please contact hello.nexvanta56@gmail.com for assistance.' },
      { status: 403 }
    );
  }

  const product = digitalProducts.find((p) => p.slug === slug);
  if (!product) {
    return NextResponse.json({ ok: false, error: 'Product not found.' }, { status: 404 });
  }

  if (!product.fileUrl) {
    // When fileUrl is empty (placeholder), return a downloadable txt confirmation
    const content = `Nexvanta.AI Digital Access Confirmation\nProduct: ${product.title}\nStatus: Confirmed\n\nYour digital asset package is being provisioned. Please check your email or message us at hello.nexvanta56@gmail.com / WhatsApp: +91 97131 03152.`;
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${product.slug}-access.txt"`,
      },
    });
  }

  return NextResponse.redirect(product.fileUrl, 302);
}
