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
filteredData.forEach(([key, value], index, arr) => {
    for (var i = 0; i < arr[index][1].length; i++) {
        testString += `['${key}']` + `('${value[i]}')`;
    };
});



test(`${dataSet[dataSet.length - 1].name}`, async t => {
    debugger;
    testString = "t" + testString;
    //
    
    await eval(testString);
});



