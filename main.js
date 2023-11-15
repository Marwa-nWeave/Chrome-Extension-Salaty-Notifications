const prayerTimes = [
  { name: "الفجر", time: "04:55" },
  { name: "الظهر", time: "11:45" },
  { name: "العصر", time: "14:43" },
  { name: "المغرب", time: "17:10" },
  { name: "العشاء", time: "18:25" },
];

chrome.runtime.sendMessage({ prayerTimes });
