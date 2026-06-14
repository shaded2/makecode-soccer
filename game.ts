// === GAME LOGIC: GOALS, TIMER, MAIN LOOP ===

let scoreBlue = 0
let scoreRed = 0
let timeLeft = MATCH_LENGTH
let gameState = "play"
let lastSecondTick = -1

function resetGame(): void {
    scoreBlue = 0
    scoreRed = 0
    timeLeft = MATCH_LENGTH
    gameState = "play"
    lastSecondTick = -1
    resetBall()
    resetPlayerPositions()
    resetAI()
    updateScoreDisplay()
    updateTimerDisplay()
}

function startGame(): void {
    game.splash("ARCADE SOCCER", "D-pad: Move | A: Kick | MENU: Pause")
    resetGame()
}

function handleGoal(scoringTeam: number): void {
    if (gameState !== "play") return
    gameState = "goal"

    if (scoringTeam === 1) {
        scoreBlue += 1
    } else {
        scoreRed += 1
    }
    updateScoreDisplay()

    if (scoringTeam === 1) {
        showMessage("BLUE GOAL!", 1)
    } else {
        showMessage("RED GOAL!", 2)
    }
    playGoalSound()

    if (scoreBlue >= WIN_SCORE || scoreRed >= WIN_SCORE || timeLeft <= 0) {
        endGame()
    } else {
        control.runInParallel(function () {
            pause(1500)
            resetBall()
            resetPlayerPositions()
            resetAI()
            gameState = "play"
        })
    }
}

function endGame(): void {
    gameState = "over"
    control.runInParallel(function () {
        pause(500)
        if (scoreBlue > scoreRed) {
            game.splash("BLUE WINS!", scoreBlue + " - " + scoreRed)
            game.over(true, effects.confetti)
        } else if (scoreRed > scoreBlue) {
            game.splash("RED WINS!", scoreRed + " - " + scoreBlue)
            game.over(false, effects.slash)
        } else {
            game.splash("DRAW!", scoreBlue + " - " + scoreRed)
        }
    })
}

function updateTimer(): void {
    let elapsed = game.runtime() / 1000
    let tick = Math.floor(elapsed)
    if (tick !== lastSecondTick) {
        lastSecondTick = tick
        timeLeft -= 1
        if (timeLeft < 0) timeLeft = 0
        updateTimerDisplay()
        if (timeLeft <= 0 && gameState === "play") {
            endGame()
        }
    }
}

function checkGoals(): void {
    if (gameState !== "play") return

    if (ball.x < FIELD_X - 4 && ball.y > GOAL_TOP && ball.y < GOAL_BOTTOM) {
        handleGoal(2)
        return
    }
    if (ball.x > FIELD_X + FIELD_W + 4 && ball.y > GOAL_TOP && ball.y < GOAL_BOTTOM) {
        handleGoal(1)
        return
    }
}

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameState === "over") return
    game.splash("PAUSED", "A to resume")
    pauseUntil(() => controller.A.isPressed())
})