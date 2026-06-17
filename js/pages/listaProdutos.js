'use strict'

import { renderizarPagina, mostrarMensagem } from '../main.js'

export function criarProdutos() {

    // ── Página e card ─────────────────────────────
    const pagina = document.createElement('div')
    pagina.className = 'pagina-lista'

    const card = document.createElement('div')
    card.className = 'pagina-card'

    // ── Topo: título + botão Criar Conta ──────────
    const topo = document.createElement('div')
    topo.className = 'topo-pagina'

    const titulo = document.createElement('h2')
    titulo.textContent = 'Produtos Cadastrados'

    const btnCriarConta = document.createElement('button')
    btnCriarConta.type = 'button'
    btnCriarConta.className = 'btn-icone'
    btnCriarConta.innerHTML = `<img src="./img/mais.png" alt="+"> Criar conta`
    btnCriarConta.onclick = () => renderizarPagina('criarConta')

    topo.append(titulo, btnCriarConta)

    // ── Botão Adicionar ───────────────────────────
    const btnAdicionar = document.createElement('button')
    btnAdicionar.type = 'button'
    btnAdicionar.className = 'btn-icone'
    btnAdicionar.innerHTML = `<img src="./img/mais.png" alt="+"> Adicionar`
    btnAdicionar.onclick = () => renderizarPagina('cadastroProduto')

    // ── Tabela ────────────────────────────────────
    const tabelaWrap = document.createElement('div')
    tabelaWrap.className = 'tabela-wrap'

    const cabecalho = document.createElement('div')
    cabecalho.className = 'tabela-cabecalho'
    cabecalho.innerHTML = `
        <span>ID</span>
        <span>Nome</span>
        <span class="col-usuario">Usuário</span>
        <span>Ativo</span>
        <span>Ações</span>
    `

    const corpo = document.createElement('div')
    corpo.id = 'corpo-tabela'
    corpo.innerHTML = '<div class="tabela-vazia">Carregando produtos...</div>'

    tabelaWrap.append(cabecalho, corpo)
    card.append(topo, btnAdicionar, tabelaWrap)
    pagina.appendChild(card)

    carregarProdutos()

    return pagina
}

// ── Busca produtos na API ─────────────────────────
async function carregarProdutos() {
    const corpo = document.getElementById('corpo-tabela')

    try {
        const resposta = await fetch('https://sua-api.com/produtos')

        if (!resposta.ok) throw new Error('Erro ao buscar produtos.')

        const produtos = await resposta.json()
        mostrarProdutos(corpo, produtos)

    } catch (erro) {
        corpo.innerHTML = `<div class="tabela-vazia">Erro: ${erro.message}</div>`
    }
}

// ── Monta as linhas da tabela ─────────────────────
function mostrarProdutos(corpo, produtos) {
    corpo.innerHTML = ''

    if (produtos.length === 0) {
        corpo.innerHTML = '<div class="tabela-vazia">Nenhum produto. Clique em Adicionar!</div>'
        return
    }

    produtos.forEach(produto => {
        const linha = document.createElement('div')
        linha.className = 'tabela-linha'

        const badge = produto.ativo
            ? `<span class="badge-ativo">Ativo</span>`
            : `<span class="badge-inativo">Inativo</span>`

        linha.innerHTML = `
            <span>${produto.id}</span>
            <span>${produto.nome}</span>
            <span class="col-usuario">${produto.usuario || '—'}</span>
            <span>${badge}</span>
        `

        // Botão editar (lápis)
        const btnEditar = document.createElement('button')
        btnEditar.type = 'button'
        btnEditar.className = 'btn-acao'
        btnEditar.innerHTML = `<img src="./img/lapis.png" alt="Editar">`
        btnEditar.onclick = () => renderizarPagina('cadastroProduto', { produto })

        // Botão excluir (lixeira)
        const btnDeletar = document.createElement('button')
        btnDeletar.type = 'button'
        btnDeletar.className = 'btn-acao'
        btnDeletar.innerHTML = `<img src="./img/lixeira.png" alt="Excluir">`
        btnDeletar.onclick = () => deletarProduto(produto, corpo)

        const acoes = document.createElement('div')
        acoes.className = 'acoes'
        acoes.append(btnEditar, btnDeletar)

        linha.appendChild(acoes)
        corpo.appendChild(linha)
    })
}

// ── Deleta um produto ─────────────────────────────
async function deletarProduto(produto, corpo) {
    const confirmar = confirm(`Excluir "${produto.nome}"?`)
    if (!confirmar) return

    try {
        const resposta = await fetch(`https://sua-api.com/produtos/${produto.id}`, {
            method: 'DELETE'
        })

        if (!resposta.ok) throw new Error('Erro ao excluir.')

        mostrarMensagem('Produto excluído!')
        carregarProdutos()

    } catch (erro) {
        mostrarMensagem(erro.message, 'erro')
    }
}
