export interface ISearchResult {
    title: string;
    url: string;
    description: string;
    date: string;
    keyword: string;
    selected?: boolean;
    results?: any;
    scrapedContent?: IScrapedContent;
}

export interface IScrapedContent {
    title: string;
    description: string;
    metaData: { [key: string]: string };
    article: string[];
    datePublished?: string;
    author?: string;
    wordCount?: number;
}

export interface ISummary{
    title: string;
    summary: string;
    url: string;
}

export interface ISummaryResult {
  summaries: ISummary[];
  searchQuery: string;
}

export interface IArticle {
  title: string;
  description: string;
  article: string;
  url?: string;
}