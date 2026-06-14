// === AI OPPONENT ===

let aiPlayer: Sprite = null

function createAI(): void {
    aiPlayer = sprites.create(P2_IMG, SpriteKind.Player)
    aiPlayer.setPosition(FIELD_X + FIELD_W - 35, FIELD_CENTER_Y)
    aiPlayer.z = 5
}

function resetAI(): void {
    aiPlayer.setPosition(FIELD_X + FIELD_W - 35, FIELD_CENTER_Y)
    aiPlayer.vx = 0
    aiPlayer.vy = 0
}

function updateAI(): void {
    let targetX = ball.x
    let targetY = ball.y

    if (ball.x < FIELD_CENTER_X - 10) {
        targetX = FIELD_X + FIELD_W * 0.65
    }

    let dx = targetX - aiPlayer.x
    let dy = targetY - aiPlayer.y
    let dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 1) {
        aiPlayer.vx += (dx / dist) * 0.25
        aiPlayer.vy += (dy / dist) * 0.25
    }

    let speed = Math.sqrt(aiPlayer.vx * aiPlayer.vx + aiPlayer.vy * aiPlayer.vy)
    if (speed > AI_MAX_SPEED) {
        aiPlayer.vx = aiPlayer.vx / speed * AI_MAX_SPEED
        aiPlayer.vy = aiPlayer.vy / speed * AI_MAX_SPEED
    }

    aiPlayer.x += aiPlayer.vx
    aiPlayer.y += aiPlayer.vy
    constrainToField(aiPlayer, PLAYER_RADIUS)

    pushBallFromSprite(aiPlayer, PLAYER_RADIUS, 0)

    let ballDx = ball.x - aiPlayer.x
    let ballDy = ball.y - aiPlayer.y
    let ballDist = Math.sqrt(ballDx * ballDx + ballDy * ballDy)

    if (ballDist < PLAYER_RADIUS + BALL_RADIUS + 2 && ballDist > 0.1) {
        let goalDx = FIELD_X - ball.x
        let goalDy = FIELD_CENTER_Y - ball.y + Math.randomRange(-15, 15)
        let goalLen = Math.sqrt(goalDx * goalDx + goalDy * goalDy)
        if (goalLen > 0) {
            ball.vx = (goalDx / goalLen) * KICK_POWER * 0.95
            ball.vy = (goalDy / goalLen) * KICK_POWER * 0.95
        }
        playKickSound()
    } else if (ballDist < PLAYER_RADIUS + BALL_RADIUS + 1 && speed > 0.3) {
        ball.vx = aiPlayer.vx * 1.1
        ball.vy = aiPlayer.vy * 1.1
    }
}