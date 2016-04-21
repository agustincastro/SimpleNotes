
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
};


// Sets the interactions of the different types of notes
function assignActions(reciever, type){
	if(type == 'note'){
	//	reciever.find("#delete-note").on("click", DeleteNote);
		reciever.find(".delete").on("click", DeleteNote);
		reciever.find("#note-title").bind("keyup change", textChanged);
		reciever.find("#note-text").bind("keyup change", textChanged);
		reciever.find(".color-note").on("click", changeNoteColor);
	}else if(type == 'checklist'){
		reciever.find("#new-check").on("click", addCheck);
		reciever.find(".check-input").on("click", crossOut);
		reciever.find("#check-title").bind("keyup change", checkTextChanged);
		reciever.find(".delete").on("click", deleteChecklist);
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
			var noteTitle = noteTemplate.find('#note-title');
			var noteText = noteTemplate.find('#note-text');
			noteTitle.val(note['title']);
			noteText.val(note['text']);
			//Set corresponding note color
			noteTemplate.css('background-color', note['color']);
			noteTemplate.find('#note-title').css('background-color', note['color']);
			noteTemplate.find('#note-text').css('background-color', note['color']);


			$notesContainer.append(noteTemplate);
		});

	});
};

//renders all checklists in chrome storage
function refreshChecklists(){
	storage.getAllChecklists(function(storedChecklists){
		//Callback
		$.each(storedChecklists, function(k, v) {
			var checkTemplate = $checklistTemplate.clone();
			var checkItemContainer = checkTemplate.find('#check-container').clone();
			checkTemplate.removeClass("invisible");
			//Set actions
			var checkId = k;
			var check = v;
			if(checkId && checkId.length == 8){
				checkTemplate.attr('data-id', checkId);
			}

			// Assign each individual check
			var checkItemsContainer = checkTemplate.find('#checklist-container');
			//Removes first todo item inside the template
			checkItemsContainer.children().empty();

			var isChecked;
			$.each(check, function (key, data){	
				var checkItem = checkItemContainer.clone();
				var checkInput = checkItem.find('.check-input');
				var checkText = checkItem.find('#check-title');
				if(key && key.length == 8){
					checkItem.attr('data-check-id',key);
				}
				checkText.val(data['title']);
				checked = data['checked'];
				
				if(checked){
					checkInput.prop('checked', true);
					checkText.css('text-decoration','line-through');
				}else{
					checkInput.prop('checked', false);
					checkText.css('text-decoration','initial');	
				}
				checkItemsContainer.append(checkItem);
			});
			$notesContainer.append(checkTemplate);
			assignActions(checkTemplate, 'checklist');
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
	var noteId = html.closest('#note-template').attr('data-id');

	storage.removeNote(noteId, function(){
		html.closest('#note-template').slideUp(200, function()
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
	
	var noteId = $note.attr('data-id');
	
	storage.updateNoteColor(noteId, selectedColor);

};

//Crossout of todo check
function crossOut(event){
	var target = $(event.target);
	var checkId = target.closest('#checklist-template').attr('data-id'); 
	var checkItemId = target.closest('#check-container').attr('data-check-id');
	if( $(this).is(':checked') ) {
		storage.crossOut(checkId, checkItemId, function(){
			$(event.target).siblings('#check-title').css('text-decoration','line-through');
		});
	}else{
		storage.crossOut(checkId, checkItemId, function(){
			$(event.target).siblings('#check-title').css('text-decoration','initial');
		});
	}
};


// Create new check in checklist
function addCheck(event){
	var checklistClone = $(event.target).parent();
	var checkId = checklistClone.attr('data-id')
	
	storage.addCheck(checkId, function(checkItemId){
		var check = $checklistTemplate.find('#check-container').clone();
		check.attr('data-check-id', checkItemId);
		check.find(".check-input").on("click", crossOut);
		checklistClone.find('#checklist-container').append(check);
	});
};


//Removes selected checklist
function deleteChecklist(event){
	var html = $(event.target);
	var checkId = html.closest('#checklist-template').attr('data-id');
	storage.removeChecklist(checkId, function(){
		html.closest('#checklist-template').slideUp(200, function(){
			$(this).remove();
		});
	});
};


//Document.ready shorthand
//Load up notes and settings
$(function() {
	refreshNotes();
	refreshChecklists();
	refreshQuote();
});

//Reloads all notes .... add loader
$reloadButton.click(function(event){
	$notesContainer.empty();
	refreshNotes();
	refreshChecklists();
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
	//$notesContainer.append(checkListTemplate);
	storage.saveChecklist(function(checkId, firstItemId){
		debugger;
		if(checkId && checkId.length == 8){
			checkListTemplate.attr('data-id', checkId);
			checkListTemplate.find('#check-container').attr('data-check-id', firstItemId);
			$notesContainer.append(checkListTemplate);
		}
	});
});


//Update checkItem text
function checkTextChanged(event){
	var html = $(event.target);
	var checkId = html.closest('#checklist-template').attr('data-id'); 
	var checkItemId = html.closest('#check-container').attr('data-check-id');
	var text = html.parent().find('#check-title').val();
	storage.updateCheckTitle(checkId, checkItemId, text); 
};



//HELPERS
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};








