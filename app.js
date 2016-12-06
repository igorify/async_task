const express = require('express');
const app = express();
const request = require('request');

app.listen(3000, ()=> console.log('App start listening on post 3000'));

//console.log('NODE_ENV:', process.env.NODE_ENV);

const statuses = {
    UP: 'UP',
    DOWN: 'DOWN'
};

app.get('/health_check',  (req, res) => {

    let resources = {
        google: 'https://www.google.com.ua',
        youtube: 'https://www.youtube.com/dsfkdds',
        yandex: 'https://www.yanddddex.com/'
    };

    let listObj = {};


    function wrapRequest(resourseName, cb){
        request(resourseName, (error, response) => {
            //console.log(response.statusCode);

            if(error) return res.status(500).send('Error');

            /*if( setTimeout( response.statusCode == undefined, 3000)) {
                listObj[resourseName] = statuses.DOWN
            } else */if (response.statusCode <=302) {
                listObj[resourseName] = statuses.UP;
            } else {
                listObj[resourseName] = statuses.DOWN;
            }
            cb();
        });
    }

        google();

        mergedJson = () => {res.send(JSON.stringify(listObj))};

        function google() {
            wrapRequest(resources.google, youtube);
        }

        function youtube() {
            wrapRequest(resources.youtube, mergedJson);
        }

      /*  function yandex() {
            wrapRequest(resources.yandex, mergedJson)
        }*/
});

