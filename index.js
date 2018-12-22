require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();
const http = require('http');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const MessagingResponse = twilio.twiml.MessagingResponse;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TWILIO_ACCOUNT_SSID = process.env.TWILIO_ACCOUNT_SSID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(TWILIO_ACCOUNT_SSID, TWILIO_AUTH_TOKEN);

const port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('App is up and running!');
});

app.post('/weather', (req, res) => {
  let query = req.body.Body;
  let type = !!Number(query) ? 'zip' : 'q';

  let url = `https://api.openweathermap.org/data/2.5/weather?${type}=${query}&APPID=${WEATHER_API_KEY}&units=imperial`;

  return axios
    .get(url)
    .then(info => {
      let { weather, main, name, sys } = info.data;
      let description = weather[0].description;
      let temp = main.temp;
      let city = name;
      let country = sys.country;
      let message = `It is ${temp} degrees in ${city}, ${country} with ${description}.`;
      let text = new MessagingResponse();
      text.message(message);
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(text.toString());
    })
    .catch(error => {
      let text = new MessagingResponse();
      console.log(error);
      text.message(
        `Invalid entry. Please enter valid US zip code or international city, country code eg. Toronto, CA.`
      );
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(text.toString());
    });
});

http.createServer(app).listen(port, () => {
  console.log(`Listening on server port ${port}`);
});
