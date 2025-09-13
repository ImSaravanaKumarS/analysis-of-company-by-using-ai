
export interface StockDataPoint {
  date: string;
  price: number;
}

export interface RevenueDataPoint {
  period: string;
  revenue: number; // in millions
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}

export interface NewsArticle {
  headline: string;
  summary: string[];
  source: string;
}

export interface AnalysisData {
  futureScope: string[];
  whyInvest: string[];
  limitations: string[];
  predictions: string[];
  historicalData: StockDataPoint[];
  visualSummaryPrompt: string;
  quarterlyRevenue: RevenueDataPoint[];
  annualRevenue: RevenueDataPoint[];
  ongoingProjects: string[];
  upcomingProjects: string[];
  upcomingBids: string[];
  investorDetails: string[];
  visualInsights: string[];
  majorNews: string[];
  references: string[];
  countryOfOrigin: string;
  currencySymbol: string;
  sentimentScore: number;
  sentimentReasoning: string[];
  searchResults?: GroundingChunk[];
}
