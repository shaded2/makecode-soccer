// === CONSTANTS ===
// Field
const FIELD_X = 4
const FIELD_Y = 12
const FIELD_W = 152
const FIELD_H = 100
const FIELD_CENTER_X = FIELD_X + FIELD_W / 2
const FIELD_CENTER_Y = FIELD_Y + FIELD_H / 2

// Goals
const GOAL_WIDTH = 4
const GOAL_HEIGHT = 36
const GOAL_TOP = FIELD_CENTER_Y - GOAL_HEIGHT / 2
const GOAL_BOTTOM = GOAL_TOP + GOAL_HEIGHT
const GOAL_DEPTH = 8
const GOAL_LINE_LEFT = FIELD_X
const GOAL_LINE_RIGHT = FIELD_X + FIELD_W

// Sizes
const BALL_RADIUS = 6
const PLAYER_RADIUS = 7
const GOALKEEPER_RADIUS = 5

// Movement
const PLAYER_MAX_SPEED = 2.4
const PLAYER_ACCEL = 0.4
const PLAYER_FRICTION = 0.82
const AI_MAX_SPEED = 2.0
const GOALKEEPER_MAX_SPEED = 1.8

// Ball physics
const BALL_FRICTION = 0.985
const BALL_RESTITUTION = 0.7
const KICK_POWER = 4.5
const DRIBBLE_POWER = 0.8
const PASS_POWER = 2.5

// Game rules
const MATCH_LENGTH = 120
const WIN_SCORE = 5

// Colors
const COLOR_RED = 2
const COLOR_DARK_RED = 4
const COLOR_BLUE = 1
const COLOR_DARK_BLUE = 8
const COLOR_WHITE = 1
const COLOR_BLACK = 15
const COLOR_SKIN = 4
const COLOR_GOLD = 5
const COLOR_GREY = 11