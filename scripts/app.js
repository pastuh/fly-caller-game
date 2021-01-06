// For the future
//let extraCanvas;

let minObjSize = 2;
let maxObjSize = 25;

let lampList = [];

class Lamp {
    constructor(posX, posY, radius, weight = 4) {
        this.cord = {
            x : posX,
            y : posY
        };
        this.radius = radius;
        this.weight = weight;
        this.time = 0;
        this.startTime = 0;
        this.endTime = 3;
        this.allowToSpawn = true;
    }

    showLine() {
        strokeWeight(this.weight);
        line(this.cord.x, 0, this.cord.x, (this.cord.y - this.radius) - this.weight);
    }

    drawSelectedLamp() {
        strokeWeight(this.weight);
        ellipseMode(CENTER);
        ellipse(this.cord.x, this.cord.y, this.radius * 2);
    }

    animateLamp(realTimer) {
        noFill();
        stroke(255, 250, 0, 50);

        ellipse(this.cord.x, this.cord.y, (this.radius * 2) - ((10 * realTimer) + 10));

        if (realTimer == 0) {
            this.allowToSpawn = true;
        } else if (realTimer == 3) {
            if (this.allowToSpawn) {
                objectSpawner();
                this.allowToSpawn = false;
            }
        }
    }

    showLightBounce() {
        let lampTableDistance = height - this.cord.y;

        noStroke();
        fill(230, 190, 0, 150);
        ellipseMode(CENTER);
        //Default bounce
        ellipse(this.cord.x, height - 8, lampTableDistance, 12);
        //More bounce based on distance
        if (lampTableDistance < height / 2) {
            fill(255, 255, 0, 100);
            ellipse(this.cord.x, height - 8, lampTableDistance / 2, 12 / 2);
        } else {
            fill(170, 140, 0, 150);
            ellipse(this.cord.x, height - 8, lampTableDistance + (width / 2), 12);
        }
    }
}

// Store all flies here
let flyList = [];

class Fly {
    constructor(posX, posY, dimension, wingsSize) {
        this.cord = {
            x : posX,
            y : posY
        };
        this.color = {
            R : 0,
            G : 0,
            B : 0
        }
        this.dimension = dimension;
        this.wingsSize = wingsSize;
        this.alive = true;
    }

    adjustSpeed(lampActive) {
        if (this.alive) {
            if (lampActive) {
                this.cord.x += random(-this.dimension, this.dimension);
                this.cord.y += random(-this.dimension, this.dimension);
            } else {
                this.cord.x += random(-this.dimension / 2, this.dimension / 2);
                this.cord.y += random(-this.dimension / 2, this.dimension / 2);
            }
        } else {
            // If dead, set fixed position (on table)
            this.cord.y = this.cord.y + this.dimension;
            if (this.cord.y >= height) {
                this.cord.y = height - (this.dimension / 2);
            }
        }
    }

    drawSelected() {
        noStroke();
        rectMode(CENTER);
        rect(this.cord.x, this.cord.y, this.dimension, this.dimension, this.wingsSize);
    }

    checkStatus(lamp, radius) {
        let d = dist(this.cord.x, this.cord.y, lamp.cord.x, lamp.cord.y);
        if (d <= radius) {
            fill(255, 0, 0);
            this.alive = false;
        }
    }

    setBoundaries() {
        // Adjust position if offscreen X
        if (this.cord.x < 0) {
            this.cord.x = 0;
        } else if (this.cord.x > width) {
            this.cord.x = width;
        }
        // Adjust position if offscreen Y
        if (this.cord.y < 0) {
            this.cord.y = 0;
        } else if (this.cord.y > height) {
            this.cord.y = height;
        }
    }

    changeColor(lampActive) {
        if (lampActive) {
            if (this.alive) {
                this.color.R = 205 + (this.dimension * 2);
                this.color.G = 205 + (this.dimension * 2);
                this.color.B = 0;
            } else {
                this.color.R = 175 + (this.dimension * 2);
                this.color.G = this.dimension * 8;
                this.color.B = 50 + (this.dimension * 2);
            }
        } else {
            if (this.alive) {
                this.color.R = this.dimension * 8;
                this.color.G = 0;
                this.color.B = 205 + (this.dimension * 2);
            } else {
                this.color.R = (this.dimension * 2);
                this.color.G = 15;
                this.color.B = this.dimension * 8;
            }
        }

        fill(this.color.R, this.color.G, this.color.B);
    }

};

function setup() {
    createCanvas(400, 400);

    // Canvas for lamp?
    //extraCanvas = createGraphics(400, 400);
    //extraCanvas.clear();

    // Create starting Objects
    lampList.push(new Lamp(setLampPosition(width, 50), setLampPosition(height, 50), 50, 6));
    flyList.push(new Fly(200, 200, 20, sizeRandomizer(0, 6)));

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

    // Counter style
    noStroke();
    fill(255);
    textSize(13);
    textAlign(LEFT, TOP);
    text(flyList.filter((obj) => obj.alive).length, 10, height - 30);

    // Text format
    textSize(40);
    textAlign(CENTER, CENTER);


    for (const [i, lamp] of lampList.entries()) {

        // Line
        stroke(40, 30, 80);
        if (mouseIsPressed) {
            stroke(135, 80, 15);
        }
        lamp.showLine();

        // Lamp light bounce
        if (mouseIsPressed) {
            lamp.showLightBounce();
        }

        // Global timer activation
        timer(lamp);
        // Reset timer while lamp not active
        if (!mouseIsPressed) {
            lamp.startTime = millis();
        }

        // Count till Lamp time
        if (lamp.time <= lamp.endTime) {
            // Show timer while mouse is Pressed
            if (mouseIsPressed) {
                let realTimer = timer(lamp);
                // Show timer numbers
                if (realTimer !== 0) {
                    //text(realTimer, width / 2, height / 2);
                }

                // Show animatioon while Lamp is active
                lamp.animateLamp(realTimer);

            }
        } else {
            // By default reset global timer
            text('', width / 2, height / 2);
            lamp.startTime = millis();
        }

        // Default LIGHT (lamp)
        if (mouseIsPressed) {
            fill(255, 20);
            stroke(255, 255, 0);
        } else {
            fill(255, 20);
            stroke(150, 150);
        }
        lamp.drawSelectedLamp();
    }

    //New canvas (to draw on top)
    //image(extraCanvas, 0, 0);

    for (const [i, fly] of flyList.entries()) {

        if (mouseIsPressed) {
            // Set Fly speed based on lamp status
            fly.adjustSpeed(true);
            // Set Fly color based on lamp status
            fly.changeColor(true);
            // Set Fly status based on Lamp distance..
            for (const [i, lamp] of lampList.entries()) {
                fly.checkStatus(lamp, lamp.radius);
            }
        } else {
            fly.adjustSpeed(false);
            fly.changeColor(false);
        }

        // Show how Fly flies..
        fly.drawSelected();
        // Adjust Fly position if hits wall
        fly.setBoundaries();

    }

}

function timer(lamp) {
    lamp.time = int((millis() - lamp.startTime) / 1000);
    return lamp.time;
}

function sizeRandomizer(minSize, maxSize) {
    return Math.trunc(random(minSize, maxSize));
}

function setLampPosition(position, objSize) {
    let point = random(0 + objSize, position - objSize);
    return point;
}

function setSpawnPosition(position, objSize) {
    let point = random(0, position);
    // Spawn only in corners
    while (true) {
        if (point < position - objSize && point > objSize) {
            point = random(0, position);
        } else {
            console.log(`${point} : ${position - objSize}`);
            return point;
            break;
        }
    }
}

function objectSpawner() {
    flyList.push(new Fly(setSpawnPosition(width, 25), setSpawnPosition(height, 25), sizeRandomizer(2, 25), sizeRandomizer(0, 10)));
}