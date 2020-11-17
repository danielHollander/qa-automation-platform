export function TestSingle(dataSet, testString, testArray) {
    test
        .meta({ testId: `${dataSet[dataSet.length - 1].id}`, testName: `${dataSet[dataSet.length - 1].name}` })
        (`${dataSet[dataSet.length - 1].name}`, async t => {
            if (testString.indexOf("t") != 0)
                testString = "t['useRole'](admin)" + testString;
            console.log("this is the testString")
            console.log(testString);
            await eval(testString);
        });
};