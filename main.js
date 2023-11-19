// Receive the message from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const receivedDelayTime = message.delayTime;

  // Display the delay time in the pop-up
  const delayTimeElement = document.getElementById('currentDelayTime');
  delayTimeElement.textContent = receivedDelayTime;
});

const prayerTimes = [
  { name: "الفجر", time: "4:59" },
  { name: "الظهر", time: "11:45" },
  { name: "العصر", time: "14:40" },
  { name: "المغرب", time: "17:00" },
  { name: "العشاء", time: "18:22" },
];

submitButton.addEventListener('click', function() {
  const delayTimeInput = document.getElementById('delayTime');
  const delayTime = delayTimeInput.value;
  if (delayTime === '') {
    // Display an error message or perform any necessary action
    console.log('Input field is empty');
    return;
  }
  chrome.runtime.sendMessage({ prayerTimes, delayTime });

  window.close();
  // Clear the input field
  delayTimeInput.value = '';
});