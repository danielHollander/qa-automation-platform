import { Selector, RequestLogger } from 'testcafe';
import { ClientFunction } from 'testcafe';
const cors = require('cors');
const express = require('express');
const app = express();


app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const getDataFromClient = ClientFunction(() => getParameters());


fixture`Fixture`
    .page('http://localhost:4200/api')

test('basic', async t => {
    let data = await t.eval(() => getParameters());
    console.log(data);
    await t
        .click(`${data.click}`)
        .navigateTo(`${data.navigate}`);
});

