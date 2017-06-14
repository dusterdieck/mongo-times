$(document).on('click', '.delete', deleteArticle);
$(document).on('click', '.notes', displayNotesArea);
$(document).on('click', '.save-note', addNote);
$(document).on('click', '.delete-note', deleteNote);

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
  notesButton.addClass('btn btn-info notes pull-right')
             .attr('articleId', id)
             .text('Notes');

  let deleteButton = $('<button/>')
  deleteButton.addClass('btn btn-danger delete pull-right')
            .attr('articleId', id)
            .text('Delete');
  buttonDiv.append(deleteButton)
           .append(notesButton)
           

  body.append(buttonDiv);

  newArticle.append(body);
  $('#articles').append(newArticle);
}

function displayNotesArea( event, _id ) {
  let articleId = _id || $(this).attr('articleId');

  $.getJSON(`/articles/${articleId}`, function( article ){
    let notes = populateNotes( article );
    let form = notesInput( articleId );

    $('#modal-content').empty()
                       .append( notes )
                       .append( form );
    $('#myModal').modal();
  });  
}

function notesInput( articleId ) {
  let form = $('<form/>');
  form.addClass('form-group');

  let label = $('<label/>');
  label.attr('for', 'note-input')
       .text('Note:');

  let textArea = $('<textarea/>');
  textArea.addClass('form-control')
          .attr('row', '2')
          .attr('id', 'note-input')

  let saveButton = $('<button/>')
  saveButton.addClass('btn btn-success save-note pull-right')
            .attr('articleId', articleId)
            .text('Save');

  form.append( label )
      .append( textArea )
      .append( saveButton );

  return form;
}

function populateNotes( article ) {
  let notes = article.notes;
  let articleId = article._id;
  let notesDiv = $('<div/>')
  for(let i = 0; i < notes.length; i++){
    let {body, _id} = notes[i];

    let note = $('<div/>')
    note.addClass('well row  vcenter')
        .attr('id', _id);

    let text = $('<div/>')
    text.addClass('col-sm-10')
        .text( body );

    let buttonDiv = $('<div/>')
    buttonDiv.addClass('col-sm-2');
    let deleteBtn = $('<span/>')
    deleteBtn.addClass('glyphicon glyphicon-trash red delete-note pull-right')
             .attr('noteId', _id )
    buttonDiv.append( deleteBtn )

    note.append(text)
        .append(buttonDiv);

    notesDiv.append(note);       
  }

  return notesDiv;
}

function addNote(){
  event.preventDefault();
  let body = $('#note-input').val().trim();
  if( body == '') { return; }
  let articleId = $(this).attr('articleId');

  $.post(`/articles/${articleId}`, { body }, function( newNote ){
    displayNotesArea(null, articleId)
  });
}

function deleteNote(){
  let noteId = $(this).attr('noteId');
  $.ajax({
    url: '/notes/' + noteId,
    type: 'DELETE'
  }).done(function( data ) {
    $('#' + noteId).remove();
  })
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

//functions found on stack overflow
//when coupled with the modal css keeps modal centered
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