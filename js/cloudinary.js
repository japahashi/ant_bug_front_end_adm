'use strict'

const CLOUD_NAME = 'daxpl0xw3'
const UPLOAD_PRESET = 'fotos_contato'

export async function uploadParaCloudinary(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const resposta = await fetch(url, {
        method: 'POST',
        body: formData
    })

    if (!resposta.ok) {
        throw new Error(`Erro no upload da imagem: ${resposta.status}`)
    }

    const dados = await resposta.json()
    return dados.secure_url
}