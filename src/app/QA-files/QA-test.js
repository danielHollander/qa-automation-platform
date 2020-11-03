import { debug } from 'console';
import { ClientFunction, t } from 'testcafe';
const dataSet = require('./data.json');

console.log(dataSet[dataSet.length - 1]);

fixture`Fixture`
    .page('http://localhost:4200/')
//Too expensive efficeny n^2
const filteredData = Object.entries(dataSet[dataSet.length - 1]).filter(([key, value]) => key != "name" && key != "id" && key != "date");

//Create a string that will reflect all test params
var testString = '';
//Too expensive efficeny n^2
filteredData.forEach(([key, value], index, arr) => {
    if (key == "typeText") {
        for (var i = 0; i + 1 < arr[index][1].length; i++) {
            testString += `['${key}']` + `('${value[i]}', '${value[i + 1]}')`;
        };
    } else {
        for (var i = 0; i < arr[index][1].length; i++) {
            testString += `['${key}']` + `('${value[i]}')`;
        };
    }
});



test
    .meta({ testId: `${dataSet[dataSet.length - 1].id}`, testName: `${dataSet[dataSet.length - 1].name}` })
    (`${dataSet[dataSet.length - 1].name}`, async t => {
        testString = "t" + testString;
        await eval(testString);
    });



