export type CoverLetterStyle = 'customized' | 'generic';

export interface CoverLetter {
  id: string;
  name: string;
  template: string | null;
  style: CoverLetterStyle;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterPayload {
  name: string;
  template?: string;
  style: CoverLetterStyle;
}
