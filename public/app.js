// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

populateArticles = function( articles ) {
  $('#articles').empty();
  let newsUrl = 'http://m.mlb.com';
  for(let i = 0; i < articles.length; i++) {

    let newArticle = $('<div>');
    newArticle.addClass('panel panel-info')

    let heading = $('<div>');
    heading.addClass('panel-heading');
    let title = $('<h3>');
    title.addClass('panel-title')
         .text( articles[i].title );
    heading.append(title);

    let body = $('<div>');
    body.addClass('panel-body')
    let blurb = $('div');
    blurb.addClass('col-sm-9');
    for(let j = 0; j < (articles.blurb.length -2 ); j++){
      let paragraph = $('<p>');
      paragraph.text( articles.blurb[j] )
      blurb.append(paragraph);
    }
    let linkButton = $('<a>')
    linkButton.attr('href', newsURL + articles[i].link)
              .addClass('btn btn-primary')
              .text('Continue Reading');
    blurb.append(linkButton)
    body.append(blurb);

    let 
    
  }
}