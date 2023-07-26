import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosenDate = selectedDates[0];
    const currentDate = new Date();
    if (chosenDate <= currentDate) {
      Notiflix.Notify.failure("Please choose a date in the future");
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

const datetimePicker = flatpickr("#datetime-picker", options);

const startButton = document.querySelector('[data-start]');
startButton.disabled = true; 


let intervalId = null;

function updateTimer() {
  const chosenDate = new Date(datetimePicker.selectedDates[0]);
  const currentDate = new Date();
  const timeDifference = chosenDate - currentDate;

  if (timeDifference <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    showTime(0, 0, 0, 0);
    Notiflix.Notify.success("Time's up!");
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);
  showTime(days, hours, minutes, seconds);
}

function showTime(days, hours, minutes, seconds) {
  const daysElem = document.querySelector('[data-days]');
  const hoursElem = document.querySelector('[data-hours]');
  const minutesElem = document.querySelector('[data-minutes]');
  const secondsElem = document.querySelector('[data-seconds]');

  daysElem.textContent = addLeadingZero(days);
  hoursElem.textContent = addLeadingZero(hours);
  minutesElem.textContent = addLeadingZero(minutes);
  secondsElem.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

startButton.addEventListener("click", () => {
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 1000);
    startButton.disabled = true; 
  }
});

// Для підрахунку значень використовуй готову функцію convertMs, 
// де ms - різниця між кінцевою і поточною датою в мілісекундах.

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
