$(function () {
  $('#uploadForm').ajaxForm({
    beforeSerialize: function(arr, $form, options) {
      $("#chargingDialog").modal("show");

      $("#tab-body").html("");
      $("#tab-headers").html("");
    },
    success: function(worksheets){
      window.worksheets = worksheets;
      loadWorksheets();

      $("#chargingDialog").modal("hide");
    }
  });

  $('[data-toggle="tooltip"]').tooltip();
});


function getConfig(worksheetIndex){
  var selectedNameColumnsList = [];
  $.each($('#selectedNameColumns' + worksheetIndex).find('li'), function() {
    selectedNameColumnsList.push($(this).text());
  });

  var config= {
    nameColumnsValue: selectedNameColumnsList,
    linkColumnsValue: ($("#linkColumns" + worksheetIndex).length>0) ? $("#linkColumns" + worksheetIndex).val():[],
    referenceColumnsValue: ($("#referenceColumns" + worksheetIndex).length>0) ? $("#referenceColumns" + worksheetIndex).val():[]
  };

  return config;
}

function initWorksheet(worksheetIndex){
  $("#dataTable" + worksheetIndex).bootstrapTable({
    columns: worksheets[worksheetIndex].columns,
    data: worksheets[worksheetIndex].dataJson,
    pagination: true,
    search: true,
    showSearchClearButton: true,
    paginationVAlign: "top",
    searchAlign: "left",
    onClickCell: function (field, value, row, element) {
      var activeWorksheet = parseInt($(".nav-link.active")[0].hash.replace("#worksheet",""));

      $("#editValueDialog").off("show.bs.modal");
      $("#editValueDialog").on("show.bs.modal", function (event) {
        $(this).find("#editValueLabel").text(field);
        $(this).find("#editValueInput").val(value);

        $("#editValueAcceptButton").data("row", element[0].parentElement.dataset.index);
        $("#editValueAcceptButton").data("field", field);
        $("#editValueAcceptButton").data("index", activeWorksheet);
      });

      $("#editValueDialog").modal("show");
    }
  });
}

function buildFullName(worksheetIndex){
  console.log("building names " + worksheetIndex);

  var config = getConfig(worksheetIndex);

  for (var record of worksheets[worksheetIndex].dataJson) {
    // build full name
    var fullname = "";
    for (var i = 0; i < config.nameColumnsValue.length; i++) {
      fullname += record[ config.nameColumnsValue[i] ] + " ";
    }
    record[ fullnameColumn ] = cleanName(fullname);
  }

  $("#dataTable" + worksheetIndex).bootstrapTable("load", worksheets[worksheetIndex].dataJson);
}

function loadWorksheets(){
  var worksheet, title, content;
  for (var index = 0; index < window.worksheets.length; index++) {
    parseWorksheet(index);

    worksheet = window.worksheets[index];

    title = titleTemplate.replace("{{added_class}}", ((index==0)?"active":"")).replace("{{index}}", index).replace("{{worksheet_name}}", worksheet.name);
    content = contentTemplate.replace("{{added_class}}", ((index==0)?"active":"fade")).replace("{{index}}", index).replace("{{controls}}", buildControls(index)).replace("{{table_view}}", buildTable(index));

    $("#tab-headers").append(title);
    $("#tab-body").append(content);

    $( "#nameColumns" + index + ", #selectedNameColumns" + index ).sortable({
        connectWith: ".connectedSortable"+index,
        placeholder: "ui-state-highlight"
    }).disableSelection();

    initWorksheet(index);
  }
}


$("#editValueInput").keypress(function(e){
  if(e.which == 13){
    $("#editValueAcceptButton").click();
    return false;
  }
});

$("#editValueDialog").on("shown.bs.modal", function (event) {
  $("#editValueInput").focus();
});

$("#userData").on("change",function(){
  var fileName = $(this).val();
  var splitedPath = fileName.split("\\");
  $(this).next('.custom-file-label').html( splitedPath[ splitedPath.length - 1 ] );
});


// string clean functions
function cleanName(fullname){
  if(!fullname)
    return "";

  return latinize( String(fullname).toLocaleLowerCase().trim() ).replace(/[^ \w]|[0-9]/g, "");
}

function cleanHeader(header){
  if(!header)
    return "";
  return latinize( String(header).toLocaleLowerCase().trim() ).replace(/ /g,"_").replace(/[^\w]|[0-9]/g, "");
}

function cleanValue(value){
  if(!value)
    return "";

  return String(value).trim();
}
