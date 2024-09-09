async function requisicao(url) {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const fullUrl = proxyUrl + url;

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados.');
        }
        const data = await response.json();
        return data.contents;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

async function buscarPalavra(palavra) {
    const loading = document.getElementById('loader');
    const resultContainer = document.getElementById('result');
    const url = `https://www.dicio.com.br/${palavra}/`;

    if (loading) {
        // Exibe o loader antes de iniciar a busca
        loading.style.display = 'block';
        resultContainer.innerHTML = ""; // Limpa os resultados anteriores
    }

    try {
        const dados = await requisicao(url);

        const parser = new DOMParser();
        const doc = parser.parseFromString(dados, 'text/html');
        const titulo = doc.querySelector(".tit-significado");
        const content = doc.querySelector(".significado");

        if (titulo && content) {
            const html = `
                <div class="titulo">
                    ${titulo.innerHTML}
                </div>
                <div class="conteudo">
                    ${content.innerHTML}
                </div>
            `;

            $("#result").html(html);

            // Atualizar o botão de áudio para ler o novo texto
            const audioButton = document.getElementById("audio-button");
            audioButton.onclick = function () {
                const speechText = `${titulo.innerText}, ${content.innerText}`;
                lerTexto(speechText);
            };
        } else {
            const notfound = parser.parseFromString(dados, 'text/html');
            const content = notfound.querySelector("#content");

            const html = `
                <div>
                    ${content.querySelector(".card").innerHTML}
                </div>
            `;
            $("#result").html(html);
        }
    } catch (erro) {
        console.error(erro);
        $("#result").html("<p>Erro ao buscar a palavra.</p>");
    } finally {
        if (loading) {
            // Esconde o loader após a busca ser concluída (com sucesso ou erro)
            loading.style.display = 'none';
        }
    }
}


// Função para ler o texto em voz alta
function lerTexto(texto) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    synth.speak(utterance);
}

// Conectar o botão de pesquisa ao evento click
document.getElementById('search-button').addEventListener('click', async function () {
    const palavra = document.getElementById('search-input').value.trim();
    if (palavra) {
        await buscarPalavra(palavra);

        const listaProcurar = document.querySelector("#enchant");
        if (listaProcurar) {
            const a = listaProcurar.querySelectorAll("._sugg")
            a.forEach((ancho, index) => {
                // console.log(ancho)
                ancho.href = "#"
                ancho.onclick = async (event) => {
                    
                    // alert(link.innerHTML)
                    const link = ancho.querySelector(".list-link")
                    document.getElementById('search-input').value = link.innerHTML;
                    await buscarPalavra(link.innerHTML);

                }
            })
        }

    } else {
        alert("Por favor, digite uma palavra!");
    }
});

// // Exemplo inicial: buscar a palavra "amor"
// buscarPalavra('amoasr');