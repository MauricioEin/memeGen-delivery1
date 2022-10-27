'use strict'



function renderGallery() {
    const imgs = getImgs()
    const strHTMLs = imgs.map(({ id, url }) => `
    <img class="rounded" onclick="onImgSelect(this.dataset.id)" data-id="${id}" src="${url}">

    `)
    document.querySelector('.img-container').innerHTML = strHTMLs.join('')
}

function onImgSelect(id) {
    console.log('clicked', id)
    setImg(id)
    showEditor()
    renderMeme()
}

function showEditor() {
    document.body.classList.add('editor-open')
    document.querySelector('.gallery').style.display = 'none'
    document.querySelector('#memes').style.display = 'none'

}
function hideEditor() {
    document.body.classList.remove('editor-open')
    document.querySelector('.gallery').style.display = 'block'
    document.querySelector('#memes').style.display = 'block'

}
