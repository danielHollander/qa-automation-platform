// const MongoClient = require('mongodb').MongoClient
// const assert = require('assert');
// global.t = test;
// export let dataSet = [];

// //Create a string that will reflect all test params
// export let testString = '';
// export let testArray = [];
// function setTestStringArr(dataSet) {
//     debugger;
//     const filteredData = Object.entries(dataSet[dataSet.length - 1]).filter(([key, value]) => key != "name" && key != "id" && key != "date" && key != "_id" && key != "__v" && key != "status" && key != "fullReport" && key != "duration" && value != '');
//     //Too expensive efficeny n^2
//     filteredData.forEach(([key, value], index, arr) => {
//         if (key == "typeText") {
//             for (var i = 0; i + 1 < arr[index][1].length; i++) {
//                 testString += `['${key}']` + `('${value[i]}', '${value[i + 1]}')`;
//             };
//         }

//         if (key == "custom") {
//             testString = value[0].replace(".", "['useRole(admin)['").replace(/(?:\)\.)/g, ")['").replace(/\(/g, "'](");
//         }

//         if (key == "multipleTests") {
//             for (var i = 0; i < value.length; i++) {
//                 value[i] = value[i].replace(".", "['useRole(admin)['").replace(/(?:\)\.)/g, ")['").replace(/\(/g, "'](");
//                 testArray.push(value[i]);
//             }
//         }
//         else {
//             for (var i = 0; i < arr[index][1].length; i++) {
//                 testString += `['${key}']` + `('${value[i]}')`;
//             };
//         }
//     });
// }

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'playground';

// function findDocs(db) {
//     return new Promise((resolve, reject) => {
//         const collection = db.collection('maintests');

//         // Find some documents
//         collection.find().toArray(async function (err, docs) {
//             if (err)
//                 return reject(err);
//             console.log("Found the following records");
//             console.log(docs);

//             dataSet = docs;
//             resolve(docs);
//         });
//     });
// }

// function getClient() {
//     return new Promise((resolve, reject) => {
//         // Use connect method to connect to the server
//         MongoClient.connect(url, function (err, client) {
//             if (err)
//                 return reject(err);

//             console.log("Connected successfully to server");

//             resolve(client);
//         });
//     });
// }

// async function getKeywords() {
//     const client = await getClient();
//     const db = client.db(dbName);

//     try {
//         return await findDocs(db);
//     }
//     finally {
//         client.close();
//     }
// }

// export const init = async () => {
//     getKeywords().then(() => setTestStringArr(dataSet));
// }