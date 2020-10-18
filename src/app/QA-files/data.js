const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const url = 'http://localhost:3001/tests';
fetch.Promise = Bluebird;


const dataSchema = new mongoose.Schema({
    master: Boolean,
    id: Number,
    name: String,
    actions: Boolean,
    tag: Boolean,
    implementaion: String,
    cmp: Boolean,
    percentagePC: Number,
    percentageTablet: Number,
    percentageMobile: Number,
    totalPlacements: Number,
    requests: Number,
    imp: Number,
    revenue: Number
});

const testSchema = new mongoose.Schema({
    name: String,
});


mongoose.connect("mongodb://localhost/playground", { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
    console.log("Connected to mongoose data base!")
).catch(err => console.error('Could not connect to Mongod'));

const Data = mongoose.model('mainData', dataSchema);
const Tests = mongoose.model('mainTests', testSchema);

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api', async (req, res) => {
    const datas = await Data.find().sort('id');
    res.send(datas);
});


let tests = null;

app.get('/tests', async (req, res) => {
    tests = await Tests.find().sort('name')
    res.send(tests);
});

app.post('/tests', async (req, res) => {
    //Update DB
    async function createTest(req, res) {
        const test = new Tests({
            name: req.body.name,
        });
        const result = await test.save();
    }
    createTest(req, res);

    //Run test
    const createTestCafe = require('testcafe');

    const setupLicense = async (req, res) => {

        const testcafe = await createTestCafe('localhost', 1337, 1338);
        const runner = testcafe.createRunner();
        const remoteConnection = await testcafe.createBrowserConnection();

        let data = (body) => {
            return body;
        }
        const scriptContent = `
  function getParameters() {
    return ${JSON.stringify(data(req.body))};
  }`

        const test = await runner
            .src(['QA-test.js'])
            .browsers(['chrome'])
            .clientScripts({ content: scriptContent })
            .run();

    }

    fetch(url)
        .then(() => {
            const reqData = JSON.stringify([req.body]);
            console.log(reqData);

            fs.readFile('data.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
                //no data is available
                if (data.length == 0) {
                    console.log("Json file is empty writing data for the first time...If you are not Daniel it means someone drop the database - Kill him :) ")
                    fs.writeFileSync('data.json', reqData, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("JSON data is saved.");
                    });
                }
                if (data.length > 0) {
                    console.log("Parsing data mate since more than one test was found in the database");
                    const file = JSON.parse(data);

                    console.log("this is the file: ");
                    file.push(req.body);
                    console.log(file)

                    const json = JSON.stringify(file);
                    console.log(json)
                    fs.writeFileSync('data.json', json, 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("JSON data was saved again!");
                        }
                    });
                }
            });
        })
        .then(() => {
            console.log("sending test requests");
            res.send(setupLicense(req, res));
        });
});


app.put('/:id', async (req, res) => {
    const data = await Data.findByIdAndUpdate('req.params.id', { id: req.body.id }, {
        new: true,
    })

    const data1 = datas.find(c => c.id == parseInt(req.params.id));
    data1.id = req.body.id;
    res.send(data);
})

const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log('Example app listening on port 3001!');
});




module.exports = mongoose.model('mainTests', testSchema);