export interface Resume {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumePayload {
  name: string;
}
