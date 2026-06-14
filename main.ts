/**
 * === ARCADE SOCCER 2.0 ===
 * 
 * D-pad: Move | A: Kick | Menu: Pause/Reset
 */
/**
 * === ASSETS - SPRITE ART ===
 */
function updateTimerDisplay () {
    if (timerSprite) {
        timerSprite.setImage(makeTimerImage())
    }
}
// === BALL ===
function createBall () {
    ball = sprites.create(BALL_IMG.clone(), SpriteKind.Projectile)
    ball.setPosition(FIELD_CENTER_X, FIELD_CENTER_Y)
    ball.z = 10
}
// === PLAYER-BALL COLLISIONS ===
function ballPlayerCollision (player2: Sprite, isPlayerTeam: boolean) {
    dx4 = ball.x - player2.x
    dy5 = ball.y - player2.y
    dist3 = Math.sqrt(dx4 * dx4 + dy5 * dy5)
    minDist = BALL_RADIUS + PLAYER_RADIUS
    if (dist3 < minDist && dist3 > 0.01) {
        // Push ball out
        overlap = minDist - dist3
        nx = dx4 / dist3
        ny = dy5 / dist3
        ball.x += nx * overlap
        ball.y += ny * overlap
        // Reflect ball velocity
        ballDot = ball.vx * nx + ball.vy * ny
        playerDot = player2.vx * nx + player2.vy * ny
        if (ballDot < playerDot) {
            transfer = (playerDot - ballDot) * 1.2
            ball.vx += nx * transfer
            ball.vy += ny * transfer
        }
        player.x -= nx * overlap * 0.3
player.y -= ny * overlap * 0.3
    }
}
function resetPositions () {
    ball.setPosition(FIELD_CENTER_X, FIELD_CENTER_Y)
    ball.vx = 0
    ball.vy = 0
    player1.setPosition(FIELD_X + 35, FIELD_CENTER_Y)
    player1.vx = 0
    player1.vy = 0
    player2.setPosition(FIELD_X + FIELD_W - 35, FIELD_CENTER_Y)
    player2.vx = 0
    player2.vy = 0
    goalkeeper1.setPosition(FIELD_X + 6, FIELD_CENTER_Y)
    goalkeeper1.vx = 0
    goalkeeper1.vy = 0
    goalkeeper2.setPosition(FIELD_X + FIELD_W - 6, FIELD_CENTER_Y)
    goalkeeper2.vx = 0
    goalkeeper2.vy = 0
}
function endGame () {
    gameState = "over"
    let winner: string
if (scoreBlue > scoreRed) {
        winner = "BLUE WINS!"
        game.over(true, effects.confetti)
    } else if (scoreRed > scoreBlue) {
        winner = "RED WINS!"
        game.over(false, effects.slash)
    } else {
        winner = "DRAW!"
        game.splash("DRAW! " + scoreBlue + "-" + scoreRed)
    }
}
// === AI ===
function updateAIPlayer () {
    dx2 = ball.x - player2.x
    dy2 = ball.y - player2.y
    distToBall = Math.sqrt(dx2 * dx2 + dy2 * dy2)
    targetX = ball.x
    targetY = ball.y
    // If ball is on our half, be defensive
    if (ball.x < FIELD_CENTER_X - 10) {
        targetX = FIELD_X + FIELD_W * 0.65
    }
    tdx = targetX - player2.x
    tdy = targetY - player2.y
    tdist = Math.sqrt(tdx * tdx + tdy * tdy)
    if (tdist > 1) {
        player2.vx += tdx / tdist * 0.25
        player2.vy += tdy / tdist * 0.25
    }
    speed2 = Math.sqrt(player2.vx * player2.vx + player2.vy * player2.vy)
    if (speed2 > AI_MAX_SPEED) {
        player2.vx = player2.vx / speed2 * AI_MAX_SPEED
        player2.vy = player2.vy / speed2 * AI_MAX_SPEED
    }
    player2.x += player2.vx
    player2.y += player2.vy
    constrainToField(player2, PLAYER_RADIUS)
    // AI kick ball
    if (distToBall < PLAYER_RADIUS + BALL_RADIUS + 2) {
        if (distToBall > 0.1) {
            goalDx = FIELD_X - ball.x
            goalDy = FIELD_CENTER_Y - ball.y + Math.random() * 30 - 15
            goalLen = Math.sqrt(goalDx * goalDx + goalDy * goalDy)
            if (goalLen > 0) {
                ball.vx = goalDx / goalLen * KICK_POWER * 0.95
                ball.vy = goalDy / goalLen * KICK_POWER * 0.95
            }
            if (Math.random() < 0.3) {
                music.play(music.tonePlayable(180, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
            }
        }
    } else if (distToBall < PLAYER_RADIUS + BALL_RADIUS + 1) {
        // Dribble
        if (speed2 > 0.3) {
            ball.vx = player2.vx * 1.1
            ball.vy = player2.vy * 1.1
        }
    }
}
// === BALL PHYSICS ===
function updateBall () {
    ball.vx *= BALL_FRICTION
ball.vy *= BALL_FRICTION
// Stop tiny movements
    if (Math.abs(ball.vx) < 0.02) {
        ball.vx = 0
    }
    if (Math.abs(ball.vy) < 0.02) {
        ball.vy = 0
    }
    // Cap speed
    ballSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
    if (ballSpeed > 8) {
        ball.vx = ball.vx / ballSpeed * 8
        ball.vy = ball.vy / ballSpeed * 8
    }
    // Move
    ball.x += ball.vx
    ball.y += ball.vy
    // Wall collisions (with goal exceptions)
    if (ball.x - BALL_RADIUS < FIELD_X) {
        if (ball.y > GOAL_TOP && ball.y < GOAL_BOTTOM) {
            // In goal area - let it through
            // Check for goal
            if (ball.x < FIELD_X - 4) {
                handleGoal(2)
                return
            }
        } else {
            ball.x = FIELD_X + BALL_RADIUS
            ball.vx = (0 - ball.vx) * BALL_RESTITUTION
            music.thump.play()
        }
    }
    if (ball.x + BALL_RADIUS > FIELD_X + FIELD_W) {
        if (ball.y > GOAL_TOP && ball.y < GOAL_BOTTOM) {
            if (ball.x > FIELD_X + FIELD_W + 4) {
                handleGoal(1)
                return
            }
        } else {
            ball.x = FIELD_X + FIELD_W - BALL_RADIUS
            ball.vx = (0 - ball.vx) * BALL_RESTITUTION
            music.thump.play()
        }
    }
    if (ball.y - BALL_RADIUS < FIELD_Y) {
        ball.y = FIELD_Y + BALL_RADIUS
        ball.vy = (0 - ball.vy) * BALL_RESTITUTION
    }
    if (ball.y + BALL_RADIUS > FIELD_Y + FIELD_H) {
        ball.y = FIELD_Y + FIELD_H - BALL_RADIUS
        ball.vy = (0 - ball.vy) * BALL_RESTITUTION
    }
}
// === CONSTRAINTS ===
function constrainToField (p: Sprite, radius: number) {
    if (p.x < FIELD_X + radius) {
        p.x = FIELD_X + radius
    }
    if (p.x > FIELD_X + FIELD_W - radius) {
        p.x = FIELD_X + FIELD_W - radius
    }
    if (p.y < FIELD_Y + radius) {
        p.y = FIELD_Y + radius
    }
    if (p.y > FIELD_Y + FIELD_H - radius) {
        p.y = FIELD_Y + FIELD_H - radius
    }
}
function makeTimerImage () {
    minutes = Math.floor(timeLeft / 60)
    seconds = timeLeft % 60
    let secStr = seconds < 10 ? "0" + seconds : "" + seconds
img_data4 = image.create(40, 10)
    img_data4.fill(0)
    img_data4.print(minutes + ":" + secStr, 4, 1, 15)
return img_data4
}
function createGoalkeeper (team: number) {
    img_data2 = GOALKEEPER_IMG.clone()
    q = sprites.create(img_data2, SpriteKind.Player)
    q.z = 5
    return q
}
// === GOAL HANDLING ===
function handleGoal (scoringTeam: number) {
    if (gameState != "play") {
        return
    }
    gameState = "goal"
    if (scoringTeam == 1) {
        scoreBlue += 1
    } else {
        scoreRed += 1
    }
    updateScoreDisplay()
    // Show goal message
    showGoalMessage(scoringTeam)
    // Goal sound
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Quarter)), music.PlaybackMode.InBackground)
    music.play(music.tonePlayable(659, music.beat(BeatFraction.Quarter)), music.PlaybackMode.InBackground)
    music.play(music.tonePlayable(784, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground)
    // Check win condition
    if (scoreBlue >= WIN_SCORE || scoreRed >= WIN_SCORE || timeLeft <= 0) {
        endGame()
    } else {
        // Reset positions after delay
        pause(2000)
        resetPositions()
        gameState = "play"
    }
}
function createPlayers () {
    player1 = createPlayer(1)
    player1.setPosition(FIELD_X + 35, FIELD_CENTER_Y)
    player2 = createPlayer(2)
    player2.setPosition(FIELD_X + FIELD_W - 35, FIELD_CENTER_Y)
    goalkeeper1 = createGoalkeeper(1)
    goalkeeper1.setPosition(FIELD_X + 6, FIELD_CENTER_Y)
    goalkeeper2 = createGoalkeeper(2)
    goalkeeper2.setPosition(FIELD_X + FIELD_W - 6, FIELD_CENTER_Y)
}
function showGoalMessage (team: number) {
    if (goalMessageSprite) {
        goalMessageSprite.destroy()
    }
    let msg = team === 1 ? "BLUE GOAL!" : "RED GOAL!"
msgImg = image.create(80, 16)
    msgImg.fill(0)
    msgImg.print(msg, 0, 4, team === 1 ? 1 : 3)
goalMessageSprite = sprites.create(msgImg, SpriteKind.Food)
    goalMessageSprite.setPosition(80, 30)
    goalMessageSprite.z = 30
    goalMessageSprite.setFlag(SpriteFlag.Ghost, true)
    goalMessageSprite.lifespan = 1500
}
function createHUD () {
    scoreSprite = sprites.create(makeScoreImage(), SpriteKind.Food)
    scoreSprite.setPosition(80, 4)
    scoreSprite.z = 20
    scoreSprite.setFlag(SpriteFlag.Ghost, true)
    scoreSprite.setFlag(SpriteFlag.RelativeToCamera, false)
    timerSprite = sprites.create(makeTimerImage(), SpriteKind.Food)
    timerSprite.setPosition(80, 112)
    timerSprite.z = 20
    timerSprite.setFlag(SpriteFlag.Ghost, true)
    timerSprite.setFlag(SpriteFlag.RelativeToCamera, false)
}
function updateScoreDisplay () {
    if (scoreSprite) {
        scoreSprite.setImage(makeScoreImage())
    }
}
function drawGoalNet (bg: Image, x: number, y: number, dir: number) {
    // Net pattern
    for (let j = 0; j <= 5; j++) {
        bg.drawLine(x, y + j * 7, x + dir * GOAL_DEPTH, y + j * 7 + (dir > 0 ? -1 : 1) * 3, 1)
    }
    for (let k = 0; k <= 3; k++) {
        bg.drawLine(x + dir * k * 3, y, x + dir * (k * 3 + 1), y + GOAL_HEIGHT, 1)
    }
}
// === UI ===
function makeScoreImage () {
    img_data3 = image.create(50, 12)
    img_data3.fill(0)
    img_data3.print(scoreBlue + " - " + scoreRed, 4, 2, 15)
return img_data3
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameState == "over") {
        return
    }
    game.splash("PAUSED", "Press A to resume")
    pauseUntil(() => controller.A.isPressed())
})
// === PLAYER MOVEMENT ===
function movePlayerWithInput (p: Sprite, maxSpeed: number, accel: number, friction: number) {
    if (controller.left.isPressed()) {
        ix += 0 - 1
    }
    if (controller.right.isPressed()) {
        ix += 1
    }
    if (controller.up.isPressed()) {
        iy += 0 - 1
    }
    if (controller.down.isPressed()) {
        iy += 1
    }
    if (ix != 0 || iy != 0) {
        len = Math.sqrt(ix * ix + iy * iy)
        ix = ix / len
        iy = iy / len
    }
    p.vx += ix * accel
    p.vy += iy * accel
    if (ix == 0) {
        p.vx *= friction
    }
    if (iy == 0) {
        p.vy *= friction
    }
    // Cap speed
    speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    if (speed > maxSpeed) {
        p.vx = p.vx / speed * maxSpeed
        p.vy = p.vy / speed * maxSpeed
    }
    return { ix: ix, iy: iy }
}
function updateGoalkeeper (keeper: Sprite, goalX: number, isLeft: boolean) {
    targetY2 = ball.y
    // Clamp to goal area
    if (targetY2 < GOAL_TOP + GOALKEEPER_RADIUS) {
        targetY2 = GOAL_TOP + GOALKEEPER_RADIUS
    }
    if (targetY2 > GOAL_BOTTOM - GOALKEEPER_RADIUS) {
        targetY2 = GOAL_BOTTOM - GOALKEEPER_RADIUS
    }
    if (isLeft) {
        chaseBall = ball.x < FIELD_X + 20
    } else {
        chaseBall = ball.x > FIELD_X + FIELD_W - 20
    }
    if (chaseBall) {
        // Move toward ball
        dx3 = ball.x - keeper.x
        dy3 = targetY2 - keeper.y
        dist2 = Math.sqrt(dx3 * dx3 + dy3 * dy3)
        if (dist2 > 1) {
        	
        }
    } else {
        // Track ball Y position
        dy4 = targetY2 - keeper.y
        keeper.vy += dy4 * 0.05
        keeper.vx *= 0.8
    }
    keeper.vx *= 0.85
keeper.vy *= 0.85
// Cap speed
    speed3 = Math.sqrt(keeper.vx * keeper.vx + keeper.vy * keeper.vy)
    if (speed3 > 1.8) {
        keeper.vx = keeper.vx / speed3 * 1.8
        keeper.vy = keeper.vy / speed3 * 1.8
    }
    keeper.x += keeper.vx
    keeper.y += keeper.vy
    constrainToField(keeper, GOALKEEPER_RADIUS)
}
// === PLAYERS ===
function createPlayer (team: number) {
    let img_data: Image
if (team == 1) {
        img_data = PLAYER1_IMG.clone()
    } else {
        img_data = PLAYER2_IMG.clone()
    }
    p = sprites.create(img_data, SpriteKind.Player)
    p.z = 5
    return p
}
// === FIELD DRAWING ===
function drawField () {
    bg = image.create(160, 120)
    // Red field with darker red stripes
    bg.fill(2)
    for (let i = 0; i <= 7; i++) {
        bg.fillRect(FIELD_X, FIELD_Y + i * 13, FIELD_W, 6, 4)
    }
    // Field outline
    bg.drawRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H, 6)
    bg.drawLine(FIELD_CENTER_X, FIELD_Y, FIELD_CENTER_X, FIELD_Y + FIELD_H, 6)
    bg.drawCircle(FIELD_CENTER_X, FIELD_CENTER_Y, 16, 6)
bg.fillRect(FIELD_CENTER_X - 1, FIELD_CENTER_Y - 1, 3, 3, 6)
    // Penalty boxes
    bg.drawRect(FIELD_X, FIELD_Y + 18, 22, GOAL_HEIGHT + 16, 6)
    bg.drawRect(FIELD_X + FIELD_W - 22, FIELD_Y + 18, 22, GOAL_HEIGHT + 16, 6)
    // Goal areas (small box)
    bg.drawRect(FIELD_X, GOAL_TOP - 6, 10, GOAL_HEIGHT + 12, 6)
    bg.drawRect(FIELD_X + FIELD_W - 10, GOAL_TOP - 6, 10, GOAL_HEIGHT + 12, 6)
    // Goals (with net pattern)
    drawGoalNet(bg, FIELD_X, GOAL_TOP, -1)
    drawGoalNet(bg, FIELD_X + FIELD_W, GOAL_TOP, 1)
    bg.drawCircle(FIELD_X + 4, FIELD_Y + 4, 4, 6)
bg.drawCircle(FIELD_X + FIELD_W - 4, FIELD_Y + 4, 4, 6)
bg.drawCircle(FIELD_X + 4, FIELD_Y + FIELD_H - 4, 4, 6)
bg.drawCircle(FIELD_X + FIELD_W - 4, FIELD_Y + FIELD_H - 4, 4, 6)
scene.setBackgroundImage(bg)
}
function updatePlayer1 () {
    input2 = movePlayerWithInput(player1, PLAYER_MAX_SPEED, PLAYER_ACCEL, PLAYER_FRICTION)
    player1.x += player1.vx
    player1.y += player1.vy
    constrainToField(player1, PLAYER_RADIUS)
    // Kick with A button
    dx = ball.x - player1.x
    dy = ball.y - player1.y
    dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < PLAYER_RADIUS + BALL_RADIUS + 2 && controller.A.isPressed()) {
        if (dist > 0.1) {
            // Determine kick direction
            inputMag = Math.sqrt(input.ix * input.ix + input.iy * input.iy)
            if (inputMag > 0.1) {
                // Kick in input direction
                ball.vx = input.ix * KICK_POWER
                ball.vy = input.iy * KICK_POWER
            } else {
                // Tap in player direction
                ball.vx = dx / dist * KICK_POWER
                ball.vy = dy / dist * KICK_POWER
            }
            music.play(music.tonePlayable(220, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        }
    } else if (dist < PLAYER_RADIUS + BALL_RADIUS + 1) {
        // Dribble: ball moves with player
        if (input.ix != 0 || input.iy != 0) {
            ball.x = player1.x + input.ix * (PLAYER_RADIUS + BALL_RADIUS)
            ball.y = player1.y + input.iy * (PLAYER_RADIUS + BALL_RADIUS)
            ball.vx = player1.vx * 1.1
            ball.vy = player1.vy * 1.1
        }
    }
}
function ballGoalkeeperCollision (keeper: Sprite) {
    dx5 = ball.x - keeper.x
    dy6 = ball.y - keeper.y
    dist4 = Math.sqrt(dx5 * dx5 + dy6 * dy6)
    minDist2 = BALL_RADIUS + GOALKEEPER_RADIUS
    if (dist4 < minDist2 && dist4 > 0.01) {
        overlap2 = minDist2 - dist4
        nx2 = dx5 / dist4
        ny2 = dy6 / dist4
        ball.x += nx2 * overlap2
        ball.y += ny2 * overlap2
        // Goalkeeper punches ball away
        power2 = 2.5
        ball.vx = nx2 * power2 + keeper.vx * 0.5
        ball.vy = ny2 * power2 + keeper.vy * 0.5
    }
}
let tick = 0
let elapsed = 0
let power2 = 0
let ny2 = 0
let nx2 = 0
let overlap2 = 0
let minDist2 = 0
let dist4 = 0
let dy6 = 0
let dx5 = 0
let inputMag = 0
let dist = 0
let dy = 0
let dx = 0
let input2 = 0
let bg: Image = null
let p: Sprite = null
let speed3 = 0
let dy4 = 0
let dist2 = 0
let dy3 = 0
let dx3 = 0
let chaseBall = false
let targetY2 = 0
let speed = 0
let len = 0
let img_data3: Image = null
let scoreSprite: Sprite = null
let msgImg: Image = null
let goalMessageSprite: Sprite = null
let q: Sprite = null
let img_data2: Image = null
let img_data4: Image = null
let seconds = 0
let minutes = 0
let ballSpeed = 0
let goalLen = 0
let goalDy = 0
let goalDx = 0
let speed2 = 0
let tdist = 0
let tdy = 0
let tdx = 0
let targetY = 0
let targetX = 0
let distToBall = 0
let dy2 = 0
let dx2 = 0
let goalkeeper2: Sprite = null
let goalkeeper1: Sprite = null
let player2: Sprite = null
let player1: Sprite = null
let transfer = 0
let playerDot = 0
let ballDot = 0
let ny = 0
let nx = 0
let overlap = 0
let minDist = 0
let dist3 = 0
let dy5 = 0
let dx4 = 0
let timerSprite: Sprite = null
let timeLeft = 0
let gameState = ""
let WIN_SCORE = 0
let KICK_POWER = 0
let BALL_RESTITUTION = 0
let AI_MAX_SPEED = 0
let PLAYER_FRICTION = 0
let PLAYER_ACCEL = 0
let PLAYER_MAX_SPEED = 0
let GOALKEEPER_RADIUS = 0
let PLAYER_RADIUS = 0
let BALL_RADIUS = 0
let GOAL_DEPTH = 0
let GOAL_BOTTOM = 0
let GOAL_TOP = 0
let GOAL_HEIGHT = 0
let FIELD_CENTER_Y = 0
let FIELD_CENTER_X = 0
let FIELD_H = 0
let FIELD_W = 0
let FIELD_Y = 0
let FIELD_X = 0
let GOALKEEPER_IMG: Image = null
let PLAYER2_IMG: Image = null
let PLAYER1_IMG: Image = null
let BALL_IMG: Image = null
let scoreRed = 0
let scoreBlue = 0
// === STATE ===
let ball: Sprite = null
let iy = 0
let ix = 0
// Ball (16x16, with shading)
BALL_IMG = img`
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
// Blue team player (16x16 with face)
PLAYER1_IMG = img`
    . . . . . . 1 1 1 1 . . . . . . 
    . . . . 1 1 1 1 1 1 1 1 . . . . 
    . . . 1 1 f f f f f f 1 1 . . . 
    . . 1 1 f f f f f f f f 1 1 . . 
    . . 1 f f 8 8 f f 8 8 f f 1 . . 
    . . 1 f f 8 8 f f 8 8 f f 1 . . 
    . . 1 f f f f f f f f f f 1 . . 
    . . 1 f f f f 1 1 f f f f 1 . . 
    . . 1 1 f f f 1 1 f f f 1 1 . . 
    . . . 1 f f f f f f f f 1 . . . 
    . . . 1 1 1 1 1 1 1 1 1 1 . . . 
    . . 1 1 1 1 1 1 1 1 1 1 1 1 . . 
    . . 1 1 b b 1 1 1 1 b b 1 1 . . 
    . . 1 1 b b 1 1 1 1 b b 1 1 . . 
    . . . 1 1 1 . . . . 1 1 1 . . . 
    . . . . . . . . . . . . . . . . 
    `
// Red team player (16x16 with face)
PLAYER2_IMG = img`
    . . . . . . 3 3 3 3 . . . . . . 
    . . . . 3 3 3 3 3 3 3 3 . . . . 
    . . . 3 3 f f f f f f 3 3 . . . 
    . . 3 3 f f f f f f f f 3 3 . . 
    . . 3 f f 8 8 f f 8 8 f f 3 . . 
    . . 3 f f 8 8 f f 8 8 f f 3 . . 
    . . 3 f f f f f f f f f f 3 . . 
    . . 3 f f f f 3 3 f f f f 3 . . 
    . . 3 3 f f f 3 3 f f f 3 3 . . 
    . . . 3 f f f f f f f f 3 . . . 
    . . . 3 3 3 3 3 3 3 3 3 3 . . . 
    . . 3 3 3 3 3 3 3 3 3 3 3 3 . . 
    . . 3 3 b b 3 3 3 3 b b 3 3 . . 
    . . 3 3 b b 3 3 3 3 b b 3 3 . . 
    . . . 3 3 3 . . . . 3 3 3 . . . 
    . . . . . . . . . . . . . . . . 
    `
// Goalkeeper (12x12)
GOALKEEPER_IMG = img`
    . . . . . . . . . . . . 
    . . . . 7 7 7 7 . . . . 
    . . . 7 f f f f 7 . . . 
    . . 7 f 8 8 f 8 8 7 . . 
    . . 7 f 8 8 f 8 8 7 . . 
    . . 7 f f f f f f 7 . . 
    . . 7 7 f f f f 7 7 . . 
    . . . 7 7 7 7 7 7 . . . 
    . . . 7 b b b b 7 . . . 
    . . . 7 b 7 7 b 7 . . . 
    . . . . 7 7 7 7 . . . . 
    . . . . . . . . . . . . 
    `
// === CONSTANTS ===
FIELD_X = 4
FIELD_Y = 12
FIELD_W = 152
FIELD_H = 100
FIELD_CENTER_X = FIELD_X + FIELD_W / 2
FIELD_CENTER_Y = FIELD_Y + FIELD_H / 2
let GOAL_WIDTH = 4
GOAL_HEIGHT = 36
GOAL_TOP = FIELD_CENTER_Y - GOAL_HEIGHT / 2
GOAL_BOTTOM = GOAL_TOP + GOAL_HEIGHT
GOAL_DEPTH = 8
BALL_RADIUS = 6
PLAYER_RADIUS = 7
GOALKEEPER_RADIUS = 5
PLAYER_MAX_SPEED = 2.4
PLAYER_ACCEL = 0.4
PLAYER_FRICTION = 0.82
AI_MAX_SPEED = 2
let BALL_FRICTION = 0.985
BALL_RESTITUTION = 0.7
KICK_POWER = 4.5
let DRIBBLE_POWER = 0.8
let PASS_POWER = 2.5
let GOAL_LINE_X_LEFT = FIELD_X
let GOAL_LINE_X_RIGHT = FIELD_X + FIELD_W
let MATCH_LENGTH = 120
WIN_SCORE = 5
// "play", "goal", "over"
gameState = "play"
timeLeft = MATCH_LENGTH
let lastSecondTick = -1
// === MAIN LOOP ===
game.splash("ARCADE SOCCER", "D-pad: Move | A: Kick")
drawField()
createPlayers()
createBall()
createHUD()
game.onUpdate(function () {
    if (gameState == "over") {
        return
    }
    if (gameState == "play") {
        updatePlayer1()
        updateAIPlayer()
        updateGoalkeeper(goalkeeper1, FIELD_X, true)
        updateGoalkeeper(goalkeeper2, FIELD_X + FIELD_W, false)
        updateBall()
        // Ball-player collisions
        ballPlayerCollision(player1, true)
        ballPlayerCollision(player2, false)
        ballGoalkeeperCollision(goalkeeper1)
        ballGoalkeeperCollision(goalkeeper2)
    }
    // Timer
    elapsed = game.runtime() / 1000
    tick = Math.floor(elapsed)
    if (tick != lastSecondTick) {
        lastSecondTick = tick
        timeLeft += 0 - 1
        if (timeLeft < 0) {
            timeLeft = 0
        }
        updateTimerDisplay()
        if (timeLeft <= 0 && gameState == "play") {
            endGame()
        }
    }
})
