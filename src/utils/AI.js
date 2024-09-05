import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC6RJY6V4J1R0qx05jKhVuCb5SeNHSCpQc";  // Replace with your actual API key

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

export async function getAIResponse(input) {
    try {
        const prompt = input;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();  // Ensure text() is awaited correctly

        return text;
        
    } catch (error) {
        console.error("Error generating AI response:", error);
    }
}
