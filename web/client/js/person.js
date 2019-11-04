var socket = io();

$(function(){
  $("#loadingModal").modal("show");

  console.log("getting person", window.person_name);

  socket.emit("getPerson", window.person_name, function(err, person){
    if(err){
      $(".progress").replaceWith("<p>No se encontro información</p>");
      return console.log("Error en la busqueda", err);
    }

    console.log(person);

    $("#person-name").html( person[ utils.fullnameColumn ] );
    $("#person-code").html( person[ utils.codeColumn ] );

    var html = "";
    for (var property in person) {
      if( property === utils.fullnameColumn || property === "score" || property === utils.codeColumn){
        continue;
      }

      html += `
      <div class="p-3 jumbotron" style="overflow-x:auto;">
        <h2 class='text-capitalize text-muted'>` + property + `</h2>
      `;

      for (var record of person[property]) {
        html += `
        <div class='row'>
          <table class='table table-bordered table-sm'>
            <thead>
              <tr class='table-info'>
        `;

        var headers = Object.keys(record);
        for (var header of headers) {
          html += "<td>" + header.toLowerCase() + "</td>";
        }

        html += `</tr>
            </thead>

            <tbody>
              <tr class='table-light'>`;

        for (var i = 0; i < headers.length; i++) {
          var header = headers[i];

          html += `<td class='text-capitalize'>` + record[header] + `</td>`;
        }

        html += `</tr>
            </tbody>
          </table>
        </div>`;

      }

      html += "</div>";
    }

    $("#dataHolder").append(html);
    $("#loadingModal").modal("hide");
  });

});
