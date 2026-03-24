// 1. Carrega o sistema de segurança (lê o arquivo .env)
require('dotenv').config();

// 2. Importa a biblioteca do Google Gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 3. Verifica se a chave foi carregada corretamente
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERRO: Chave da API não encontrada. Verifique seu arquivo .env!");
    process.exit(1);
}

// 4. Conecta com a IA usando a sua chave secreta
const genAI = new GoogleGenerativeAI(apiKey);

async function executarAgente() {
    try {
        console.log("⏳ Conectando aos servidores do Google...");

        // 5. Escolhe o modelo de IA que vamos usar
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        // 6. ENGENHARIA DE PROMPT (Critérios de Aceite 1 e 2)
        // Conceito: O que é uma API. 
        // Persona: Narrador de futebol brasileiro empolgado.
        const prompt = "Explique o que é uma API (Application Programming Interface) em exatamente um parágrafo curto. Aja e fale como se você fosse um narrador de futebol brasileiro extremamente empolgado, dramático e gritando como se estivesse narrando um gol na final de um campeonato.";

        // 7. Envia a pergunta e espera (await) a resposta
        const result = await model.generateContent(prompt);
        const resposta = result.response.text();

        console.log("\n🎙️ [AGENTE GEMINI - NARRADOR ESPORTIVO]:");
        console.log(resposta);
        console.log("\n✅ Missão Concluída com Sucesso!");

    } catch (erro) {
        console.error("❌ Ocorreu um erro na conexão:", erro.message);
    }
}

// Roda o sistema
executarAgente();