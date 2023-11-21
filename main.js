const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Add 1 to get the month number
const city = 'Alexandria';
const country = 'Egypt';
const method = 2;
let todayObject = null; // Declare todayObject outside the fetch scope

const apiUrl = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}`;

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const day = currentDate.getDate();
    const monthName = currentDate.toLocaleString('default', { month: 'short' });
    const currentDateString = `${day} ${monthName} ${year}`;

    todayObject = data.data.find(obj => obj.date.readable === currentDateString);

    if (todayObject) {
      const prayerTimes = [
        { name: "الفجر", time: todayObject.timings?.Fajr },
        { name: "الظهر", time: todayObject.timings?.Dhuhr },
        { name: "العصر", time: todayObject.timings?.Asr },
        { name: "المغرب", time: todayObject.timings?.Maghrib },
        { name: "العشاء", time: todayObject.timings?.Isha },
      ];

      const submitButton = document.getElementById('submitButton');

      if(submitButton){

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
      }
    } else {
      console.log("No data available for today.");
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();

    // Receive the message from the background script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      const receivedDelayTime = message.delayTime;

      // Display the delay time in the pop-up
      const delayTimeElement = document.getElementById('currentDelayTime');
      delayTimeElement.textContent = receivedDelayTime;
    });