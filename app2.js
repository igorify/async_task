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

let resourcesData = config.get('Resources');

function upDownCheck(resources, resourceIndex,  cb){

    let timeout = setTimeout(()=>{
        r.abort();
        cb(null, statuses.DOWN);
    }, 5000);

    let r = request.get(resource = resources[resourceIndex], (error, response) => {
        //setTimeout((error)=> {if(error) return cb(error)}, 5000 );
        if(response){
             clearTimeout(timeout);
            if (response.statusCode <=302) {
                cb(error, statuses.UP);
            } else {
                cb(error, statuses.DOWN);
            }
        }
    });
}

app.get('/health_check',  (req, res, next) => {

    let mergedStatuses = {};

    let resources = Object.keys(resourcesData).map(key => resourcesData[key]);
    let resourceIndex = resources.length - 1;

     upDownCheck (resources, resourceIndex, function cb(error , status) {
        if(error) return next(error);
        let resource = resources[resourceIndex];

        mergedStatuses[resource] = status;
        console.log(mergedStatuses);

        if (resourceIndex > 0)  return upDownCheck(resources, resourceIndex = resourceIndex - 1, cb);

        return res.send(JSON.stringify(mergedStatuses));

     });
});

