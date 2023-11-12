const inputEL = document.getElementById('city-input')
const submitBtn = document.getElementById('submit-btn')
const locationBtn = document.getElementById('location-btn')
const cityEl = document.getElementById('city-text')
const iconEl = document.getElementById('current-icon')
const weatherEL = document.getElementById('current-weather')
const tempEL = document.getElementById('current-temp')
const windEl = document.getElementById('current-wind')
const humidEl = document.getElementById('current-humid')
const cardEl = document.querySelector('.forecast-card')

const API_KEY = "4ebfaead6c491afbfc58fc63b4b49102"
let city = ''
let icon = ''
let date = ''
let weather = ''
let temperature = ''
let wind = ''
let humidity = ''

function getGeolocation() {
    let inputValue = inputEL.value
    // console.log(inputValue)
    axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=${API_KEY}`)
        .then(response => {
            let cityLocation = response.data[0]
            let cityLatitude = cityLocation.lat
            let cityLongitude = cityLocation.lon
            getCurrentWeather(cityLatitude, cityLongitude)
            getForecastWeather(cityLatitude,cityLongitude)
        })
        .catch(err => {
            console.error(err)
        })
}

function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords
            getCurrentWeather(latitude,longitude)
            getForecastWeather(latitude,longitude)
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permision to grant access again!")   
            } else {
                alert("Geolocation request error. Please reset location permision to grant access again!")
            }
        }
    )
}

function getCurrentWeather(latitude, longitude) {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        .then(response => {
            let currentWeatherData = response.data
            city = currentWeatherData.name
            icon = currentWeatherData.weather[0].icon
            weather = currentWeatherData.weather[0].main
            temperature = (currentWeatherData.main.temp - 273.15).toFixed(2)
            wind = currentWeatherData.wind.speed
            humidity = currentWeatherData.main.humidity
            dateObject = new Date(currentWeatherData.dt * 1000)
            date = (dateObject.toString()).slice(0,15)

            cityEl.innerHTML = `<h2>City: ${city} (${date})</h2>`

            let iconImage = document.createElement("img")
            iconImage.src = `https://openweathermap.org/img/wn/${icon}@4x.png`
            iconImage.alt = "weather icon"
            iconImage.id = "current-icon"
            iconEl.innerHTML = ''
            iconEl.append(iconImage)
           
            weatherEL.innerHTML = `<p>Weather: ${weather}</p>`
            tempEL.innerHTML = `<p>Temperature: ${temperature}°C</p>`
            windEl.innerHTML = `<p>Wind: ${wind} m/s</p>`
            humidEl.innerHTML = `<p>Humidity: ${humidity}%</p>`
            inputEL.value = ''
          
        })
}

function getForecastWeather(latitude, longitude) {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        .then(response => {
            let forecastData = response.data
            let uniqueForecastDays = []
            let fiveDaysForecast = forecastData.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate()
                if(!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate)
                }
            })
            
            cardEl.innerHTML = ''

            fiveDaysForecast.reverse()

            fiveDaysForecast.forEach((forecastList, index) => {
                weather = forecastList.weather[0].main
                temperature = (forecastList.main.temp - 273.15).toFixed(2)
                wind = forecastList.wind.speed
                humidity = forecastList.main.humidity
                icon = forecastList.weather[0].icon
                dateObject = new Date(forecastList.dt * 1000)
                date = (dateObject.toString()).slice(0,15)

                const html = `<li>
                <h3>(${date})</h3>
                <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="forecast-icon">
                <h6 id="forecast-weather">Weather: ${weather}</h6>
                <h6 id="forecast-temp">Temperature: ${temperature} °C</h6>
                <h6 id="forecast-wind">Wind: ${wind} m/s</h6>
                <h6 id="forecast-humid">Humidity: ${humidity}%</h6>
                </li>`
                if (index < fiveDaysForecast.length - 1) {
                    cardEl.insertAdjacentHTML("afterbegin", html)
                }
              
            })
        })
}

submitBtn.addEventListener("click", getGeolocation)
locationBtn.addEventListener("click", getCurrentLocation)