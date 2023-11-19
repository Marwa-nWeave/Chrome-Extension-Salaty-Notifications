const prayerTimes = [
  { name: "الفجر", time: "4:59" },
  { name: "الظهر", time: "11:45" },
  { name: "العصر", time: "14:40" },
  { name: "المغرب", time: "17:00" },
  { name: "العشاء", time: "18:22" },
];

chrome.runtime.sendMessage({ prayerTimes });
