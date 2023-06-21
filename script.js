let cityData = [];

window.addEventListener('DOMContentLoaded', fetchData);

async function fetchData() {
  try {
    const response = await fetch('http://13.48.147.79:3000');

    if (!response.ok) {
      throw new Error('Fetch failed');
    }

    const responseData = await response.json();
    cityData = Array.isArray(responseData) ? responseData : [responseData];
    displayData(cityData);
    fetchPrayerTimesForFirstCity(); // Fetch prayer times for the first city when the page loads
  } catch (error) {
    console.log('Error:', error);
  }
}

function displayData(data) {
  const dataElement = document.getElementById('data');
  let content = '';

  if (Array.isArray(data)) {
    data.forEach(item => {
      content += `<p onclick="displayCityPrayerTimes('${item.city}', '${item.latitude}', '${item.longitude}')">City: ${item.city}</p><br>`;
    });
  } else if (typeof data === 'object' && data !== null) {
    content += `<p>City: ${data.city}</p><br>`;
  }

  dataElement.innerHTML = content;
}

function displayPrayerTimes(prayerTimes) {
  const prayerTimesElement = document.getElementById('prayerTimes');
  let content = '';

  for (const key in prayerTimes) {
    if (typeof prayerTimes[key] === 'object' && prayerTimes[key] !== null) {
      content += `<p>${key}:</p>`;
      content += '<ul>';

      for (const prayer in prayerTimes[key]) {
        content += `<li>${prayer}: ${prayerTimes[key][prayer]}</li>`;
      }

      content += '</ul>';
    } else {
      content += `<p>${key}: ${prayerTimes[key]}</p>`;
    }
  }

  prayerTimesElement.innerHTML = content;
}

const searchInput = document.getElementById('search');
const suggestionsElement = document.getElementById('suggestions');
const responseElement = document.getElementById('response');

searchInput.addEventListener('input', function (event) {
  const typedWord = event.target.value;
  fetchDataWithSearch(typedWord);
});

searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const typedWord = event.target.value;
    fetchDataWithSearch(typedWord);
  }
});

async function fetchDataWithSearch(searchTerm) {
  searchTerm = searchTerm.trim();
  if (searchTerm.length > 0) {
    try {
      const response = await fetch(`http://13.48.147.79:4000/city`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: searchTerm,
      });

      if (!response.ok) {
        throw new Error('Fetch failed');
      }

      const data = await response.json();
      displaySuggestions(data);
    } catch (error) {
      console.log('Error:', error);
    }
  } else {
    suggestionsElement.innerHTML = '';
  }
}

function displaySuggestions(data) {
  let content = '';

  if (data.length > 0) {
    content += '<ul class="suggestions-list">';
    const maxSuggestions = 7;
    const limitedData = data.slice(0, maxSuggestions);

    limitedData.forEach(item => {
      const city = item.city;
      const lat = item.latitude;
      const lng = item.longitude;
      const country = item.country;
      content += `<li onclick="displayCityPrayerTimes('${city}', '${lat}','${lng}')">${city}, ${country}</li>`;
    });

    content += '</ul>';
  }

  suggestionsElement.innerHTML = content;
}

async function fetchPrayerTimesForFirstCity() {
  try {
    const firstCity = cityData[0];
    if (firstCity) {
      const { city, latitude, longitude } = firstCity;
      const prayerTimes = await fetchPrayerTimes(city, latitude, longitude);
      displayPrayerTimes(prayerTimes);
      displayData(firstCity);
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

async function displayCityPrayerTimes(city, lat, lng) {
  try {
    const prayerTimes = await fetchPrayerTimes(city, lat, lng);
    displayPrayerTimes(prayerTimes);
    const dataElement = document.getElementById('data');
    const content = `<p>City: ${city}</p>`;
    dataElement.innerHTML = content;
    suggestionsElement.innerHTML = '';
  } catch (error) {
    console.log('Error:', error);
  }
}

async function fetchPrayerTimes(city, lat, lng) {
  try {
    const reqBody = { city: city, latitude: lat, longitude: lng };
    const response = await fetch('http://13.48.147.79:80/prayer-times/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });

    if (!response.ok) {
      throw new Error('Prayer-times fetch failed');
    }

    const prayerTimes = await response.json();
    return prayerTimes;
  } catch (error) {
    console.log('Error:', error);
  }
}
