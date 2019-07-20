var fullnameColumn = ".clean_name";
var matchColumn = "match";
var defaultHeadersRowCount = 1;

$('#uploadForm').ajaxForm({
  beforeSerialize: function(arr, $form, options) {
    $("#chargingDialog").modal("show");
  },
  success: function(worksheets){
    window.worksheets = worksheets;
    setTimeout(function () {
      paintWorksheets();

      $("#chargingDialog").modal("hide");
    }, 300);
  }
});

function cleanName(fullname){
  if(!fullname)
    return "";

  return latinize( String(fullname).toLocaleLowerCase().trim() ).replace(/[^ \w]|_|[0-9]/g, "");
}

function cleanHeader(header){
  if(!header)
    return "";

  return latinize( String(header).toLocaleLowerCase().trim() ).replace(/[^ \w]|_|[0-9]/g, "").replace(/ /g,"_");
}

function cleanValue(value){
  if(!value)
    return "";

  return String(value).trim();
}

function updateWorksheet(worksheetIndex){
  $("#chargingDialog").modal("show");

  setTimeout(function () {
    console.log("update worksheet " + worksheetIndex);

    buildHeaders(worksheetIndex);

    var controlsConfig = {
      headersRowValue: ($("#headersRowCounter" + worksheetIndex).length>0) ? parseInt($("#headersRowCounter" + worksheetIndex).val()):defaultHeadersRowCount,
      nameColumnsValue: $("#nameColumns" + worksheetIndex).val()
    };

    $("#controls" + worksheetIndex).replaceWith( buildControls(worksheetIndex, controlsConfig) );
    $("#dataTable" + worksheetIndex).replaceWith( buildView(worksheetIndex) );

    var editableAux = [];
    for( var headerIndex = 0; headerIndex < worksheets[worksheetIndex].headers.length; headerIndex++ ){
      editableAux.push( [headerIndex+1, String(headerIndex+1)] );
    }

    $('#dataTable' + worksheetIndex).Tabledit({
      editButton: false,
      removeButton: false,
      saveButton: false,
      restoreButton: false,
      deleteButton: false,
      columns: {
        identifier: [0, fullnameColumn],
        editable: editableAux
      }
    });

    $("#chargingDialog").modal("hide");
  }, 400);
}

function buildHeaders(worksheetIndex, config){
  if (!config){
    config= {
      headersRowValue: ($("#headersRowCounter" + worksheetIndex).length>0) ? parseInt($("#headersRowCounter" + worksheetIndex).val()):defaultHeadersRowCount
    };
  }

  var headerRows = worksheets[worksheetIndex].data.slice(0, config.headersRowValue);

  var headers = [], value, indexNoName=0;
  for (var i = 0; i < headerRows.length; i++) {
    for (var j = 0; j < headerRows[i].length; j++) {
      value = headerRows[i][j] ? cleanHeader(headerRows[i][j]):"";

      if(i==0){
        if(value == "" ){
          value = "no_name_" + (++indexNoName);
        }

        headers.push( value );
      }else if(value != ""){
        headers[j] += "_" + value;
      }

    }
  }

  worksheets[worksheetIndex].headers = headers;
}

function paintWorksheets(){
  var index = 0;
  for (var worksheet of worksheets) {
    buildHeaders(index, {headersRowValue: 1});

    var title = "<li class='nav-item'><a class='nav-link " + ((index==0)?"active":"") + "' data-toggle='tab' href='#worksheet" + index + "'>" + worksheet.name + "</a></li>";

    var content = "<div id='worksheet" + index + "' class='tab-pane " + ((index==0)?"active":"fade") + "'>" + buildControls(index,{"headersRowValue": 1, "nameColumnsValue": []}) + buildView(index) + "</div>";

    if(index==0){
      $("#tab-headers").html("");
      $("#tab-body").html("");
    }

    $("#tab-headers").append(title);
    $("#tab-body").append( content);

    var editableAux = [];
    for( var headerIndex = 0; headerIndex < worksheets[index].headers.length; headerIndex++ ){
      editableAux.push( [headerIndex+1, String(headerIndex+1)] );
    }

    $('#dataTable' + index).Tabledit({
      editButton: false,
      removeButton: false,
      saveButton: false,
      restoreButton: false,
      deleteButton: false,
      columns: {
        identifier: [0, fullnameColumn],
        editable: editableAux
      }
    });

    index++;
  }
}

function buildControls(worksheetIndex, config={"headersRowValue": 1, "nameColumnsValue": []}){
  var controls = `
  <div class='container' id='controls` + worksheetIndex + `'>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text"># de lineas de encabezado: </span>
      </div>
      <input type="number" min="1" class="form-control" id="headersRowCounter` + worksheetIndex + `" value="` + config.headersRowValue + `">
    </div>

    <div class="form-group">
      <label for="nameColumns` + worksheetIndex + `">Columnas de nombre:</label>
      <select multiple class="form-control" id="nameColumns` + worksheetIndex + `">
  `;

  for (var header of worksheets[worksheetIndex].headers) {
    var selected = (config.nameColumnsValue.indexOf(header)>-1) ? "selected":"";
    controls += "<option " + selected + ">" + header + "</option>";
  }

  controls += `
      </select>
    </div>

    <button class="btn btn-primary float-right" type="button" onclick="updateWorksheet(` + worksheetIndex + `);">Actualizar</button>
    <div class="clearfix mb-4"></div>

  </div>
  `;

  return controls;
}

function buildView(worksheetIndex){
  var worksheet = worksheets[worksheetIndex];
  var data = worksheet.data;
  var headers = worksheets[worksheetIndex].headers;
  var headersRowCounter = ($("#headersRowCounter" + worksheetIndex).length>0) ? parseInt($("#headersRowCounter" + worksheetIndex).val()):defaultHeadersRowCount;

  var table = `
  <div>
    <table id='dataTable` + worksheetIndex + `' class="table table-striped table-bordered table-sm">
      <thead>
        <tr>`;

  for (var i = 0; i < headers.length; i++) {
    if ( i == 0 ){
      table += "<th>" + fullnameColumn + "</th>";
      table += "<th>" + matchColumn + "</th>";
    }

    table += "<th>" + headers[i] + "</th>";
  }

  table += "</tr></thead>";
  table += "<tbody>";

  for (var i = headersRowCounter; i < data.length; i++) {
    table += "<tr>";


    for (var j = 0; j < headers.length; j++) {
      if(j==0){
        // print full name
        var fullname = "";
        if($("#nameColumns" + worksheetIndex).length > 0){
          for (var headerName of $("#nameColumns" + worksheetIndex).val()) {
            fullname += cleanName(data[i][headers.indexOf(headerName)]) + " ";
          }
        }

        table += "<td>" + cleanName(fullname) + "</td>";

        // print match
        if(window.matchs){
          table += "<td>" + window.matchs[fullname] + "</td>";
        }else{
          table += "<td></td>";
        }
      }

      value = data[i][j] ? data[i][j]:"";
      table += "<td>" + cleanValue(value) + "</td>";
    }

    table += "</tr>";
  }

  table += "</tbody>";
  table += "</table></div>";

  return table;
}

function findMatches(){
  
}