export function TestMultiple(dataSet, testString, testArray) {
    testArray.forEach((value, index, arr) => {
        test
            (`${dataSet[dataSet.length - 1].name}`, async t => {
                console.log("this is the value")
                console.log(value);
                await eval(value);
            });
    });
};