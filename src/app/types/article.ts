// Types pour les articles de blog

export type ArticleBlockType = 'text' | 'quote' | 'image' | 'video';

export interface ArticleTextBlock {
  type: 'text';
  content: string;
}

export interface ArticleQuoteBlock {
  type: 'quote';
  content: string;
}

export interface ArticleImageBlock {
  type: 'image';
  src: string;
  caption?: string;
}

export interface ArticleVideoBlock {
  type: 'video';
  src: string;
  caption?: string;
  provider?: 'youtube' | 'vimeo' | 'direct';
}

export type ArticleBlock = ArticleTextBlock | ArticleQuoteBlock | ArticleImageBlock | ArticleVideoBlock;

export interface Article {
  id: string;
  created_at: string;
  updated_at: string;
  titre: string;
  slug: string;
  extrait: string;
  categorie: string;
  date: string; // Format ISO date
  banniere_url: string;
  contenu: ArticleBlock[];
  ordre: number;
  visible: boolean;
}

export interface ArticleFormData {
  titre: string;
  slug: string;
  extrait: string;
  categorie: string;
  date: string;
  banniere_url: string;
  contenu: ArticleBlock[];
  visible: boolean;
}
