const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('Universal Agent Builder 2035_ Autonomous Micro-Enterprise Exchange (AMX).pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (error) {
    console.error(error);
});
