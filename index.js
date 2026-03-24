// 1. Carrega as bibliotecas necessárias
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require('readline'); // Cria a interface de chat no terminal
const fs = require('fs'); // Permite salvar arquivos no computador
const PDFDocument = require('pdfkit'); // Biblioteca que gera o PDF

// 2. Verifica a chave de segurança
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERRO: Chave da API não encontrada.");
    process.exit(1);
}

// 3. Configura a IA
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// 4. Configura a Interface do Terminal (O Chat)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 5. Função Mágica que cria o PDF
function gerarPDF(perguntaUsuario, respostaIA) {
    const doc = new PDFDocument();
    
    // Cria um nome de arquivo único baseado na hora atual
    const nomeArquivo = `Resposta_IA_${Date.now()}.pdf`; 
    
    // Diz para onde o PDF vai ser salvo
    doc.pipe(fs.createWriteStream(nomeArquivo)); 
    
    // Escreve o conteúdo dentro do PDF
    doc.fontSize(18).text('Relatório do Agente IA - Narrador Esportivo', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`👤 VOCÊ PERGUNTOU:`);
    doc.fontSize(12).text(perguntaUsuario);
    doc.moveDown();
    doc.fontSize(14).text(`🎙️ RESPOSTA DA IA:`);
    doc.fontSize(12).text(respostaIA);
    
    // Finaliza e salva o arquivo
    doc.end(); 
    
    console.log(`\n📄 PDF gerado com sucesso! Arquivo salvo como: ${nomeArquivo}`);
}

// 6. Função principal que faz as perguntas
function iniciarChat() {
    // Fica aguardando o usuário digitar algo
    rl.question('\n🎤 Digite um assunto para o Narrador (ou digite "sair" para encerrar): ', async (pergunta) => {
        
        // Se o usuário digitar "sair", o programa fecha
        if (pergunta.toLowerCase() === 'sair') {
            console.log("🏁 Fim de jogo! O árbitro apita e termina a partida!");
            rl.close();
            return;
        }

        try {
            console.log("⏳ O narrador está puxando o fôlego...");

            // Juntamos a personalidade com a pergunta que você digitou
            const promptComPersona = `Aja como um narrador de futebol brasileiro muito empolgado. Explique o seguinte assunto de forma rápida e gritando muito: ${pergunta}`;

            // Pede a resposta para o Google
            const result = await model.generateContent(promptComPersona);
            const resposta = result.response.text();

            console.log("\n🎙️ [AGENTE GEMINI]:");
            console.log(resposta);

            // Chama a função que salva o PDF passando o que rolou na conversa!
            gerarPDF(pergunta, resposta);

        } catch (erro) {
            console.error("❌ Ocorreu um erro:", erro.message);
        }

        // Chama a função de novo para fazer um "loop" infinito até a pessoa digitar "sair"
        iniciarChat();
    });
}

// Mensagem de boas-vindas e inicio do programa
console.log("⚽ BEM-VINDO AO CHAT DO NARRADOR ESPORTIVO DA IA!");
iniciarChat();