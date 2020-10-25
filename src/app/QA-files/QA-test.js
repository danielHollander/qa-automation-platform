import { ClientFunction, t } from 'testcafe';
const dataSet = require('./data.json');
const getWindowLocation = ClientFunction(() => getParameters());


var x = 'not test name'
const createTestDaniel = async (testData, t) => {
    console.log("If you can read this, it means it worked")
    await t
        .click(`3213dasdsa`);
}

fixture`Fixture`
    .page('http://localhost:4200/')
for (let [key, value] of Object.entries(dataSet[dataSet.length - 1])) {
    if (key == "click" || key == "navigateTo" || key == "typeText") {
        test(`${dataSet[dataSet.length - 1].name}`, async t => {
            //Should I use the proto?
            //Do not have sufficent knowledge for it
            //MDN says it a feature that is deprecated 
            for (const [func, funcValue] of Object.entries(t.__proto__)) {
                if (key == func)
                    t["testParam"] = funcValue;
                break;
            }
            await t
                .testParam(value);
        });
    }
}


