const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');;

let app = express();

app.set('port', (process.env.PORT) || 3331);

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const baseRouter = require('./routers/commonRouter.js');
app.use('/', baseRouter);

const loginRouter = require('./routers/loginRouter.js');
app.use('/login', loginRouter);

const userInfoRouter = require('./routers/userinfoRouter.js');
app.use('/user', userInfoRouter);

// mongoose.Promise = global.Promise;

// mongoose.connect(process.env.MONGO_URI, { useMongoClient: true })
// .then(() => console.log('Successfully connected to mongodb'))
// .catch(e => console.error(e));


let server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log(`Express 엔진이 ${app.get('port')}에서 실행중`);
});