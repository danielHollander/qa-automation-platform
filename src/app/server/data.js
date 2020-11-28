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
var nodemon = require('nodemon');
const userRoutes = require("./users/userRoute"); //bring in our user routes
var chokidar = require('chokidar');
var { restart } = require('nodemon');
var watcher = chokidar.watch('.')
require("./users/db")(app);
const http = require('http');
const server = http.createServer(app);
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(bodyParser.text({ limit: '200mb' }));


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
    typeText: [Array],
    expect: [String],
    eql: [String],
    getBrowserConsoleMessages: [String],
    custom: [String],
    multipleTests: [String],
    status: [String],
    duration: [String],
    fullReport: [String],
});

const commentsSchema = new mongoose.Schema({
    id: Number,
    comment: String,
    date: String
});

const mediaSchema = new mongoose.Schema({
    progress: Number,
    id: String,
    filename: String,
    chunkSize: Number,
    src: String
})


mongoose.connect("mongodb://localhost/playground", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() =>
    console.log("Connected to mongoose tests data base!")
).catch(err => console.error('Could not connect to Mongod'));

const Data = mongoose.model('mainData', dataSchema);
const Tests = mongoose.model('mainTests', testSchema);
const Comments = mongoose.model('mainComments', commentsSchema);
const Media = mongoose.model('mainMedia', mediaSchema);

app.use(cors())

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
    // console.log(req);
    async function createTest(req, res) {
        console.log(req.body);
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

        try {
            console.log("data is")
            console.log();
            const test = await runner
                .src(['QA-test.js'])
                .browsers(['chrome'])
                .reporter(['spec', {
                    name: 'json',
                    output: './reports.json'
                }])
                .run();
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
        .then((req) => {
            console.log("sending test requests");
            res.send(setupLicense(req, res)
                .then(() => {
                    // update data base with the test report
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
                        })
                    })
                        .then(async () => {
                            console.log("Test is over....");
                            // One - liner for current directory
                            console.log("This is pid " + process.pid);
                            //This is to restart the nodemon platform
                            const spamJson = JSON.stringify({});
                            console.log("Spamming json Spam File");
                            fs.writeFileSync('spam.json', spamJson, (err) => {
                                if (err) {
                                    throw err;
                                }
                                console.log("Spammed successfully");
                            });
                        })
                }));
        })
});


//Detect comments
app.get('/comments', async (req, res) => {
    const comments = await Comments.find().sort('id')
    res.send(comments);
});


app.post('/comments', async (req, res) => {
    //Update DB
    async function createComment(req, res) {
        const comment = new Comments({
            id: req.body.id,
            comment: req.body.comment,
            date: req.body.date
        });
        const result = await comment.save();
        console.log("New comment was sent....")
        console.log(result);
    }
    createComment(req, res);
});


app.post("/uploads", (req, res) => {
    //Update DB
    async function createMedia(req, res) {
        const media = new Media({
            id: req.body.id,
            comment: req.body.comment,
            date: req.body.date,
            progress: req.body.progress,
            filename: req.body.filename,
            chunkSize: req.body.chunkSize,
            src: req.body.src
        });
        const result = await media.save();
        console.log("New comment was sent....")
        console.log(result);
    }
    createMedia(req, res);
});



app.post("/uploads/delete", (req, res) => {
    //Update DB
    Media.deleteOne({
        id: req.body.id,
        comment: req.body.comment,
        date: req.body.date,
        progress: req.body.progress,
        filename: req.body.filename,
        chunkSize: req.body.chunkSize,
        src: req.body.src
    }, function (err, media) {
        if (err)
            return console.error(err);
        console.log('media successfully removed from Media collection!');
        res.status(200).send();
    });
});

//Detect Media
app.get('/uploads', async (req, res) => {
    const media = await Media.find().sort('id')
    res.send(media);
});


app.use("/users", userRoutes);


module.exports = mongoose.model('mainTests', testSchema);
const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log('Example app listening on port 3001!');
});