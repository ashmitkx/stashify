function stripTime(date) {
    const timeStrippedDate = new Date(date);
    timeStrippedDate.setHours(0);
    timeStrippedDate.setMinutes(0);
    timeStrippedDate.setSeconds(0);
    timeStrippedDate.setMilliseconds(0);

    return timeStrippedDate;
}

function timeSinceStr(date) {
    const timeSinceSeconds = Math.floor((new Date() - date) / 1000);

    const epochs = [
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
        ['second', 1]
    ];

    for (let [epoch, seconds] of epochs) {
        let interval = Math.floor(timeSinceSeconds / seconds);

        if (interval >= 1) {
            // strip time data from date, if date is more than a day old
            if (epoch === 'day') {
                const strippedTimeSeconds = Math.floor((new Date() - stripTime(date)) / 1000);
                interval = Math.floor(strippedTimeSeconds / 86400);
            }

            return { interval, epoch };
        }
    }
}

export function timeSince(date) {
    date = new Date(date);

    // simply return the date, if time since is more than 30 days
    const timeSinceSeconds = Math.floor((new Date() - date) / 1000);
    if (timeSinceSeconds / 2592000 >= 1) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    const { interval, epoch } = timeSinceStr(date);
    const suffix = interval === 1 ? '' : 's';
    return `${interval} ${epoch}${suffix} ago`;
}

export function timeToDuration(ms) {
    let durationSeconds = Math.round(ms / 1000);
    let durations = [];
    const epochs = [
        ['hour', 3600],
        ['minute', 60],
        ['second', 1]
    ];

    for (let [_, seconds] of epochs) {
        const interval = Math.floor(durationSeconds / seconds);

        // once an interval has been added to the durations array
        // any intervals following it must also be added to the durations array
        // for example, this ensures that durationSeconds = 300 gives '5:00' and not just '5'
        if (durations.length > 0 || interval >= 1) {
            durations.push(interval);
            durationSeconds %= seconds;
        }
    }

    // pad all except first element with leading zeros
    durations = [
        durations[0],
        ...durations.slice(1).map(duration => duration.toString().padStart(2, '0'))
    ];

    return durations.join(':');
}
