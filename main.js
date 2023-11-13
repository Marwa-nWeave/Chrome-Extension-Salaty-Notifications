const prayerTimes = [
  { name: "الفجر", time: "04:55" },
  { name: "الظهر", time: "11:45" },
  { name: "العصر", time: "14:43" },
  { name: "المغرب", time: "18:04" },
  { name: "العشاء", time: "06:25" },
];

chrome.runtime.sendMessage({ prayerTimes });
