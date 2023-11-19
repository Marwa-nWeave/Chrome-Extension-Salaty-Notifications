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

// ayat reminder
let ayahs = [];

async function fetchData() {
  try {
    const response = await fetch(chrome.runtime.getURL("quran.json"));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return null;
  }
}

async function scheduleAyahNotifications() {
  await fetchData(); // Wait for the JSON data to be fetched and loaded

  chrome.alarms.create("ayahAlarm", {
    delayInMinutes: 10, // Initial delay of 10 minutes
    periodInMinutes: 10, // Repeat the alarm every 10 minutes
  });
}

chrome.alarms.onAlarm.addListener(async function (alarm) {
  if (alarm.name === "ayahAlarm") {
    await showRandomAyahNotification(); // Wait for the random ayah notification to be displayed
  }
});

async function showRandomAyahNotification() {
  const data = await fetchData();
  if (!data) {
    console.error("No ayah data available");
    return;
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  const randomAyah = data[randomIndex];

  if (!randomAyah || !randomAyah.aya_text_emlaey) {
    console.error("Invalid ayah data or missing 'aya_text_emlaey' property");
    return;
  }

  const notificationOptions = {
    type: "basic",
    iconUrl: "images/icon2.png",
    title: "تدبر",
    message: `${randomAyah.aya_text_emlaey}\n- سورة ${randomAyah.sura_name_ar}-آية ${randomAyah.aya_no}`,
  };

  chrome.notifications.create(notificationOptions);
}

scheduleAyahNotifications(); // Call the function to schedule the initial ayah notification