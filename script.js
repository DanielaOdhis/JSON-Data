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
  } catch (error) {
    console.log('Error:', error);
  }
}

function displayData(data) {
  const dataElement = document.getElementById('data');
  let content = '';

  if (Array.isArray(data)) {
    data.forEach(item => {
      content += `<p>City: ${item.city}</p><p>Latitude: ${item.latitude}</p><p>Longitude: ${item.longitude}</p><br>`;
    });
  } else if (typeof data === 'object' && data !== null) {
    content += `<p>City: ${data.city}</p><p>Latitude: ${data.latitude}</p><p>Longitude: ${data.longitude}</p>`;
  }

  dataElement.innerHTML = content;
}

const searchInput = document.getElementById('search');
const suggestionsElement = document.getElementById('suggestions');
const responseElement = document.getElementById('response');

searchInput.addEventListener('input', function(event) {
  const typedWord = event.target.value;
  console.log(typedWord);
  fetchDataWithSearch(typedWord);
});

searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const typedWord = event.target.value;
    // console.log(typedWord);
    fetchDataWithSearch(typedWord);
  }
});

async function fetchDataWithSearch(searchTerm) {
  try {
    const response = await fetch(`http://13.48.147.79:4000/city`);

    if (!response.ok) {
      throw new Error('Fetch failed');
    }

    const data = await response.json();
    const filteredData = filterData(data, searchTerm);
    displaySuggestions(filteredData);
  } catch (error) {
    console.log('Error:', error);
  }
}

function filterData(data, searchTerm) {
  if (Array.isArray(data)) {
    return data.filter(item => {
      const cityName = item.city.toLowerCase();
      const search = searchTerm.toLowerCase();
      return cityName.includes(search);
    });
  }

  return [];
}


function displaySuggestions(data) {
  let content = '';

  if (data.length > 0) {
    content += '<ul class="suggestions-list">';
    const maxSuggestions = 7;
    const limitedData = data.slice(0, maxSuggestions);

    limitedData.forEach(item => {
      const city = item.city;
      const country = item.country;
      content += `<li onclick="displayCityDetails('${city}', '${country}')">${city}, ${country}</li>`;
    });

    content += '</ul>';
  }

  suggestionsElement.innerHTML = content;
}

function displayCityDetails(city, country) {
  const filteredData = cityData.filter(item => item.city === country);

  if (filteredData.length === 0) {
    responseElement.innerHTML = 'City details not found.';
    return;
  }

  const foundCity = filteredData.find(item => item.city === city);

  if (foundCity) {
    const { city: cityName, country: countryName, latitude, longitude } = foundCity;
    const content = `<p>City: ${cityName}</p><p>Country: ${countryName}</p><p>Latitude: ${latitude}</p><p>Longitude: ${longitude}</p>`;
    responseElement.innerHTML = content;
  } else {
    responseElement.innerHTML = 'City details not found.';
  }
}

