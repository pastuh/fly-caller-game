let allowToSpawn = true;
let minFlySize = 2;
let maxFlySize = 25;

let lamp = {
    diameter : 60,
    time : 0,
    startTime : 0,
    endTime : 3
};

// Store all flies here
let aliveList = [];

class Fly {
    constructor(posX, posY, dimension) {
        this.cord = {
            x : posX,
            y : posY
        };
        this.dimension = dimension;
        this.alive = true;
    }

    drawSelectedFly() {
        noStroke();
        rectMode(CENTER);
        rect(this.cord.x, this.cord.y, this.dimension, this.dimension);
    }
};
let extraCanvas;

let backgroundColor = {
    r : 218,
    g : 160,
    b : 221
}

function setup() {
    createCanvas(400, 400);

    extraCanvas = createGraphics(400, 400);
    extraCanvas.clear();

    // Create first fly
    aliveList.push(new Fly(200, 200, 20));

    background(0);
}

function draw() {
    background(0);

    // Table
    stroke(40, 30, 80);
    if (mouseIsPressed) {
        stroke(105, 85, 30);
    }
    strokeWeight(32);
    line(0, height, width, height);

    // Table shadow
    if (mouseIsPressed) {
        noStroke();
        fill(230, 190, 0, 150);
        ellipseMode(CENTER);
        ellipse(width / 2, height - 8, 250, 12);
    }

    // Line
    stroke(40, 30, 80);
    if (mouseIsPressed) {
        stroke(135, 80, 15);
    }
    strokeWeight(6);
    line(width / 2, 0, width / 2, height / 2 - 56);

    // Counter style
    noStroke();
    fill(255);
    textSize(13);
    textAlign(LEFT, TOP);
    text(aliveList.filter((obj) => obj.alive).length, 10, height - 30);

    // Text format
    textSize(40);
    textAlign(CENTER, CENTER);

    // Global timer activation
    timer();
    // Reset timer while lamp not active
    if (!mouseIsPressed) {
        lamp.startTime = millis();
    }

    // Count till Lamp time
    if (lamp.time <= lamp.endTime) {
        // Show timer while mouse is Pressed
        if (mouseIsPressed) {
            let realTimer = timer();
            // Hide timer if number 0
            if (realTimer !== 0) {
                //text(realTimer, width / 2, height / 2);
            }

            switch (realTimer) {
                case 0:
                    // Reset spawner
                    allowToSpawn = true;

                    noFill();
                    stroke(255, 200, 0, 20);
                    ellipse(200, 200, 90, 90);
                    break;
                case 1:
                    noFill();
                    stroke(255, 200, 0, 20);
                    ellipse(200, 200, 80, 80);
                    break;
                case 2:
                    noFill();
                    stroke(255, 200, 0, 20);
                    ellipse(200, 200, 70, 70);
                    break;
                case 3:
                    noFill();
                    stroke(255, 200, 0, 20);
                    ellipse(200, 200, 60, 60);

                    if (allowToSpawn) {
                        objectSpawner();
                        allowToSpawn = false;
                    }
                    break;
            }
        }
    } else {
        // By default reset global timer
        text('', width / 2, height / 2);
        lamp.startTime = millis();
    }

    // Default LIGHT (lamp)
    fill(255, 20);
    stroke(150, 150);
    strokeWeight(6);
    // Style lamp if active
    if (mouseIsPressed) {
        fill(255, 20);
        stroke(255, 255, 0);
    }
    ellipseMode(CENTER);
    ellipse(200, 200, 100, 100);

    //New canvas (to draw on top)
    image(extraCanvas, 0, 0);

    for (const [i, fly] of aliveList.entries()) {
        // Fly
        if (fly.alive) {
            fly.cord.x += random(-fly.dimension, fly.dimension);
            fly.cord.y += random(-fly.dimension, fly.dimension);
        } else {

            fly.cord.y = fly.cord.y + fly.dimension;
            if (fly.cord.y >= height) {
                fly.cord.y = height - (fly.dimension / 2);
                fill(255, 150, 0);
            }
        }

        // Color Fly if lamp is active
        if (mouseIsPressed) {
            // Default fly color when lamp is active
            if (fly.alive) {
                if(fly.dimension < 5) {
                    fill(225, 225, 160);
                } else if (fly.dimension < 10) {
                    fill(225, 225, 0);
                } else if (fly.dimension <=20) {
                    fill(255, 255, 0);
                } else {
                    fill(210, 255, 0);
                }
            } else {
                if(fly.dimension < 5) {
                    fill(210, 160, 95);
                } else if (fly.dimension < 10) {
                    fill(215, 130, 0);
                } else if (fly.dimension <=20) {
                    fill(255, 150, 0);
                } else {
                    fill(255, 175, 55);
                }

            }
            // Kill fly based on position
            checkIfFlyAlive(fly);
        } else {
            // How looks fly if lamp not active
            if (fly.alive) {
                if(fly.dimension < 5) {
                    fill(110, 60, 190);
                } else if (fly.dimension < 10) {
                    fill(90, 0, 225);
                } else if (fly.dimension <=20) {
                    fill(100, 0, 255);
                } else {
                    fill(130, 50, 255);
                }
            // If dead and not active
            } else {
                if(fly.dimension < 5) {
                    fill(100, 5, 150);
                } else if (fly.dimension < 10) {
                    fill(110, 0, 130);
                } else if (fly.dimension <=20) {
                    fill(80, 15, 95);
                } else {
                    fill(110, 50, 120);
                }

            }

        }

        // Show how Fly flies..
        fly.drawSelectedFly();

        // Adjust position if offscreen X
        if (fly.cord.x < 0) {
            fly.cord.x = 0;
        } else if (fly.cord.x > width) {
            fly.cord.x = width;
        }
        // Adjust position if offscreen Y
        if (fly.cord.y < 0) {
            fly.cord.y = 0;
        } else if (fly.cord.y > height) {
            fly.cord.y = height;
        }
    }

}

function timer() {
    lamp.time = int((millis() - lamp.startTime) / 1000);
    return lamp.time;
}

function sizeRandomizer() {
    return Math.trunc(random(minFlySize, maxFlySize));
}

function positionSpawner(position) {
    let point = random(0, position);
    // Spawn only in corners
    while (true) {
        if (point < position - maxFlySize && point > maxFlySize) {
            point = random(0, position);
        } else {
            return point;
            break;
        }
    }
}

function objectSpawner() {
    aliveList.push(new Fly(positionSpawner(width), positionSpawner(height), sizeRandomizer()));
}

function checkIfFlyAlive(fly) {
    if (fly.cord.x > 150 && fly.cord.x < 250 && fly.cord.y > 150 && fly.cord.y < 250) {
        fill(255, 0, 0);
        fly.alive = false;
    }
}