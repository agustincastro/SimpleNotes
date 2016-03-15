
//Jquery DOM variables for commonly used nodes, more performant
var $newNoteButton = $("#new-note");
var $noteTemplate = $("#note-template");
var $notesContainer = $("#notes-container");
//var $noteDeleteButton = $("#delete-note");


//Create new note
$newNoteButton.click(function(event){
	var noteTemplate = $noteTemplate.clone();
	noteTemplate.removeClass("invisible");
	noteTemplate.find("#delete-note").on("click", DeleteNote);
	$notesContainer.append(noteTemplate);

  //TODO: Guardar la nota en storage  
});


//Delete note
function DeleteNote(event){
	var html = $(event.target);
	html.parent().slideUp(200, function()
	{
		$(this).remove();
	});

	//$notesContainer.
	//TODO: Borrar la nota del storage y dsps hace el 
	//borrado de html
};


//HELPERS
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};




// CHROME STORAGE
// refer to https://developer.chrome.com/extensions/storage


//Generates random alphanumeric string to use as Id if notes
function generateID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx'.replace(/[xy]/g,function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid.toUpperCase();
};


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




