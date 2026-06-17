'use strict'

import { criarLogin }            from './pages/login.js'
import { criarCriarConta }       from './pages/criarConta.js'
import { criarProdutos }         from './pages/listaProdutos.js'
import { criarCadastroProduto }  from './pages/cadastroProduto.js'

// ── Registra todas as páginas ─────────────────────
const paginas = {
    login: {
        renderizar: criarLogin
    },
    criarConta: {
        renderizar: criarCriarConta
    },
    produtos: {
        renderizar: criarProdutos
    },
    cadastroProduto: {
        renderizar: criarCadastroProduto
    }
}

// ── Troca a página na tela ────────────────────────
export function renderizarPagina(nomePagina, dados) {
    const logado = sessionStorage.getItem('logado')
    const protegidas = ['produtos', 'criarConta', 'cadastroProduto']

    // Se não está logado e tenta acessar página protegida
    if (!logado && protegidas.includes(nomePagina)) {
        renderizarPagina('login')
        return
    }

    // Mostra ou esconde botão Sair
    const btnSair = document.getElementById('btn-sair')
    if (logado && nomePagina !== 'login') {
        btnSair.classList.remove('escondido')
    } else {
        btnSair.classList.add('escondido')
    }

    // Renderiza a página passando "dados" (usado ao editar produto)
    const pagina = paginas[nomePagina].renderizar(dados)
    document.getElementById('main').replaceChildren(pagina)
}

// ── Botão Sair ────────────────────────────────────
document.getElementById('btn-sair').onclick = () => {
    sessionStorage.clear()
    renderizarPagina('login')
}

// ── Mensagem de feedback (toast) ──────────────────
export function mostrarMensagem(texto, tipo) {
    let toast = document.getElementById('toast')
    if (!toast) {
        toast = document.createElement('div')
        toast.id = 'toast'
        document.body.appendChild(toast)
    }
    toast.textContent = texto
    toast.className = tipo === 'erro' ? 'erro' : ''
    toast.classList.add('visivel')
    setTimeout(() => toast.classList.remove('visivel'), 3000)
}

// ── Inicia na página de login ─────────────────────
renderizarPagina('login')
