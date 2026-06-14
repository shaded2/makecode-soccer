// === PLAYERS & INPUT ===
import {
    FIELD_X, FIELD_Y, FIELD_W, FIELD_H, FIELD_CENTER_Y,
    PLAYER_RADIUS, GOALKEEPER_RADIUS,
    PLAYER_MAX_SPEED, PLAYER_ACCEL, PLAYER_FRICTION,
    KICK_POWER, DRIBBLE_POWER, BALL_RADIUS
} from "./constants"
import { ball, pushBallFromSprite } from "./ball"
import { P1_IMG, KEEPER_IMG, playKickSound } from "./assets"

export let p1: Sprite = null
export let keeper1: Sprite = null
export let keeper2: Sprite = null

export function createPlayers(): void {
    p1 = sprites.create(P1_IMG, SpriteKind.Player)
    p1.setPosition(FIELD_X + 35, FIELD_CENTER_Y)
    p1.z = 5

    keeper1 = sprites.create(KEEPER_IMG, SpriteKind.Player)
    keeper1.setPosition(FIELD_X + 6, FIELD_CENTER_Y)
    keeper1.z = 5

    keeper2 = sprites.create(KEEPER_IMG, SpriteKind.Player)
    keeper2.setPosition(FIELD_X + FIELD_W - 6, FIELD_CENTER_Y)
    keeper2.z = 5
}

export function resetPlayerPositions(): void {
    p1.setPosition(FIELD_X + 35, FIELD_CENTER_Y)
    p1.vx = 0
    p1.vy = 0
    keeper1.setPosition(FIELD_X + 6, FIELD_CENTER_Y)
    keeper1.vx = 0
    keeper1.vy = 0
    keeper2.setPosition(FIELD_X + FIELD_W - 6, FIELD_CENTER_Y)
    keeper2.vx = 0
    keeper2.vy = 0
}

export function constrainToField(s: Sprite, radius: number): void {
    if (s.x < FIELD_X + radius) s.x = FIELD_X + radius
    if (s.x > FIELD_X + FIELD_W - radius) s.x = FIELD_X + FIELD_W - radius
    if (s.y < FIELD_Y + radius) s.y = FIELD_Y + radius
    if (s.y > FIELD_Y + FIELD_H - radius) s.y = FIELD_Y + FIELD_H - radius
}

export function updateP1(): void {
    let stickInput = readStickInput()
    let magnitude = Math.sqrt(stickInput.ix * stickInput.ix + stickInput.iy * stickInput.iy)

    if (magnitude > 0) {
        p1.vx += (stickInput.ix / magnitude) * PLAYER_ACCEL
        p1.vy += (stickInput.iy / magnitude) * PLAYER_ACCEL
    } else {
        p1.vx *= PLAYER_FRICTION
        p1.vy *= PLAYER_FRICTION
    }

    capSpeed(p1, PLAYER_MAX_SPEED)

    p1.x += p1.vx
    p1.y += p1.vy
    constrainToField(p1, PLAYER_RADIUS)

    // Collide ball
    pushBallFromSprite(p1, PLAYER_RADIUS, 0)

    let dx = ball.x - p1.x
    let dy = ball.y - p1.y
    let dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < PLAYER_RADIUS + BALL_RADIUS + 2 && controller.A.isPressed()) {
        let kickDir = { ix: 0, iy: 0 }
        if (magnitude > 0.1) {
            kickDir.ix = stickInput.ix / magnitude
            kickDir.iy = stickInput.iy / magnitude
        } else if (dist > 0.1) {
            kickDir.ix = dx / dist
            kickDir.iy = dy / dist
        }
        ball.vx = kickDir.ix * KICK_POWER
        ball.vy = kickDir.iy * KICK_POWER
        playKickSound()
    } else if (dist < PLAYER_RADIUS + BALL_RADIUS + 1 && magnitude > 0.1) {
        // Dribble
        ball.x = p1.x + (stickInput.ix / magnitude) * (PLAYER_RADIUS + BALL_RADIUS)
        ball.y = p1.y + (stickInput.iy / magnitude) * (PLAYER_RADIUS + BALL_RADIUS)
        ball.vx = p1.vx * 1.1 + (stickInput.ix / magnitude) * DRIBBLE_POWER
        ball.vy = p1.vy * 1.1 + (stickInput.iy / magnitude) * DRIBBLE_POWER
    }
}

function readStickInput(): { ix: number, iy: number } {
    let ix = 0
    let iy = 0
    if (controller.left.isPressed()) ix -= 1
    if (controller.right.isPressed()) ix += 1
    if (controller.up.isPressed()) iy -= 1
    if (controller.down.isPressed()) iy += 1
    return { ix: ix, iy: iy }
}

function capSpeed(s: Sprite, max: number): void {
    let speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
    if (speed > max) {
        s.vx = s.vx / speed * max
        s.vy = s.vy / speed * max
    }
}

export function updateGoalkeeper(keeper: Sprite, isLeft: boolean): void {
    let targetY = ball.y
    if (targetY < FIELD_CENTER_Y - GOALKEEPER_RADIUS - 12) targetY = FIELD_CENTER_Y - GOALKEEPER_RADIUS - 12
    if (targetY > FIELD_CENTER_Y + GOALKEEPER_RADIUS + 12) targetY = FIELD_CENTER_Y + GOALKEEPER_RADIUS + 12

    let chase = false
    if (isLeft) {
        chase = ball.x < FIELD_X + 22
    } else {
        chase = ball.x > FIELD_X + FIELD_W - 22
    }

    if (chase) {
        let dx = ball.x - keeper.x
        let dy = targetY - keeper.y
        let dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 1) {
            keeper.vx += (dx / dist) * 0.3
            keeper.vy += (dy / dist) * 0.3
        }
    } else {
        let dy = targetY - keeper.y
        keeper.vy += dy * 0.05
        keeper.vx *= 0.8
    }

    keeper.vx *= 0.85
    keeper.vy *= 0.85
    capSpeed(keeper, 1.8)

    keeper.x += keeper.vx
    keeper.y += keeper.vy
    constrainToField(keeper, GOALKEEPER_RADIUS)

    // Keeper collision with ball (punch away)
    let dx = ball.x - keeper.x
    let dy = ball.y - keeper.y
    let dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < GOALKEEPER_RADIUS + BALL_RADIUS + 1 && dist > 0.01) {
        let nx = dx / dist
        let ny = dy / dist
        let overlap = GOALKEEPER_RADIUS + BALL_RADIUS - dist
        ball.x += nx * overlap
        ball.y += ny * overlap
        ball.vx = nx * 3.0 + keeper.vx * 0.5
        ball.vy = ny * 3.0 + keeper.vy * 0.5
        playKickSound()
    }
}