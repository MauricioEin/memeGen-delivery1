'use strict'

var gElCanvas
var gCtx

function onInit() {
    renderGallery()
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    resizeCanvas()
    setTimeout(renderMeme, 1000)
    window.addEventListener('resize', () => { resizeCanvas(), renderMeme() })


}

function addListeners() {
    // document.querySelector('#txt-editor').addEventListener()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = gElCanvas.height = elContainer.offsetWidth
    // gElCanvas.height = elContainer.offsetHeight
}



function renderMeme() {

    const { selectedImgId: id, lines } = getMeme()
    const img = document.querySelector(`[data-id="${id}"]`)
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    lines.forEach((line, idx) => {
        drawText(line.txt, line.size, line.stroke, line.fill, idx)
    })


}

function drawText(text, size, stroke, fill, lineIdx) {
    const startX = 10
    const startY = (lineIdx === 0) ? size :
        (lineIdx === 1) ? gElCanvas.height - size : gElCanvas.height / 2
    gCtx.lineWidth = 1
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = fill
    gCtx.font = `${size}px Arial`
    gCtx.fillText(text, startX, startY)
    gCtx.strokeText(text, startX, startY)
}

function onTextEdit(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onSetColor(clr, clrTarget) {
    setColor(clr, clrTarget)
    renderMeme()
}

function onSetFontSize(dif) {
    setFontSize(dif)
    renderMeme()
}

function onSwitchLine() {
    switchLine()
}

function onAddLine() {
    addLine()
    renderMeme()
    updateTxtInput()
}

function updateTxtInput() {
    const meme = getMeme()
    const txt = meme.lines[meme.selectedLineIdx].txt
    document.querySelector('#txt-editor').value = txt
}