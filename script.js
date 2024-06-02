function addMins(hours, time, minsToAdd) {
    // Parse the time string to get the starting hour and minute
    let [startingHour, startingMinute] = time.split(':').map(Number);

    let startingHourIndex = startingHour;

    // Add minutes to the starting hour
    while (minsToAdd > 0 && startingMinute < 60) {
        const minutesToAddThisHour = Math.min(60 - startingMinute, minsToAdd);
        hours[startingHourIndex] += minutesToAddThisHour;
        minsToAdd -= minutesToAddThisHour;
        startingHourIndex += 1;
        startingMinute = 0;
    }

    // If there are remaining minutes, distribute them to the subsequent hours
    while (minsToAdd > 0) {
        hours[startingHourIndex % 24] += Math.min(60, minsToAdd);
        minsToAdd -= Math.min(60, minsToAdd);
        startingHourIndex += 1;
    }
    return hours;
}
// Get the current URL and create a URL object
const currentUrl = window.location.href;
const url = new URL(currentUrl);

// Get the query parameters and read the 'data' parameter
const queryParams = new URLSearchParams(url.search);
const dataParam = queryParams.get('data');

// URL decode and parse the 'data' parameter as JSON
const todayData = String(decodeURIComponent(dataParam));
document.body.innerHTML += todayData;
const events = todayData.split("|").slice(0, -1);
console.log(events);
let previousEvent = "+00:00:00";
const hourTimes = Array.from({ length: 24 }, () => 0);

for (const event of events) {
    if (event.includes("-")) {
        if (previousEvent.includes("+")) {
            const previousEventEval = new Date(`1970-01-01T${previousEvent.replace("+", "")}`);
            const eventEval = new Date(`1970-01-01T${event.replace("-", "")}`);
            const eventMinuteDifference = Math.floor((eventEval - previousEventEval) / (1000 * 60));
            const previousEventHour = previousEventEval.getHours();
            const previousEventMaxMins = 60 - previousEventEval.getMinutes();
            if (eventMinuteDifference <= previousEventMaxMins) {
                hourTimes[previousEventHour] += eventMinuteDifference;
            } else {
                addMins(hourTimes, previousEventEval.toTimeString().slice(0, 8), eventMinuteDifference);
            }
        }
    }
    previousEvent = event;
}

function printHourTimes(d) {
    document.body.innerHTML += "startdict" + JSON.stringify(d) + "enddict";
    return;
    for (let i = 0; i < d.length; i++) {
        document.body.innerHTML += (`${String(i).padStart(2, '0')} : ${"|".repeat(d[i])}`);
        document.body.innerHTML += "<br>";
    }
}

printHourTimes(hourTimes);
