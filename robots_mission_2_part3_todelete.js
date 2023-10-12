// part 3: make robot go around the box, randomly choose left/right
const motorA = ev3_motorA();
const motorB = ev3_motorB();
const ultraS = ev3_ultrasonicSensor();
let distance_away = ev3_ultrasonicSensoorDistance(ultraS) / 10;
const randomize = math_random() < 0.5;

function left_wheel_move(time) {
    ev3_runForTime(motorA, time, 260);
    ev3_pause(time);
}

function right_wheel_move(time) {
    ev3_runForTime(motorB, time, 260);
    ev3_pause(time);
}

function rotate_cw(time) {
    left_wheel_move(time);
    ev3_pause(time);
}
function rotate_acw(time) {
    right_wheel_move(time);
    ev3_pause(time);
}


function long_forward_no_pause(time, speed) {
    ev3_runForTime(motorA, time, speed);
    ev3_runForTime(motorB, time, speed);
}

function forward(time, speed) {
    ev3_runForTime(motorA, time, speed);
    ev3_runForTime(motorB, time, speed);
    ev3_pause(time);
}

function stop_motors(){
    ev3_motorStop(motorA);
    ev3_motorStop(motorB);
}

function original_turn(){
    randomize ? rotate_acw(1800) : rotate_cw(1800);
}

function inverse_of_original_turn(){
    randomize ? rotate_cw(1800) : rotate_acw(1800);
}

long_forward_no_pause(10000, 500);

while (distance_away >= 30) {
    distance_away = ev3_ultrasonicSensorDistance(ultraS) / 10;
}

stop_motors();
original_turn();
distance_away = 0;

while (distance_away <= 40){
    forward(10000, 750);
    inverse_of_original_turn();
    distance_away = ev3_ultrasonicSensorDistance(ultraS) / 10;
    // 40 instead of 30 to give buffer possible slight over-rotation
    if (distance_away >= 40){
        // when sensor doesnt see object worse case wings can still have contact
        // so move foward slightly before doign final turn
        original_turn();
        ev3_runForTime(motorA, 3000, 750);
        ev3_runForTime(motorB, 3000, 750);
        ev3_pause(3000);
        inverse_of_original_turn();
        break;
    }
    original_turn();
}

forward(5000, 750);
