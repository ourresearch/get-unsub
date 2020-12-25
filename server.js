var sslRedirect = require('heroku-ssl-redirect');


const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

let app = express();

// https://medium.com/@thiscodeworks.com/how-to-redirect-your-node-js-app-hosted-on-heroku-from-http-to-https-50ef80130bff
// https://www.npmjs.com/package/heroku-ssl-redirect
app.use(sslRedirect(['production'], 301));



// this was helpful for configs:
// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
app.use(serveStatic(__dirname + "/dist"));

app.get('*', function(req, res) {
  res.sendfile('./dist/index.html');
});



// redirect to https. untested yet.
app.get('*', function (req, res) {

    if (req.protocol !== "https") {
        const redirectUrl =  "https://journals.unpaywall.org" + req.path
        res.redirect(redirectUrl)
    }
    else {
        res.sendfile('./dist/index.html');
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});