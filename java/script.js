document.addEventListener("DOMContentLoaded", function () {
  // Select the button and other necessary elements
  const butpage2 = document.querySelector(".butn");
  const btnLocation = document.querySelector(".btn_location");
  const cards = document.querySelector("#cards");
  const searchInp = document.querySelector("#searchInp");
  const weatherAlert = document.querySelector("#weatherAlert");

  // Attach the click event listener for btn_location to fetch the user's geolocation
  btnLocation.addEventListener("click", function () {
    console.log("Fetching location...");

    // Check if the browser supports geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          // Success callback: The position object contains the user's location
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          // Fetch weather data based on the user's geolocation
          getWeather(`${latitude},${longitude}`);
        },
        function (error) {
          // Error callback
          console.error(`Error: ${error.message}`);
          weatherAlert.classList.remove("d-none");
          cards.classList.add("d-none");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      weatherAlert.classList.remove("d-none");
      cards.classList.add("d-none");
    }
  });

  // Fetch Weather Data from API
  async function getWeather(location) {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=78cc8a072c9e4f3e9d0171535240912&q=${location}&days=3`
      );

      if (response.status !== 200)
        throw new Error("Failed to fetch weather data.");

      const result = await response.json();
      displayWeather(result);
      weatherAlert.classList.add("d-none"); // Hide alert on success
      cards.classList.remove("d-none"); // Show cards on success
      searchInp.value = ""; // Clear input after search
    } catch (error) {
      console.error("Error fetching weather:", error);
      weatherAlert.classList.remove("d-none"); // Show alert on error
      cards.classList.add("d-none"); // Hide cards on error
    }
  }

  // Display Weather Cards
  function displayWeather(result) {
    const days = result.forecast.forecastday;
    let cardContent = "";
    const now = new Date();

    for (let [index, day] of days.entries()) {
      const date = new Date(day.date);
      cardContent += `
          <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card">
              <div class="card-header bg-transparent d-flex justify-content-between text-white">
                <div class="day">${date.toLocaleDateString("en-us", {
                  weekday: "long",
                })}</div>
                <div class="date">${date.getDate()} ${date.toLocaleDateString(
        "en-us",
        { month: "short" }
      )}</div>
              </div>
              <div class="card-body text-white py-2">
                <div class="location">${result.location.name}</div>
                <h5 class="card-title degree">${
                  day.hour[now.getHours()].temp_c
                }°C</h5>
                <img src="${
                  "https:" + day.day.condition.icon
                }" width="120" alt="${day.day.condition.text}">
                <div class="card-text">${day.day.condition.text}</div>
                <div class="weather-details mb-2">
                  <span><img src="imgs/icon-umberella.png" alt=""> ${
                    day.hour[now.getHours()].humidity
                  }%</span>
                  <span><img src="imgs/icon-wind.png" class="degree" alt="18 km/h"> ${
                    day.hour[now.getHours()].wind_kph
                  } km/h </span>
                  <span><img src="imgs/icon-compass.png" alt="East"> ${
                    day.hour[now.getHours()].wind_dir
                  } </span>
                </div>
              </div>
            </div>
          </div>
        `;
    }
    cards.innerHTML = cardContent;
  }

  // On Search Input Key Press
  searchInp.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      getWeather(this.value);
    }
  });
});




function go(){
    window.location.href = "page2.html";
}