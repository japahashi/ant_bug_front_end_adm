'use strict'

import { renderizarPagina, mostrarMensagem } from '../main.js'

export function criarCriarConta() {

    const card = document.createElement('div')
    card.className = 'card'

    const labelNome = document.createElement('label')
    labelNome.textContent = 'Nome'
    labelNome.className = 'label-campo'

    const inputNome = document.createElement('input')
    inputNome.type = 'text'
    inputNome.placeholder = 'Nome do funcionário'
    inputNome.className = 'input-campo'

    const labelEmail = document.createElement('label')
    labelEmail.textContent = 'Email'
    labelEmail.className = 'label-campo'

    const inputEmail = document.createElement('input')
    inputEmail.type = 'email'
    inputEmail.placeholder = 'funcionario@planetavegano.com'
    inputEmail.className = 'input-campo'

    const labelSenha = document.createElement('label')
    labelSenha.textContent = 'Senha'
    labelSenha.className = 'label-campo'

    const inputSenha = document.createElement('input')
    inputSenha.type = 'password'
    inputSenha.placeholder = 'Mínimo 6 caracteres'
    inputSenha.className = 'input-campo'

    const btnCriar = document.createElement('button')
    btnCriar.type = 'button'
    btnCriar.className = 'btn-principal'
    btnCriar.textContent = 'Criar'

    btnCriar.onclick = async () => {
        const nome  = inputNome.value.trim()
        const email = inputEmail.value.trim()
        const senha = inputSenha.value

        if (!nome || !email || !senha) {
            mostrarMensagem('Preencha todos os campos.', 'erro')
            return
        }

        btnCriar.textContent = 'Criando...'
        btnCriar.disabled = true

        try {
            const resposta = await fetch('https://sua-api.com/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            })

            if (!resposta.ok) throw new Error('Erro ao criar conta.')

            mostrarMensagem('Conta criada com sucesso!')
            renderizarPagina('produtos')

        } catch (erro) {
            mostrarMensagem(erro.message, 'erro')
            btnCriar.textContent = 'Criar'
            btnCriar.disabled = false
        }
    }

    const btnVoltar = document.createElement('button')
    btnVoltar.type = 'button'
    btnVoltar.className = 'btn-secundario'
    btnVoltar.textContent = '← Voltar'
    btnVoltar.onclick = () => renderizarPagina('produtos')

    card.append(labelNome, inputNome, labelEmail, inputEmail, labelSenha, inputSenha, btnCriar, btnVoltar)
    return card
}
