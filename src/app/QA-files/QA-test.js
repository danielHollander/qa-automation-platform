import { ClientFunction, t } from 'testcafe';
const dataSet = require('./data.json');
const getWindowLocation = ClientFunction(() => getParameters());


var x = 'not test name'
const createTest = (testData) => {

}

fixture`Fixture`
    .page('http://localhost:4200/')
test(`${dataSet[dataSet.length - 1].name}`, async t => {
    //Find an alternative to eval since MDN says its a huge security risk and not that efficent 
    let data = await t.eval(() => getParameters());
    await t
        .click(`${data.click}`)
        .navigateTo(`${data.navigate}`);
});


