'use strict'

const DEFAULT_FONT_SIZE = 20
const DEFAULT_STROKE = 'black'
const DEFAULT_FILL = 'white'
const DEFAULT_ALIGN = 'left'

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

const gSavedMemes = {}
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            align: 'left',
            fill: 'red',
            stroke: 'black'
        }
    ]
}

// Getters:

function getImgs() {
    return gImgs
}

function getMeme() {
    return gMeme
}

// setters

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(id) {
    gMeme = {
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [{
            txt: '',
            size: DEFAULT_FONT_SIZE,
            align: DEFAULT_ALIGN,
            fill: DEFAULT_FILL,
            stroke: DEFAULT_STROKE
        }]
    }
}

function setColor(clr, clrTarget) {
    gMeme.lines[gMeme.selectedLineIdx][clrTarget] = clr
}

function setFontSize(dif) {
    if (gMeme.lines[gMeme.selectedLineIdx].size + dif < 1) return
    gMeme.lines[gMeme.selectedLineIdx].size += dif
}

function switchLine() {
    gMeme.selectedLineIdx++
    gMeme.selectedLineIdx %= gMeme.lines.length
}

function addLine() {
    const newLine = {
        txt: '',
        size: DEFAULT_FONT_SIZE,
        align: DEFAULT_ALIGN,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx++
}



