var titleTemplate = "<li class='nav-item'><a class='nav-link {{added_class}}' data-toggle='tab' href='#worksheet{{index}}'>{{worksheet_name}}</a></li>";
var contentTemplate = "<div id='worksheet{{index}}' class='tab-pane {{added_class}}'>{{controls}} {{table_view}}</div>";

function parseWorksheet(worksheetIndex){
  console.log("parsing worksheet " + worksheetIndex);

  var config = getConfig(worksheetIndex);

  var indexNoName=0;
  var headers = [utils.matchColumn, utils.fullnameColumn];
  var columns = [
    {field: utils.matchColumn, title: utils.matchColumn},
    {field: utils.fullnameColumn, title: utils.fullnameColumn}
  ];
  var dataJson = [];
  var header;
  var i,j;

  // build headers
  if(worksheets[worksheetIndex].data.length == 0){
    console.log("no se encontraron datos");
  }else{
    for (i = 0; i < worksheets[worksheetIndex].data[0].length; i++) {
      header = worksheets[worksheetIndex].data[0][i] ? utils.cleanHeader(worksheets[worksheetIndex].data[0][i]):(utils.emptyColumnName + "_" + (++indexNoName));

      headers.push(header);
      columns.push({field: header, title: header});
    }
  }

  // parse data
  var row, parsedRow;
  for (i = 1; i < worksheets[worksheetIndex].data.length; i++) {
    row = worksheets[worksheetIndex].data[i];
    parsedRow = {id: i};

    for (j = 2; j < headers.length; j++) {
      parsedRow[ headers[j] ] = utils.cleanValue(row[j-2]);
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
    if(header == utils.fullnameColumn || header == utils.matchColumn){
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
    if(header == utils.fullnameColumn || header == utils.matchColumn){
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
    if(header == utils.fullnameColumn || header == utils.matchColumn){
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
      <button class="btn btn-info" type="button" onclick="buildFullName(` + worksheetIndex + `);">Generar nombres</button>
      <button type="button" class="btn btn-info">Obtener coincidencias</button>
    </div>

    <div class="clearfix"></div>

    <div class="float-right">
      <button type="button" class="btn btn-primary mt-1 float-right" data-toggle="modal" data-target="#insertPersonsDialog" data-index="` + worksheetIndex + `">Agregar a la base de datos</button>
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
