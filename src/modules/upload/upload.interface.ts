export interface UploadFileRequest {
  fileName: string
  fileType: string
  body: Buffer
}

export interface UploadedFile {
  id: string
  title: string
  url: string
}
