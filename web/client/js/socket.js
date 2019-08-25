var socket = io();

function insertPersons(){
  var indexSpredsheet = window.selectedWorksheet;
  var config = getConfig(indexSpredsheet);

  if(config){
    $("#insertPersonsAcceptButton").prop("disabled", true);
    $("#chargingDialog").modal("show");

    config.propertyToInsert = $("#insertPersonsInput").val();

    if( config.propertyToInsert && config.propertyToInsert !== "" ){
      socket.emit("insertPersons", {persons: window.worksheets[indexSpredsheet].dataJson, config: config}, function(result){
        console.log("completed", result);

        $("#chargingDialog").modal("hide");
        $("#insertPersonsAcceptButton").prop("disabled", false);
        $("#insertPersonsDialog").modal("hide");
      });
    }
  }
}

function getMatches(indexSpredsheet){
  console.log("Getting matches", indexSpredsheet);

  var config = getConfig(indexSpredsheet);
  if(config){
    $("#chargingDialog").modal("show");

    socket.emit("getMatches", {persons: window.worksheets[indexSpredsheet].dataJson, config: config}, function(result){
      window.worksheets[indexSpredsheet].dataJson = result;
      $("#dataTable" + indexSpredsheet).bootstrapTable("load", worksheets[indexSpredsheet].dataJson);

      $("#chargingDialog").modal("hide");
    });
  }
}
