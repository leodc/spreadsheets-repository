var fs = require("fs");
var vm = require("vm");
var path = require("path");

vm.runInThisContext( fs.readFileSync( path.join(__dirname, "../client/js/fuzziac.js") ) );

var minScoreSamePerson = 1.75;

function sameName(a, b){
  a = a.toLowerCase();
  b = b.toLowerCase();

  if( a === b ){
    return 2;
  }

  namesA = a.split(" ").sort();
  namesB = b.split(" ").sort();

  a = namesA.join(" ");
  b = namesB.join(" ");

  if ( a === b ) {
    return 2;
  }

  var maxLength = namesA.length > namesB.length ? namesA.length:namesB.length;
  var included;
  for (var i = 0; i < maxLength; i++) {
    if( typeof namesA[i] !== "string" || typeof namesB[i] !== "string" ){
      included = false;
      break;
    }

    if( namesA[i] === namesB[i] ){
      continue;
    }

    if( namesA[i].length < 4 || namesB[i].length < 4 ){
      included = namesA[i].length > namesB[i].length ? namesA[i].startsWith( namesB[i].replace(/[^a-zñ]/g,"") ):namesB[i].startsWith( namesA[i].replace(/[^a-zñ]/g,"") );
      if(!included){
        break;
      }
    }else if ( namesA[i] !== namesB[i] ) {
      included = false;
      break;
    }
  }

  if(included){
    return 1.95;
  }

  return new fuzziac(a).score(b);
}

module.exports = {
  sameName: sameName,
  minScoreSamePerson: minScoreSamePerson
}
