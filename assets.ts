// === ASSETS: SPRITES & SOUNDS ===

// Soccer ball (16x16)
const BALL_IMG = img`
    . . . . . . . . . . . . . . . .
    . . . . . 2 2 2 2 2 2 . . . . .
    . . . 2 2 5 5 5 5 5 5 2 2 . . .
    . . 2 5 5 2 2 2 2 2 2 5 5 2 . .
    . 2 5 2 2 2 2 2 2 2 2 2 2 5 2 .
    . 2 5 2 2 2 2 2 2 2 2 2 2 5 2 .
    . 2 5 2 2 2 2 2 2 2 2 2 2 5 2 .
    . 2 5 2 2 2 2 2 2 2 2 2 2 5 2 .
    . 2 5 2 2 2 2 2 2 2 2 2 2 5 2 .
    . 2 5 2 2 2 2 2 2 2 2 2 2 5 2 .
    . 2 5 2 2 2 2 2 2 2 2 2 2 5 2 .
    . . 2 5 5 2 2 2 2 2 2 5 5 2 . .
    . . . 2 2 5 5 5 5 5 5 2 2 . . .
    . . . . . 2 2 2 2 2 2 . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Blue team player (16x16 with face, jersey, shorts)
const P1_IMG = img`
    . . . . . . 1 1 1 1 . . . . . .
    . . . . 1 1 1 1 1 1 1 1 . . . .
    . . . 1 1 4 4 4 4 4 4 1 1 . . .
    . . 1 1 4 4 4 4 4 4 4 4 1 1 . .
    . . 1 4 4 8 8 4 4 8 8 4 4 1 . .
    . . 1 4 4 8 8 4 4 8 8 4 4 1 . .
    . . 1 4 4 4 4 4 4 4 4 4 4 1 . .
    . . 1 4 4 4 4 1 1 4 4 4 4 1 . .
    . . 1 1 4 4 4 1 1 4 4 4 1 1 . .
    . . . 1 4 4 4 4 4 4 4 4 1 . . .
    . . . 1 1 1 1 1 1 1 1 1 1 . . .
    . . 1 1 1 1 1 1 1 1 1 1 1 1 . .
    . . 1 1 b b 1 1 1 1 b b 1 1 . .
    . . 1 1 b b 1 1 1 1 b b 1 1 . .
    . . . 1 1 1 . . . . 1 1 1 . . .
    . . . . . . . . . . . . . . . .
`

// Red team player (16x16 with face, jersey, shorts)
const P2_IMG = img`
    . . . . . . 2 2 2 2 . . . . . .
    . . . . 2 2 2 2 2 2 2 2 . . . .
    . . . 2 2 4 4 4 4 4 4 2 2 . . .
    . . 2 2 4 4 4 4 4 4 4 4 2 2 . .
    . . 2 4 4 8 8 4 4 8 8 4 4 2 . .
    . . 2 4 4 8 8 4 4 8 8 4 4 2 . .
    . . 2 4 4 4 4 4 4 4 4 4 4 2 . .
    . . 2 4 4 4 4 2 2 4 4 4 4 2 . .
    . . 2 2 4 4 4 2 2 4 4 4 2 2 . .
    . . . 2 4 4 4 4 4 4 4 4 2 . . .
    . . . 2 2 2 2 2 2 2 2 2 2 . . .
    . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
    . . 2 2 b b 2 2 2 2 b b 2 2 . .
    . . 2 2 b b 2 2 2 2 b b 2 2 . .
    . . . 2 2 2 . . . . 2 2 2 . . .
    . . . . . . . . . . . . . . . .
`

// Goalkeeper (16x16 padded)
const KEEPER_IMG = img`
    . . . . . . . . . . . . . . . .
    . . . . . . 7 7 7 7 . . . . . .
    . . . . 7 7 4 4 4 4 7 7 . . . .
    . . . 7 4 4 8 8 4 4 8 8 7 . . .
    . . 7 4 4 8 8 4 4 8 8 4 4 7 . .
    . . 7 4 4 4 4 4 4 4 4 4 4 7 . .
    . . 7 4 4 4 4 7 7 4 4 4 4 7 . .
    . . . 7 4 4 4 7 7 4 4 4 7 . . .
    . . . 7 7 7 7 7 7 7 7 7 7 . . .
    . . . 7 b b b b b b b b 7 . . .
    . . . 7 b 7 7 b b 7 7 b 7 . . .
    . . . . 7 7 7 7 7 7 7 7 . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Sounds
function playKickSound(): void {
    music.play(music.tonePlayable(220, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
}

function playThumpSound(): void {
    music.thump.play()
}

function playGoalSound(): void {
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Quarter)), music.PlaybackMode.InBackground)
    music.play(music.tonePlayable(659, music.beat(BeatFraction.Quarter)), music.PlaybackMode.InBackground)
    music.play(music.tonePlayable(784, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground)
}

function playWhistleSound(): void {
    music.play(music.tonePlayable(880, music.beat(BeatFraction.Quarter)), music.PlaybackMode.InBackground)
}

// Helper to create a shadow under a sprite
function withShadow(base: Image): Image {
    let result = image.create(base.width, base.height + 2)
    result.fill(0)
    result.drawImage(base, 0, 0)
    return result
}