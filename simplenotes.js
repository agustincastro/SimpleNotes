
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




// CHROME STORAGE
// refer to https://developer.chrome.com/extensions/storage

function saveChanges() {
        // Get a value saved in a form.
        var theValue = textarea.value;
        // Check that there's some code there.
        if (!theValue) {
          message('Error: No value specified');
          return;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'value': theValue}, function() {
          // Notify that we saved.
          message('Settings saved');
        });
      };




