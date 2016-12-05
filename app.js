const express = require('express');
const app = express();
const request = require('request');
const timeout = require('connect-timeout');

app.listen(3000);

app.get('/health_check', timeout('5s'), (req, res) => {

    const UP = 'UP',
          DOWN = 'DOWN';

    let resourses = {
        google: 'google.com',
        youtube: 'youtube.com/dsfkdds',
        yandex: 'ya.goat'
    };

    let listObj = {};


    function wrapRequest(resourseName, cb){
        request(`https://${resourseName}`, (error, response) => {
            //console.log(response.statusCode);
            if (error) return res.status(500).send('Error');

            if (response.statusCode == 200) {
                listObj[resourseName] = UP;
            } else if (response.statusCode == 404){
                listObj[resourseName] = UP;
            } else if (response.timedout){
                listObj[resourseName] = DOWN;
            }
            cb();
        });
    }

        google();

        function google() {
            wrapRequest(resourses.google, youtube);
        }

        function youtube() {
            wrapRequest(resourses.youtube, yandex);
        }

        function yandex() {
            wrapRequest(resourses.yandex, ()=> {res.send(JSON.stringify(listObj))})
        }


});

