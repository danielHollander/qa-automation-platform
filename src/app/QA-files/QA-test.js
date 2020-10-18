import { ClientFunction, t } from 'testcafe';
const dataSet = require('./data.json');
const getWindowLocation = ClientFunction(() => getParameters());


var x = 'not test name'


fixture`Fixture`
    .page('http://localhost:4200/')


test(`${dataSet[dataSet.length - 1].name}`, async t => {
    let data = await t.eval(() => getParameters());
    await t
        .click(`${data.click}`)
        .navigateTo(`${data.navigate}`);
});


