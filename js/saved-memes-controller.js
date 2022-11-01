'use strict'



function renderSavedMemes() {
    const savedMemes = getSavedMemes()
    const strHTMLs = savedMemes.map((meme, idx) =>
        `<div class="saved-img-container rounded" onmouseenter="toggleDelete(${idx})" onmouseleave="toggleDelete(${idx})">
    <img class="rounded" onclick="onSelectMeme(${idx})" data-saved-idx="${idx}" src="${meme.dataUrl}">
    <div class="delete-meme" id="delete-meme${idx}" onclick="onDeleteMeme(${idx})">
    <iconify-icon icon="bi:trash"></iconify-icon></div></div>`)
    document.querySelector('.saved-memes-container').innerHTML = strHTMLs.join('')
}

function onSelectMeme(savedIdx) {
    setCurrMeme(savedIdx)
    showEditor()
    renderMeme()
}

function onDeleteMeme(idx) {
    deleteMeme(idx)
    renderSavedMemes()
}

function toggleDelete(idx) {
    document.getElementById('delete-meme' + idx).classList.toggle('show')
}