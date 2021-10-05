//Declaring and Requiring Packages

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const res = require('express/lib/response');

//Using Express JS
const app = express();

//Here Express is used to access our static pages & contents
app.use(express.static('public'));

//Here BodyParser is used to parse input from our html
app.use(bodyParser.urlencoded({ extended: true }));

//Sending our html page as response for GET request from client
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

//Here we're sending our validated results for the POST request from client
app.post('/', function(req, res) {

    //When user posts, using bodyparser we're getting their data
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    //This Data is constructed based on the MAILCHIMPS API Data model
    //Here we're gathering all those data and framing it as mentioned in MailChimps API
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: secondName
            }
        }]
    };

    //Converting those data into JSON format
    const jsonData = JSON.stringify(data);

    //Url for MailChimp API
    const url = 'https://us5.api.mailchimp.com/3.0/lists/ef02068b55'

    //Posting object for that allows us to post data on MailChimp
    const options = {
        method: 'POST',
        auth: 'arjun1:19232929ac129c7f1546659998a86a79-us5'
    }

    //Here, we're are sending request to MailChimp to accept & store our data
    //Once accepted, our gathered data has been sent as response
    const request = https.request(url, options, function(response) {

        //Checking status of response
        const status = response.statusCode;
        if (status == 200) {
            //Displaying success if succeeded
            res.sendFile(__dirname + '/success.html');
        } else {
            //Displaying failure if succeeded
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', function(data) {
            console.log(JSON.parse(data));
        });
    });

    //Once request is accepted, data is written as JSON
    request.write(jsonData);
    request.end();

});

//The failure page is redirected to Homepage when button is clicked
app.post('/failure', function(req, res) {
    res.redirect('/');
})

//Dynmanic Port allocation by HEROKU or Port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log("Server working at Port: 3000");
});













// API key
// 19232929ac129c7f1546659998a86a79-us5

// list ID
// ef02068b55