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

const stringSource = '{"5/29/24":"+19:51:38|-19:57:57|+20:28:54|-20:33:09|+21:33:16|-21:35:51|+21:36:53|-21:38:52|+22:22:29|-22:53:14|+22:53:19|-22:56:45|+23:40:23|","5/30/24":"-00:17:09|+07:55:57|-08:30:25|+08:53:18|-09:32:51|+10:49:59|-11:09:21|+11:09:43|-11:09:48|+11:10:12|-11:10:14|+11:10:15|-11:10:26|+11:19:36|-11:25:05|+11:26:08|-11:54:42|+12:02:11|-12:20:19|+12:22:43|-12:24:10|+12:34:50|-12:35:01|+13:16:49|-14:02:03|+14:04:25|-14:07:49|+15:09:24|-15:12:06|+15:25:09|-15:45:32|+16:04:55|-16:56:07|+17:12:21|-17:22:46|+17:28:22|-18:49:36|+18:56:06|-20:03:32|+21:02:19|-21:29:55|+21:34:15|-21:39:57|+21:47:15|-22:21:36|+22:32:08|-22:32:10|+22:33:48|-23:06:24|+23:24:51|-23:41:37|+23:41:49|-23:59:38|"}';
const dictionaryFromSource = JSON.parse(stringSource);
const todayData = dictionaryFromSource["5/30/24"];
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
    return
    for (let i = 0; i < d.length; i++) {
        document.body.innerHTML += (`${String(i).padStart(2, '0')} : ${"|".repeat(d[i])}`);
        document.body.innerHTML += "<br>";
    }
}

printHourTimes(hourTimes);
