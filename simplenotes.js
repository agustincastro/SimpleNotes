
//Jquery DOM variables for commonly used nodes, more performant
var $newNoteButton = $("#new-note");
var $newCheckButton = $("#new-checklist");
var $noteTemplate = $("#note-template");
var $checklistTemplate = $("#checklist-template");
var $reloadButton = $("#reload");
var $removeAllButton = $("#remove-all");
var $quoteContainer = $("#quote-container");

var $notesContainer = $("#notes-container");

var storage = new storage();   // to ease testing
vex.defaultOptions.className = 'vex-theme-os'; // Initializes vex theme


function ping(){
	storage.holaMundo();
}


// Sets the interactions of the different types of notes
function assignActions(reciever, type){
	if(type == 'note'){
		reciever.find("#delete-note").on("click", DeleteNote);
		reciever.find("#note-title").bind("keyup change", textChanged);
		reciever.find("#note-text").bind("keyup change", textChanged);
		reciever.find(".color-note").on("click", changeNoteColor);
	}else if(type == 'checklist'){
		reciever.find("#new-check").on("click", addCheck);
		reciever.find(".check-input").on("click", crossOut);
	}else{
		console.log('c est fini');
	}

};


//Get new quote
function refreshQuote(){
	var randomQuote = getQuote();
	$quoteContainer.find("p").text('"'+randomQuote['quote']+'"');
	$quoteContainer.find("label").text(randomQuote['author']);
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


//Change Note color
function changeNoteColor(event){
	var selectedColor = $(event.target).attr("data-color");
	var $note = $(event.target).closest('.note');
	$note.css('background-color', selectedColor);
	$note.find('#note-title').css('background-color', selectedColor);
	$note.find('#note-text').css('background-color', selectedColor);
	

	//TODO: Mejorar los colores y guardar en el json de la nota

};

//Crossout of todo check
function crossOut(event){
	if( $(this).is(':checked') ) {
		$(event.target).siblings('#check-title').css('text-decoration','line-through');
	}else{
		$(event.target).siblings('#check-title').css('text-decoration','initial');
	}
};


// Create new check in checklist
function addCheck(event){
	var check = $checklistTemplate.find('#check-container').clone();
	check.find(".check-input").on("click", crossOut);
	var html = $(event.target).parent();
	html.find('#checklist-contaimer').append(check);
};


//Document.ready shorthand
//Load up notes and settings
$(function() {
	refreshNotes();
	refreshQuote();
});

//Reloads all notes .... agrega loader
$reloadButton.click(function(event){
	$notesContainer.empty();
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

// Delete all notes
$removeAllButton.click(function(){
	//Banzaiii
	vex.dialog.confirm({
		message: 'Are you sure you want to delete all notes?',
		callback: function(value) {
			if(value){
				storage.removeAllNotes(function(result){
					// TODO: verificar result y hacer alguna animacion
					$notesContainer.empty();
					refreshNotes();	
				});
			}
		}
	});

});

//Create new Checklist
$newCheckButton.click(function(event){
	var checkListTemplate = $checklistTemplate.clone();
	checkListTemplate.removeClass("invisible");
	//Set actions
	assignActions(checkListTemplate, 'checklist');
	$notesContainer.append(checkListTemplate);
	// storage.saveNote('', '', function(noteId){
	// 	if(noteId && noteId.length == 8){
	// 		noteTemplate.attr('data-id', noteId);
	// 		$notesContainer.append(noteTemplate);
	// 	}
	// });
});




//HELPERS
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};








