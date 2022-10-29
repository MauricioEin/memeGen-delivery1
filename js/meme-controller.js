'use strict'
var gElCanvas
var gCtx
var gDragStartPos

function onInit() {

    renderGallery()
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    resizeCanvas()
    adjustFontMenu()
    renderSavedMemes()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => { resizeCanvas(), renderMeme() })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
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
    const { selectedImgId: id, selectedLineIdx, lines } = getMeme()
    const img = document.querySelector(`[data-id="${id}"]`)
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    setStyleInputs(selectedLineIdx, lines)
    resetShareBtn()
    if (selectedLineIdx < 0) return
    lines.forEach((line, idx) => {
        drawText(line, idx)
    })


}

function drawText({ txt, size, font, stroke, fill, startPos, align }, lineIdx) {
    console.log(gMeme.lines[gMeme.selectedLineIdx])

    if (startPos.y === null) {
        //is this awful? changing it from  the controller instead
        // of making a setStartY function that does the same?
        startPos.y = (lineIdx === 0) ? size :
            (lineIdx === 1) ? gElCanvas.height - size : gElCanvas.height / 2
    }
    if (startPos.x === null) startPos.x = gElCanvas.width / 2


    gCtx.lineWidth = size / 20
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = fill
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = align
    gCtx.fillText(txt || 'enter text here', startPos.x, startPos.y)
    gCtx.strokeText(txt || 'enter text here', startPos.x, startPos.y)
    setTextMeasure(gCtx.measureText(txt || 'enter text here'))
    // console.log(gMeme.lines[gMeme.selectedLineIdx].measure)
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
    setStyleInputs()
    updateTxtInput()

}

function onAddLine() {
    addLine()
    renderMeme()
    updateTxtInput()
}

function onMoveTxt(difX, difY) {
    moveTxt(difX, difY)
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
    renderSavedMemes()
    hideEditor()
    document.getElementById("memes").scrollIntoView();


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
    document.querySelector('.fb-container').innerHTML = ''
    document.querySelector('.share').style.display = 'inline'

}

function setStyleInputs() {
    var { selectedLineIdx, lines } = getMeme()
    selectedLineIdx = Math.max(selectedLineIdx, 0)
    const { stroke, fill, font } = lines[selectedLineIdx]
    document.getElementById('stroke').value = stroke
    document.getElementById('fill').value = fill
    document.getElementById('font-selector').value = font
    adjustFontSelector()
}

function onDown({ offsetX, offsetY }) {
    const clickedIdx = getClickedLineIdx(offsetX, offsetY)
    if (clickedIdx < 0) return
    console.log('clicked', clickedIdx)
    setIsDrag(true)
    // //Save the pos we start from 
    gDragStartPos = { x: offsetX, y: offsetY }
    document.querySelector('canvas').style.cursor = 'grabbing'

}

function onMove({ offsetX, offsetY }) {
    if (!getMeme().isDrag) {
        (getClickedLineIdx(offsetX, offsetY) >= 0) ?
         document.querySelector('canvas').style.cursor = 'grab' :
         document.querySelector('canvas').style.cursor = 'default'


        return
    }
    // const pos = getEvPos(ev)
    // //Calc the delta , the diff we moved
    const dx = offsetX - gDragStartPos.x
    const dy = offsetY - gDragStartPos.y
    moveTxt(dx, dy)
    gDragStartPos.x += dx
    gDragStartPos.y += dy
    renderMeme()

}

function onUp() {
    setIsDrag(false)
    document.querySelector('canvas').style.cursor = 'grab'
}