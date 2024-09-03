const express = require('express');
const request = require('request');
require('dotenv').config();
const app = express();
const mapboxToken = 'pk.eyJ1IjoibWFkaGFuMjgyMiIsImEiOiJjbTBiMXJiZWcwNDd6MnBzOGk3NjNubzI5In0.0jJuUSZwA3gLTvvICxoU3Q' 

let cachedRouteData = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 5 * 1000;

// Function to check if the cache is still valid
const isCacheValid = () => {
  if (!cacheTimestamp) return false;
  return (Date.now() - cacheTimestamp) < CACHE_DURATION_MS;
};

// Endpoint to fetch directions with caching
app.get('/directions', async (req, res) => {
  const startTime = Date.now(); // Record start time

  try {
    if (cachedRouteData && isCacheValid()) {
      console.log('Serving cached data');

      // Calculate and log response time
      const responseTime = Date.now() - startTime;
      console.log(`Response time (cached): ${responseTime} ms`);

      // Return cached data
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.json(formatResponse(cachedRouteData));
    } else {
      console.log('Fetching new data from Mapbox Directions API');

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/` +
                  `-87.6298,41.8781;-118.2437,34.0522`; // Coordinates for Chicago to Los Angeles
      request.get({
        url: url,
        qs: {
          access_token: mapboxToken,
          geometries: 'geojson',
          steps: true, 
        },
        json: true
      }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.error('Error fetching directions:', error || body);
          res.status(500).json({ error: 'Failed to fetch directions' });
          return;
        }

        // Cache the data
        cachedRouteData = body;
        cacheTimestamp = Date.now();
        console.log('Fetched and cached new data');


        const responseTime = Date.now() - startTime;
        console.log(`Response time (non-cached): ${responseTime} ms`);

        // Return new data
        res.set({
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.json(formatResponse(body));
      });
    }
  } catch (error) {
    console.error('Error fetching directions:', error);
    res.status(500).json({ error: 'Failed to fetch directions' });
  }
});

const formatResponse = (data) => {
  if (!data.routes || data.routes.length === 0) {
    return { error: 'No routes found or an error occurred.' };
  }

  const route = data.routes[0];

 
  if (route.legs && route.legs.length > 0) {
    const leg = route.legs[0];
    return {
      distance: `${(route.distance / 1000).toFixed(2)} km`,
      duration: `${route.duration.toFixed(2)} seconds`,
      steps: leg.steps.map((step, index) => ({
        step_number: index + 1,
        instruction: step.maneuver.instruction,
        distance: `${(step.distance / 1000).toFixed(2)} km`,
        duration: `${step.duration.toFixed(2)} seconds`
      }))
    };
  } else {
    return {
      distance: `${(route.distance / 1000).toFixed(2)} km`,
      duration: `${route.duration.toFixed(2)} seconds`,
      steps: "No steps data available"
    };
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
