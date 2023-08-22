'use strict';

function lorentzFactor(v, c) {
    const comp = ["x", "y", "z"];
    return comp.map(coordinate => {
        const ratio = BigInt(v[coordinate]) * BigInt(v[coordinate]) / (BigInt(c) * BigInt(c));
        const lorentzTerm = calculateSqrt(1n - ratio);
        return lorentzTerm;
    });
}
// https://www.codeproject.com/Questions/451725/
// Square-root-algorithm-for-BigInteger#NewEntryGroup
function calculateSqrt(N) {
    if (N === 0n) return 0n;
    let n1 = (N >> 1n) + 1n;
    let n2 = (n1 + (N / n1)) >> 1n;

    while (n2 < n1) {
        n1 = n2;
        n2 = (n1 + (N / n1)) >> 1n;
    }

    return n1;
}
// change stationaryObserverVelocity and speedoflight 
const stationaryObserverVelocity = { x: 0, y: 0, z: 0 };
const speedOfLight = 1;


const gamma = lorentzFactor(stationaryObserverVelocity, speedOfLight);

const clock = document.getElementById("clock");

function* createClockGenerator(el, gammaIndex) {
    const timeInterval = 1000; // 1 second
    let currentTime = BigInt(new Date().getTime());

    const clockA = document.createElement("div");
    const clockB = document.createElement("div");
    el.appendChild(clockA);
    el.appendChild(clockB);

    function updateClock() {
        const relativeTime = new Date(Number(currentTime) * Number(gamma[gammaIndex]));
        currentTime += BigInt(timeInterval);

        const formattedRelativeTime = relativeTime.toLocaleString();
        const formattedCurrentTime = new Date(Number(currentTime)).toLocaleString();

        clockA.innerHTML = `Relative Time: ${formattedRelativeTime}`;
        clockA.classList.add('clock-relative');

        clockB.innerHTML = `Current Time: ${formattedCurrentTime}`;
        clockB.classList.add('clock-current')
    }

    setInterval(function () {
        updateClock();
    }, timeInterval);
}

document.addEventListener("DOMContentLoaded", function () {
    const clocks = createClockGenerator(clock, 0);
    clocks.next(); // Start the generator
});
