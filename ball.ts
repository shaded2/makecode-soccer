// === BALL PHYSICS ===

let ball: Sprite = null

function createBall(): void {
    ball = sprites.create(BALL_IMG, SpriteKind.Projectile)
    ball.setPosition(80, 62)
    ball.z = 10
}

function resetBall(): void {
    ball.setPosition(80, 62)
    ball.vx = 0
    ball.vy = 0
}

function updateBall(): void {
    ball.vx *= BALL_FRICTION
    ball.vy *= BALL_FRICTION

    if (Math.abs(ball.vx) < 0.02) ball.vx = 0
    if (Math.abs(ball.vy) < 0.02) ball.vy = 0

    let ballSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
    if (ballSpeed > 8) {
        ball.vx = ball.vx / ballSpeed * 8
        ball.vy = ball.vy / ballSpeed * 8
    }

    ball.x += ball.vx
    ball.y += ball.vy

    // Left wall
    if (ball.x - BALL_RADIUS < FIELD_X) {
        if (ball.y <= GOAL_TOP || ball.y >= GOAL_BOTTOM) {
            ball.x = FIELD_X + BALL_RADIUS
            ball.vx = -ball.vx * BALL_RESTITUTION
            playThumpSound()
        }
    }

    // Right wall
    if (ball.x + BALL_RADIUS > FIELD_X + FIELD_W) {
        if (ball.y <= GOAL_TOP || ball.y >= GOAL_BOTTOM) {
            ball.x = FIELD_X + FIELD_W - BALL_RADIUS
            ball.vx = -ball.vx * BALL_RESTITUTION
            playThumpSound()
        }
    }

    // Top/bottom walls
    if (ball.y - BALL_RADIUS < FIELD_Y) {
        ball.y = FIELD_Y + BALL_RADIUS
        ball.vy = -ball.vy * BALL_RESTITUTION
    }
    if (ball.y + BALL_RADIUS > FIELD_Y + FIELD_H) {
        ball.y = FIELD_Y + FIELD_H - BALL_RADIUS
        ball.vy = -ball.vy * BALL_RESTITUTION
    }
}

function pushBallFromSprite(s: Sprite, radius: number, power: number): void {
    let dx = ball.x - s.x
    let dy = ball.y - s.y
    let dist = Math.sqrt(dx * dx + dy * dy)
    let minDist = BALL_RADIUS + radius

    if (dist < minDist && dist > 0.01) {
        let nx = dx / dist
        let ny = dy / dist
        let overlap = minDist - dist
        ball.x += nx * overlap
        ball.y += ny * overlap

        if (power > 0) {
            ball.vx += nx * power
            ball.vy += ny * power
        }

        let ballDot = ball.vx * nx + ball.vy * ny
        let spriteDot = s.vx * nx + s.vy * ny
        if (ballDot < spriteDot) {
            let transfer = (spriteDot - ballDot) * 1.2
            ball.vx += nx * transfer
            ball.vy += ny * transfer
        }

        s.x -= nx * overlap * 0.3
        s.y -= ny * overlap * 0.3
    }
}