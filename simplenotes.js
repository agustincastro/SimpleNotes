
//Jquery DOM variables for commonly used nodes, more performant
var $newNoteButton = $("#new-note");
var $noteTemplate = $("#note-template");
var $reloadButton = $("#reload");

var $notesContainer = $("#notes-container");

var storage = new storage();   // to ease testing


function ping(){
	storage.holaMundo();
}


// Sets the interactions of the different types of notes
function assignActions(reciever, type){
	if(type == 'note'){
		reciever.find("#delete-note").on("click", DeleteNote);
		reciever.find("#note-title").bind("keyup change", textChanged);
		reciever.find("#note-text").bind("keyup change", textChanged);
	}else{
		console.log('c est fini');
	}

};


//Renders all notes stored in chrome storage
function refreshNotes(){
	storage.getAllNotes(function(storedNotes){

		//Callback
		$.each(storedNotes, function(k, v) {
			var noteTemplate = $noteTemplate.clone();
			noteTemplate.removeClass("invisible");
			//Set actions
			assignActions(noteTemplate, 'note');

			var noteId = k;
			var note = v;

			if(noteId && noteId.length == 8){
				noteTemplate.attr('data-id', noteId);
			}
			noteTemplate.find('#note-title').val(note['title']);
			noteTemplate.find('#note-text').val(note['text']);

			$notesContainer.append(noteTemplate);
		});

	});
};

//Update text of note
function textChanged(event){
	var html = $(event.target);
	var noteId = html.parent().attr('data-id'); 
	var text = html.parent().find('#note-text').val();
	var title = html.parent().find('#note-title').val();

	storage.updateNote(noteId, title, text); 
};


//Document.ready shorthand
//Load up notes and settings
$(function() {
	refreshNotes();
});

//Reloads all notes .... agrega loader
$reloadButton.click(function(event){
	refreshNotes();
});


//Create new note
$newNoteButton.click(function(event){
	var noteTemplate = $noteTemplate.clone();
	noteTemplate.removeClass("invisible");

	//Set actions
	assignActions(noteTemplate, 'note');

	storage.saveNote('', '', function(noteId){
		if(noteId && noteId.length == 8){
			noteTemplate.attr('data-id', noteId);
			$notesContainer.append(noteTemplate);
		}
	});
});



//Delete note
function DeleteNote(event){
	var html = $(event.target);
	var noteId = html.parent().attr('data-id');	

	storage.removeNote(noteId, function(){
		html.parent().slideUp(200, function()
		{
			$(this).remove();
		});
	});
};


//HELPERS
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};








