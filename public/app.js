// Grab the articles as a json
$('#scraper').on('click', populateArticles );
$(document).on('click', '.save', saveArticle);

function populateArticles() {
  
  event.preventDefault();
  console.log('clicked') 

  $.getJSON("/scrape", function(articles) {
    $('#articles').empty();

    $('#modal-content').html('<h3>Scrape Complete</h3>');
    $('#myModal').modal('show');

    for(let i = 0; i < articles.length; i++) {
      addArticle( articles[i] );
    }
  });  
}

function addArticle(article){
  let id = Date.now()
  let newArticle = $('<div/>');
  newArticle.addClass('panel panel-info')
            .addClass(''+id);

  let heading = $('<div/>');
  heading.addClass('panel-heading');
  let title = $('<h3/>');
  title.addClass('panel-title')
       .text( article.title );
  heading.append(title);

  let body = $('<div/>');
  body.addClass('panel-body row')
  let blurb = $('<div/>');
  blurb.addClass('col-sm-9');
  for(let j = 0; j < (article.blurb.length -2 ); j++){
    let paragraph = $('<p/>');
    paragraph.text( article.blurb[j] );
    blurb.append(paragraph);
  }
  let linkButton = $('<a/>')
  linkButton.attr('href', article.link)
            .addClass('btn btn-primary')
            .text('Continue Reading');
  blurb.append(linkButton)
  body.append(blurb);

  let buttonDiv = $('<div/>')
  buttonDiv.addClass('col-sm-3');
  let saveButton = $('<button/>')
  saveButton.addClass('btn btn-success save')
            .attr('id', id)
            .text('Save');
  buttonDiv.append(saveButton);
  body.append(buttonDiv);

  newArticle.append(heading)
            .append(body);
  $('#articles').append(newArticle);
}


function saveArticle() {
  let id = $(this).attr('id');
  let article = $('.' + id);
  let saveObject = {};
  saveObject.title = article.children('.panel-heading').text();
  saveObject.link = article.children('.panel-body').children('.col-sm-9').children('a').attr('href');
  console.log(saveObject);
  $.post('/articles', saveObject, function(){
    $('#modal-content').html('<h3>Article Saved.</h3>')
    $('#myModal').modal('toggle')
  });
}