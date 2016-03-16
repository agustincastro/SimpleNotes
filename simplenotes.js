
//Jquery DOM variables for commonly used nodes, more performant
var $newNoteButton = $("#new-note");
var $noteTemplate = $("#note-template");
var $reloadButton = $("#reload");

var $notesContainer = $("#notes-container");

var storage = new storage();   // to ease testing


//Document.ready shorthand
//Load up notes and settings
// $(function() {

// 	var storedNotes = storage.getAllNotes();
// 	$.each(storedNotes, function(k, v) {
// 		var noteTemplate = $noteTemplate.clone();
// 		noteTemplate.removeClass("invisible");
// 		noteTemplate.find("#delete-note").on("click", DeleteNote);

// 		var noteId = k;
// 		var notes = v;

// 		if(noteId && noteId.length == 8){
// 			noteTemplate.attr('data-id', noteId);
// 		}
// 		$notesContainer.find('#note-title').html(notes['title']);
// 		$notesContainer.find('#note-text').html(notes['text']);

// 		$notesContainer.append(noteTemplate);
// 	});
// });


$reloadButton.click(function(event){

		var hi = storage.holaMundo();

		var storedNotes = storage.getAllNotes();
		$.each(storedNotes, function(k, v) {
		var noteTemplate = $noteTemplate.clone();
		noteTemplate.removeClass("invisible");
		noteTemplate.find("#delete-note").on("click", DeleteNote);

		var noteId = k;
		var notes = v;

		if(noteId && noteId.length == 8){
			noteTemplate.attr('data-id', noteId);
		}
		$notesContainer.find('#note-title').html(notes['title']);
		$notesContainer.find('#note-text').html(notes['text']);

		$notesContainer.append(noteTemplate);
	});

});


//Create new note
$newNoteButton.click(function(event){
	var noteTemplate = $noteTemplate.clone();
	noteTemplate.removeClass("invisible");
	noteTemplate.find("#delete-note").on("click", DeleteNote);

	var noteId = storage.saveNote('', '');

	if(noteId && noteId.length == 8){
		noteTemplate.attr('data-id', noteId);
	}

	$notesContainer.append(noteTemplate);

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








