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



function wrapRequest(resourseName, resultObj, cb){

    let timeout = setTimeout(()=>{
        r.abort();
        resultObj[resourseName] = statuses.DOWN;
        cb();
    }, 3000);

    let r = request.get(resourseName, (error, response) => {
        if(error) console.error(error.stack);

        if(response){
            clearTimeout(timeout);
            if (response.statusCode <=302) {
                resultObj[resourseName] = statuses.UP;
            } else {
                resultObj[resourseName] = statuses.DOWN;
            }
            cb();
        }

    });

}

app.get('/health_check',  (req, res) => {
    let listObj = {};

    let operations = 0;

    Object.keys(resources).forEach((resource)=> {
        wrapRequest(resources[resource], listObj,  function() {
            operations++;
            console.log(operations);

            if (Object.keys(resources).length == operations){
                console.log(listObj);
                return res.send(JSON.stringify(listObj))
            }
        });

    });
});

