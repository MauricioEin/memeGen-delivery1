'use strict'
var gElCanvas
var gCtx

function onInit() {
    renderGallery()
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    resizeCanvas()
    adjustFontMenu()
    window.addEventListener('resize', () => { resizeCanvas(), renderMeme() })
    renderSavedMemes()
}

function addListeners() {
    // document.querySelector('#txt-editor').addEventListener()
}



function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = gElCanvas.height = elContainer.offsetWidth
    // gElCanvas.height = elContainer.offsetHeight
}

function adjustFontMenu() {
    const elOpts = document.querySelectorAll('#font-selector option')
    elOpts.forEach(opt => opt.style.fontFamily = opt.value)
    adjustFontSelector()
}

function adjustFontSelector() {
    const elSelect = document.querySelector('#font-selector')
    elSelect.style.fontFamily = elSelect.value
}


function renderMeme() {

    resetShareBtn()

    const { selectedImgId: id, selectedLineIdx, lines } = getMeme()
    const img = document.querySelector(`[data-id="${id}"]`)
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    if (selectedLineIdx < 0) return
    lines.forEach((line, idx) => {

        drawText(line, idx)
    })

}

function drawText({ txt, size, font, stroke, fill, startPos, align }, lineIdx) {

    if (startPos.y === null) {
        //is this awful? changing it from  the controller instead
        // of making a setStartY function that does the same?
        startPos.y = (lineIdx === 0) ? size :
            (lineIdx === 1) ? gElCanvas.height - size : gElCanvas.height / 2
    }
    const centerX = gElCanvas.width / 2
    gCtx.lineWidth = size / 20
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = fill
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = align
    gCtx.fillText(txt || 'enter text here', startPos.x || centerX, startPos.y)
    gCtx.strokeText(txt || 'enter text here', startPos.x || centerX, startPos.y)
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
    updateTxtInput()

}

function onAddLine() {
    addLine()
    renderMeme()
    updateTxtInput()
}

function onMoveTxt(dif) {
    moveTxt(dif)
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
    updateTxtInput()
}

function onAlign(direction) {
    align(direction, gElCanvas.width)
    renderMeme()
}

function onSetFont(font) {
    adjustFontSelector()
    setFont(font)
    renderMeme()
}

function onDownload(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')// image/jpeg the default format
    elLink.href = imgContent

}

function updateTxtInput() {
    const meme = getMeme()
    const txt = (meme.selectedLineIdx >= 0) ? meme.lines[meme.selectedLineIdx].txt : ''
    document.querySelector('#txt-editor').value = txt
}

function onSave() {
    saveMeme(gElCanvas.toDataURL())
    hideEditor()
    renderSavedMemes()
}

function onShare(elLink) {
    elLink.innerHTML = 'loading...'
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")// Gets the canvas content as an image format

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log(encodedUploadedImgUrl)
        // Create a link that on click will make a post in facebook with the image we uploaded
        document.querySelector('.fb-container').innerHTML =
            `<a class="btn fb rounded" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" 
            title="Share on Facebook" target="_blank" 
            onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share on FB  
        </a>`
        elLink.style.display = 'none'
        elLink.innerHTML = 'share'
    }
    uploadImg(imgDataUrl, onSuccess)
}

function resetShareBtn() {
    document.querySelector('.fb-container').innerHTML =''
    document.querySelector('.share').style.display = 'inline'

}
