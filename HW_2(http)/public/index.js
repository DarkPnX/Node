const http = require('http');


const intervalTime = process.env.myIntervalTime || 1000;
const endTime = process.env.myEndTime || 5000;


function responseDelay(interval,delay){
    return new Promise((resolve) => {
        let timerId = setInterval(() => {
            console.log(new Date().toISOString())
        }, interval);

        setTimeout(() => {
            clearInterval(timerId);
            resolve(new Date().toISOString())
        }, delay);
    })
}

http.createServer((req, res) => {
    if (req.url === '/') {
        responseDelay(intervalTime,endTime).then((response) => {
            res.end(response);
        })
    }
}).listen(3000,()=>{console.log('HTTP server running(port:3000)');});

