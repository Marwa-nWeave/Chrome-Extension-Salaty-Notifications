let prayerTimes = [];
let alarmsSet = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.prayerTimes) {
    prayerTimes = message.prayerTimes;
    scheduleAlarms();
  }
});

function scheduleAlarms() {
  if (alarmsSet) {
    return; // Alarms already set, do nothing
  }

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
  });

  alarmsSet = true; // Mark alarms as set
}

chrome.alarms.onAlarm.addListener(function (alarm) {
  const prayerName = alarm.name.substring("prayerAlarm".length);
  const entry = prayerTimes.find((entry) => entry.name === prayerName);
  if (entry) {
    // Display a notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/icon2.png",
      title: "Reminder",
      message: `حان الآن موعد صلاة ${entry.name}`,
    });
  }
});

// ayat reminder 
let ayahs = [];

fetch(chrome.runtime.getURL('quran.json'))
  .then(response => response.json())
  .then(data => {
    ayahs = data;
    scheduleAyahNotifications();
  });

  function scheduleAyahNotifications() {
    chrome.alarms.create("ayahAlarm", {
      delayInMinutes: 5, // Initial delay of 5 minutes
      periodInMinutes: 5, // Repeat the alarm every 5 minutes
    });
  }
  
  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "ayahAlarm") {
      showRandomAyahNotification();
    }
  });

function showRandomAyahNotification() {
  const randomIndex = Math.floor(Math.random() * ayahs.length);
  const randomAyah = ayahs[randomIndex];

  const notificationOptions = {
    type: "basic",
    iconUrl: "images/icon2.png",
    title: "تدبر",
    message: randomAyah.aya_text_emlaey,
    message: `${randomAyah.aya_text_emlaey}\n- سورة ${randomAyah.sura_name_ar}-آية ${randomAyah.aya_no}`,

  };

  chrome.notifications.create(notificationOptions);
}