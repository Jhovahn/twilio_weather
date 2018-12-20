require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const http = require('http');
const twilio = require('twilio');

const messagingResponse = twilio.twiml.Messagingresponse;
const app = express();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TWILIO_ACCOUNT_SSID = process.env.TWILIO_ACCOUNT_SSID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(TWILIO_ACCOUNT_SSID, TWILIO_AUTH_TOKEN);

function message() {
  return client.messages
    .create({
      body: 'hello',
      to: '+19176916588',
      from: '+14155944227'
    })
    .then(res => console.log(res.sid))
    .catch(err => console.log(err));
}

const port = process.env.PORT || 1337;

http.createServer(app).listen(port, () => {
  console.log(`listening on server port ${port}`);
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/test ', (req, res) => {
  res.send(`Successful post`);
});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message('The robots');
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

function weather(zip) {
  let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&APPID=${WEATHER_API_KEY}`;
  return axios
    .get(url)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}
