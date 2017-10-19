
var express = require('express')
var app = express()
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = process.env.DATABASE_URL || 'postgres://elsa:elsa@127.0.0.1:5432/elsadb';
var bodyParser = require('body-parser');
var engine = require('ejs-locals');

app.engine('ejs', engine);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser());

app.use(express.static(__dirname + '/public'));

// index page 
app.get('/index', function(req, res) {
    res.render('pages/index.ejs');
});

app.get('/', function (req, res) {
	//res.redirect('admin.html');
	res.render('pages/index.ejs');
 });
 
app.post('/api/v1/reports', (req, res) => {
  const results = [];
  // Grab data from http request
//  console.log(req.body);
  const data = req.body;
 // console.log(data);
 // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      console.log("----------------------=====-------");
      return res.status(500).json({success: false, test:abc, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO elsadev(devid, timestamp, location, event) values($1, $2, $3, $4)',
    [data.devid, data.timestamp, data.location, data.event]);
    return res.json({"status":"success"});
  });
});


app.get('/api/v1/reports', (req, res) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM elsadev ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port $$$$    3000!      $$$$$')
});
