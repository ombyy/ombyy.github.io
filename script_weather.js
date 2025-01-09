document.addEventListener("DOMContentLoaded", function() {
    const weatherDescriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Drizzle: Light intensity",
        53: "Drizzle: Moderate intensity",
        55: "Drizzle: Dense intensity",
        56: "Freezing Drizzle: Light intensity",
        57: "Freezing Drizzle: Dense intensity",
        61: "Rain: Slight intensity",
        63: "Rain: Moderate intensity",
        65: "Rain: Heavy intensity",
        66: "Freezing Rain: Light intensity",
        67: "Freezing Rain: Heavy intensity",
        71: "Snow fall: Slight intensity",
        73: "Snow fall: Moderate intensity",
        75: "Snow fall: Heavy intensity",
        77: "Snow grains",
        80: "Rain showers: Slight intensity",
        81: "Rain showers: Moderate intensity",
        82: "Rain showers: Violent intensity",
        85: "Snow showers: Slight intensity",
        86: "Snow showers: Heavy intensity",
        95: "Thunderstorm: Slight or moderate",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };

    const fetchWeatherData = async function() {
        const city = document.getElementById('cityInput').value.trim().toLowerCase();
        if (!city) {
            alert('Please enter a city name.');
            return;
        }

        try {
            const response = await fetch('cities500.json');
            const cities = await response.json();
            const cityData = cities.find(c => c.name.toLowerCase().replace(/\s+/g, '') === city.replace(/\s+/g, ''));
            if (!cityData) {
                alert('City not found. Please enter a valid city name.');
                return;
            }

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&hourly=temperature_2m,weathercode&timezone=GMT`;

            const weatherResponse = await fetch(url);
            const data = await weatherResponse.json();
            const weatherCode = data.hourly.weathercode[0];
            const temperature = data.hourly.temperature_2m[0];
            const weatherDescription = weatherDescriptions[weatherCode] || "Unknown weather code";
            
            document.getElementById("title1").textContent = `Temperature in ${cityData.name}: ${temperature}°C and weather: ${weatherDescription}`;
            const jsonData = JSON.stringify(data, null, 2);
            document.getElementById("weatherData").textContent = jsonData;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const setBackground = function() {
        const hour = new Date().getHours();
        let timeOfDay;

        if (hour >= 5 && hour < 12) {
            timeOfDay = 'morning';
        } else if (hour >= 12 && hour < 17) {
            timeOfDay = 'afternoon';
        } else if (hour >= 17 && hour < 20) {
            timeOfDay = 'evening';
        } else {
            timeOfDay = 'night';
        }

        document.body.className = timeOfDay;
    };

    setBackground();
    document.getElementById('getWeatherButton').addEventListener('click', fetchWeatherData);

    document.getElementById('cityInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            fetchWeatherData();
        }
    });
    
    function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar');

    const ul = document.createElement('ul');

    const links = [
        { name: 'Home', href: '/index.html' },
        { name: 'About', href: '/about.html' },
        { name: 'Contact', href: '/contact.html' },
        { name: 'Projects', href: '/projects.html' }
    ];

    links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = link.name;
        a.href = link.href;
        li.appendChild(a);
        ul.appendChild(li);
    });

    navbar.appendChild(ul);
    document.body.appendChild(navbar);

    setActiveLink();
}

function setActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.navbar a');

    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function addVideoBackground() {
    const videoBackground = document.createElement('div');
    videoBackground.classList.add('video-background');

    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.id = 'bg-video';

    const source = document.createElement('source');
    source.src = 'img/img_website/background1.mp4';
    source.type = 'video/mp4';

    video.appendChild(source);
    videoBackground.appendChild(video);
    document.body.appendChild(videoBackground);
}

addVideoBackground();
createNavbar();
});

