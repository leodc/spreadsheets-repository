var fullnameColumn = "clean_name";
var matchColumn = "matched_name";
var defaultHeadersRowCount = 1;
var emptyColumnName = "no_name";

var titleTemplate = "<li class='nav-item'><a class='nav-link {{added_class}}' data-toggle='tab' href='#worksheet{{index}}'>{{worksheet_name}}</a></li>";
var contentTemplate = "<div id='worksheet{{index}}' class='tab-pane {{added_class}}'>{{controls}} {{table_view}}</div>";

function parseWorksheet(worksheetIndex){
  var config = getConfig(worksheetIndex);

  var indexNoName=0;
  var headers = [];
  var columns = [];
  var dataJson = [];
  var header;
  var i,j;

  // build headers
  var headerRows = worksheets[worksheetIndex].data.slice(0, config.headersRowValue);
  for (i = 0; i < headerRows.length; i++) {
    for (j = 0; j < headerRows[i].length; j++) {
      header = headerRows[i][j] ? cleanHeader(headerRows[i][j]):"";

      if(i==0){
        if(header == "" ){
          header =  emptyColumnName + "_" + (++indexNoName);
        }
        headers.push( header );
      }else if(header != ""){
        headers[j] += "_" + header;
      }
    }
  }

  headers.unshift(matchColumn, fullnameColumn);

  // get columns
  for (header of headers) {
    columns.push({field: header, title: header});
  }

  // parse data
  var row, parsedRow;
  for (i = config.headersRowValue; i < worksheets[worksheetIndex].data.length; i++) {
    row = worksheets[worksheetIndex].data[i];
    parsedRow = {id: i};

    var fullname = "";
    if( config.nameColumnsValue.length > 0 ){
      for (var k = 0; k < config.nameColumnsValue.length; k++) {
        fullname += row[ headers.indexOf(config.nameColumnsValue[k])-2 ] + " ";
      }
    }
    parsedRow[ fullnameColumn ] = cleanName(fullname);

    for (j = 2; j < headers.length; j++) {
      parsedRow[ headers[j] ] = cleanValue(row[j-2]);
    }

    dataJson.push(parsedRow);
  }

  worksheets[worksheetIndex].headers = headers;
  worksheets[worksheetIndex].columns = columns;
  worksheets[worksheetIndex].dataJson = dataJson;
}


function buildControls(worksheetIndex){
  var config = getConfig(worksheetIndex);

  var controls = `
  <div class='container' id='controls` + worksheetIndex + `'>
    <div class="input-group mb-2">
      <div class="input-group-prepend">
        <span class="input-group-text"># de lineas de encabezado: </span>
      </div>
      <input type="number" min="1" class="form-control" id="headersRowCounter` + worksheetIndex + `" value="` + config.headersRowValue + `">
    </div>

    Columnas de nombre:
    <div class="row">
      <div class="col">
        <ul class="sortable connectedSortable` + worksheetIndex + `" id="nameColumns` + worksheetIndex + `">
  `;

  var selectedNamesItems = "";
  for (var nameColumn of config.nameColumnsValue) {
    selectedNamesItems += "<li>" + nameColumn + "</li>";
  }
  for (var header of worksheets[worksheetIndex].headers) {
    if(header == fullnameColumn || header == matchColumn){
      continue;
    }

    if( config.nameColumnsValue.indexOf(header) == -1 ){
      controls += "<li>" + header + "</li>";
    }
  }

  controls += `
        </ul>
      </div>

      <div class="col">
        <ul class="sortable connectedSortable` + worksheetIndex + `" id="selectedNameColumns` + worksheetIndex + `">` + selectedNamesItems + `</ul>
        <small>**Orden correcto:<br>[Apellido paterno]<br>[Apellido materno]<br>[Nombres]</small>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col">
        <div class="form-group">
          <label for="linkColumns` + worksheetIndex + `">Columnas con enlaces externos:</label>
          <select multiple class="form-control" id="linkColumns` + worksheetIndex + `">
  `;

  for (var header of worksheets[worksheetIndex].headers) {
    if(header == fullnameColumn || header == matchColumn){
      continue;
    }
    var selected = (config.linkColumnsValue.indexOf(header)>-1) ? "selected":"";
    controls += "<option " + selected + ">" + header + "</option>";
  }

  controls += `
          </select>
        </div>
      </div>

      <div class="col">
        <div class="form-group">
          <label for="referenceColumns` + worksheetIndex + `">Columnas con referencia a otras personas:</label>
          <select multiple class="form-control" id="referenceColumns` + worksheetIndex + `">
  `;

  for (var header of worksheets[worksheetIndex].headers) {
    if(header == fullnameColumn || header == matchColumn){
      continue;
    }
    var selected = (config.referenceColumnsValue.indexOf(header)>-1) ? "selected":"";
    controls += "<option " + selected + ">" + header + "</option>";
  }

  controls += `
          </select>
        </div>
      </div>
    </div>

    <div class="float-right">
      <button class="btn btn-info" type="button" onclick="updateWorksheet(` + worksheetIndex + `);">Actualizar tabla</button>
      <button type="button" class="btn btn-info"><i class="fas fa-search"></i></button>
      <button type="button" class="btn btn-info"><i class="fas fa-play"></i></button>
    </div>
    <div class="clearfix mb-4"></div>
  </div>
  `;

  return controls;
}


function buildTable(worksheetIndex){
  return `<div id="containerTable` + worksheetIndex + `"><table id='dataTable` + worksheetIndex + `' class="table table-striped table-bordered table-sm"></table></div>`;
}

function updateCellValue(){
  var indexRow = parseInt($('#editValueAcceptButton').data("row"));
  var field = $('#editValueAcceptButton').data("field");
  var activeWorksheet = $('#editValueAcceptButton').data("index");
  var value = $('#editValueInput').val();

  $('#dataTable' + activeWorksheet).bootstrapTable('updateCell', {index: indexRow, field: field, value: value});

  $("#editValueDialog").modal("hide");
}
