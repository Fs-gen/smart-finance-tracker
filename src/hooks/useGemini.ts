import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const cleanJsonResponse = (text: string): string => {
  // Remove markdown code blocks and any extra whitespace
  return text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
};

export const useGemini = () => {
  const analyzeTransaction = async (text: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `Analisis transaksi keuangan berikut dan ekstrak informasi dalam format JSON:
      "${text}"
      
      Format JSON yang diinginkan:
      {
        "type": "income" atau "expense",
        "amount": angka (tanpa Rp dan separator),
        "description": "deskripsi transaksi",
        "category": "kategori yang sesuai dari: housing, transportation, food, utilities, insurance, healthcare, savings, personal, entertainment, salary, business, investment, gift, other",
        "date": "YYYY-MM-DD" (hari ini jika tidak disebutkan)
      }
      
      Contoh input: "Belanja makanan di supermarket Rp 150.000"
      Contoh output: {
        "type": "expense",
        "amount": 150000,
        "description": "Belanja makanan di supermarket",
        "category": "food",
        "date": "2024-03-20"
      }
      
      Berikan HANYA output JSON, tanpa komentar atau teks tambahan.`;

      const result = await model.generateContent(prompt + "\n\n" + text);
      const response = await result.response;
      const jsonStr = cleanJsonResponse(response.text());
      
      try {
        return JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing JSON response:', jsonStr, parseError);
        throw new Error('Invalid JSON response from Gemini');
      }
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      throw error;
    }
  };

  return { analyzeTransaction };
};