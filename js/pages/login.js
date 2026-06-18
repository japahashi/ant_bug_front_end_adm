'use strict'

import { renderizarPagina, mostrarMensagem } from '../main.js'

const API_URL = 'http://localhost:8080/v1/planetaverde/admin'

export function criarLogin() {

    const card = document.createElement('div')
    card.className = 'card'

    const inputEmail = document.createElement('input')
    inputEmail.type = 'email'
    inputEmail.placeholder = 'admin@planetavegano.com'
    inputEmail.className = 'input-campo'

    const inputSenha = document.createElement('input')
    inputSenha.type = 'password'
    inputSenha.placeholder = 'Senha'
    inputSenha.className = 'input-campo'

    const labelEmail = document.createElement('label')
    labelEmail.textContent = 'Email'
    labelEmail.className = 'label-campo'

    const labelSenha = document.createElement('label')
    labelSenha.textContent = 'Senha'
    labelSenha.className = 'label-campo'

    const btnEntrar = document.createElement('button')
    btnEntrar.type = 'button'
    btnEntrar.className = 'btn-principal'
    btnEntrar.textContent = 'Entrar'

    btnEntrar.onclick = async () => {
        const email = inputEmail.value.trim()
        const senha = inputSenha.value

        if (!email || !senha) {
            mostrarMensagem('Preencha e-mail e senha.', 'erro')
            return
        }

        btnEntrar.textContent = "Entrando..."
        btnEntrar.disabled = true

        try {
            const respota = await fetch(`${API_URL}/administrador/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, senha})
            })

            const dados = await respota.json()

            if (!dados.status) {
                throw new Error(dados.message || 'Email ou senha inválidos.')
            }

            // Salva o token e marca como logado
            sessionStorage.setItem('logado', '1')
            sessionStorage.setItem('token', dados.response.token)

            renderizarPagina('produtos')

        } catch (erro) {
            mostrarMensagem(erro.message, 'erro')
            btnEntrar.textContent = 'Entrar'
            btnEntrar.disabled = false
        }
    }
        

        // Por enquanto só marca como logado
        // Quando tiver back-end: trocar por fetch para a API
        sessionStorage.setItem('logado', '1')
        renderizarPagina('produtos')

    card.append(labelEmail, inputEmail, labelSenha, inputSenha, btnEntrar)
    return card
}
