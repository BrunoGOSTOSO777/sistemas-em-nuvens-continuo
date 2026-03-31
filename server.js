require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------------------------------------------
// 1. PÁGINA INICIAL (O Chat que você usa no Chrome)
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Chat com IA Sarcástica</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; margin-top: 50px; background: #f1f5f9; color: #1e293b; }
                .chat-box { background: white; width: 450px; margin: 0 auto; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #cbd5e1; }
                input { width: calc(100% - 24px); padding: 12px; margin-bottom: 15px; border: 2px solid #cbd5e1; border-radius: 8px; font-size: 16px; outline: none; transition: 0.3s; }
                input:focus { border-color: #6366f1; }
                button { width: 100%; padding: 12px; background: #6366f1; color: white; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; transition: 0.3s; }
                button:hover { background: #4f46e5; }
                #resposta { margin-top: 20px; text-align: left; padding: 15px; background: #e0e7ff; border-radius: 8px; min-height: 60px; color: #3730a3; font-size: 15px; border: 1px solid #c7d2fe; white-space: pre-wrap; word-wrap: break-word; }
            </style>
        </head>
        <body>
            <div class="chat-box">
                <h2 style="margin-top:0;">🤖 IA Sarcástica API</h2>
                <input type="text" id="pergunta" placeholder="O que você quer agora?">
                <button onclick="enviarPergunta()">Enviar para a API</button>
                <div id="resposta">Aguardando sua pergunta...</div>
            </div>

            <script>
                async function enviarPergunta() {
                    const perguntaTexto = document.getElementById('pergunta').value;
                    const divResposta = document.getElementById('resposta');
                    
                    if(!perguntaTexto) return alert('Digite algo!');
                    
                    divResposta.innerHTML = "<i>Processando... ⏳</i>";
                    
                    try {
                        const requisicao = await fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ pergunta: perguntaTexto })
                        });
                        
                        const dados = await requisicao.json();
                        
                        if(dados.erro) {
                            divResposta.innerHTML = "<b style='color:red;'>Erro:</b><br>" + dados.erro;
                        } else {
                            divResposta.innerHTML = "<b>🤖 IA:</b><br><br>" + dados.resposta;
                        }
                    } catch(e) {
                        divResposta.innerHTML = "<b style='color:red;'>Erro de conexão!</b>";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// ---------------------------------------------------------
// 2. ROTA DA API (Onde a mágica acontece)
// ---------------------------------------------------------
app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey || apiKey.includes("cole_sua_chave")) {
            return res.status(500).json({ erro: "Chave API não configurada no .env" });
        }

        const { pergunta } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Voltando para o modelo que funcionou para você
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        
        const promptFinal = `Você é um robô sarcástico e irônico. Responda: ${pergunta}`;
        
        const result = await model.generateContent(promptFinal);
        return res.status(200).json({ sucesso: true, resposta: result.response.text() });

    } catch (erro) {
        console.error("Erro:", erro.message);
        return res.status(500).json({ erro: erro.message });
    }
});

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
});