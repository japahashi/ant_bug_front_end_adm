'use strict'

import { renderizarPagina, mostrarMensagem } from '../main.js'

const API_URL = 'http://localhost:8080/v1/planetaverde/admin/produto'

export function criarCadastroProduto(dados) {

    const produto = dados ? dados.produto : null
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

    // ── Grid: campos + imagem ─────────────────────
    const grid = document.createElement('div')
    grid.className = 'cadastro-grid'

    // Campos de texto
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
                    <option value="1">Fruta</option>
                </select>
            </div>
        </div>
    `

    // Caixa de imagem (preview local)
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

    inputImagem.onchange = (evento) => {
        const arquivo = evento.target.files[0]
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

    // ── Salvar ────────────────────────────────────
    btnSalvar.onclick = async () => {
        const nome = document.getElementById('cp-nome').value.trim()
        const descricao = document.getElementById('cp-descricao').value.trim()
        const detalhes = document.getElementById('cp-detalhes').value.trim()
        const categoria = document.getElementById('cp-categoria').value

        if (!nome) {
            mostrarMensagem('O nome é obrigatório.', 'erro')
            return
        }

        btnSalvar.textContent = 'Salvando...'
        btnSalvar.disabled = true

        const dadosProduto = { nome, descricao, detalhes, imagem: ''}

        try {
            let resposta

            if (modoEdicao) {
                resposta = await fetch(`${API_URL}/${produto.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosProduto)
                })
            } else {
                resposta = await fetch(`${API_URL}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosProduto)
                })
            }

            const dadosResposta = await resposta.json()
            console.log(dadosResposta)

            if (!resposta.ok) {
                throw new Error(
                    dadosResposta.message || JSON.stringify(dadosResposta)
                )
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
