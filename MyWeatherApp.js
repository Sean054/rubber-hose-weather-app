// ==========================================
// API CONFIGURATION
// ==========================================

const API_KEYS = {
    current: "YOUR_API_KEY_HERE",
    forecast: "YOUR_API_KEY_HERE"
};

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// ==========================================
// DOM ELEMENT REFERENCES
// ==========================================
const elements = {
    // Input elements
    cityInput: document.getElementById("cityInput"),
    getWeatherButton: document.getElementById("getWeatherButton"),
    
    // Display elements
    time: document.getElementById("time"),
    date: document.getElementById("date"),
    temperature: document.getElementById("temperature"),
    day: document.getElementById("day"),
    
    // Forecast containers
    hourlyForecast: document.getElementById("hourlyForecast"),
    weeklyForecast: document.getElementById("weeklyForecast"),
    
    // Animation elements
    sky: document.getElementById("sky"),
    sun: document.getElementById("sun"),
    moon: document.getElementById("moon")
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Converts Unix timestamp to readable time string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted time string (HH:MM)
 */
function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

/**
 * Converts Unix timestamp to readable date string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string (e.g., "Mon Dec 25")
 */
function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}

/**
 * Keeps a value within specified bounds
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Fetches weather data for a given city
 * @param {string} city - Name of the city
 * @returns {Promise<Object>} Weather data object with current and forecast
 */
async function getWeather(city) {
    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEYS.current}&units=imperial`
        );
        
        // Fetch forecast data
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEYS.forecast}&units=imperial`
        );

        // Check if requests were successful
        if (!currentResponse.ok) {
            throw new Error("City not found");
        }
        
        if (!forecastResponse.ok) {
            throw new Error("Forecast data unavailable");
        }

        // Return combined data
        return {
            current: await currentResponse.json(),
            forecast: await forecastResponse.json()
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// ==========================================
// TIME AND DATE FUNCTIONS
// ==========================================

/**
 * Updates the time and date display elements
 */
function updateTimeAndDate() {
    const now = new Date();
    
    // Update time display
    if (elements.time) {
        elements.time.textContent = now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });
    }
    
    // Update date display
    if (elements.date) {
        elements.date.textContent = now.toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
    }
}

/**
 * Sets up the day of the week display with today highlighted
 */
function setupDaysOfWeek() {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const todayIndex = today.getDay();

    if (elements.day) {
        elements.day.innerHTML = daysOfWeek
            .map((dayName, index) => {
                const isToday = index === todayIndex;
                const className = isToday ? ' class="circle-today"' : "";
                return `<span${className}>${dayName}</span>`;
            })
            .join(" ");
    }
}

// ==========================================
// ANIMATION FUNCTIONS
// ==========================================

/**
 * Calculates the current hour as a decimal (e.g., 2:30 PM = 14.5)
 * @returns {number} Current hour with minutes as decimal
 */
function getCurrentHour() {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
}

/**
 * Calculates position for sun during daytime (6 AM - 6 PM)
 * @param {number} hour - Current hour as decimal
 * @param {Object} skyDimensions - Sky container dimensions
 * @returns {Object} x and y coordinates
 */
function calculateSunPosition(hour, skyDimensions) {
    const { skyWidth, skyHeight, radius, centerX, centerY } = skyDimensions;
    
    // Calculate progress through the day (0 = 6am, 1 = 6pm)
    const dayProgress = (hour - 6) / 12;
    
    // Calculate arc position using trigonometry
    const angle = Math.PI - dayProgress * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - Math.abs(radius * Math.sin(angle));
    
    return {
        x: clamp(x, 15, skyWidth - 15),
        y: clamp(y, 15, skyHeight - 15)
    };
}

/**
 * Calculates position for moon during nighttime (6 PM - 6 AM)
 * @param {number} hour - Current hour as decimal
 * @param {Object} skyDimensions - Sky container dimensions
 * @returns {Object} x and y coordinates
 */
function calculateMoonPosition(hour, skyDimensions) {
    const { skyWidth, skyHeight, radius, centerX, centerY } = skyDimensions;
    
    // Adjust hour for night cycle (handle midnight crossing)
    let nightHour = hour;
    if (nightHour < 6) nightHour += 24;
    
    // Calculate progress through the night (0 = 6pm, 1 = 6am)
    const nightProgress = (nightHour - 18) / 12;
    
    // Calculate arc position using trigonometry
    const angle = Math.PI - nightProgress * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - Math.abs(radius * Math.sin(angle));
    
    return {
        x: clamp(x, 15, skyWidth - 15),
        y: clamp(y, 15, skyHeight - 15)
    };
}

/**
 * Updates the sun and moon positions based on current time
 */
function updateSky() {
    // Check if all required elements exist
    if (!elements.sky || !elements.sun || !elements.moon) {
        console.log("Sky elements not found - waiting for HTML to load");
        return;
    }

    const currentHour = getCurrentHour();
    
    // Get sky container dimensions
    const skyDimensions = {
        skyWidth: elements.sky.offsetWidth,
        skyHeight: elements.sky.offsetHeight,
        radius: Math.min(elements.sky.offsetWidth, elements.sky.offsetHeight) / 3,
        centerX: elements.sky.offsetWidth / 2,
        centerY: elements.sky.offsetHeight - 10
    };

    // Determine if it's day or night (6 AM - 6 PM = day)
    const isDaytime = currentHour >= 6 && currentHour < 18;
    
    if (isDaytime) {
        // Show sun, hide moon
        elements.sun.style.display = "block";
        elements.moon.style.display = "none";
        
        // Calculate and set sun position
        const sunPosition = calculateSunPosition(currentHour, skyDimensions);
        elements.sun.style.left = `${sunPosition.x}px`;
        elements.sun.style.top = `${sunPosition.y}px`;
    } else {
        // Show moon, hide sun
        elements.sun.style.display = "none";
        elements.moon.style.display = "block";
        
        // Calculate and set moon position
        const moonPosition = calculateMoonPosition(currentHour, skyDimensions);
        elements.moon.style.left = `${moonPosition.x}px`;
        elements.moon.style.top = `${moonPosition.y}px`;
    }
}

// ==========================================
// WEATHER DISPLAY FUNCTIONS
// ==========================================

/**
 * Updates the current temperature display
 * @param {Object} currentWeatherData - Current weather data from API
 */
function updateCurrentTemperature(currentWeatherData) {
    if (elements.temperature) {
        const temp = Math.round(currentWeatherData.main.temp);
        elements.temperature.textContent = `${temp}°F`;
    }
}

/**
 * Updates the hourly forecast display
 * @param {Array} forecastList - Array of forecast data points
 */
function updateHourlyForecast(forecastList) {
    if (!elements.hourlyForecast) return;
    
    const hourlyHTML = forecastList
        .slice(0, 6) // Show next 6 hours
        .map((item) => {
            const time = formatTime(item.dt);
            const temp = Math.round(item.main.temp);
            return `<div>${time}: ${temp}°F</div>`;
        })
        .join("");
    
    elements.hourlyForecast.innerHTML = hourlyHTML;
}

/**
 * Updates the weekly forecast display
 * @param {Array} forecastList - Array of forecast data points
 */
function updateWeeklyForecast(forecastList) {
    if (!elements.weeklyForecast) return;
    
    let lastDate = "";
    let daysShown = 0;
    
    const weeklyHTML = forecastList
        .filter((item) => {
            // Filter to show only one entry per day, max 5 days
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (date !== lastDate && daysShown < 5) {
                lastDate = date;
                daysShown++;
                return true;
            }
            return false;
        })
        .map((item) => {
            const date = formatDate(item.dt);
            const temp = Math.round(item.main.temp);
            return `<div>${date}: ${temp}°F</div>`;
        })
        .join("");
    
    elements.weeklyForecast.innerHTML = weeklyHTML;
}

/**
 * Handles successful weather data fetch and updates all displays
 * @param {Object} weatherData - Complete weather data object
 */
function handleWeatherSuccess(weatherData) {
    console.log("Weather data fetched successfully:", weatherData);
    
    // Update all weather displays
    updateCurrentTemperature(weatherData.current);
    updateHourlyForecast(weatherData.forecast.list);
    updateWeeklyForecast(weatherData.forecast.list);
}

/**
 * Handles weather data fetch errors
 * @param {Error} error - The error that occurred
 */
function handleWeatherError(error) {
    console.error("Error fetching weather data:", error);
    alert("Cannot fetch weather data: " + error.message);
}

// ==========================================
// EVENT HANDLERS
// ==========================================

/**
 * Handles the get weather button click event
 */
function handleGetWeatherClick() {
    console.log("Get Weather button clicked");
    
    const city = elements.cityInput.value.trim();
    console.log("City input value:", city);
    
    if (!city) {
        console.log("City input is empty");
        alert("Please enter a city name.");
        return;
    }
    
    // Fetch weather data and handle response
    getWeather(city)
        .then(handleWeatherSuccess)
        .catch(handleWeatherError);
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initializes the weather app when the page loads
 */
function initializeApp() {
    console.log("Weather app initializing...");
    
    // Set up time and date updates
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);
    
    // Set up sky animation
    updateSky();
    setInterval(updateSky, 1000);
    
    // Set up days of the week display
    setupDaysOfWeek();
    
    // Add event listener for weather button
    if (elements.getWeatherButton) {
        elements.getWeatherButton.addEventListener("click", handleGetWeatherClick);
    }
    
    console.log("Weather app initialized successfully!");
}

// Start the app when the page is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);