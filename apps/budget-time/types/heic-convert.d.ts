declare module 'heic-convert' {
  interface ConvertOptions {
    buffer: Buffer
    format: 'JPEG' | 'PNG'
    quality?: number
  }

  function convert(options: ConvertOptions): Promise<Uint8Array>

  export default convert
}
