require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const http = require('http');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const MessagingResponse = twilio.twiml.MessagingResponse;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TWILIO_ACCOUNT_SSID = process.env.TWILIO_ACCOUNT_SSID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(TWILIO_ACCOUNT_SSID, TWILIO_AUTH_TOKEN);

function message(text) {
  return client.messages
    .create({
      body: text,
      to: '+19176916588',
      from: '+14155944227'
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
  res.send('App is up and running!');
});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message('The robots');
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.post('/weather', (req, res) => {
  let query = req.body.Body;

  let zurl = `https://api.openweathermap.org/data/2.5/weather?zip=${query},us&APPID=${WEATHER_API_KEY}&units=imperial`;
  let curl = `https://api.openweathermap.org/data/2.5/weather?q=${query}`;
  let url = !!Number(query) ? zurl : curl;
  return axios
    .get(url)
    .then(weather => {
      let description = weather.data.weather[0].description;
      let temp = weather.data.main.temp;
      let city = weather.data.name;
      let message = `It is ${temp} degrees in ${city} with ${description}.`;
      let text = new MessagingResponse();
      text.message(message);
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(text.toString());
    })
    .catch(error => {
      let text = new MessagingResponse();
      text.message(`Invalid Zip Code`);
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(text.toString());
    });
});

http.createServer(app).listen(port, () => {
  console.log(`Listening on server port ${port}`);
});
