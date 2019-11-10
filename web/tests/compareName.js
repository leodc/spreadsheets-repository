var personUtils = require("../config/person");

var a = 'Leonel David Castañeda Mendoza';
var names = [
  'Leonel David Castañeda Mendoza',
  'Leonel D. Castañeda Mendoza',
  "Castañeda Mendoza Leonel David",
  "Castañeda Mendoza Leonel",
  "Leonel Castañeda Mendoza",
  "Castañeda Mendoza",
  'John Apples',
  'Jon Appleton'
];

for (var b of names) {
  console.log( a, b, personUtils.sameName(a,b) );
}

console.log("adame perez enrique", "perez arce enrique", personUtils.sameName("adame perez enrique", "perez arce enrique"))
console.log("adame perez enrique", "adame perez enrique", personUtils.sameName("adame perez enrique", "adame perez enrique"))
console.log("baca lopez rigoberto", "calleja lopez rigoberto", personUtils.sameName("baca lopez rigoberto", "calleja lopez rigoberto"))
console.log("alba y alba jose manuel", "alba y alba jose manuel de", personUtils.sameName("alba y alba jose manuel", "alba y alba jose manuel de"))
console.log("aguillon guzman miguel", "guillen guzman miguel", personUtils.sameName("aguillon guzman miguel", "guillen guzman miguel"))
console.log("alvarez sergio antonio", "alvarez vazquez sergio antonio", personUtils.sameName("alvarez sergio antonio", "alvarez vazquez sergio antonio"))
console.log("arroyo munoz jose tomas", "garrido munoz jose tomas", personUtils.sameName("arroyo munoz jose tomas", "garrido munoz jose tomas"))
console.log("castaneda gilberto m", "moreno castaneda gilberto", personUtils.sameName("castaneda gilberto m", "moreno castaneda gilberto"))
console.log("garcia romero luis", "garcia romero luisa", personUtils.sameName("garcia romero luis", "garcia romero luisa"))
console.log("silva santillan maria luz", "ortega tlapa luz maria", personUtils.sameName("silva santillan maria luz", "ortega tlapa luz maria"))
console.log("aguilar francisco d", "bastida medina daniel", personUtils.sameName("aguilar francisco d", "bastida medina daniel"))
