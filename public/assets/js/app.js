// Grab the articles as a json
$('#scraper').on('click', populateArticles );
$(document).on('click', '.save', saveArticle);

function populateArticles() {
  
  event.preventDefault();
  console.log('clicked') 

  $.getJSON("/scrape", function(articles) {
    $('#modal-content').html('<h2>Scrape Complete.</h2>');
    $('#myModal').modal('toggle');
    $('#articles').empty();
    
    for(let i = 0; i < articles.length; i++) {
      addArticle( articles[i] );
    }
  });  
}

function addArticle(article){
  let id = guidGenerator();
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
  saveButton.addClass('btn btn-success save pull-right')
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
  //I realize now, I would've been better off using data- attributes on the div on creation
  //could have saved my self a lot of time and made this infinitely clearer
  saveObject.title = article.children('.panel-heading').text();
  saveObject.link = article.children('.panel-body').children('.col-sm-9').children('a').attr('href');
  console.log('title', saveObject.title);
  console.log('link', saveObject.link);
  $.post('/articles', saveObject, function(){

    $('#modal-content').html('<h2>Article Saved.</h2>')
    $('#myModal').modal();
  });
}

//function for random unique id
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

//the below keeps the modal centered even when resized, etc
function setModalMaxHeight(element) {
  this.$element     = $(element);  
  this.$content     = this.$element.find('.modal-content');
  var borderWidth   = this.$content.outerHeight() - this.$content.innerHeight();
  var dialogMargin  = $(window).width() < 768 ? 20 : 60;
  var contentHeight = $(window).height() - (dialogMargin + borderWidth);
  var headerHeight  = this.$element.find('.modal-header').outerHeight() || 0;
  var footerHeight  = this.$element.find('.modal-footer').outerHeight() || 0;
  var maxHeight     = contentHeight - (headerHeight + footerHeight);

  this.$content.css({
      'overflow': 'hidden'
  });

  this.$element
    .find('.modal-body').css({
      'max-height': maxHeight,
      'overflow-y': 'auto'
  });
}

$('#myModal').on('show.bs.modal', function() {
  $(this).show();
  setModalMaxHeight(this);
});

$(window).resize(function() {
  if ($('.modal.in').length != 0) {
    setModalMaxHeight($('.modal.in'));
  }
});