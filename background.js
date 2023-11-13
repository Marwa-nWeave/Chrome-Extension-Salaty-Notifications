let prayerTimes = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.prayerTimes) {
    prayerTimes = message.prayerTimes;
    scheduleAlarms();
  }
});

function scheduleAlarms() {
  Object.entries(prayerTimes).forEach(([index, entry]) => {
    const currentTime = new Date();
    const prayerTime = new Date();
    const [hours, minutes] = entry.time.split(" ")[0].split(":");
    prayerTime.setHours(parseInt(hours));
    prayerTime.setMinutes(parseInt(minutes));
    if (prayerTime < currentTime) {
      // If the prayer time has already passed today, set it for tomorrow
      prayerTime.setDate(prayerTime.getDate() + 1);
    }
    const delayInMinutes = Math.floor((prayerTime - currentTime) / 60000);
    chrome.alarms.create(`prayerAlarm${entry.name}`, {
      delayInMinutes,
      periodInMinutes: 24 * 60, // Repeat the alarm every day
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
      if (alarm.name === `prayerAlarm${entry.name}`) {
        // Display a notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "images/icon2.png",
          title: "Reminder",
          message: ` حان الآن موعد صلاة ${entry.name}`,
        });
      }
    });
  });
}