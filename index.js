require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const http = require('http');
const messagingResponse = require('twilio').twiml.Messagingresponse;
const app = express();
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/sms', (req, res) => {
  const twiml = new Messagingresponse();
  twiml.message('The robots');
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log(`listening on server port 1337`);
});

function weather(zip) {
  let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&APPID=${WEATHER_API_KEY}`;
  return axios
    .get(url)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}
