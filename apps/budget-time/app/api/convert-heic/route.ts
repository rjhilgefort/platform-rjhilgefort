import { NextRequest, NextResponse } from 'next/server'
import heicConvert from 'heic-convert'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const jpegBuffer = await heicConvert({
      buffer,
      format: 'JPEG',
      quality: 0.9,
    })

    const base64 = `data:image/jpeg;base64,${Buffer.from(jpegBuffer).toString('base64')}`

    return NextResponse.json({ base64 })
  } catch (err) {
    console.error('HEIC conversion error:', err)
    return NextResponse.json({ error: 'Failed to convert image' }, { status: 500 })
  }
}
