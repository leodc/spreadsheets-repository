var fs = require("fs");
var vm = require("vm");
var path = require("path");

console.log(path.join(__dirname, "../client/js/fuzziac.js"));

vm.runInThisContext( fs.readFileSync( path.join(__dirname, "../client/js/fuzziac.js") ) );

var stringA = 'Leonel David Castañeda Mendoza';
var stringAA = 'Leonel David Castañeda Mendoza';
var stringB = 'John Apples';
var stringC = 'Jon Appleton';
var finalScore = 0;

nm = new fuzziac(stringA);

console.log(stringA, stringB, nm.score(stringB));
console.log(stringA, stringC, nm.score(stringC));
console.log(stringA, stringAA, nm.score(stringAA));
