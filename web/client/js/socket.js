var socket = io();

function insertPersons(){
  var indexSpredsheet = window.selectedWorksheet;
  var config = getConfig(indexSpredsheet);
  config.propertyToInsert = $("#insertPersonsInput").val();

  if( config.propertyToInsert && config.propertyToInsert !== "" ){
    socket.emit("insertPersons", {persons: window.worksheets[indexSpredsheet].dataJson, config: config}, function(result){
      $("#insertPersonsDialog").modal("hide");

      console.log("completed", result);
    });
  }
}

function getMatches(indexSpredsheet){
  console.log("Getting matches", indexSpredsheet);

  socket.emit("getMatches", {persons: window.worksheets[indexSpredsheet].dataJson, config: getConfig(indexSpredsheet)}, function(result){
    window.worksheets[indexSpredsheet].dataJson = result;
    $("#dataTable" + indexSpredsheet).bootstrapTable("load", worksheets[indexSpredsheet].dataJson);
  });
}
