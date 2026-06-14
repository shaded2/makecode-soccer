// === MAIN ENTRY POINT ===

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
        checkGoals()
    }

    updateTimer()
})