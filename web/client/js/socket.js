var socket = io();

function insertPersons(){
  $("#insertPersonsAcceptButton").prop("disabled", true);
  $("#chargingDialog").modal("show");

  var indexSpredsheet = window.selectedWorksheet;
  var config = getConfig(indexSpredsheet);

  if(config){
    config.propertyToInsert = $("#insertPersonsInput").val();

    if( config.propertyToInsert && config.propertyToInsert !== "" ){
      socket.emit("insertPersons", {persons: window.worksheets[indexSpredsheet].dataJson, config: config}, function(result){
        $("#insertPersonsDialog").modal("hide");

        console.log("completed", result);

        $("#insertPersonsAcceptButton").prop("disabled", false);
        $("#chargingDialog").modal("hide");
      });
    }
  }
}

function getMatches(indexSpredsheet){
  $("#chargingDialog").modal("show");

  console.log("Getting matches", indexSpredsheet);

  var config = getConfig(indexSpredsheet);
  if(config){
    socket.emit("getMatches", {persons: window.worksheets[indexSpredsheet].dataJson, config: config}, function(result){
      window.worksheets[indexSpredsheet].dataJson = result;
      $("#dataTable" + indexSpredsheet).bootstrapTable("load", worksheets[indexSpredsheet].dataJson);

      $("#chargingDialog").modal("hide");
    });
  }
}
