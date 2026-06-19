'use strict'

import { renderizarPagina, mostrarMensagem } from '../main.js'

const API_URL = 'http://localhost:8080/v1/planetaverde/admin'

export function criarProdutos() {

    const pagina = document.createElement('div')
    pagina.className = 'pagina-lista'

    const card = document.createElement('div')
    card.className = 'pagina-card'

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

    const btnAdicionar = document.createElement('button')
    btnAdicionar.type = 'button'
    btnAdicionar.className = 'btn-icone'
    btnAdicionar.innerHTML = `<img src="./img/mais.png" alt="+"> Adicionar`
    btnAdicionar.onclick = () => renderizarPagina('cadastroProduto')

    const tabelaWrap = document.createElement('div')
    tabelaWrap.className = 'tabela-wrap'

    const cabecalho = document.createElement('div')
    cabecalho.className = 'tabela-cabecalho'
    cabecalho.innerHTML = `
        <span>ID</span>
        <span>Imagem</span>
        <span>Nome</span>
        <span>Categoria</span>
        <span>Ações</span>
    `

    const corpo = document.createElement('div')
    corpo.id = 'corpo-tabela'
    corpo.innerHTML = '<div class="tabela-vazia">Carregando produtos...</div>'

    tabelaWrap.append(cabecalho, corpo)
    card.append(topo, btnAdicionar, tabelaWrap)
    pagina.appendChild(card)

    setTimeout(() => {
        carregarProdutos()
    }, 100)

    return pagina
}

async function carregarProdutos() {
    const corpo = document.getElementById('corpo-tabela')

    if (!corpo) {
        console.log('Tabela ainda não existe.')
        return
    }

    try {
        const resposta = await fetch(`${API_URL}/categoria`)

        if (!resposta.ok) throw new Error('Erro ao buscar produtos.')

        const dados = await resposta.json()
        const categorias = dados.response.categoria

        const produtos = []
        for (let categoria of categorias) {
            if (categoria.produtos && categoria.produtos.length > 0) {
                for (let produto of categoria.produtos) {
                    produtos.push({
                        ...produto,
                        categoriaNome: categoria.nome
                    })
                }
            }
        }

        mostrarProdutos(corpo, produtos)

    } catch (erro) {
        corpo.innerHTML = `<div class="tabela-vazia">Erro: ${erro.message}</div>`
    }
}

function mostrarProdutos(corpo, produtos) {
    corpo.innerHTML = ''

    if (produtos.length === 0) {
        corpo.innerHTML = '<div class="tabela-vazia">Nenhum produto. Clique em Adicionar!</div>'
        return
    }

    produtos.forEach(produto => {
        const linha = document.createElement('div')
        linha.className = 'tabela-linha'

        const imagemProduto =
            produto.imagem && produto.imagem !== 'undefined'
                ? produto.imagem
                : './img/image.png'

        linha.innerHTML = `
            <span>${produto.id}</span>
            <img src="${imagemProduto}" alt="${produto.nome}" class="miniatura-produto">
            <span>${produto.nome}</span>
            <span>${produto.categoriaNome || '—'}</span>
        `

        const btnEditar = document.createElement('button')
        btnEditar.type = 'button'
        btnEditar.className = 'btn-acao'
        btnEditar.innerHTML = `<img src="./img/lapis.png" alt="Editar">`
        btnEditar.onclick = () => renderizarPagina('cadastroProduto', { produto })

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

async function deletarProduto(produto, corpo) {
    const confirmar = confirm(`Excluir "${produto.nome}"?`)
    if (!confirmar) return

    try {
        const resposta = await fetch(`${API_URL}/produto/${produto.id}`, {
            method: 'DELETE'
        })

        if (!resposta.ok) throw new Error('Erro ao excluir.')

        mostrarMensagem('Produto excluído!')
        carregarProdutos()

    } catch (erro) {
        mostrarMensagem(erro.message, 'erro')
    }
}