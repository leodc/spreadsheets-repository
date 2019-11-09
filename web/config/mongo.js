var MongoClient = require("mongodb").MongoClient;
var utils = require("../client/js/utils");
var personUtils = require("./person");

var host = process.env.MONGO_HOST || "mongo";
var port = process.env.MONGO_PORT || "27017";
var database = process.env.MONGO_DATABASE || "cide";
var collection = process.env.MONGO_COLLECTION || "personas";

var mongoUrl = "mongodb://" + host + ":" + port + "/";

function isSamePerson(a, b){
  if( typeof a[utils.codeColumn] === "string" && a[utils.codeColumn] !== "" && a[utils.codeColumn] === b[utils.codeColumn]){
    console.log("same code", a[utils.codeColumn]);
    return 2;
  }

  var score = personUtils.sameName(a[ utils.fullnameColumn ], b[ utils.fullnameColumn ]);
  if( score >= personUtils.minScoreSamePerson ){
    console.log("same name", a[ utils.fullnameColumn ], b[ utils.fullnameColumn ]);
    return score;
  }

  return 0;
}

function isValidPerson(person){
  return (person !== null && person[ utils.fullnameColumn ] && person[ utils.fullnameColumn ] !== "");
}

function parsePerson(person, config){
  var newPerson = {};
  var newRecord = {};
  for (var property in person) {
    if(property === "id"){
      continue;
    }

    if( property === utils.fullnameColumn || property === utils.codeColumn){
      newPerson[ property ] = person[property];
    }else if( config.nameColumnsValue.indexOf(property) === -1 && property !== utils.matchColumn ){
      if ( config.linkColumnsValue.indexOf(property) > -1 ) {
        newRecord[ property + utils.linkSuffix ] = person[property];
      }else if ( config.referenceColumnsValue.indexOf(property) > -1 ) {
        newRecord[ property + utils.referenceSuffix ] = person[property];
      }else{
        newRecord[ property ] = person[property];
      }
    }
  }
  newPerson[ config.propertyToInsert ] = [ newRecord ];

  return newPerson;
}

function insertPersonsArray(data, callback, index){
  if(!index) {
    index = 0;
  }

  if( index === 0 ){
    if(!data.persons[0].hasOwnProperty(utils.fullnameColumn)){
      console.log("creating names");
      data.persons = utils.buildFullName(data.persons, data.config);
    }

    var aux = [];
    // clean && parse
    for (var i = 0; i < data.persons.length; i++) {
      var person = data.persons[i];
      if(isValidPerson(person)){
        aux.push(parsePerson(person, data.config));
      }else{
        console.log("omitiendo", JSON.stringify(person));
      }
    }

    for (var i = 0; i < aux.length; i++) {
      var personA = aux[i];

      for(var j = i+1; j < aux.length; j++){
        var personB = aux[j];

        var score = isSamePerson(personA, personB);
        if( score > personUtils.minScoreSamePerson){
          for (var k = 0; k < personB[ data.config.propertyToInsert ].length; k++ ) {
            personB[ data.config.propertyToInsert ][k].score = score;
          }

          personA[ data.config.propertyToInsert ] = personA[ data.config.propertyToInsert ].concat(personB[ data.config.propertyToInsert ]);
          aux.splice(j, 1);
          j--;
        }
      }
    }

    data.persons = aux;
  }


  if( index == data.persons.length ){
    callback("end");
  }else{
    var person = data.persons[index];

    process.stdout.write((index+1) + "/" + data.persons.length + ": " + person[ utils.fullnameColumn ] + " -- ");

    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
      if(connectErr) return callback({details: "Error conectando a la base de datos", err: String(connectErr)}, null);

      var query = {$text: { $search: person[ utils.fullnameColumn ] }};
      client.db(database).collection(collection).find(query).project({ score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(function(searchErr, result) {
        if(searchErr) return callback({details: "Error buscando coincidencias", person: person, query: query, err: String(searchErr)}, null);

        // update
        var update = false;
        for (var matchedPerson of result) {
          var score = isSamePerson(person, matchedPerson);
          if( score > personUtils.minScoreSamePerson){
            for (var k = 0; k < person[ data.config.propertyToInsert ].length; k++ ) {
              person[ data.config.propertyToInsert ][k].score = score;
            }

            if( matchedPerson[ data.config.propertyToInsert ] ){
              matchedPerson[ data.config.propertyToInsert ] = matchedPerson[ data.config.propertyToInsert ].concat( person[ data.config.propertyToInsert ] );
            }else{
              matchedPerson[ data.config.propertyToInsert ] = person[ data.config.propertyToInsert ];
            }

            update = true;
            break;
          }

        }

        if( update ){
          var select = {};
          select[ utils.fullnameColumn ] = matchedPerson[ utils.fullnameColumn ];

          client.db(database).collection(collection).updateOne(select, { $set: matchedPerson }, function(insertUpdateErr, res){
            if(insertUpdateErr) return callback({details: "Error actualizando la base de datos", person: matchedPerson, err: String(insertUpdateErr)}, null);

            console.log("update", matchedPerson[ utils.fullnameColumn ]);

            client.close();
            insertPersonsArray(data, callback, ++index);
          });
        }else{
          client.db(database).collection(collection).insertOne(person, function(insertErr, res){
            if(insertErr) return callback({details: "Error insertando en la base de datos", person: person, err: String(insertErr)}, null);
            console.log("inserted as new person");

            client.close();
            insertPersonsArray(data, callback, ++index);
          });
        }
      });
    });
  }
}

function getArrayMatches(data, callback, index){
  if(!index) {
    index = 0;
  }

  if( !data.persons[0].hasOwnProperty(utils.fullnameColumn) ){
    console.log("creating names");
    data.persons = utils.buildFullName(data.persons, data.config);
  }

  if( index == data.persons.length ){
    callback(data.persons);
  }else{
    var person = data.persons[index];

    process.stdout.write(index + "/" + data.persons.length + ": " + person[ utils.fullnameColumn ] + " -- ");

    if( isValidPerson(person) ){
      MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
        if(connectErr) return callback({details: "Error conectando a la base de datos", err: String(connectErr)}, null);

        var query = {$text: { $search: person[ utils.fullnameColumn ] }};
        client.db(database).collection(collection).find(query).project({ score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(function(searchErr, result) {
          if(searchErr) return callback({details: "Error buscando coincidencias", person: person, query: query, err: String(searchErr)}, null);

          console.log("evaluando", result.length, "coincidencias");

          if( result.length == 0 ){
            data.persons[index][ utils.matchColumn ] = "";
          }else{
            // update
            for (var matchedPerson of result) {
              if( isSamePerson(person, matchedPerson) > personUtils.minScoreSamePerson ){
                data.persons[index][ utils.matchColumn ] = matchedPerson[ utils.fullnameColumn ];
                break;
              }
            }
          }

          getArrayMatches(data, callback, ++index);
        });
      });
    }else{
      console.log("omitiendo", JSON.stringify(person));
      getArrayMatches(data, callback, ++index);
    }
  }
}

function getTotalPersons(callback){
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
    var db = client.db(database);
    var projection = {};
    projection[ utils.fullnameColumn ] = 1;

    // count documents
    db.collection(collection).find({},{ projection: projection }).count(callback);
  });
}

function getNameList(max, callback){
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
    var db = client.db(database);

    var projection = {};
    projection[ utils.fullnameColumn ] = 1;

    var sort = {};
    sort[ utils.fullnameColumn ] = 1;

    // Find document
    db.collection(collection)
      .find({}, { projection: projection })
      .sort(sort)
      .limit(max)
      .toArray()
      .then(callback);
  });
}


function searchPersonsByNames(prop, callback) {
  console.log("searching person by names", prop);

  var query = {$text: { $search: prop.names }};

  // custom filters
  for (var customFilter of prop.filters) {
    var aux = customFilter.split(":");
    var filterProp = aux[0].trim();
    var filterOpt = aux[1].trim();
    var filterValue = aux[2].trim();

    if( !query[filterProp] ){
      query[filterProp] = {};
    }

    if (filterOpt == "$regex"){
      query[filterProp][filterOpt] = new RegExp(".*" + filterValue + ".*", "i");
    }else{
      query[filterProp][filterOpt] = filterValue;
    }
  }

  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
    var db = client.db(database);

    var sort = {};
    sort[utils.fullnameColumn] = 1;

    // Find document
    db.collection(collection)
      .find(query)
      .sort(sort)
      .toArray()
      .then(callback);
  });
}



function getPerson(fullname, callback){
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
    if(connectErr) return callback({details: "Error conectando a la base de datos", err: String(connectErr)}, null);

    var query = {$text: { $search: fullname }};
    client.db(database).collection(collection).find(query).project({ "_id": 0, score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(function(searchErr, result) {
      if(searchErr) {
        callback({details: "Error buscando coincidencias", name: fullname, query: query, err: String(searchErr)}, null);
      } else if( result.length == 0 ){
        callback({details: "Persona no encontrada", name: fullname, query: query}, null);
      }else{
        var person = {};
        person[ utils.fullnameColumn ] = fullname;

        var found = false;
        for (var matchedPerson of result) {
          if( isSamePerson(person, matchedPerson) > personUtils.minScoreSamePerson ){
            found = true;
            break;
          }
        }

        if(found){
          callback(null, matchedPerson);
        }else{
          callback({details: "Persona no encontrada", name: fullname, query: query}, null);
        }
      }
    });
  });
}

module.exports = {
  insertPersonsArray: insertPersonsArray,
  getArrayMatches: getArrayMatches,
  searchPersonsByNames: searchPersonsByNames,
  getPerson: getPerson,
  getNameList: getNameList,
  getTotalPersons: getTotalPersons
}
