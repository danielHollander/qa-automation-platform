const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');


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



mongoose.connect("mongodb://localhost/playground", { useNewUrlParser: true, useUnifiedTopology: true });

const Data = mongoose.model('mainData', dataSchema);

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api', async (req, res) => {
    const datas = await Data.find().sort('id');
    res.send(datas);
});

app.post('/api', async (req, res) => {
    const createTestCafe = require('testcafe');

    const setupLicense = async (req, res) => {

        const testcafe = await createTestCafe('localhost', 1337, 1338);
        const runner = testcafe.createRunner();
        const remoteConnection = await testcafe.createBrowserConnection();

        let data = (body) => {
            console.log(body);
            return { click: req.body.click, url: req.body.url };
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

    res.send(setupLicense(req, res));

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


