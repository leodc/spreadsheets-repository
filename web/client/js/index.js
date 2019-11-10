var socket = io();


function downloadPersons(){
  searchPersons(function(persons){
    console.log(persons);

    var fileContent = "";
    if( $("#downloadJson").is(":checked") ){
      fileContent = JSON.stringify(persons);
    }else{
      var headers = [utils.fullnameColumn];
      var skip = ["_id", utils.fullnameColumn, "score"];

      var childrenProperties = {};
      for (var person of persons) {
        for (var parentProp in person) {
          if( skip.indexOf(parentProp) < 0 ){

            var counter = 0;
            for (var prop of person[parentProp]) {
              for (var key in prop){
                var newHeader = parentProp + "." + key + "." + (counter);

                if(!childrenProperties[parentProp]){
                  childrenProperties[parentProp] = [];
                }

                if(childrenProperties[parentProp].indexOf(newHeader) < 0){
                  childrenProperties[parentProp].push(newHeader);
                }
              }
              counter++;
            }
          }
        }
      }


      for (var parentProp in childrenProperties) {
        headers = headers.concat(childrenProperties[parentProp]);
      }

      fileContent = headers.join(",") + "\n";
      for (var person of persons) {
        for(var header of headers){
          var value = "";

          if(header == "name"){
            value = person[header].join(" ");
          }else if(header.includes(".")){
            var aux = header.split(".");

            var parentProp = aux[0];
            var propKey = aux[1];
            var elementIndex = parseInt(aux[2]);

            value = (person[parentProp] && person[parentProp].length > elementIndex && person[parentProp][elementIndex][propKey]) ? person[parentProp][elementIndex][propKey]:"";
          }else{
            value = person[header] ? person[header]:"";
          }

          value = value.toString().replace(",",";");
          fileContent += value + ",";
        }

        fileContent = fileContent.slice(0, -1) + "\n";
      }
    }

    var filename = ($("#downloadFileName").val() != "") ? $("#downloadFileName").val():"personas_descarga";
    var fileType = ($("#downloadJson").is(":checked")) ? "json":"csv";

    var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});

    saveAs(blob, filename + "." + fileType);

    $("#loadingModal").modal("hide");
  });
}

function createNewFilter(){
  var prop = $("#newFilterProperty").val();
  var opt = $("#newFilterOpt").val();
  var value = $("#newFilterValue").val();

  var condition = prop + ":" + opt + ":" + value;
  var contidionHtml = prop + " " + $("#newFilterOpt").find("option:selected").text() + " " + value;

  var html = "<span class='badge badge-info filter-mongo' data-condition='" + condition + "' onclick='this.remove();' style='cursor:pointer;'> " + contidionHtml +   " &nbsp;<i class='fas fa-times' style='color:red;'></i></span>&nbsp;"

  $("#filterList").append(html);

  $("#newFilterModal").modal("hide");
}

function searchPersons(callback){
  $("#loadingModal").modal("show");

  var names = $("#searchName").val().toLowerCase();
  var opt = $("#sourceOpt").val();

  // build query
  var filters = [];
  $(".filter-mongo").each(function(){
    filters.push($(this).data("condition"));
  });

  // $("#searchNames").html("");

  if(!callback){
    callback = function(persons){
      console.log(persons);

      $("#searchNames").html("");

      for (var person of persons) {
        html = "<li>";
        html += "<a href='/persona/" + person[utils.fullnameColumn] + "' target='_blank'>" + person[utils.fullnameColumn] + "</a>";
        html += "</li>";

        $("#searchNames").append(html);
      }

      $("#searchCounter").html( persons.length + " personas encontradas");
      $("#loadingModal").modal("hide");
    };
  }

  // socket.emit( "search" , {names: names, opt: opt, score: score, filters: filters}, callback);
  socket.emit( "search" , {names: names, opt: opt, filters: filters}, callback);
}

function getPersons() {
  var max = parseInt($("#maxPersons").val());

  $("#loadingModal").modal("show");

  socket.emit("nameList", max,function(persons){
    $("#nameindex").html("");

    console.log(persons);

    var option;
    for( var person of persons ){
      option = "<li><a target='_blank' href='/persona/" + person[utils.fullnameColumn] + "'>" + person[utils.fullnameColumn] + "</a></li>";
      $("#nameindex").append(option);
    }

    $("#loadingModal").modal("hide");
  });
}

var init = false;
socket.on("totalPersons", function(count){
  if(!init){
    $("#totalPersons").val(count);

    getPersons();

    init = true;
  }
});

$(function () {
  $("#loadingModal").modal("show");

  $("#searchName, #score").keypress(function (e) {
    if (e.which == 13) {
      searchPersons();
      return false;
    }
  });
});
