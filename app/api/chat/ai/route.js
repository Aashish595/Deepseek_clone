import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    // ✅ Proper way to extract response text
    const text = result.response.candidates[0].content.parts[0].text;

    return Response.json({
      success: true,
      data: {
        role: "assistant",
        content: text,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response("Gemini API Failed", { status: 500 });
  }
}
