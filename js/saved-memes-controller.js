'use strict'



function renderSavedMemes() {
    const savedMemes = getSavedMemes()
    const strHTMLs = savedMemes.map((meme, idx) => `
    <img class="rounded" onclick="onSelectMeme(${idx})" data-saved-idx="${idx}" src="${meme.dataUrl}">`)
    document.querySelector('.saved-memes-container').innerHTML = strHTMLs.join('')
}

function onSelectMeme(savedIdx) {
    setCurrMeme(savedIdx)
    showEditor()
    renderMeme()
}