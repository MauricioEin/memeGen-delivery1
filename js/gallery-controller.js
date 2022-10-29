'use strict'



function renderGallery() {
    renderFilter()
    renderKeywords()
    renderImgs()
}

// RENDERING:

function renderFilter() {
    const keywords = getKeywords()
    const strHTMLs = keywords.map(keyword => `
    <option value="${keyword}">
    `)
    document.getElementById('keywords').innerHTML = strHTMLs.join('')
}

function renderImgs() {
    const imgs = getImgs()
    const strHTMLs = imgs.map(({ id, url }) => `
    <img class="rounded" onclick="onImgSelect(this.dataset.id)" data-id="${id}" src="${url}">

    `)
    document.querySelector('.img-container').innerHTML = strHTMLs.join('')

}

function renderKeywords() {
    const popWords = getPopularKeywords().sort((a, b) => b[1] - a[1])
    // this is a sorted 2d array: [[word1, count1], [word2, count2], ...]
    const strHTMLs = popWords.map(entry => `
    <span style="font-size:${1 + entry[1] * 0.2}em" onclick="onKeyword('${entry[0]}');onFilter('${entry[0]}')">${entry[0]}</span>
    `)
    console.log(popWords)
    document.querySelector('.search-words').innerHTML = strHTMLs.join('')
}

// EVENT HANDLERS:

function onImgSelect(id) {
    setImg(id)
    showEditor()
    renderMeme()
}

function onFilter(filter) {
    setFilter(filter.toLowerCase())
    renderImgs()
}

function onKeyword(word) {
    updatePopularKeywords(word.toLowerCase())
    renderKeywords()
}

function onMore(){
    document.body.classList.toggle('keywords-open')
    document.querySelector('.search-words').classList.toggle('pill')

}




// LAYOUT:

function showEditor() {
    document.body.classList.add('editor-open')
    document.querySelector('.gallery').style.display = 'none'
    document.querySelector('#memes').style.display = 'none'
    document.querySelector('#about').style.display = 'none'

    updateTxtInput()


}
function hideEditor() {
    document.body.classList.remove('editor-open')
    document.querySelector('.gallery').style.display = 'block'
    document.querySelector('#memes').style.display = 'block'
    document.querySelector('#about').style.display = 'block'


}

