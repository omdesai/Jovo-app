'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const requestPromise = require('request-promise-native');
// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
	this.ask("Hello! This is your jovo app! Glad to help.");
  },

  async WeatherIntent() {
	const weather = await getWeather(this.$inputs.zipCode);
    this.tell(weather);
  },

  MyNameIsIntent() {
    this.tell('Hey ' + this.$inputs.namevalue + ', nice to meet you!');
  },
});

async function getWeather(zipCode){
	const options = {
        uri: "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode.value + "&appid=30dcb85b5b8f06a3630da7ef742ba2d5",
        json: true // Automatically parses the JSON string in the response
    };
    const data = await requestPromise(options);
	const quote = "There is/are currently " + data.weather[0].description + ". The temperature in this area is " + Math.round(10*(data.main.temp - 273.15))/10 + " degrees Celsius. The wind speed is " + data.wind.speed + " mph. The humidity is " + data.main.humidity + "%.";
	return quote;
}

module.exports = { app };
