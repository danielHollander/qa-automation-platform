import { Role } from 'testcafe';
import data from './data';
// import { Fixture } from './Fixture';
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const dataSet = require('./data.json');

//Create a string that will reflect all test params
var testString = '';
var testArray = [];

const filteredData = Object.entries(dataSet[dataSet.length - 1]).filter(([key, value]) => key != "name" && key != "id" && key != "date" && key != "_id" && key != "__v" && key != "status" && key != "fullReport" && key != "duration" && value != '');
//Too expensive efficeny n^2
filteredData.forEach(([key, value], index, arr) => {
    if (key == "typeText") {
        debugger;
        for (var i = 0; i + 1 < arr[index][1][0].length; i++) {
            debugger;
            testString += `['${key}']` + `('${value[0][i]}', '${value[0][i + 1]}')`;
        };
    }

    if (key == "custom") {
        testString = value[0].replace(".", "['useRole(admin)['").replace(/(?:\)\.)/g, ")['").replace(/\(/g, "'](");
    }

    if (key == "multipleTests") {
        for (var i = 0; i < value.length; i++) {
            value[i] = value[i].replace(".", "['useRole(admin)['").replace(/(?:\)\.)/g, ")['").replace(/\(/g, "'](");
            testArray.push(value[i]);
        }
    }
    if (key !== "custom" && key !== "typeText" && key !== "multipleTests") {
        for (var i = 0; i < arr[index][1].length; i++) {
            testString += `['${key}']` + `('${value[i]}')`;
        };
    }
});


const admin = Role('http://localhost:4200/', async t => {
    await t
        .typeText('#inputEmail', 'daniel.hollander@firstimpression.io')
        .typeText('#inputPassword', '123456')
        .click('#sign-in');
}, { preserveUrl: true });



fixture`My fixture`
    .page('http://localhost:4200/')

if (testString != '') {
    test
        .meta({ testId: `${dataSet[dataSet.length - 1].id}`, testName: `${dataSet[dataSet.length - 1].name}` })
        (`${dataSet[dataSet.length - 1].name}`, async t => {
            if (testString.indexOf("t") != 0)
                testString = "t['useRole'](admin)" + testString;
            console.log("this is the testString")
            console.log(testString);
            await eval(testString);
        });
} else {
    testArray.forEach((value, index, arr) => {
        test
            .meta({ testId: `${dataSet[dataSet.length - 1].id}`, testName: `${dataSet[dataSet.length - 1].name}` })
            (`${dataSet[dataSet.length - 1].name}`, async t => {
                console.log("this is the value")
                console.log(value);
                await eval(value);
            });
    });
}