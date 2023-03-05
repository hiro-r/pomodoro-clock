const breakLengthEl = document.getElementById("break-length");
const breakDecrementEl = document.getElementById("break-decrement");
const breakIncrementEl = document.getElementById("break-increment");
const sessionLengthEl = document.getElementById("session-length");
const sessionDecrementEl = document.getElementById("session-decrement");
const sessionIncrementEl = document.getElementById("session-increment");
const timerLabelEl = document.getElementById("timer-label");
const timeLeftEl = document.getElementById("time-left");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetEl = document.getElementById("reset");
const audio = new Audio("alarm-clock.mp3")
let intervalId;
let remainingTime;
let isSessionOn = true;

function start() {
    timerLabelEl.textContent = isSessionOn ? "Session" : "Break";
    startBtn.disabled = true;
    breakDecrementEl.disabled = true;
    breakIncrementEl.disabled = true;
    sessionDecrementEl.disabled = true;
    sessionIncrementEl.disabled = true;

    if(stoppedTime > 0) {
        remainingTime = stoppedTime;
        stoppedTime = 0;
    } else {
        remainingTime = Number(sessionLengthEl.textContent) * 60000;
        timeLeftEl.textContent = formatTime(remainingTime);
    }
    intervalId = setInterval(function() {
        remainingTime -= 1000;
        timeLeftEl.textContent = formatTime(remainingTime);
        if(remainingTime <= 0) {
            clearInterval(intervalId);  
            isSessionOn = !isSessionOn;          
            audio.play();
            timeLeftEl.textContent = formatTime(remainingTime);
            setTimeout(isSessionOn ? start : breakTime, 1000);
        }
    }, 1000)    
}

function breakTime() {
    timerLabelEl.textContent = isSessionOn ? "Session" : "Break";
    if(intervalId) {
        clearInterval(intervalId);
    }
    remainingTime = Number(breakLengthEl.textContent) * 60000;
    timeLeftEl.textContent = formatTime(remainingTime);
    intervalId = setInterval(function() {
        remainingTime -= 1000;
        timeLeftEl.textContent = formatTime(remainingTime);
        
        if(remainingTime <= 0) {
            isSessionOn = !isSessionOn;
            audio.play();
            clearInterval(intervalId);
            setTimeout(start, 1000);
        }
    }, 1000)    
}

function formatTime(time) {
    let s = Math.floor(time / 1000) % 60;
    let m = Math.floor(time / 60000);
    let sEl = s >= 10 ? s : "0" + s;
    let mEl = m >= 10 ? m : "0" + m;
    return `${mEl}:${sEl}`;
}

let stoppedTime = 0;

function stop() {
    clearInterval(intervalId);
    stoppedTime = remainingTime;
    startBtn.disabled = false;
    breakDecrementEl.disabled = false;
    breakIncrementEl.disabled = false;
    sessionDecrementEl.disabled = false;
    sessionIncrementEl.disabled = false;
}

breakDecrementEl.addEventListener("click", function() {
    let breakLength = Number(breakLengthEl.textContent); 
    if(breakLength > 1) {
        breakLengthEl.textContent = breakLength - 1;
    }    
})

breakIncrementEl.addEventListener("click", function() {
    let breakLength = Number(breakLengthEl.textContent); 
    if(breakLength < 60) {
        breakLengthEl.textContent = breakLength + 1;
    }    
})

sessionDecrementEl.addEventListener("click", function() {
    let sessionLength = Number(sessionLengthEl.textContent); 
    if(sessionLength > 1) {
        sessionLengthEl.textContent = sessionLength - 1;
        if(stoppedTime === 0) {
            timeLeftEl.textContent = `${sessionLength - 1 >= 10 ? sessionLength - 1: "0" + (sessionLength - 1)}:00`;
        }
    }    
})

sessionIncrementEl.addEventListener("click", function() {
    let sessionLength = Number(sessionLengthEl.textContent); 
    if(sessionLength < 60) {
        sessionLengthEl.textContent = sessionLength + 1;
        if(stoppedTime === 0) {
            timeLeftEl.textContent = `${sessionLength + 1 >= 10 ? sessionLength + 1 : "0" + (sessionLength + 1)}:00`;
        }
    }    
})

startBtn.addEventListener("click", start)
stopBtn.addEventListener("click", stop)

resetEl.addEventListener("click", function() {
    breakLengthEl.textContent = 5;
    sessionLengthEl.textContent = 25;
    timeLeftEl.textContent = "25:00";
    clearInterval(intervalId);
    remainingTime = 0;
    stoppedTime = 0;
    timerLabelEl.textContent = "Session";
    isSessionOn = true;
    startBtn.disabled = false;
    breakDecrementEl.disabled = false;
    breakIncrementEl.disabled = false;
    sessionDecrementEl.disabled = false;
    sessionIncrementEl.disabled = false;
})