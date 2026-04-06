import { NextRequest, NextResponse } from "next/server"

// Gemini free tier como primário, OpenRouter como fallback
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  )

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta"
}

async function callOpenRouter(
  prompt: string,
  apiKey: string,
  model: string
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "Você é o LotoLogic AI, um assistente especializado em loterias da CAIXA. Analise dados, sugira estratégias baseadas em estatística e responda em português brasileiro. Nunca prometa prever resultados.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || "Sem resposta"
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()
    if (!prompt) {
      return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 })
    }

    const geminiKey = process.env.GEMINI_API_KEY
    const openrouterKey = process.env.OPENROUTER_API_KEY

    let response: string

    // Tenta Gemini primeiro (grátis)
    if (geminiKey) {
      try {
        response = await callGemini(prompt, geminiKey)
        return NextResponse.json({ response, provider: "gemini" })
      } catch {
        console.warn("Gemini falhou, tentando fallback...")
      }
    }

    // Fallback: OpenRouter (modelos gratuitos)
    if (openrouterKey) {
      const fallbackModel =
        process.env.AI_MODEL_FALLBACK || "deepseek/deepseek-chat-v3-0324:free"
      response = await callOpenRouter(prompt, openrouterKey, fallbackModel)
      return NextResponse.json({ response, provider: "openrouter" })
    }

    return NextResponse.json(
      { error: "Nenhuma API de IA configurada" },
      { status: 503 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
