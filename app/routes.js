//all the routes for our application
module.exports = function(app, passport) {
	
	var connectionString = 'postgres://elsa:elsa@127.0.0.1:5432/elsadb';
	var pg = require('pg');
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        // res.render('index.ejs'); // load the index.ejs file   
		  res.render('login.ejs');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
			message: req.flash('loginMessage') 
		});
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/elsa/index', // redirect to the secure profile section
        failureRedirect : '/elsa/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.get('/index', isLoggedIn, function(req, res) {
		 res.render('main.ejs', {		
            user : req.user // get the user out of session and pass to template
        });
    });
	
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/elsa/profile', // redirect to the secure profile section
        failureRedirect : '/elsa/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
      // res.render('pages/test.ejs', {
		// res.render('pages/main.ejs', {
		res.render("partials/profile_settings.ejs", {
            user : req.user // get the user out of session and pass to template
        });
        console.log(req.user);
    });
		   
// =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/elsa');
    });
	
	//===============================================
	//OLD ELSA API ROUTES
	//===============================================
	
	app.post('/api/v1/reports', (req, res) => {
    const results = [];
    // Grab data from http request
    //  console.log(req.body);
    const data = req.body;
    // console.log(data);
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            console.log("----------------------=====-------");
            return res.status(500).json({
                success: false,
                test: abc,
                data: err
            });
        }
        // SQL Query > Insert Data
        client.query('INSERT INTO elsadev(devid, timestamp, location, event) values($1, $2, $3, $4)', [data.devid, data.timestamp, data.location, data.event]);
        return res.json({
            "status": "success"
        });
    });
});

app.post('/api/v1/usrdev', (req, res) => {
    const results = [];
    // Grab data from http request
    //  console.log(req.body);
    const data = req.body;
    // console.log(data);
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            console.log("----------------------=====-------");
            return res.status(500).json({
                success: false,
                test: abc,
                data: err
            });
        }
        // SQL Query > Insert Data
        client.query('INSERT INTO usrdev(u_id, devid) values($1, $2)', [data.u_id, data.devid]);
        return res.json({
            "status": "success"
        });
    });
});

app.get('/api/v1/reports', (req, res) => {
    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
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

app.get('/api/v1/usrdev', (req, res) => {
    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM usrdev ORDER BY id ASC;');
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

app.get('/api/v1/users', (req, res) => {
    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM users ORDER BY u_id ASC;');
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
	
	
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('isLoggedin');
        return next();
    }
    console.log('is not logged in');

    // if they aren't redirect them to the home page
    res.redirect('/elsa');
}