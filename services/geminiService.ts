
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function removePeopleFromImage(base64Image: string, mimeType: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    const prompt = "Bu resimdeki tüm insanları kaldır. Arka planı orijinaline sadık kalarak ve doğal bir şekilde doldur. Sadece işlenmiş resmi döndür, başka metin veya açıklama ekleme.";

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return part.inlineData.data;
                }
            }
        }
        
        throw new Error("Yapay zeka modelinden geçerli bir resim yanıtı alınamadı.");

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Yapay zeka modeliyle iletişim kurarken bir sorun oluştu.");
    }
}
