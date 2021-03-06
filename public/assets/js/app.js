// grab articles as JSON
$.getJSON("/articles", function(data) {
  // For each one...
  for (var i = 0; i < data.length; i++) {
    // display the appropriate info on page
    $("#articles").append(
      "<div class='card medium-leading medium-font' data-favorite='false'><div><button type='button' class='btn btn-info btn-sm saveArticle' data-toggle='modal' data-target='#cardModal' data-text-swap='saved' data-id='" +
        data[i]._id +
        "'>save</button></div><h6 class='title-margins'>" +
        data[i].title +
        "</h6><div class='date-margins'>" +
        data[i].date +
        "</div><a class='article-link' href='" +
        data[i].link +
        "' target='_blank'>" +
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

// when a `save` article button is clicked
$(document).on("click", ".saveArticle", function() {
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
        "<h6 class='medium-leading modal-title-margins'>" + data.title + "</h6>"
      );

      $("#notes").append(
        "<input id='titleinput' name='title' placeholder='title'>"
      );

      $("#notes").append("<hr />");

      $("#notes").append(
        "<textarea id='bodyinput' name='body' placeholder='notes'></textarea>"
      );

      $("#notes").append(
        "<button type='button' class='btn btn-info btn-sm' data-dismiss='modal' data-id='" +
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
