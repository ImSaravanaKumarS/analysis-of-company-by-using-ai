
import { GoogleGenAI } from "@google/genai";
import type { AnalysisData, GroundingChunk, NewsArticle } from "../types";
import { GEMINI_MODEL } from "../constants";

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getIndianFinancialNews = async (existingHeadlines: string[] = []): Promise<NewsArticle[]> => {
  const prompt = `
    You are a financial news analyst. Your task is to provide a list of 5 major financial and company-related news headlines from India for today.
    ${existingHeadlines.length > 0 ? `You MUST avoid any headlines that are similar to the ones already provided in this list: ${JSON.stringify(existingHeadlines)}` : ''}
    You MUST respond with only a valid JSON object that adheres to the following structure. Do not include any text, markdown, or any other characters outside of the JSON object.

    The JSON object should be an array of objects, where each object has the following properties:
    - "headline": A string containing the news headline.
    - "summary": An array of strings, with each string being a concise key point summarizing the news (aim for 3-4 points).
    - "source": A string containing the full source URL of the news article.
  
    If you cannot find 5 new, distinct headlines, return an empty array [].
  `;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  let jsonText = response.text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.substring(7, jsonText.length - 3).trim();
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.substring(3, jsonText.length - 3).trim();
  }
  
  try {
    const news: NewsArticle[] = JSON.parse(jsonText);
    return news;
  } catch (e) {
    console.error("Failed to parse JSON response for news from Gemini:", jsonText);
    throw new Error("The AI returned an invalid data format for news.");
  }
};

export const getCompanyAnalysis = async (companyName: string): Promise<{ analysis: AnalysisData; searchResults: GroundingChunk[] | undefined }> => {
  const prompt = `
    Conduct a comprehensive financial and operational analysis for the company: "${companyName}".
    Based on the company's primary country of operation, you MUST determine the appropriate currency and use it for all financial values (stock price, revenue).
    You MUST respond with only a valid JSON object that adheres to the following structure. Do not include any text, markdown, or reference numbers in your response.

    The JSON object should have the following properties:
    - "countryOfOrigin": A string with the company's primary country of operation (e.g., "India", "USA").
    - "currencySymbol": A string with the appropriate currency symbol for that country (e.g., "₹", "$", "€").
    - "sentimentScore": A numerical score from -1.0 (very negative) to 1.0 (very positive) representing the overall market and news sentiment for the company. 0.0 is neutral.
    - "sentimentReasoning": An array of strings explaining the key factors (positive and negative) that contributed to the sentiment score, based on recent news, financial reports, and market trends.
    - "futureScope": An array of strings detailing potential future growth, expansion plans, and market opportunities.
    - "whyInvest": An array of strings with compelling reasons to invest in the company.
    - "limitations": An array of strings outlining potential risks, challenges, and limitations.
    - "predictions": An array of strings with AI-driven predictions about the company's future performance and stock trends.
    - "historicalData": An array of objects representing the stock price for the last 30 days. Each object must have a "date" (YYYY-MM-DD format) and a "price" (as a number in the determined currency).
    - "visualSummaryPrompt": A single, concise, and visually rich string prompt for an AI image generator to create a symbolic representation of the company's current state and future outlook.
    - "quarterlyRevenue": An array of objects for the last 4 quarters. Each object must have a "period" (e.g., "Q1 2024") and "revenue" (in millions of the determined currency, as a number).
    - "annualRevenue": An array of objects for the last 3 years. Each object must have a "period" (e.g., "2023") and "revenue" (in millions of the determined currency, as a number).
    - "ongoingProjects": An array of strings listing key ongoing projects.
    - "upcomingProjects": An array of strings listing announced upcoming projects.
    - "upcomingBids": An array of strings listing significant upcoming bids or contracts the company is competing for.
    - "investorDetails": An array of strings listing major institutional or individual investors.
    - "visualInsights": An array of strings listing key insights that can be visualized from the data.
    - "majorNews": An array of strings listing recent major news headlines or events impacting the company.
    - "references": An array of strings listing key references or sources used in the analysis.
    
    Use Google Search to find the most up-to-date information, focusing on the current year. Ensure all financial data is as recent as possible and presented in the correct local currency. The string arrays should contain clean, readable points without any reference markers like [1], [2], etc.
  `;

  // Fix: Call the Gemini API using generateContent with Google Search tool enabled.
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  // Fix: Extract and parse the JSON text from the response.
  let jsonText = response.text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.substring(7, jsonText.length - 3).trim();
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.substring(3, jsonText.length - 3).trim();
  }

  try {
    const analysisResult: AnalysisData = JSON.parse(jsonText);
    const searchResults = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { analysis: analysisResult, searchResults };
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", jsonText);
    throw new Error("The AI returned an invalid data format. Please try again.");
  }
};

export const generateAnalysisVisual = async (prompt: string): Promise<string> => {
    // Fix: Call the Gemini API to generate an image using the specified model.
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed, no images were returned.");
    }
    
    // Fix: Extract the base64 image data from the response.
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
};
