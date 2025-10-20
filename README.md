# Rubber Hose Weather App 🌞🌙
(This is my very first project and first time making it public, any feedback and advice would be awesome! Thank You!)

A vintage cartoon-style weather application featuring animated sun and moon elements that move across the sky based on real-time data.

![Weather App Demo](screenshot.png)

## 🌟 Features

- **Real-time Weather Data**: Fetches current weather and forecasts using OpenWeatherMap API
- **Animated Sky**: Sun and moon videos move in realistic arcs based on time of day
- **Rubber Hose Styling**: 1930s cartoon-inspired design with rounded borders and shadows
- **Responsive Design**: Works on desktop and mobile devices
- **Live Time Display**: Shows current time, date, and highlighted day of week

## 🛠️ Technologies Used

- **HTML5**: Structure and video elements
- **CSS3**: Flexbox layout, animations, and rubber hose styling
- **JavaScript ES6+**: API integration, DOM manipulation, trigonometric animations
- **OpenWeatherMap API**: Weather data source

## 🚀 How It Works

### Animation System
The sun and moon follow realistic arc paths calculated using trigonometry:
- **Daytime (6 AM - 6 PM)**: Sun moves from east to west
- **Nighttime (6 PM - 6 AM)**: Moon follows similar arc pattern
- **Position calculation**: Uses `Math.cos()` and `Math.sin()` for smooth movement

### API Integration
- Fetches current weather and 5-day forecast
- Displays hourly forecast (next 6 hours)
- Error handling for invalid cities or network issues

## 📋 Setup Instructions

1. **Clone this repository:**
   ```bash
   git clone https://github.com/Sean054/rubber-hose-weather-app.git
   ```

2. **Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)**

3. **Replace the API keys in `MyWeatherApp.js`:**
   ```javascript
   const API_KEYS = {
       current: "YOUR_API_KEY_HERE",
       forecast: "YOUR_API_KEY_HERE"
   };
   ```

4. **Open `MyWeatherApp.html` in a web browser**

## 📁 File Structure

```
rubber-hose-weather-app/
├── MyWeatherApp.html      # Main HTML structure
├── MyWeatherApp.js        # JavaScript logic and API integration
├── style.css              # CSS styling and animations
├── Sun_Cartoon.mp4        # Animated sun video
├── Moon_Cartoons.mp4      # Animated moon video
└── README.md              # Project documentation
```

## 🎯 Learning Outcomes

This project demonstrates:
- **Asynchronous JavaScript** (async/await, fetch API)
- **Mathematical calculations** in programming (trigonometry)
- **CSS positioning and animations**
- **API integration and error handling**
- **Clean code organization and documentation**
- **Git version control workflow**

## 🔮 Future Enhancements

- [ ] Weather condition-based background changes
- [ ] Additional weather details (humidity, wind speed)
- [ ] Location-based automatic weather detection
- [ ] Weather alerts and notifications
- [ ] Day/night background color transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing the weather API
- **1930s cartoon animation** for design inspiration
- **VS Code** for being an amazing development environment

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

*Created as a learning project to explore web APIs, animations, and responsive design.*
