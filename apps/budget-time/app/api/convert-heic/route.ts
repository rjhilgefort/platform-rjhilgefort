import { NextRequest, NextResponse } from 'next/server'
import heicConvert from 'heic-convert'
import { apiHandler } from '../../../lib/api-utils'

export const POST = apiHandler(async (request: Request) => {
  const formData = await (request as NextRequest).formData()
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
})
