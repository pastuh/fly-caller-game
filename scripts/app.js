// For the future
//let extraCanvas;

let lightIsOn = false;
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

    showLine(R, G, B, A = 255) {
        //strokeWeight(this.weight);
        // Lamp stem
        stroke(R, G, B);
        line(this.cord.x, this.cord.y - this.radius - this.weight, this.cord.x, 0);
        //ellipse(this.cord.x, this.cord.y, this.radius * 3.5);

        // push();
        // strokeWeight(10);
        // line(this.cord.x, this.cord.y + this.radius + this.weight - 1, this.cord.x, this.cord.y + this.radius * 2);
        // pop();
        //
        // // Stem end
        // push();
        // strokeWeight(6);
        // line(this.cord.x - 6, this.cord.y + (this.radius * 2) - 6, this.cord.x + 6, this.cord.y + (this.radius * 2) + 6);
        // pop();
        //
        // // Middle
        // push();
        // strokeWeight(10);
        // line(this.cord.x, this.cord.y + this.radius * 2 + this.weight, width / 2 - this.radius * 2, height / 2 + this.radius * 4);
        // pop();
        //
        // push();
        // strokeWeight(10);
        // line(width / 2 - this.radius * 2, height / 2 + this.radius * 4, 0 + this.radius * 2, height - 24);
        // pop();
        //
        // push();
        // strokeWeight(20);
        // line(0 + this.radius * 2, height - 20, 0 + this.radius * 4, height - 20);
        // pop();

    }

    showObj() {
        strokeWeight(this.weight);
        ellipseMode(CENTER);
        ellipse(this.cord.x, this.cord.y, this.radius * 2);
    }

    hover(x, y) {
        let d = dist(x, y, this.cord.x, this.cord.y);
        if (d <= this.radius) {
            lightIsOn = true;
            return true;
        } else {
            lightIsOn = false;
        }
    }

    animateLamp(realTimer) {
        noFill();
        stroke(255, 250, 0, 50);

        ellipse(this.cord.x, this.cord.y, (this.radius * 2) - ((10 * realTimer) - 10));

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


        noStroke();
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
            // Adjust speed based on Lamp
            if (lampActive) {
                this.cord.x += random(-this.dimension, this.dimension);
                this.cord.y += random(-this.dimension, this.dimension);
            } else {
                this.cord.x += random(-this.dimension / 2, this.dimension / 2);
                this.cord.y += random(-this.dimension / 2, this.dimension / 2);
            }
        } else {
            // Show drop effect
            this.cord.y = this.cord.y + this.dimension;
            // If dead, set fixed position
            if (this.cord.y >= height) {
                this.cord.y = height - this.dimension;
            }
        }
    }

    showObj() {
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
                this.color.R = 100 - this.dimension * 2;
                this.color.G = 0;
                this.color.B = 205 - (this.dimension * 2);
            } else {
                this.color.R = (this.dimension * 2);
                this.color.G = 15;
                this.color.B = this.dimension * 8;
            }
        }

        fill(this.color.R, this.color.G, this.color.B);
    }

};

let tableList = [];

class Table {
    constructor(posX, posY, width, height, weight) {
        this.cord = {
            x : posX,
            y : posY
        };
        this.width = width;
        this.height = height;
        this.weight = weight;
    }

    showObj(R, G, B) {
        stroke(R, G, B);
        strokeWeight(this.weight);
        line(this.cord.x, this.cord.y, this.width, this.height);
    }
}

function setup() {
    createCanvas(400, 400);

    // Canvas for lamp?
    //extraCanvas = createGraphics(400, 400);
    //extraCanvas.clear();

    // Create starting Objects
    lampList.push(new Lamp(setLampPosition(width, 50), setLampPosition(height, 50), sizeRandomizer(25, 40), 6));
    flyList.push(new Fly(200, 200, 20, sizeRandomizer(0, 6)));
    tableList.push(new Table(0, height, width, height, 25));

    background(0);
}

function draw() {
    background(0);

    // Counter style
    noStroke();
    fill(255);
    textSize(13);
    textAlign(LEFT, TOP);
    text(flyList.filter((obj) => obj.alive).length, 10, height - 30);
    // Text format
    textSize(40);
    textAlign(CENTER, CENTER);

    // showObj Table
    tableList[0].showObj(40, 30, 80);

    for (const [i, lamp] of lampList.entries()) {

        // Global timer activation
        timer(lamp);
        // Reset timer while lamp not active
        if (!mouseIsPressed) {
            lamp.startTime = millis();
        }

        // showObj Lamp
        if (lamp.hover(mouseX, mouseY)) {
            stroke(70, 70, 70, 255);
            fill(255, 150);
        } else {
            stroke(50, 50, 50, 255);
            fill(255, 150);
        }
        lamp.showObj();
        lamp.showLine(50, 50, 50, 20);

        if (mouseIsPressed) {
            if (lamp.hover(mouseX, mouseY)) {
                lamp.showLightBounce();

                stroke(255, 255, 255, 255);
                lamp.showObj();
                lamp.showLine(135, 80, 15, 20);
                tableList[0].showObj(105, 85, 30);

                // Animate lamp till endTime
                if (lamp.time <= lamp.endTime) {
                    let realTimer = timer(lamp);
                    //showObj timer numbers (for test)
                    // if (realTimer !== 0) {
                    //     text(realTimer, width / 2, height / 2);
                    // }
                    lamp.animateLamp(realTimer);
                } else {
                    // Hide timer numbers (for test)
                    //text('', width / 2, height / 2);
                    // Reset Timer if reached endTime
                    lamp.startTime = millis();
                }
            } else {
                // Reset Timer if clicked not on lamp
                lamp.startTime = millis();
            }
        }

    }

    //New canvas (to draw on top)
    //image(extraCanvas, 0, 0);

    for (const [i, fly] of flyList.entries()) {

        if (mouseIsPressed) {
            // Set Fly speed based on lamp status
            fly.adjustSpeed(lightIsOn);
            // Set Fly color based on lamp status
            fly.changeColor(lightIsOn);
            // Set Fly status if flies on Lamp..
            if (lightIsOn) {
                for (const [i, lamp] of lampList.entries()) {
                    fly.checkStatus(lamp, lamp.radius);
                }
            }

        } else {
            fly.adjustSpeed(false);
            fly.changeColor(false);
        }

        // showObj how Fly flies..
        fly.showObj();
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
            return point;
            break;
        }
    }
}

function objectSpawner() {
    flyList.push(new Fly(setSpawnPosition(width, 25), setSpawnPosition(height, 25), sizeRandomizer(5, 25), sizeRandomizer(0, 15)));
}