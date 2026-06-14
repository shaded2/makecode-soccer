// === UI: SCORE, TIMER, MESSAGES ===
import { scoreBlue, scoreRed, timeLeft, MATCH_LENGTH } from "./game"

let scoreSprite: Sprite = null
let timerSprite: Sprite = null
let messageSprite: Sprite = null

export function createHUD(): void {
    scoreSprite = sprites.create(makeScoreImage(), SpriteKind.Food)
    scoreSprite.setPosition(80, 4)
    scoreSprite.z = 20
    scoreSprite.setFlag(SpriteFlag.Ghost, true)

    timerSprite = sprites.create(makeTimerImage(), SpriteKind.Food)
    timerSprite.setPosition(80, 112)
    timerSprite.z = 20
    timerSprite.setFlag(SpriteFlag.Ghost, true)
}

export function updateScoreDisplay(): void {
    if (scoreSprite) {
        scoreSprite.setImage(makeScoreImage())
    }
}

export function updateTimerDisplay(): void {
    if (timerSprite) {
        timerSprite.setImage(makeTimerImage())
    }
}

export function showMessage(text: string, color: number): void {
    if (messageSprite) messageSprite.destroy()
    let msgImg = image.create(80, 16)
    msgImg.fill(0)
    msgImg.print(text, 0, 4, color)
    messageSprite = sprites.create(msgImg, SpriteKind.Food)
    messageSprite.setPosition(80, 30)
    messageSprite.z = 30
    messageSprite.setFlag(SpriteFlag.Ghost, true)
    messageSprite.lifespan = 1500
}

function makeScoreImage(): Image {
    let img_data = image.create(50, 12)
    img_data.fill(0)
    img_data.print(scoreBlue + " - " + scoreRed, 4, 2, 15)
    return img_data
}

function makeTimerImage(): Image {
    let minutes = Math.floor(timeLeft / 60)
    let seconds = timeLeft % 60
    let secStr = seconds < 10 ? "0" + seconds : "" + seconds
    let img_data = image.create(40, 10)
    img_data.fill(0)
    img_data.print(minutes + ":" + secStr, 4, 1, 15)
    return img_data
}