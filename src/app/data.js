const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
const reports = require('./reports.json');
const mongoose = require('mongoose');
const fs = require('fs');
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const { stringify } = require('querystring');
const url = 'http://localhost:3001/tests';
const users = require('./users');
const bodyParser = require('body-parser');
const morgan = require("morgan");
fetch.Promise = Bluebird;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require("./users/db")(app);
const userRoutes = require("./users/userRoute"); //bring in our user routes



//General data
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
    id: [Number],
    date: [String],
    name: [String],
    click: [String],
    navigateTo: [String],
    typeText: [String],
    expect: [String],
    eql: [String],
    getBrowserConsoleMessages: [String],
    custom: [String],
    multipleTests: [String],
    status: [String],
    duration: [String],
    fullReport: [String],
});


mongoose.connect("mongodb://localhost/playground", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() =>
    console.log("Connected to mongoose tests data base!")
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

//Tests logic to create tests and access database
let tests = null;

app.get('/tests', async (req, res) => {
    tests = await Tests.find().sort('id')
    res.send(tests);
});

app.post('/tests', async (req, res) => {
    //Update DB
    async function createTest(req, res) {
        const test = new Tests({
            id: req.body.id,
            name: req.body.name,
            date: req.body.date,
            click: req.body.click,
            navigateTo: req.body.navigateTo,
            typeText: req.body.typeText,
            expect: req.body.expect,
            eql: req.body.eql,
            getBrowserConsoleMessages: req.body.getBrowserConsoleMessages,
            custom: req.body.custom,
            multipleTests: req.body.multipleTests,
            status: ["pending..."],
            duration: ["pending..."],
            fullReport: ["pending..."]
        });
        const result = await test.save();
        console.log(result);
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

        try {
            const test = await runner
                .src(['QA-test.js'])
                .browsers(['chrome'])
                .reporter(['spec', {
                    name: 'json',
                    output: './reports.json'
                }])
                .run()
        } finally {
            console.log("Closing test after completion");
            await testcafe.close();
        }
    }
    //Function reads Json files for reporting and tests creations
    fetch(url)
        .then(() => {
            const reqData = JSON.stringify([req.body]);
            fs.readFile('data.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
                //no data is available
                if (data.length == 0) {
                    console.log("Json file is empty writing data for the first time...If you are not Daniel it means someone dropped the database - Kill him :) ")
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

                    const json = JSON.stringify(file);
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
            res.send(setupLicense(req, res).then(() => {
                //update data base with the test report
                (async function getReport() {
                    let rawdata = fs.readFileSync('reports.json');
                    let student = JSON.parse(rawdata);

                    return student;
                })().then((parsedReport) => {
                    global.duration = Math.round(parsedReport.fixtures[0].tests[0].durationMs / 1000) + " seconds";
                    const testId = parsedReport.fixtures[0].tests[0].meta.testId;
                    const stringifiedReport = JSON.stringify(parsedReport);

                    const query = { id: testId, status: "pending...", duration: "pending...", fullReport: "pending..." };
                    const update = { status: parsedReport.passed, duration: global.duration, fullReport: stringifiedReport };


                    Tests.findOneAndUpdate(query, { $set: update }, { runValidators: true }, function (err, doc) {
                        if (err)
                            console.log(err)
                        console.log("Successfuly updated Database");
                    });
                }).then(() => {
                    console.log("Test is over....");
                })
            }));
        })
});


app.put('/:id', async (req, res) => {
    const data = await Data.findByIdAndUpdate('req.params.id', { id: req.body.id }, {
        new: true,
    })

    const data1 = datas.find(c => c.id == parseInt(req.params.id));
    data1.id = req.body.id;
    res.send(data);
})


module.exports = mongoose.model('mainTests', testSchema);

app.use("/users", userRoutes);


const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log('Example app listening on port 3001!');
});