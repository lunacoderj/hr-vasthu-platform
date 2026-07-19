export interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  language: string; // 'en', 'te', etc.
  pages: number;
  category: string;
  isFree: boolean;
  price?: number;
}
