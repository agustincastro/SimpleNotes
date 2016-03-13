
var $newNoteButton = $("#new-note");
var $noteTemplate = $("#note-template");
var $notesContainer = $("#notes-container");



//Create new note
$newNoteButton.click(function(event){
  var noteTemplate = $noteTemplate.clone();
  noteTemplate.removeClass("invisible");
  $notesContainer.append(noteTemplate);
  console.log("golazo!");
});



//HELPERS
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};