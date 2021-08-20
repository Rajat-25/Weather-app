const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//Define path for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather ',
    name: 'Raj',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me ',
    name: 'Raj',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Raj',
    helpText: 'Enter your query',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error: 'You must provide an address' });
  } else {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({error});
        }
        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
           return res.send({error});
          }
          res.send({
            forecast: forecastData,
            location: location,
            address: req.query.address,
          });
        });
      }
    );
  }

});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({ error: 'You must provide an search term' });
  }
  console.log(req.query.search);
  res.send({ products: [] });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Raj',
    errorMessage: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Raj',
    errorMessage: '404 page not found',
  });
});

app.listen(3000, () => {
  console.log('Server run succesfully');
});
