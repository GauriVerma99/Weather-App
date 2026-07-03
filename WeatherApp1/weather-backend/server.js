// Load environment variables from .env into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Allow requests from your frontend (different origin)
app.use(cors());

// Our one route: GET /api/weather?city=London
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;

  // Basic validation: was a city even provided?
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    if (!response.ok) {
      console.error('OpenWeather error:', response.status, data);
      return res.status(response.status).json({ error: data.message || 'Weather provider error' });
    }


    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});