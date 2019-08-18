var MongoClient = require("mongodb").MongoClient;
var utils = require("../client/js/utils");

var host = process.env.MONGO_HOST || "mongo";
var port = process.env.MONGO_PORT || "27017";
var database = process.env.MONGO_DATABASE || "cide";
var collection = process.env.MONGO_COLLECTION || "personas";

var mongoUrl = "mongodb://" + host + ":" + port + "/";

function insert(data, index, callback){
  if( index == data.persons.length ){
    callback("end");
  }else{
    var person = data.persons[index];

    if( person[ utils.fullnameColumn ] == "" ){
      console.log("Omitiendo", person);
      insert(data, ++index, callback);
    }else{
      var query = {$text: { $search: person[ utils.fullnameColumn ] }};

      MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(connectErr, client) {
        if(connectErr) return callback({details: "Error conectando a la base de datos", err: String(connectErr)}, null);

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

          if( result.length == 0 ){
            // insert new person
            client.db(database).collection(collection).insertOne(newPerson, function(insertErr, res){
              if(insertErr) return callback({details: "Error insertando en la base de datos", person: newPerson, err: String(insertErr)}, null);
              console.log("inserted", newPerson[ utils.fullnameColumn ]);

              client.close();
              insert(data, ++index, callback);
            });
          }else{
            // update
            var update = false;
            for (var matchedPerson of result) {
              if( matchedPerson[ utils.fullnameColumn ] === newPerson[ utils.fullnameColumn ] ){
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
                console.log("inserted", newPerson[ utils.fullnameColumn ]);

                client.close();
                insert(data, ++index, callback);
              });
            }
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


module.exports = {
  insertPersons: insertPersons
}
