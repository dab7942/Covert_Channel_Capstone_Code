var robot = require("robotjs");

/* Borrowed from https://www.learncodebygaming.com/blog/how-to-code-a-runescape-bot-with-robotjs */
function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function adjustScroll(){
	robot.moveMouse(1910, 115);
	robot.mouseToggle("down");
	sleep(1000);
	robot.mouseToggle("up");
	robot.moveMouse(1906, 156);
	robot.mouseToggle("down");
	robot.dragMouse(1912, 256);
	robot.mouseToggle("up");
}

function getToMine(){
	robot.moveMouse(389, 1074);
	robot.moveMouseSmooth(388, 875);
	checkLoad(388, 875, "ff0000");
	robot.mouseClick();
	robot.moveMouseSmooth(1099, 343);
	checkLoad(1099, 343, "b56478");
	robot.mouseClick();
/*	sleep(1000); */
	robot.moveMouseSmooth(965, 499);
	checkLoad(965, 499, "aab2c1");
	robot.mouseClick();
/*	sleep(1000); */
	robot.moveMouseSmooth(955, 355);
	checkLoad(955, 355, "57573d");
	robot.mouseClick();
/*	sleep(1000); */
}

function mouseOverGenerator(){
	robot.moveMouseSmooth(1098, 201);
}

function throwSnowball(bit){
	if (bit == 1){
		robot.moveMouseSmooth(1098, 201);
/*		robot.keyToggle('t', 'down');
		robot.keyToggle('t', 'up');
		robot.mouseClick();*/
	} else {
		robot.moveMouseSmooth(1098, 251);
	}
	robot.keyToggle('t', 'down');
	robot.keyToggle('t', 'up');
	robot.mouseClick();
}

function checkLoad(x, y, goal){
	var current = robot.getPixelColor(x, y);
	while (current != goal){
		console.log("Incorrect value: " + current);
		sleep(1000);
		var current = robot.getPixelColor(x, y);
	}
}

function main() {
	console.log("Starting");
	var secret = "shall"
	bin_secret = ""
	console.log("Converting message");
	for (var i = 0; i < secret.length; ++i) {
/*		console.log(secret[i]); */
		bin_i = secret[i].charCodeAt().toString(2);
		while (bin_i.length < 7){
			bin_i = "0" + bin_i;
		}
/*		console.log(bin_i); */
		bin_secret += bin_i;
	}
	console.log("Message converted");
	sleep(3000);
	console.log("Scrolling");
	adjustScroll();
	console.log("Moving");
	getToMine();
	console.log("Hovering");
	mouseOverGenerator();
	console.log("Sending data");
	for (var i = 0; i < bin_secret.length; ++i) {
		next_bit = bin_secret[i];
		throwSnowball(next_bit);
		sleep(1000);
	}
}

main();