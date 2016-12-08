process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
console.log('NODE_ENV:', process.env.NODE_ENV);

const express = require('express');
const app = express();
const request = require('request');
const config = require('config');

app.listen(3000, ()=> console.log('App start listening on post 3000'));

const statuses = {
    UP: 'UP',
    DOWN: 'DOWN'
};

let resources = config.get('Resources');

function upDownCheck(resourseName, cb){

    let timeout = setTimeout(()=>{
        r.abort();
        cb(statuses.DOWN);
    }, 5000);

    let r = request.get(resourseName, (error, response) => {
        if(error) console.error(error.stack);

        if(response){
            clearTimeout(timeout);
            if (response.statusCode <=302) {
                cb(statuses.UP);
            } else {
                cb(statuses.DOWN);
            }

        }
    });
}

app.get('/health_check',  (req, res) => {

    let mergedStatuses = {};
    let operations = 0;

    Object.keys(resources).forEach((resource)=> {
        let resourceValue = resources[resource];

        upDownCheck(resourceValue,  function(status) {
            mergedStatuses[resourceValue] = status;
            operations++;

            if (Object.keys(resources).length == operations){
                return res.send(JSON.stringify(mergedStatuses));
            }
        });

    });
});

