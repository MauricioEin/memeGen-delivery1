'use strict'

const DEFAULT_FONT_SIZE = 40
const DEFAULT_FONT_FAMILY = 'impact'
const DEFAULT_STROKE = '#000000'
const DEFAULT_FILL = '#ffffff'
const DEFAULT_ALIGN = 'center'
const TEXT_PADDING = 10

const MEMES_STORAGE_KEY = 'savedMemes'

const gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
const gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['politic', 'serious', 'hair', 'explain', 'man'] },
{ id: 2, url: 'img/2.jpg', keywords: ['dog', 'kiss', 'friends'] },
{ id: 3, url: 'img/3.jpg', keywords: ['baby', 'dog', 'sleep', 'friends'] },
{ id: 4, url: 'img/4.jpg', keywords: ['cat', 'sleep'] },
{ id: 5, url: 'img/5.jpg', keywords: ['baby', 'serious'] },
{ id: 6, url: 'img/6.jpg', keywords: ['hair', 'explain', 'man'] },
{ id: 7, url: 'img/7.jpg', keywords: ['baby', 'listen', 'shock'] },
{ id: 8, url: 'img/8.jpg', keywords: ['listen', 'hair', 'man'] },
{ id: 9, url: 'img/9.jpg', keywords: ['baby', 'laugh'] },
{ id: 10, url: 'img/10.jpg', keywords: ['politic', 'laugh', 'man'] },
{ id: 11, url: 'img/11.jpg', keywords: ['kiss', 'gay', 'friends', 'man'] },
{ id: 12, url: 'img/12.jpg', keywords: ['you', 'man', 'man'] },
{ id: 13, url: 'img/13.jpg', keywords: ['cheers', 'hair', 'man', 'you'] },
{ id: 14, url: 'img/14.jpg', keywords: ['serious', 'listen', 'shock', 'man'] },
{ id: 15, url: 'img/15.jpg', keywords: ['serious', 'hair', 'explain', 'man'] },
{ id: 16, url: 'img/16.jpg', keywords: ['laugh', 'listen', 'shock', 'man'] },
{ id: 17, url: 'img/17.jpg', keywords: ['politic', 'serious', 'explain', 'man'] },
{ id: 18, url: 'img/18.jpg', keywords: ['friends', 'listen', 'shock'] }];

const gSavedMemes = loadFromStorage(MEMES_STORAGE_KEY) || getInitialMemes()
var gMeme
var gFilter = ''
const gPopKeywords = { friends: 5, baby: 8, dog: 14, listen: 4, serious: 6, laugh: 5, cat: 8, kiss: 4, politic: 4, you: 3, shock: 5, hair: 2, cheers: 2, explain: 2, gay: 2, man: 2, sleep: 5 }

// GETTERS:


function getImgs() {
    return gImgs.filter(img => img.keywords.some(keyword => keyword.includes(gFilter)))
}

function getMeme() {
    return gMeme
}

function getSavedMemes() {
    return gSavedMemes
}

function getKeywords() {
    const keywords = []
    gImgs.forEach(img => {
        keywords.push(...(img.keywords.filter(keyword => !keywords.includes(keyword))))
    })
    return keywords.sort((a, b) => a.localeCompare(b))
}

function getPopularKeywords() {
    return Object.entries(gPopKeywords)

}

function getClickedLineIdx({ x, y }) {
    const idx = gMeme.lines.findIndex(line => isBelongingX(line, x) && isBelongingY(line, y))
    if (idx >= 0) gMeme.selectedLineIdx = idx
    return idx
}

function isBelongingY({ startPos, measure }, y) {
    return y >= (startPos.y - measure.actualBoundingBoxAscent) && y <= (startPos.y + measure.actualBoundingBoxDescent)
}
function isBelongingX({ startPos, measure }, x) {
    return x >= (startPos.x - measure.actualBoundingBoxLeft) && x <= (startPos.x + measure.actualBoundingBoxRight)
}

// SETTERS:
function setFilter(filter) {
    gFilter = filter
}

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

function updatePopularKeywords(word) {
    gPopKeywords[word] ? gPopKeywords[word]++ : gPopKeywords[word] = 1
    console.log(gPopKeywords)
}

function setTextMeasure(measure) {
    console.log('setting', gMeme.selectedLineIdx)
    gMeme.lines[gMeme.selectedLineIdx].measure = measure
}

function setIsDrag(isDrag) {
    gMeme.isDrag = isDrag
}


// MANAGING MEME ELEMENTS:

function switchLine() {
    gMeme.selectedLineIdx++
    gMeme.selectedLineIdx %= gMeme.lines.length
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

function moveTxt(difX, difY, canvasHeight, lineIdx) {
    if (lineIdx === undefined) lineIdx = gMeme.selectedLineIdx
    if (gMeme.lines[lineIdx].startPos.y + difY < gMeme.lines[lineIdx].size) return
    if (gMeme.lines[lineIdx].startPos.y + difY > canvasHeight ) return
    gMeme.lines[lineIdx].startPos.x += difX
    gMeme.lines[lineIdx].startPos.y += difY
}



// uploading, saving, downloading, deleting

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

function deleteMeme(idx) {
    gSavedMemes.splice(idx, 1)
    _saveMemesToStorage()
}

function _saveMemesToStorage() {
    saveToStorage(MEMES_STORAGE_KEY, gSavedMemes)
}







function getInitialMemes() {
    return [{ "selectedImgId": "18", "selectedLineIdx": 1, "lines": [{ "txt": "BLA BLA BLA", "size": 40, "font": "impact", "align": "center", "fill": "#ffffff", "stroke": "#000000", "startPos": { "x": null, "y": 40 } }, { "txt": "yep...", "size": 40, "font": "impact", "align": "start", "fill": "#ffffff", "stroke": "#000000", "startPos": { "x": 10, "y": 465 } }], dataUrl: 'img/initial-memes/sample1.png' },
    { "selectedImgId": "1", "selectedLineIdx": 2, "lines": [{ "txt": "this is a test", "size": 40, "font": "impact", "align": "center", "fill": "#a83e3e", "stroke": "#000000", "startPos": { "x": null, "y": 40 } }, { "txt": "and i never lie", "size": 40, "font": "impact", "align": "center", "fill": "#4dcbbd", "stroke": "#000000", "startPos": { "x": null, "y": 423 } }, { "txt": "oh yes", "size": 40, "font": "impact", "align": "center", "fill": "#ccaa2e", "stroke": "#000000", "startPos": { "x": null, "y": 231.5 } }], dataUrl: 'img/initial-memes/sample2.png' },
    { "selectedImgId": "11", "selectedLineIdx": 0, "lines": [{ "txt": "voulez vous coucher avec moi?", "size": 39, "font": "impact", "align": "start", "fill": "#241f70", "stroke": "#902323", "startPos": { "x": 10, "y": 50 } }, { "txt": "ce soir? non, merci", "size": 50, "font": "Franklin Gothic Medium", "align": "center", "fill": "#cbff0f", "stroke": "#000000", "startPos": { "x": null, "y": 461 } }], dataUrl: 'img/initial-memes/sample3.png' }]

}