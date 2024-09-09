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
    const url = `https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/${palavra}/`;

    if (loading) {
        // Exibe o loader
        loading.style.display = 'block';
        resultContainer.innerHTML = ''; // Limpa os resultados anteriores
    }

    try {
        const dados = await requisicao(url);

        const parser = new DOMParser();
        const doc = parser.parseFromString(dados, 'text/html');
        const content = doc.querySelector("#content");
        console.log(content)

        if (content) {
            const html = `
                <div class="titulo">
                    
                </div>
                <div class="conteudo">
                    ${content.innerHTML}
                </div>
            `;

            $("#result").html(html);

            // Atualizar o botão de áudio para ler o novo texto
            const audioButton = document.getElementById("audio-button");
            audioButton.onclick = function () {
                const speechText = `${content.innerText}`;
                lerTexto(speechText);
            };
        } else {
            const parser = new DOMParser();
            const notfound = parser.parseFromString(dados, 'text/html');

            const content = notfound.querySelector("#content");
            // console.log(content.querySelector(".card"))
            // const content = doc.querySelector(".significado");

            const html = `
            <div>
                ${content.querySelector(".card").innerHTML}
            </div>`

            $("#result").html(html);
        }

    } catch (erro) {
        console.error(erro);
        $("#result").html("<p>Erro ao buscar a palavra.</p>");
    }finally {
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

        const sugestoes_lista = document.querySelector("#sugestoes-lista");
        if (sugestoes_lista) {
            const items = sugestoes_lista.querySelectorAll("a")
            items.forEach((a, index) => {
                a.href = "#"
                a.onclick = async (event) => {
                    // cal<ei>1</ei>
                    // alert(a.innerHTML)
                    document.getElementById('search-input').value = a.innerHTML;
                    await buscarPalavra(a.innerHTML);
                }
            })
        } else {
            console.log("Sugestões não Encontradas...")
        }

    } else {
        alert("Por favor, digite uma palavra!");
    }
});

// // Exemplo inicial: buscar a palavra "amor"
// buscarPalavra('amoasr');