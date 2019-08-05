var fullnameColumn = "clean_name";
var matchColumn = "matched_name";
var defaultHeadersRowCount = 1;
var emptyColumnName = "no_name";

var titleTemplate = "<li class='nav-item'><a class='nav-link {{added_class}}' data-toggle='tab' href='#worksheet{{index}}'>{{worksheet_name}}</a></li>";
var contentTemplate = "<div id='worksheet{{index}}' class='tab-pane {{added_class}}'>{{controls}} {{table_view}}</div>";

function parseWorksheet(worksheetIndex){
  console.log("parsing worksheet " + worksheetIndex);

  var config = getConfig(worksheetIndex);

  var indexNoName=0;
  var headers = [matchColumn, fullnameColumn];
  var columns = [
    {field: matchColumn, title: matchColumn},
    {field: fullnameColumn, title: fullnameColumn}
  ];
  var dataJson = [];
  var header;
  var i,j;

  // build headers
  if(worksheets[worksheetIndex].data.length == 0){
    console.log("no se encontraron datos");
  }else{
    for (i = 0; i < worksheets[worksheetIndex].data[0].length; i++) {
      header = worksheets[worksheetIndex].data[0][i] ? cleanHeader(worksheets[worksheetIndex].data[0][i]):(emptyColumnName + "_" + (++indexNoName));

      headers.push(header);
      columns.push({field: header, title: header});
    }
  }

  // parse data
  var row, parsedRow;
  for (i = 1; i < worksheets[worksheetIndex].data.length; i++) {
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

    <span data-toggle="tooltip" title="Arrastra los encabezados de izquierda a derecha para seleccionarlos">Columnas de nombre: <i class="fas fa-question-circle text-secondary"></i></span>
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
          <label data-toggle="tooltip" title="Columnas con ligas a internet" for="linkColumns` + worksheetIndex + `">Columnas con enlaces externos: <i class="fas fa-question-circle text-secondary"></i></label>
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
