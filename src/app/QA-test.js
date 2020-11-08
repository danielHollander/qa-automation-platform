const dataSet = require('./data.json');

fixture`Fixture`
    .page('http://localhost:4200/')
//Too expensive efficeny n^2
const filteredData = Object.entries(dataSet[dataSet.length - 1]).filter(([key, value]) => key != "name" && key != "id" && key != "date");

//Create a string that will reflect all test params
var testString = '';
var testArray = [];
//Too expensive efficeny n^2
filteredData.forEach(([key, value], index, arr) => {
    if (key == "typeText") {
        for (var i = 0; i + 1 < arr[index][1].length; i++) {
            testString += `['${key}']` + `('${value[i]}', '${value[i + 1]}')`;
        };
    }

    if (key == "custom") {
        testString = value[0].replace(".", "['").replace(/(?:\)\.)/g, ")['").replace(/\(/g, "'](");
    }

    if (key == "multipleTests") {
        for (var i = 0; i < value.length; i++) {
            value[i] = value[i].replace(".", "['").replace(/(?:\)\.)/g, ")['").replace(/\(/g, "'](");
            testArray.push(value[i]);
        }
    }
    else {
        for (var i = 0; i < arr[index][1].length; i++) {
            testString += `['${key}']` + `('${value[i]}')`;
        };
    }
});

//Replacement for eval
if (testString != '') {
    debugger;
    test
        .meta({ testId: `${dataSet[dataSet.length - 1].id}`, testName: `${dataSet[dataSet.length - 1].name}` })
        (`${dataSet[dataSet.length - 1].name}`, async t => {
            if (testString.indexOf("t") != 0)
                testString = "t" + testString;
            await eval(testString);
        });
} else {
    testArray.forEach((value, index, arr) => {
        test
            .meta({ testId: `${dataSet[dataSet.length - 1].id}`, testName: `${dataSet[dataSet.length - 1].name}` })
            (`${dataSet[dataSet.length - 1].name}`, async t => {
                await eval(value);
            });
    });
}


