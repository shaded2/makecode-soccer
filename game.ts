// === GAME LOGIC: GOALS, TIMER, MAIN LOOP ===
import { ball, resetBall } from "./ball"
import { resetPlayerPositions } from "./players"
import { resetAI } from "./ai"
import { updateScoreDisplay, updateTimerDisplay, showMessage } from "./ui"
import { playGoalSound, playWhistleSound } from "./assets"

export let scoreBlue = 0
export let scoreRed = 0
export let timeLeft = MATCH_LENGTH
export let gameState = "play"
let lastSecondTick = -1

export function resetGame(): void {
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

export function startGame(): void {
    game.splash("ARCADE SOCCER", "D-pad: Move | A: Kick | MENU: Pause")
    resetGame()
}

export function handleGoal(scoringTeam: number): void {
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

export function endGame(): void {
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

export function updateTimer(): void {
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

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameState === "over") return
    game.splash("PAUSED", "A to resume")
    pauseUntil(() => controller.A.isPressed())
})