axios.post("http://localhost:5000/user/login", {
	"username": "christian",
	"password": "christian"
})

// axios.get('http://localhost:5000/user/current').then((user)=>{
//     console.log(user)
// })


let x = document.getElementById("myAudio");

function playAudio() {
    x.play();
}
// select canvas
const cvs = document.getElementById("canvas")
const ctx = cvs.getContext("2d")

//  game vars and const 
let running = true
let frames = 0
let jumped = false
let slashed = false
let score = 0
let direction = false
let enemyArr = []
let bullets = []
let fires = []
let wavesArr = []
let idle = true
let facing = true
let potionsArr = []
let flying = false
let immune = false
let cooldown = false

for (let i = 1; i < 100; i++) {
    enemyArr.push({ x: i + 700, y: 360, health: 20 * i })
}

for (let i = 1; i < 100; i++) {
    potionsArr.push({ x: i + 790, y: 380 })
}

// load sprite

const potionEmpty = new Image()
potionEmpty.src = "img/health-empty.png"

const waveImg = new Image()
waveImg.src = "img/wave.png"

const potionImg = new Image()
potionImg.src = "img/Health Potion 1.png"

const bulletImg = new Image()
bulletImg.src = "img/bullet.png"

const blue = new Image()
blue.src = "img/blue.png"

const red = new Image()
red.src = "img/red.jpg"

const fireImg  = new Image()
fireImg.src = "img/Fogo_1.png"

const knight = new Image()
knight.src = "img/adventurer-v1.5-Sheet.png"

const knightInverse = new Image()
knightInverse.src = "img/02095342_adventurer-v1.5-Sheetcopy.png"

const start = new Image();
start.src = "img/iron-knight.png"

const hearts = new Image()
hearts.src = "img/heart_animated_2.png"

const enemySprite = new Image()
enemySprite.src = "img/wizard-attack.png"

const bossSprite = new Image()
bossSprite.src = "img/reddragonfly2.png"

const enemyDeath = new Image()
enemyDeath.src = "img/wizard death.png"

// Sound effects 

const error = new Audio()
error.volume = 0.3
error.src = "img/error.mp3"

const healing = new Audio()
healing.volume = 0.3
healing.src = "img/healing.mp3"

const jumpingSFX = new Audio()
jumpingSFX.volume = 0.3
jumpingSFX.src = "img/jumping-sfx.mp3"

const waveSound = new Audio()
waveSound.volume = 0.1
waveSound.src = "img/wave.mp3"

const dragonCry = new Audio()
dragonCry.volume = 0.3
dragonCry.src = "img/dragon-cry.mp3"

const walkingSFX = new Audio()
walkingSFX.volume = 0.3
walkingSFX.src = "img/walking-sfx.mp3"

const slashSFX = new Audio()
slashSFX.volume = 0.3
slashSFX.src = "img/sword-sfx.mp3"

const music = new Audio()
music.volume = 0.1
music.src = "img/Dark Cloud Soundtrack - The Village Festival.mp3"

// game current 
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// background infinite

var bg = new Image();
bg.src = "img/bg2.png";

let background = {
    src: "img/bg2.png",
    x: 0,
    y: 0
}


//  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%   MAIN CODE   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// controller 

document.addEventListener("click", function(e) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            music.play()
            break;
        case state.game:
            break;
        case state.over:
            window.location.reload()
            break;

    }
})

let controller = {


    left: false,
    right: false,
    up: false,
    keyListener: function(event) {

        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {

            case 37: // left key
                controller.left = key_state;
                facing = false
                break;
            case 38: // up key
                controller.up = key_state;
                jumpingSFX.play()
                break;
            case 39: // right key
                controller.right = key_state;
                facing = true
                break;
            case 32: // spacebar
                controller.space = key_state;
                break;
            case 83: // spacebar
                controller.s = key_state;
                waveSound.play()
                break;
            case 87: // spacebar
                controller.w = key_state;
                break;
        }

    }

};


// Enemies 


class bulletClass {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class wavesClass {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class fireClass {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

const enemy = {

    animation: [
        [{ sX: 100, sY: 200 },
            { sX: 1400, sY: 200 },
            { sX: 2700, sY: 200 },
            { sX: 4000, sY: 200 },
            { sX: 5300, sY: 200 },
            { sX: 1400, sY: 1500 },
            { sX: 1400, sY: 1500 },
            { sX: 1400, sY: 1500 },
            { sX: 1400, sY: 1500 },
            { sX: 1400, sY: 1500 },
            { sX: 6600, sY: 200 },
            { sX: 100, sY: 1500 },
        ],
        [{ sX: 160, sY: 0 },
            { sX: 240, sY: 0 },
            { sX: 320, sY: 0 },
            { sX: 400, sY: 0 },
            { sX: 480, sY: 0 },
            { sX: 560, sY: 0 },
            { sX: 640, sY: 0 },
            { sX: 720, sY: 0 },
            { sX: 720, sY: 0 },
            { sX: 720, sY: 0 },
            { sX: 720, sY: 0 },
            { sX: 720, sY: 0 }
        ]
    ],

    w: 1000,
    h: 1000,
    dw: 100,
    dh: 100,
    x: 200,
    y: 0,


    bulletPath: 0,
    attack: 1,

    frame: 0,

    draw: function() {

        if (enemyArr[0].health <= 0) {
            let enemy = enemyArr[0]
            let aniFrames = this.animation[1][this.frame]
            ctx.drawImage(enemyDeath, aniFrames.sX, aniFrames.sY, this.dw, this.dh, enemy.x, 345, 125, 125)
        } else {
            let enemy = enemyArr[0]
            let aniFrames = this.animation[0][this.frame]
            ctx.drawImage(enemySprite, aniFrames.sX, aniFrames.sY, this.w, this.h, enemy.x, enemy.y, 80, 80)
        }
    },


    right: function() {
        enemyArr[0].x -= 3
    },

    left: function() {
        enemyArr[0].x += 3
    },

    slashedd: function() {
        enemyArr[0].x -= 3
    },

    enemyStab: function() {
        enemyArr[0].x += 3
    },

    shoot: function() {
        if (this.frame == 11) {
            bullet = new bulletClass(enemyArr[0].x + 10, enemyArr[0].y + 30)
            bullets.push(bullet)
        }
    },

    bulletMoveLeft: function() {
        bullets.forEach(bullet => {


            if (controller.right) {
                bullet.x -= 6
                this.bulletPath += 6
            } else if (controller.left) {
                bullet.x -= 2
                this.bulletPath += 2
            } else {
                bullet.x -= 4
                this.bulletPath += 4
            }

            if (this.bulletPath >= 400) {
                bullets.shift()
                this.bulletPath = 0
            }
            if (bullet.x + 10 > hero.x && bullet.x < hero.x + 10 && bullet.y + 10 > hero.y && bullet.y < hero.y + 40 && immune == false) {
                immune = true
                score -= 10
                hero.health -= 1
                hero.x -= 3
                hero.y -= 10
                setTimeout(function() {
                    immune = false;
                }, 1100);

            }

            ctx.drawImage(bulletImg, 0, 0, 341, 218, bullet.x - 3, 392, 10, 15)

        })
    },

    update: function() {
        this.period = state.current == state.getReady ? 10 : 10;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % 12;
    },

}

// Hero 

const hero = {

    animation: [
        [{ sX: 50, sY: 40 },
            { sX: 100, sY: 40 },
            { sX: 150, sY: 40 },
            { sX: 200, sY: 40 },
            { sX: 250, sY: 40 },
            { sX: 300, sY: 40 }
        ],

        [{ sX: 0, sY: 0 },
            { sX: 50, sY: 0 },
            { sX: 100, sY: 0 },
            { sX: 150, sY: 0 },
            { sX: 100, sY: 0 },
            { sX: 50, sY: 0 }
        ],

        [{ sX: 150, sY: 80 },
            { sX: 150, sY: 80 },
            { sX: 150, sY: 80 },
            { sX: 200, sY: 80 },
            { sX: 200, sY: 80 },
            { sX: 200, sY: 80 }
        ],

        [{ sX: 285, sY: 40 },
            { sX: 235, sY: 40 },
            { sX: 185, sY: 40 },
            { sX: 135, sY: 40 },
            { sX: 85, sY: 40 },
            { sX: 35, sY: 40 }
        ],

        [{ sX: 150, sY: 480 },
            { sX: 300, sY: 480 },
            { sX: 0, sY: 520 },
            { sX: 50, sY: 520 },
            { sX: 150, sY: 480 },
            { sX: 300, sY: 480 }
        ],

        [{ sX: 300, sY: 295 },
            { sX: 0, sY: 333 },
            { sX: 50, sY: 333 },
            { sX: 100, sY: 333 },
            { sX: 150, sY: 333 },
            { sX: 200, sY: 333 }
        ],

        [{ sX: 335, sY: 0 },
            { sX: 285, sY: 0 },
            { sX: 235, sY: 0 },
            { sX: 185, sY: 0 },
            { sX: 235, sY: 0 },
            { sX: 285, sY: 0 }
        ],

        [{ sX: 335, sY: 480 },
            { sX: 285, sY: 480 },
            { sX: 235, sY: 480 },
            { sX: 185, sY: 480 },
            { sX: 235, sY: 480 },
            { sX: 285, sY: 480 }
        ],


        [{ sX: 200, sY: 517 },
            { sX: 150, sY: 517 },
            { sX: 100, sY: 517 },
            { sX: 200, sY: 517 },
            { sX: 150, sY: 517 },
            { sX: 100, sY: 517 }
        ]

    ],

    w: 40,
    h: 40,
    x: 20,
    y: 360,

    frame: 0,


    speed: 0,
    gravity: 0.25,
    jump: 6.5,

    potion: 0,
    chests: 0,
    health: 8,

    draw: function() {


        if (controller.up && this.y < 340) {
            let hero = this.animation[2][this.frame]
            ctx.drawImage(knight, hero.sX, hero.sY, this.w, this.h, this.x, this.y, 60, 80)
        } else if (controller.s) {
            let hero = this.animation[8][this.frame];
            ctx.drawImage(knight, hero.sX, hero.sY, 50, 40, this.x, this.y - 16, 80, 100)
        } else if (controller.right && facing == true) {
            let hero = this.animation[0][this.frame]
            ctx.drawImage(knight, hero.sX, hero.sY, this.w, this.h, this.x, this.y, 60, 80)
        } else if (controller.left && facing == false) {
            let hero = this.animation[3][this.frame]
            ctx.drawImage(knightInverse, hero.sX, hero.sY, this.w, this.h, this.x, this.y, 60, 80)
        } else if (controller.space && facing == true) {
            let hero = this.animation[4][this.frame]
            ctx.drawImage(knight, hero.sX, hero.sY, 60, 40, this.x, this.y - 20, 75, 95)
        } else if (this.health <= 0) {
            let hero = this.animation[5][this.frame]
            ctx.drawImage(knight, hero.sX, hero.sY, this.w, this.h, this.x, this.y, 60, 80)
        } else if (facing == true) {
            let hero = this.animation[1][this.frame];
            ctx.drawImage(knight, hero.sX, hero.sY, this.w, this.h, this.x, this.y, 60, 80)
        } else if (controller.space && facing == false) {
            let hero = this.animation[7][this.frame];
            ctx.drawImage(knightInverse, hero.sX, hero.sY, this.w, this.h, this.x, this.y, 60, 80)
        } else if (facing == false) {
            let hero = this.animation[6][this.frame];
            ctx.drawImage(knightInverse, hero.sX, hero.sY, this.w, this.h, this.x, this.y, 60, 80)
        }

    },

    // RANDOM MENU %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    menuDraw: function() {

        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        switch (this.health) {

            case (this.health = 8):
                ctx.drawImage(hearts, 0, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 0, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
            case (this.health = 7):
                ctx.drawImage(hearts, 17, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 0, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
            case (this.health = 6):
                ctx.drawImage(hearts, 17, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 0, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
            case (this.health = 5):
                ctx.drawImage(hearts, 34, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 0, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;

            case (this.health = 4):
                ctx.drawImage(hearts, 34, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 0, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
            case (this.health = 3):
                ctx.drawImage(hearts, 51, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 0, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
            case (this.health = 2):
                ctx.drawImage(hearts, 51, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 50, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
            case (this.health = 1):
                ctx.drawImage(hearts, 68, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 100, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
            case (this.health = 0):
                ctx.drawImage(hearts, 68, 0, 17, 20, 50, 460, 30, 30)
                ctx.drawImage(knight, 150, 335, 40, 40, 5, 450, 40, 40)
                ctx.drawImage(enemyDeath, 0, 0, 60, 70, 105, 450, 40, 40)
                ctx.drawImage(bossSprite, 0, 0, 200, 200, 220, 445, 60, 60)
                ctx.lineWidth = 2;
                ctx.font = "15px'Press Start 2P'";
                ctx.fillText(enemyArr[0].health, 160, 480);
                ctx.fillText(boss.health, 300, 480);
                ctx.fillText(`Score = ${score}`, 380, 480);
                break;
        }
    },


    jumping: function() {
        this.speed = -this.jump
        jumped = true
    },

    right: function() {
        this.x += 0.5
    },

    left: function() {
        this.x -= 3
    },

    slash: function() {
        this.x += 3
        slashed = true
    },

    stab: function() {
        this.x -= 3
    },

    isAlive: function() {
        if (hero.health <= 0) {
            state.current = 2
            setTimeout(function() {
                hero.w = 0
                hero.h = 0
            }, 750)
        }
    },

    wave: function() {
        flying = true
        waveslash = new wavesClass(this.x, this.y)
        wavesArr.push(waveslash)
    },

    waveMoveUp: function() {
        wavesArr.forEach(wave => {
            wave.y -= 7
            if (wave.y <= 0) {
                flying = false
                wavesArr.shift()
            }
            if (wave.x + 75 > boss.x && wave.x < boss.x + 75 && wave.y + 75 > boss.y && wave.y < boss.y + 75 && immune == false) {
                immune = true
                boss.health -= 25
                score += 25
                setTimeout(function() {
                    immune = false;
                }, 1100);
            }

            ctx.drawImage(waveImg, 0, 0, 49, 42, wave.x, wave.y, 90, 25)
        })
    },


    collision: function() {


        if (enemyArr[0].health > 0) {

            if (this.x + 25 > enemyArr[0].x && this.x < enemyArr[0].x + 25 && this.y + this.h > enemyArr[0].y && this.y < enemyArr[0].y + 25 && slashed == false && facing == true) {
                hero.x -= 60
                score -= 20
                enemyArr[0].x += 60
                hero.health -= 1
            } else if (this.x + 25 > potionsArr[0].x && this.x < potionsArr[0].x + 25 && this.y + this.h > potionsArr[0].y && this.y < potionsArr[0].y + 25) {
                if (hero.potion == 0) {
                    hero.potion = 1
                }
                potionsArr.shift()

            } else if (this.x + 25 > enemyArr[0].x && this.x < enemyArr[0].x + 25 && this.y + this.h > enemyArr[0].y && this.y < enemyArr[0].y + 25 && slashed == true && facing == true) {
                enemyArr[0].health -= 50
                enemy.frame = 0
                if (enemyArr[0].health <= 0) {
                    score += 100
                    setTimeout(function() {
                        enemyArr.shift();
                    }, 1100);
                }
                hero.x -= 60
                enemyArr[0].x += 60
            } else if (this.x + 25 > enemyArr[0].x && this.x < enemyArr[0].x + 25 && this.y + this.h > enemyArr[0].y && this.y < enemyArr[0].y + 25 && slashed == true && facing == false) {
                enemyArr[0].health -= 300
                enemy.frame = 0
                if (enemyArr[0].health <= 0) {
                    score += 100
                    setTimeout(function() {
                        enemyArr.shift();
                    }, 1100);
                }
                hero.x += 60
                enemyArr[0].x -= 60
            }

        }

    },

    update: function() {
        this.period = state.current == state.getReady ? 10 : 10;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % 6;

        if (state.current == state.getReady) {
            this.y = 360
        } else {
            this.speed += this.gravity;
            this.y += this.speed;
            if (this.y >= 360) {
                this.y = 360
                jumped = false
            }
        }
    }
}

// Potions 

const potion = {


    animation: [
        [{ sX: 0, sY: 10 },
            { sX: 0, sY: 40 },
            { sX: 0, sY: 50 },
            { sX: 0, sY: 40 },
            { sX: 0, sY: 20 },
            { sX: 0, sY: 10 },
        ]
    ],

    w: 500,
    h: 600,
    dw: 100,
    dh: 100,
    x: 200,
    y: 0,


    attack: 1,

    frame: 0,

    draw: function() {
        let potion = potionsArr[0]
        let aniFrames = this.animation[0][this.frame]
        ctx.drawImage(potionImg, aniFrames.sX, aniFrames.sY, this.w, this.h, potion.x, potion.y, 40, 40)
        if (hero.potion == 1) {
            ctx.drawImage(potionImg, 0, 0, 500, 600, 545, 453, 40, 40)
        } else {
            ctx.drawImage(potionEmpty, 0, 0, 500, 600, 545, 453, 40, 40)
        }
    },


    right: function() {
        potionsArr[0].x -= 3
    },

    left: function() {
        potionsArr[0].x += 3
    },

    slashedd: function() {
        potionsArr[0].x -= 3
    },

    enemyStab: function() {
        potionsArr[0].x += 3
    },

    update: function() {
        this.period = state.current == state.getReady ? 10 : 10;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % 6;
    },

}


// Boss

const boss = {
    animation: [{ sX: 10, sY: 0 },
        { sX: 220, sY: 0 },
        { sX: 430, sY: 0 },
        { sX: 640, sY: 0 },
        { sX: 10, sY: 160 },
        { sX: 220, sY: 160 },
        { sX: 430, sY: 160 },
        { sX: 640, sY: 160 },
        { sX: 220, sY: 320 },
        { sX: 220, sY: 320 },
        { sX: 430, sY: 320 },
        { sX: 640, sY: 320 },
        { sX: 10, sY: 470 },
        { sX: 220, sY: 470 },
        { sX: 430, sY: 470 },
        { sX: 640, sY: 470 }
    ],

    w: 185,
    h: 185,
    x: 0,
    y: 0,

    firePath: 0,
    health: 1000,
    attack: 1,
    frame: 0,

    draw: function() {
        let aniFrames = this.animation[this.frame]
        ctx.drawImage(bossSprite, aniFrames.sX, aniFrames.sY, this.w, this.h, this.x, -100, 300, 300)
    },


    right: function() {
        this.x += 1
    },

    left: function() {
        this.x -= 1
    },

    slashedd: function() {
        enemyArr[0].x -= 3
    },


    isDead: function() {
        if (this.health <= 0) {
            score += 3000
            dragonCry.play()
        }
    },

    update: function() {
        this.period = state.current == state.getReady ? 7 : 7;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % 16;
    },

    flying: function() {

        switch (direction) {

            case true: // left key
                this.right()
                break;
            case false: // up key
                this.left()
                break;
        }
    },

    bossDirection: function() {
        if (this.x <= 0) {
            direction = true
        } else if (this.x > 350) {
            direction = false
        }
    },


    shoot: function() {
        if (this.frame == 8) {
            fire = new fireClass(this.x + 130, 70 )
            fires.push(fire)
        }
    },

    bulletMoveLeft: function() {
        fires.forEach(fire => {

            if (controller.right) {
                fire.y += 3
                this.firePath += 6
            } else if (controller.left) {
                fire.y += 3
                this.firePath += 2
            } else if (controller.space) {
                fire.y += 3
                this.firePath += 2
            }
             else {
                fire.y += 4
                this.firePath += 4
            }

            if (this.firePath >= 400) {
                fires.shift()
                this.firePath = 0
            }
            if (fire.x + 20 > hero.x && fire.x < hero.x + 20 && fire.y + 10 > hero.y && fire.y < hero.y + 10 && immune == false) {
                console.log("it hit")
                immune = true
                score -= 10
                hero.health -= 1
                hero.x -= 3
                hero.y -= 10
                setTimeout(function() {
                    immune = false;
                }, 1100);

            }

            ctx.drawImage(red, 0, 0, 100, 100, fire.x + 20 , fire.y, 15, 15)

        })
    },

}

// get ready 

const getReady = {

    animation: [
        { x: 200, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 200 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ],

    sX: 0,
    sY: 0,
    w: 2000,
    h: 1000,
    x: 60,
    y: 120,

    frame: 0,

    draw: function() {

        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if (state.current == state.getReady) {
            let click = this.animation[this.frame]
            ctx.lineWidth = 2;
            ctx.font = "15px'Press Start 2P'";
            ctx.fillText('CLICK TO START', click.x, click.y);
            ctx.drawImage(start, this.sX, this.sY, this.w, this.h, this.x, this.y, 600, 200)
        }
    },

    update: function() {
        this.period = state.current == state.getReady ? 10 : 10;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % 6;
    }
}

// 

const gameOver = {



    animation: [
        { x: 230, y: 280 },
        { x: 230, y: 280 },
        { x: 230, y: 280 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ],

    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: 60,
    y: 300,

    frame: 0,

    draw: function() {

        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if (state.current == state.over) {
            let click = this.animation[this.frame]
            ctx.lineWidth = 2;
            ctx.font = "30px'Press Start 2P'";
            ctx.fillText('GAME OVER', 165, 250);
            ctx.font = "15px'Press Start 2P'";
            ctx.fillText('TRY AGAIN', click.x, click.y);
            ctx.drawImage(knight, 200, 333, 40, 40, hero.x, hero.y, 60, 80)
        }
    },

    update: function() {
        this.period = state.current == state.getReady ? 10 : 10;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % 6;
    }
}


//  draw 


function draw() {
    ctx.fillStyle = "rgb(21,24,37)"
    ctx.fillRect(0, 0, cvs.width, cvs.height)
    for (var w = 0; w < 1000; w++) {
        ctx.drawImage(bg, (w * cvs.width * 2.2) + background.x, 0);
        //context.drawImage(bg, w*background.x, 0); trippy

    }
    potion.draw()
    enemy.draw()
    hero.draw()
    boss.draw()
    getReady.draw()
    gameOver.draw()
    hero.menuDraw()
}

//  update 

function update() {
    enemy.update()
    hero.update()
    hero.isAlive()
    boss.update()
    getReady.update()
    gameOver.update()
    potion.update()
}

//  loop 

function loop() {
    update();
    draw();
    enemy.bulletMoveLeft()
    enemy.shoot()
    boss.bulletMoveLeft()
    boss.shoot()
    hero.waveMoveUp()
        // bullets.forEach(bullet => {
        //     bullet.moveLeft()
        // })

    boss.bossDirection()
    boss.flying()
    frames++;
    if (controller.up && jumped == false) {
        hero.jumping()
        jumpingSFX.play();
    } else if (controller.space && state.current == 2) {
        state.current = 0
        hero.health = 8
        hero.w = 40
        hero.h = 40
    } else if (controller.s && flying == false) {
        hero.wave()
    } 
    else if (controller.w && cooldown == false && hero.health != 8 ) {
        if (hero.health == 8) {
            healing.play()
        }
        if (hero.potion == 1 && hero.health != 4) {
            cooldown = true
            hero.health = 8
            hero.potion -= 1
            healing.play()
        }
         else if (cooldown == false) {
            error.play()
        }

        setTimeout(function() {
            cooldown = false
        }, 1000)

    } else if (controller.right) {
        hero.right()
        enemy.right()
        potion.right()
        background.x -= 3;
        if (jumped == false) {
            walkingSFX.play()
        }
    } else if (controller.left) {
        hero.left()
        enemy.left()
        potion.left()
        background.x += 3;
        if (jumped == false) {
            walkingSFX.play()
        }
    } else if (controller.space && slashed == false && facing == true) {
        hero.slash()
        enemy.slashedd()
        background.x -= 4
        slashSFX.play()
        slashed = true
    } else if (controller.space && slashed == false && facing == false) {
        hero.stab()
        enemy.enemyStab()
        background.x += 4
        slashSFX.play()
        slashed = true
    }

    if (hero.x < 32) {

        hero.x = 32;

    } else if (hero.x > 550) { // if rectangle goes past right boundary

        hero.x = 50;
    }

    setTimeout(function() {
        slashed = false
    })

    hero.collision()
    requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop);
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');
var canvas3 = document.getElementById('canvas3');
var ctx1 = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');
var ctx3 = canvas3.getContext('2d');

var rainthroughnum = 500;
var speedRainTrough = 25;
var RainTrough = [];

var rainnum = 500;
var rain = [];

var lightning = [];
var lightTimeCurrent = 0;
var lightTimeTotal = 0;

var w = canvas1.width = canvas2.width = canvas3.width = window.innerWidth;
var h = canvas1.height = canvas2.height = canvas3.height = window.innerHeight;
window.addEventListener('resize', function() {
    w = canvas1.width = canvas2.width = canvas3.width = window.innerWidth;
    h = canvas1.height = canvas2.height = canvas3.height = window.innerHeight;
});

function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function clearcanvas1() {
    ctx1.clearRect(0, 0, w, h);
}

function clearcanvas2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
}

function clearCanvas3() {
    ctx3.globalCompositeOperation = 'destination-out';
    ctx3.fillStyle = 'rgba(0,0,0,' + random(1, 30) / 100 + ')';
    ctx3.fillRect(0, 0, w, h);
    ctx3.globalCompositeOperation = 'source-over';
};

function createRainTrough() {
    for (var i = 0; i < rainthroughnum; i++) {
        RainTrough[i] = {
            x: random(0, w),
            y: random(0, h),
            length: Math.floor(random(1, 830)),
            opacity: Math.random() * 0.2,
            xs: random(-2, 2),
            ys: random(10, 20)
        };
    }
}

function createRain() {
    for (var i = 0; i < rainnum; i++) {
        rain[i] = {
            x: Math.random() * w,
            y: Math.random() * h,
            l: Math.random() * 1,
            xs: -4 + Math.random() * 4 + 2,
            ys: Math.random() * 10 + 10
        };
    }
}

function createLightning() {
    var x = random(100, w - 100);
    var y = random(0, h / 4);

    var createCount = random(1, 3);
    for (var i = 0; i < createCount; i++) {
        single = {
            x: x,
            y: y,
            xRange: random(5, 30),
            yRange: random(10, 25),
            path: [{
                x: x,
                y: y
            }],
            pathLimit: random(40, 55)
        };
        lightning.push(single);
    }
};

function drawRainTrough(i) {
    ctx1.beginPath();
    var grd = ctx1.createLinearGradient(0, RainTrough[i].y, 0, RainTrough[i].y + RainTrough[i].length);
    grd.addColorStop(0, "rgba(255,255,255,0)");
    grd.addColorStop(1, "rgba(255,255,255," + RainTrough[i].opacity + ")");

    ctx1.fillStyle = grd;
    ctx1.fillRect(RainTrough[i].x, RainTrough[i].y, 1, RainTrough[i].length);
    ctx1.fill();
}

function drawRain(i) {
    ctx2.beginPath();
    ctx2.moveTo(rain[i].x, rain[i].y);
    ctx2.lineTo(rain[i].x + rain[i].l * rain[i].xs, rain[i].y + rain[i].l * rain[i].ys);
    ctx2.strokeStyle = 'rgba(174,194,224,0.5)';
    ctx2.lineWidth = 1;
    ctx2.lineCap = 'round';
    ctx2.stroke();
}

function drawLightning() {
    for (var i = 0; i < lightning.length; i++) {
        var light = lightning[i];

        light.path.push({
            x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
            y: light.path[light.path.length - 1].y + (random(0, light.yRange))
        });

        if (light.path.length > light.pathLimit) {
            lightning.splice(i, 1);
        }

        ctx3.strokeStyle = 'rgba(255, 255, 255, .1)';
        ctx3.lineWidth = 3;
        if (random(0, 15) === 0) {
            ctx3.lineWidth = 6;
        }
        if (random(0, 30) === 0) {
            ctx3.lineWidth = 8;
        }

        ctx3.beginPath();
        ctx3.moveTo(light.x, light.y);
        for (var pc = 0; pc < light.path.length; pc++) {
            ctx3.lineTo(light.path[pc].x, light.path[pc].y);
        }
        if (Math.floor(random(0, 30)) === 1) { //to fos apo piso
            ctx3.fillStyle = 'rgba(255, 255, 255, ' + random(1, 3) / 100 + ')';
            ctx3.fillRect(0, 0, w, h);
        }
        ctx3.lineJoin = 'miter';
        ctx3.stroke();
    }
};

function animateRainTrough() {
    clearcanvas1();
    for (var i = 0; i < rainthroughnum; i++) {
        if (RainTrough[i].y >= h) {
            RainTrough[i].y = h - RainTrough[i].y - RainTrough[i].length * 5;
        } else {
            RainTrough[i].y += speedRainTrough;
        }
        drawRainTrough(i);
    }
}

function animateRain() {
    clearcanvas2();
    for (var i = 0; i < rainnum; i++) {
        rain[i].x += rain[i].xs;
        rain[i].y += rain[i].ys;
        if (rain[i].x > w || rain[i].y > h) {
            rain[i].x = Math.random() * w;
            rain[i].y = -20;
        }
        drawRain(i);
    }
}

function animateLightning() {
    clearCanvas3();
    lightTimeCurrent++;
    if (lightTimeCurrent >= lightTimeTotal) {
        createLightning();
        lightTimeCurrent = 0;
        lightTimeTotal = 200; //rand(100, 200)
    }
    drawLightning();
}

function init() {
    createRainTrough();
    createRain();
    window.addEventListener('resize', createRainTrough);
}
init();

function animloop() {
    animateRainTrough();
    animateRain();
    animateLightning();
    requestAnimationFrame(animloop);
}
animloop();

window.onkeydown = function(e) { 
    return !(e.keyCode == 32 && e.target == document.body);
  }; 

  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);