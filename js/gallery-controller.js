'use strict'



function renderGallery() {
    const imgs = getImgs()
    const strHTMLs = imgs.map(({ id, url }) => `
    <img onclick="onImgSelect(this.dataset.id)" data-id="${id}" src="${url}">

    `)
    document.querySelector('.img-container').innerHTML = strHTMLs.join('')
}

function onImgSelect(id){
    setImg(id)
    renderMeme()
    showEditor()
}

function showEditor(){
    document.querySelector('.gallery').style.display = 'none'
    document.querySelector('.editor').style.display = 'flex'
}
