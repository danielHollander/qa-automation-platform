const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
    console.log("Connected!")
).catch(err => console.error('Could not connect to Mongod'));

mongoose.Promise = global.Promise;

const dataSchema = new mongoose.Schema({
    master: Boolean,
    id: Number,
    website: String,
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

const Data = mongoose.model('mainData', dataSchema);
module.exports = mongoose.model('mainData', dataSchema);

const data = new Data({
    master: false,
    id: 3,
    website: "www.example3.com",
    actions: true,
    tag: true,
    implementaion: "Hardcoded",
    cmp: false,
    pageViews: 1,
    percentagePC: 80,
    percentageTablet: 5,
    percentageMobile: 15,
    totalPlacements: 10,
    requests: 98319,
    imp: 46728,
    revenue: 9724
});


