const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

let app = express();

app.set('port', (process.env.PORT) || 3331);

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./router');
app.use(router);

let server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log(`Express 엔진이 ${app.get('port')}에서 실행중`);
});