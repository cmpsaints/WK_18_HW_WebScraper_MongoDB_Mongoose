// grab articles as JSON
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        data[i].link +
        "</p>"
    );
  }
});

// ----------

$(document).on("click", "p", function() {
  $("#notes").empty();

  // save id from p tag
  var thisId = $(this).attr("data-id");

  // AJAX GET request for Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // add note information to page
    .then(function(data) {
      console.log(data);

      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// ----------

$(document).on("click", "#savenote", function() {
  // submit button grabs Article's associated id
  var thisId = $(this).attr("data-id");

  // AJAX POST request to change note
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);

    $("#notes").empty();
  });

  // remove note values entered in input & textarea
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
