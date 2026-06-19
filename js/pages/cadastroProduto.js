'use strict'

import { renderizarPagina, mostrarMensagem } from '../main.js'
import { uploadParaCloudinary } from '../cloudinary.js'

const API_URL = 'http://localhost:8080/v1/planetaverde/admin'

export function criarCadastroProduto(dados) {

    const produto = dados ? dados.produto : null
    console.log(produto)
    const modoEdicao = produto != null


    const pagina = document.createElement('div')
    pagina.className = 'pagina-cadastro'

    const card = document.createElement('div')
    card.className = 'pagina-card'


    const topo = document.createElement('div')
    topo.className = 'topo-pagina'

    const titulo = document.createElement('h2')
    titulo.textContent = modoEdicao ? 'Editar Produto' : 'Cadastro de Produtos'

    const btnVoltar = document.createElement('button')
    btnVoltar.type = 'button'
    btnVoltar.className = 'btn-secundario'
    btnVoltar.textContent = '← Voltar'
    btnVoltar.onclick = () => renderizarPagina('produtos')

    const btnSalvar = document.createElement('button')
    btnSalvar.type = 'button'
    btnSalvar.className = 'btn-principal'
    btnSalvar.textContent = 'Salvar'

    const botoesTopo = document.createElement('div')
    botoesTopo.className = 'botoes-topo'
    botoesTopo.append(btnVoltar, btnSalvar)

    topo.append(titulo, botoesTopo)

    const grid = document.createElement('div')
    grid.className = 'cadastro-grid'

    const subcategoriasPorCategoria = {
        1: ['Grãos', 'Doces Veganos', 'Congelados'],
        2: ['Batons', 'Cremes Faciais', 'Protetor Solar'],
        3: ['Camisetas', 'Calçados', 'Casacos'],
        4: ['Lava-Louças', 'Sabão em Pó', 'Desinfetante'],
        5: ['Shampoo Sólido', 'Desodorante', 'Creme Dental'],
        6: ['Bolsas', 'Cintos', 'Carteiras']
    }

    const campos = document.createElement('div')
    campos.innerHTML = `
        <div class="campo-texto">
            <label>Nome</label>
            <input type="text" id="cp-nome" value="${modoEdicao ? produto.nome : ''}">
        </div>
        <div class="campo-texto">
            <label>Descrição</label>
            <input type="text" id="cp-descricao" value="${modoEdicao ? (produto.descricao || '') : ''}">
        </div>
        <div class="campo-texto">
            <label>Detalhes</label>
            <textarea id="cp-detalhes">${modoEdicao ? (produto.detalhes || '') : ''}</textarea>
        </div>
        <div class="grid-categorias">
            <div class="campo-select">
                <label>Categorias</label>
                <select id="cp-categoria" size="6">
                    <option value="1">Alimento</option>
                    <option value="2">Cosméticos</option>
                    <option value="3">Vestuário</option>
                    <option value="4">Limpeza</option>
                    <option value="5">Higiene Pessoal</option>
                    <option value="6">Acessórios</option>
                </select>
            </div>
            <div class="campo-select">
                <label>SubCategoria</label>
                <select id="cp-subcategoria" size="6">
                    <option value="">Selecione uma categoria</option>
                </select>
            </div>
        </div>
    `
function atualizarSubcategorias() {
        const categoriaSelecionada = campos.querySelector('#cp-categoria').value
        const selectSubcategoria = campos.querySelector('#cp-subcategoria')

        const opcoes = subcategoriasPorCategoria[categoriaSelecionada] || []

        if (opcoes.length === 0) {
            selectSubcategoria.innerHTML = '<option value="">Selecione uma categoria</option>'
            return
        }

        selectSubcategoria.innerHTML = opcoes
            .map((nome, index) => `<option value="${index + 1}">${nome}</option>`)
            .join('')
    }

    campos.querySelector('#cp-categoria').addEventListener('change', atualizarSubcategorias)

    if (modoEdicao && produto) {
        const selectCategoria = campos.querySelector('#cp-categoria')
        const selectSubcategoria = campos.querySelector('#cp-subcategoria')

        if (produto.categoriaNome) {
            for (let i = 0; i < selectCategoria.options.length; i++) {
                if (selectCategoria.options[i].text === produto.categoriaNome) {
                    selectCategoria.selectedIndex = i
                    break
                }
            }

            atualizarSubcategorias()

            if (produto.subcategoriaNome) {
                for (let i = 0; i < selectSubcategoria.options.length; i++) {
                    if (selectSubcategoria.options[i].text === produto.subcategoriaNome) {
                        selectSubcategoria.selectedIndex = i
                        break
                    }
                }
            }
        }
    }

    const caixaImagem = document.createElement('div')
    caixaImagem.className = 'caixa-imagem'

    const inputImagem = document.createElement('input')
    inputImagem.type = 'file'
    inputImagem.id = 'cp-imagem'
    inputImagem.accept = 'image/*'

    const imgPreview = document.createElement('img')
    imgPreview.className = 'preview'
    imgPreview.id = 'preview-imagem'
    if (modoEdicao && produto.imagem) {
        imgPreview.src = produto.imagem
        imgPreview.style.display = 'block'
    }

    const textoUpload = document.createElement('div')
    textoUpload.className = 'texto-upload'
    textoUpload.id = 'texto-upload'
    textoUpload.innerHTML = '🖼️<br><br>Clique para<br>adicionar imagem'
    if (modoEdicao && produto.imagem) textoUpload.style.display = 'none'

    inputImagem.onchange = () => {
        const arquivo = inputImagem.files[0]

        if (arquivo) {
            imgPreview.src = URL.createObjectURL(arquivo)
            imgPreview.style.display = 'block'
            textoUpload.style.display = 'none'
        }
    }

    caixaImagem.append(inputImagem, imgPreview, textoUpload)

    grid.append(campos, caixaImagem)
    card.append(topo, grid)
    pagina.appendChild(card)

    btnSalvar.onclick = async () => {
        const nome = document.getElementById('cp-nome').value.trim()
        const descricao = document.getElementById('cp-descricao').value.trim()
        const detalhes = document.getElementById('cp-detalhes').value.trim()
        const categoria = document.getElementById('cp-categoria').value
        const arquivo = document.getElementById('cp-imagem').files[0] 

        if (!nome) {
            mostrarMensagem('O nome é obrigatório.', 'erro')
            return
        }
        if (!categoria) {
            mostrarMensagem('Por favor, selecione uma categoria.', 'erro')
            return
        }

        if (!modoEdicao && !arquivo) {
            mostrarMensagem('A imagem do produto é obrigatória.', 'erro')
            return
        }

        if (arquivo) {
            const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
            const tamanhoMaximo = 2 * 1024 * 1024 // 2MB em Bytes

            if (!tiposPermitidos.includes(arquivo.type)) {
                mostrarMensagem('Formato inválido! Escolha uma imagem JPG, PNG ou WEBP.', 'erro')
                return
            }

            if (arquivo.size > tamanhoMaximo) {
                mostrarMensagem('A imagem é muito pesada! O limite máximo é de 2MB.', 'erro')
                return
            }
        }

        btnSalvar.textContent = 'Salvando...'
        btnSalvar.disabled = true

        try {
            let urlImagem = modoEdicao ? produto.imagem : ''

            if (arquivo) {
                urlImagem = await uploadParaCloudinary(arquivo)
            }

            const formData = new FormData()
            formData.append('nome', nome)
            formData.append('descricao', descricao)
            formData.append('detalhes', detalhes)
            formData.append('imagem', urlImagem)

            let resposta

            if (modoEdicao) {
                resposta = await fetch(`${API_URL}/produto/${produto.id}`, {
                    method: 'PUT',
                    body: formData
                })
            } else {
                resposta = await fetch(`${API_URL}/produto`, {
                    method: 'POST',
                    body: formData
                })
            }

            const dadosResposta = await resposta.json()

            if (!resposta.ok) {
                throw new Error(dadosResposta.message || JSON.stringify(dadosResposta))
            }

            const idProduto = modoEdicao ? produto.id : dadosResposta.response.id

            if (modoEdicao) {
                await fetch(`${API_URL}/categoria-produto/produto/${idProduto}`, {
                    method: 'DELETE'
                })
            }
            const formDataVinculo = new FormData()
            formDataVinculo.append('id_categoria', categoria)
            formDataVinculo.append('id_produto', idProduto)

            const respostaVinculo = await fetch(`${API_URL}/categoria-produto`, {
                method: 'POST',
                body: formDataVinculo
            })

            const dadosVinculo = await respostaVinculo.json()

            if (!dadosVinculo.status) {
                mostrarMensagem('Produto salvo, mas houve um erro ao vincular a categoria.', 'erro')
                return
            }

            mostrarMensagem(modoEdicao ? 'Produto atualizado!' : 'Produto cadastrado!')
            renderizarPagina('produtos')

        } catch (erro) {
            mostrarMensagem(erro.message, 'erro')
            btnSalvar.textContent = 'Salvar'
            btnSalvar.disabled = false
        }
    }

    return pagina
}