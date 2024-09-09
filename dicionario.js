$(document).ready(function () {

    // Função assíncrona para fazer uma requisição usando fetch
    async function requisicao(dados) {
        try {

            const script = dados.map((item) => {
                return {
                    "_ativo":item.ativo,
                    "_servidor":item.servidor,
                    "_script":item.script
                }
            })
           
            script.forEach(dicionario => {
                
                $.ajax({
                    url: dicionario._script,
                    method: "GET",
                    cache: false,
                    success: (data) => {
                        // console.log(data)
                        
                    },
                    error: (error) => {
                        console.error('Erro:', error);
                        $('#result').html('<p>Erro ao carregar os dados</p>');
                    }
                });

            });
          
        } catch (error) {
            console.error('Erro:', error);
            return null;
        }
    }

    // Função para carregar dados do servidor usando AJAX com jQuery
    function servidores() {
        $.ajax({
            url: "dicionario.json",
            method: "GET",
            cache: false,
            success: (data) => {
                const select = $(".servidores");
                
                // Preenche o select com opções de servidores
                select.html(
                    data.map((items) => {
                        return `<option value="${items.servidor}">${items.servidor}</option>`;
                    })
                );

                // Verifica se há um servidor salvo no localStorage
                const dicionarioServido = localStorage.getItem("dicionario-servido");
                if (dicionarioServido) {
                    select.val(dicionarioServido);
                }

                // Filtra e carrega os dados do servidor atual
                const servidor = data.filter((servidorInfo) => servidorInfo.servidor === select.val());
                // console.log('Servidor atual:', servidor);

                // Atualiza o servidor ao mudar a seleção
                select.change(function () {
                    const selectedServidor = $(this).val();
                    localStorage.setItem("dicionario-servido", selectedServidor); // Salva o servidor no localStorage
                    const novoServidor = data.filter((servidorInfo) => servidorInfo.servidor === selectedServidor);
                    window.location.reload();
                    // console.log('Servidor selecionado:', novoServidor);
                    // Você pode realizar outras ações com os dados do servidor aqui.
                });
                
                requisicao(servidor)
            },
            error: (error) => {
                console.error('Erro:', error);
                $('#result').html('<p>Erro ao carregar os dados</p>');
            }
        });
    }

    // Executa a função para carregar os servidores
    servidores();
});
