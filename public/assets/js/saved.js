// Grab the articles as a json
$(document).on('click', '.delete', deleteArticle);

populateArticles();

function populateArticles() {
  $.getJSON("/articles", function(articles) {
    console.log(articles)
   if(articles.length > 0){
       $('#articles').empty();
       
       for(let i = 0; i < articles.length; i++) {
         addArticle( articles[i] );
       }
    }
  });  
}

function addArticle(article){
  let id = article._id
  let newArticle = $('<div/>');
  newArticle.addClass('well well-lg')
            .attr('id', id);

  let body = $('<div/>');
  body.addClass('row')

  let linkDiv = $('<div/>');
  linkDiv.addClass('col-sm-9');
  let link = $('<a/>')
  link.attr('href', article.link)
      .html('<h2>' + article.title + '</h2>')
  linkDiv.append(link)
  body.append(linkDiv);

  let buttonDiv = $('<div/>')
  buttonDiv.addClass('col-sm-3');
  let notesButton = $('<button/>')
  notesButton.addClass('btn btn-info notes')
             .attr('articleId', id)
             .text('Notes');

  let deleteButton = $('<button/>')
  deleteButton.addClass('btn btn-danger delete')
            .attr('articleId', id)
            .text('Delete');
  buttonDiv.append(notesButton)
           .append(deleteButton);

  body.append(buttonDiv);

  newArticle.append(body);
  $('#articles').append(newArticle);
}


function deleteArticle() {
  let id = $(this).attr('articleId');
  $.ajax({
    url: '/articles/' + id,
    type: 'DELETE'
  }).done(function( data ) {
    $('#' + id).remove();
  })
}