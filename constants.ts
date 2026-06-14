// === CONSTANTS ===
// Field
export const FIELD_X = 4
export const FIELD_Y = 12
export const FIELD_W = 152
export const FIELD_H = 100
export const FIELD_CENTER_X = FIELD_X + FIELD_W / 2
export const FIELD_CENTER_Y = FIELD_Y + FIELD_H / 2

// Goals
export const GOAL_WIDTH = 4
export const GOAL_HEIGHT = 36
export const GOAL_TOP = FIELD_CENTER_Y - GOAL_HEIGHT / 2
export const GOAL_BOTTOM = GOAL_TOP + GOAL_HEIGHT
export const GOAL_DEPTH = 8
export const GOAL_LINE_LEFT = FIELD_X
export const GOAL_LINE_RIGHT = FIELD_X + FIELD_W

// Sizes
export const BALL_RADIUS = 6
export const PLAYER_RADIUS = 7
export const GOALKEEPER_RADIUS = 5

// Movement
export const PLAYER_MAX_SPEED = 2.4
export const PLAYER_ACCEL = 0.4
export const PLAYER_FRICTION = 0.82
export const AI_MAX_SPEED = 2.0
export const GOALKEEPER_MAX_SPEED = 1.8

// Ball physics
export const BALL_FRICTION = 0.985
export const BALL_RESTITUTION = 0.7
export const KICK_POWER = 4.5
export const DRIBBLE_POWER = 0.8
export const PASS_POWER = 2.5

// Game rules
export const MATCH_LENGTH = 120
export const WIN_SCORE = 5

// Colors
export const COLOR_RED = 2
export const COLOR_DARK_RED = 4
export const COLOR_BLUE = 1
export const COLOR_DARK_BLUE = 8
export const COLOR_WHITE = 1
export const COLOR_BLACK = 15
export const COLOR_SKIN = 4
export const COLOR_GOLD = 5
export const COLOR_GREY = 11