// === MAIN ENTRY POINT ===
import { drawField } from "./field"
import { createBall, updateBall } from "./ball"
import { createPlayers, updateP1, updateGoalkeeper, keeper1, keeper2, resetPlayerPositions } from "./players"
import { createAI, updateAI, resetAI } from "./ai"
import { createHUD, updateTimerDisplay } from "./ui"
import { startGame, updateTimer, gameState } from "./game"

drawField()
createPlayers()
createAI()
createBall()
createHUD()

startGame()
updateTimerDisplay()

game.onUpdate(function () {
    if (gameState === "over") return

    if (gameState === "play") {
        updateP1()
        updateAI()
        updateGoalkeeper(keeper1, true)
        updateGoalkeeper(keeper2, false)
        updateBall()
    }

    updateTimer()
})

// Keep references alive for potential external access
if (false) {
    resetPlayerPositions()
    resetAI()
}