'use strict'

const DEFAULT_FONT_SIZE = 40
const DEFAULT_FONT_FAMILY = 'impact'
const DEFAULT_STROKE = '#000000'
const DEFAULT_FILL = '#ffffff'
const DEFAULT_ALIGN = 'center'
const TEXT_PADDING = 10

const MEMES_STORAGE_KEY = 'savedMemes'

const gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
const gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
{ id: 2, url: 'img/2.jpg', keywords: ['funny', 'cat'] },
{ id: 3, url: 'img/3.jpg', keywords: ['funny', 'cat'] },
{ id: 4, url: 'img/4.jpg', keywords: ['funny', 'cat'] },
{ id: 5, url: 'img/5.jpg', keywords: ['funny', 'cat'] },
{ id: 6, url: 'img/6.jpg', keywords: ['funny', 'cat'] },
{ id: 7, url: 'img/7.jpg', keywords: ['funny', 'cat'] },
{ id: 8, url: 'img/8.jpg', keywords: ['funny', 'cat'] },
{ id: 9, url: 'img/9.jpg', keywords: ['funny', 'cat'] },
{ id: 10, url: 'img/10.jpg', keywords: ['funny', 'cat'] },
{ id: 11, url: 'img/11.jpg', keywords: ['funny', 'cat'] },
{ id: 12, url: 'img/12.jpg', keywords: ['funny', 'cat'] },
{ id: 13, url: 'img/13.jpg', keywords: ['funny', 'cat'] },
{ id: 14, url: 'img/14.jpg', keywords: ['funny', 'cat'] },
{ id: 15, url: 'img/15.jpg', keywords: ['funny', 'cat'] },
{ id: 16, url: 'img/16.jpg', keywords: ['funny', 'cat'] },
{ id: 17, url: 'img/17.jpg', keywords: ['funny', 'cat'] },
{ id: 18, url: 'img/18.jpg', keywords: ['funny', 'cat'] }];

const gSavedMemes = loadFromStorage(MEMES_STORAGE_KEY) || []
var gMeme
// Getters:

function getImgs() {
    return gImgs
}

function getMeme() {
    return gMeme
}

function getSavedMemes() {
    return gSavedMemes
}

// setters:

function setLineTxt(txt) {
    if (gMeme.selectedLineIdx < 0) gMeme.selectedLineIdx = 0
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(id) {
    gMeme = {
        selectedImgId: id,
        selectedLineIdx: -1,
        lines: []
    }
    pushNewLine()
}

function setColor(clr, clrTarget) {
    const lineIdx = Math.max(gMeme.selectedLineIdx, 0)

    gMeme.lines[lineIdx][clrTarget] = clr
}

function setFontSize(dif) {
    if (gMeme.lines[gMeme.selectedLineIdx].size + dif < 1) return
    gMeme.lines[gMeme.selectedLineIdx].size += dif
}

function setFont(font) {
    const lineIdx = Math.max(gMeme.selectedLineIdx, 0)

    gMeme.lines[lineIdx].font = font
}

function setCurrMeme(savedIdx) {
    gMeme = JSON.parse(JSON.stringify(gSavedMemes[savedIdx]))
}

// managing meme elements:

function switchLine() {
    gMeme.selectedLineIdx++
    gMeme.selectedLineIdx %= gMeme.lines.length
}

function moveTxt(dif) {

    gMeme.lines[gMeme.selectedLineIdx].startPos.y += dif

}

function addLine() {
    if (gMeme.selectedLineIdx < 0) return gMeme.selectedLineIdx = 0
    // LineIdx -1 is for not rendering placeholder text as default
    pushNewLine()
    gMeme.selectedLineIdx++
}

function pushNewLine() {
    const newLine = {
        txt: '',
        size: DEFAULT_FONT_SIZE,
        font: DEFAULT_FONT_FAMILY,
        align: DEFAULT_ALIGN,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        startPos: { x: null, y: null }
    }
    gMeme.lines.push(newLine)
}

function deleteLine() {
    if (gMeme.lines.length < 1) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx > 0 || gMeme.lines.length < 1) gMeme.selectedLineIdx--
    if (gMeme.selectedLineIdx < 0) pushNewLine()
}

function align(direction, canvasWidth) {
    var startX
    switch (direction) {
        case 'start':
            startX = TEXT_PADDING
            break
        case 'center':
            startX = canvasWidth / 2
            break
        default:
            startX = canvasWidth - TEXT_PADDING
            break;
    }
    gMeme.lines[gMeme.selectedLineIdx].startPos.x = startX
    gMeme.lines[gMeme.selectedLineIdx].align = direction
}

// uploading, saving, downloading

function uploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const url = XHR.responseText
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

function saveMeme(dataUrl) {
    gMeme.dataUrl = dataUrl
    gSavedMemes.push(gMeme)
    _saveMemesToStorage()
}

function _saveMemesToStorage() {
    saveToStorage(MEMES_STORAGE_KEY, gSavedMemes)
}