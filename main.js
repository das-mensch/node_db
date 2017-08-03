const DB = require('./src/db');
const readline = require('readline');
const fs = require('fs');

global._config = new DB.Config();

let mySchema = DB.Schema.fromName("plz");
/*let mySchema = new DB.Schema("plz");
mySchema.addField(
    new DB.Field(
        new DB.Types.TextType(10),
        "plz"
    ));
mySchema.addField(
    new DB.Field(
        new DB.Types.TextType(40),
        "ort"
    ));
mySchema.save();
*/
let myTable = new DB.Table(mySchema);
/*
let stream = fs.createReadStream('./zuordnung_plz_ort_b.csv');
let rl = readline.createInterface(stream);
let id = 1;
rl.on('line', (line) => {
    let [ort, plz] = line.split(',');
    myTable.writeById(id++, {
        plz: plz,
        ort: ort
    })
});

stream.on('end', () => {
    console.log(myTable.findByKeyValue('plz', '959'));
});
*/

console.log(myTable.findByKeyValue('ort', 'Lipp'));
console.log(myTable.findByKeyValue('plz', '5955'));
console.log(myTable.findByKeyValue('ort', 'Burg'));
