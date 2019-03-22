// grab articles as JSON
$.getJSON("/articles", function(data) {
  // For each one...
  for (var i = 0; i < data.length; i++) {
    // display the appropriate info on page
    $("#articles").append(
      "<div class='cards medium-leading medium-font' data-favorite='false' data-toggle='modal' data-target='#cardModal' data-id='" +
        data[i]._id +
        "'><div><button type='button' class='btn btn-info btn-sm saveArticle' data-text-swap='saved'>save</button></div><h1 class='title-margin'>" +
        data[i].title +
        "</h1><a class='link' src=" +
        data[i].link +
        ">" +
        data[i].paragraph +
        "</a></div>"
    );
  }
});

// ----------

// when saveArticle is clicked
$(document).on("click", ".saveArticle", function() {
  var el = $(this);
  el.text() == el.data("text-swap")
    ? el.text(el.data("text-original"))
    : el.text(el.data("text-swap"));
});

// ----------

// when a `p` tag is clicked
$(document).on("click", ".cards", function() {
  // empty the notes from note section
  $("#notes").empty();
  // save the id from p tag
  var thisId = $(this).attr("data-id");

  // AJAX call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // then add the note information to page
    .then(function(data) {
      console.log(data);

      $("#notes").append(
        "<h2 class='lrg-font medium-leading'>" + data.title + "</h2>"
      );

      $("#notes").append(
        "<br /><input id='titleinput' name='title' placeholder='title'>"
      );

      $("#notes").append(
        "<br /><textarea id='bodyinput' name='body' placeholder='notes'></textarea>"
      );

      $("#notes").append(
        "<br /><button type='button' class='btn btn-info btn-sm' data-dismiss='modal' data-id='" +
          data._id +
          "' id='savenote'>save note</button>"
      );

      // if there's a note in the article
      if (data.note) {
        // place title of note in the title input
        $("#titleinput").val(data.note.title);
        // place body of note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// ----------

// when savenote button is clicked
$(document).on("click", "#savenote", function() {
  // grab id associated with the article from submit button
  var thisId = $(this).attr("data-id");

  // run POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // value taken from title input
      title: $("#titleinput").val(),
      // value taken from note textarea
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
