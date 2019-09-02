var MongoClient = require("mongodb").MongoClient;
var utils = require("../client/js/utils");

var host = process.env.MONGO_HOST || "mongo";
var port = process.env.MONGO_PORT || "27017";
var database = process.env.MONGO_DATABASE || "cide";
var collection = process.env.MONGO_COLLECTION || "personas";

var mongoUrl = "mongodb://" + host + ":" + port + "/";

function isSamePerson(a, b){
  return a[ utils.fullnameColumn ] === b[ utils.fullnameColumn ];
}

function isValidPerson(person){
  return person[ utils.fullnameColumn ] === "";
}

function insert(data, index, callback){
  if( index == data.persons.length ){
    callback("end");
  }else{
    var person = data.persons[index];

    process.stdout.write(index + "/" + data.persons.length + ": " + person[ utils.fullnameColumn ] + " -- ");

    if( isValidPerson(person) ){
      console.log("omitiendo", JSON.stringify(person));
      insert(data, ++index, callback);
    }else{
      MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
        if(connectErr) return callback({details: "Error conectando a la base de datos", err: String(connectErr)}, null);

        var query = {$text: { $search: person[ utils.fullnameColumn ] }};
        client.db(database).collection(collection).find(query).project({ score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(function(searchErr, result) {
          if(searchErr) return callback({details: "Error buscando coincidencias", person: person, query: query, err: String(searchErr)}, null);

          var newPerson = {};
          var newRecord = {};
          for (var property in person) {
            if(property === "id"){
              continue;
            }

            if( property === utils.fullnameColumn ){
              newPerson[ property ] = person[property];
            }else if( data.config.nameColumnsValue.indexOf(property) === -1 && property !== utils.matchColumn ){
              if ( data.config.linkColumnsValue.indexOf(property) > -1 ) {
                newRecord[ property + utils.linkSuffix ] = person[property];
              }else if ( data.config.referenceColumnsValue.indexOf(property) > -1 ) {
                newRecord[ property + utils.referenceSuffix ] = person[property];
              }else{
                newRecord[ property ] = person[property];
              }
            }
          }

          newPerson[ data.config.propertyToInsert ] = [ newRecord ];

          // update
          var update = false;
          for (var matchedPerson of result) {
            if( isSamePerson(newPerson, matchedPerson) ){
              if( matchedPerson[ data.config.propertyToInsert ] ){
                matchedPerson[ data.config.propertyToInsert ] = matchedPerson[ data.config.propertyToInsert ].concat( newPerson[ data.config.propertyToInsert ] );
              }else{
                matchedPerson[ data.config.propertyToInsert ] = newPerson[ data.config.propertyToInsert ];
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
              insert(data, ++index, callback);
            });
          }else{
            client.db(database).collection(collection).insertOne(newPerson, function(insertErr, res){
              if(insertErr) return callback({details: "Error insertando en la base de datos", person: newPerson, err: String(insertErr)}, null);
              console.log("inserted as new person");

              client.close();
              insert(data, ++index, callback);
            });
          }
        });
      });
    }
  }
}

function insertPersons(data, callback){
  if( !data.persons[0].hasOwnProperty(utils.fullnameColumn) ){
    console.log("creating names");
    data.persons = utils.buildFullName(data.persons, data.config);
  }

  insert(data, 0, callback);
}

function getMatch(data, index, callback){
  if( index == data.persons.length ){
    callback(data.persons);
  }else{
    var person = data.persons[index];

    process.stdout.write(index + "/" + data.persons.length + ": " + person[ utils.fullnameColumn ] + " -- ");

    if( isValidPerson(person) ){
      console.log("omitiendo", JSON.stringify(person));
      getMatch(data, ++index, callback);
    }else{
      var query = {$text: { $search: person[ utils.fullnameColumn ] }};

      MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
        if(connectErr) return callback({details: "Error conectando a la base de datos", err: String(connectErr)}, null);

        client.db(database).collection(collection).find(query).project({ score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(function(searchErr, result) {
          if(searchErr) return callback({details: "Error buscando coincidencias", person: person, query: query, err: String(searchErr)}, null);

          console.log("evaluando", result.length, "coincidencias");

          if( result.length == 0 ){
            data.persons[index][ utils.matchColumn ] = "";
          }else{
            // update
            for (var matchedPerson of result) {
              if( isSamePerson(person, matchedPerson) ){
                data.persons[index][ utils.matchColumn ] = matchedPerson[ utils.fullnameColumn ];
                break;
              }
            }
          }

          getMatch(data, ++index, callback);
        });
      });
    }
  }
}

function getMatches(data, callback){
  if( !data.persons[0].hasOwnProperty(utils.fullnameColumn) ){
    console.log("creating names");
    data.persons = utils.buildFullName(data.persons, data.config);
  }

  getMatch(data, 0, callback);
}

function getTotalPersons(callback){

  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
    var db = client.db(database);

    // count documents
    db.collection(collection).find({},{ projection: {clean_name: 1} }).count(callback);
  });
}

function getNameList(max, callback){
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
    var db = client.db(database);

    // Find document
    db.collection(collection)
      .find({}, { projection: { clean_name: 1} })
      .sort({'name.0': 1})
      .limit(max)
      .toArray()
      .then(callback);
  });
}


function searchPersonsByNames(prop, callback) {
  console.log("searching person by names", prop);

  // query
  // var query = {};
  //
  // if(prop.names && prop.names != ""){
  //   query["name"]= { $all: prop.names.split(" ") };
  // }
  //
  // query["_joined._score"] = {};
  // query["_joined._score"][prop.opt] = prop.score;

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



function getPerson(name_id, callback){
  console.log("getting person", name_id);

  // query
  var query = { name_id: name_id };


  // Create a new MongoClient
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
    var db = client.db(database);

    // Find document
    db.collection(collection).findOne(query, function(err, person){
      if(err || !person){
        console.log("Error en la busqueda por name_id, intentando por nombre", name_id);

        var query = { name: { $all: name_id.split("_") } };
        db.collection(collection)
          .findOne(query, callback)
      }else{
        callback(err, person);
      }
    });
  });
}

module.exports = {
  insertPersons: insertPersons,
  getMatches: getMatches,
  searchPersonsByNames: searchPersonsByNames,
  getPerson: getPerson,
  getNameList: getNameList,
  getTotalPersons: getTotalPersons
}
