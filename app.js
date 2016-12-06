const express = require('express');
const app = express();
const request = require('request');
const config = require('config');

app.listen(3000, ()=> console.log('App start listening on post 3000'));

console.log('NODE_ENV:', process.env.NODE_ENV);

const statuses = {
    UP: 'UP',
    DOWN: 'DOWN'
};

let resources = config.get('Resources');


let listObj = {};


function wrapRequest(resourseName, cb){
    request(resourseName, /*{timeout: 3000},*/ (error, response) => {

        if(error) console.error(error.stack);

        if (setTimeout(()=> !response, 3000)){
            listObj[resourseName] = statuses.DOWN;
        } else if (response.statusCode <=302) {
            listObj[resourseName] = statuses.UP;
        } else {
            listObj[resourseName] = statuses.DOWN;
        }

        cb();
    });
}

app.get('/health_check',  (req, res) => {

        uber();

        mergedJson = () => {res.send(JSON.stringify(listObj))};

        function uber() {
            wrapRequest(resources.uber, spotify);
        }

        function spotify() {
            wrapRequest(resources.spotify, yandex);
        }

        function yandex() {
            wrapRequest(resources.yandex, mergedJson)
        }
});

