// === FIELD ===

function drawField(): void {
    let bg = image.create(160, 120)

    // Red field with darker red stripes
    bg.fill(2)
    for (let i = 0; i < 8; i++) {
        bg.fillRect(FIELD_X, FIELD_Y + i * 13, FIELD_W, 6, 4)
    }

    // Field outline and markings
    bg.drawRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H, 6)
    bg.drawLine(FIELD_CENTER_X, FIELD_Y, FIELD_CENTER_X, FIELD_Y + FIELD_H, 6)
    bg.drawCircle(FIELD_CENTER_X, FIELD_CENTER_Y, 16, 6)
    bg.fillRect(FIELD_CENTER_X - 1, FIELD_CENTER_Y - 1, 3, 3, 6)

    // Penalty boxes
    bg.drawRect(FIELD_X, FIELD_Y + 18, 22, GOAL_HEIGHT + 16, 6)
    bg.drawRect(FIELD_X + FIELD_W - 22, FIELD_Y + 18, 22, GOAL_HEIGHT + 16, 6)

    // Goal areas
    bg.drawRect(FIELD_X, GOAL_TOP - 6, 10, GOAL_HEIGHT + 12, 6)
    bg.drawRect(FIELD_X + FIELD_W - 10, GOAL_TOP - 6, 10, GOAL_HEIGHT + 12, 6)

    // Goals
    drawGoalNet(bg, FIELD_X, GOAL_TOP, -1)
    drawGoalNet(bg, FIELD_X + FIELD_W, GOAL_TOP, 1)

    // Corner arcs
    bg.drawCircle(FIELD_X + 4, FIELD_Y + 4, 4, 6)
    bg.drawCircle(FIELD_X + FIELD_W - 4, FIELD_Y + 4, 4, 6)
    bg.drawCircle(FIELD_X + 4, FIELD_Y + FIELD_H - 4, 4, 6)
    bg.drawCircle(FIELD_X + FIELD_W - 4, FIELD_Y + FIELD_H - 4, 4, 6)

    scene.setBackgroundImage(bg)
}

function drawGoalNet(bg: Image, x: number, y: number, dir: number): void {
    for (let i = 0; i < 6; i++) {
        bg.drawLine(x, y + i * 7, x + dir * GOAL_DEPTH, y + i * 7 + (dir > 0 ? -1 : 1) * 3, 1)
    }
    for (let i = 0; i <= 3; i++) {
        bg.drawLine(x + dir * i * 3, y, x + dir * (i * 3 + 1), y + GOAL_HEIGHT, 1)
    }
}