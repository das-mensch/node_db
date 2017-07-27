const DB = require('./src/db');

global._config = new DB.Config();

let mySchema = new DB.Schema("mySchema");
mySchema.addField(
    new DB.Field(
        new DB.Types.Int32Type(),
        "testInt32"
));
mySchema.addField(
    new DB.Field(
        new DB.Types.TextType(15),
        "testTextType"
));
mySchema.addField(
    new DB.Field(
        new DB.Types.DoubleType(),
        "testDoubleType"
));

mySchema.save();

let anotherSchema = new DB.Schema('mySchema');
anotherSchema.read();

console.log(anotherSchema);
