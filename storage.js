// CHROME STORAGE
// refer to https://developer.chrome.com/extensions/storage

//var x= {'notes': [{"id1": {'title': 'mititulo', 'text': 'mitexto'}}, {"id2": {'title': 'mititulo2', 'text': 'mitexto2'}} ] };

function storage()
{
	var notes;


    //Generates random alphanumeric string to use as Id of notes
    var generateID = function() {
    	var d = new Date().getTime();
    	var uuid = 'xxxxxxxx'.replace(/[xy]/g,function(c) {
    		var r = (d + Math.random()*16)%16 | 0;
    		d = Math.floor(d/16);
    		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    	});
    	return uuid.toUpperCase();
    };


    //  ----- CONCRETE IMPLEMENTARIONS FOR DATA ACCESS LOGIC  ------

    //Private implementation of saveNote
    var save_note = function(title, text) 
    {
    	var noteId = generateID();

    	chrome.storage.sync.get('notes', function(data) {
    		if($.isEmptyObject(data)){
    			//set notes first value
    			var noteData = {};
    			noteData[noteId] = { 'title':title, 'text':text}
    			chrome.storage.sync.set({'notes': [ noteData ] }, function() {
    				console.log("First note created, id: " + noteId);
    				return noteId;
    			});
    		}else{
    			//already have notes array initialied
    			var noteData = {};
    			noteData[noteId] = { 'title':title, 'text':text}
    			//merges two objects recursively
    			$.extend(true, data.notes, [ noteData ] );

    			chrome.storage.sync.set( data, function() {
    				console.log("Note created, id: " + noteId);
    				return noteId;
    			});
    		}
    	});
    };


    //Private implementation of updateNote
    var update_note = function(noteId, title, text) 
    {
        chrome.storage.sync.get('notes', function(data) {
            if($.isEmptyObject(data)){
                //set notes first value
                var noteData = {};
                noteData[noteId] = { 'title':title, 'text':text}
                chrome.storage.sync.set({'notes': [ noteData ] }, function() {
                    console.log("First note created in update, id: " + noteId);
                    return noteId;
                });
            }else{
                //already have notes array initialied
                var noteData = {};
                noteData[noteId] = { 'title':title, 'text':text}
                //deletes original object
                delete data['notes'][0][noteId];
                //merges two objects recursively
                $.extend(true, data.notes, [ noteData ] );

                chrome.storage.sync.set( data, function() {
                    console.log("Note updated, id: " + noteId);
                    return noteId;
                });
            }
        });
    };


     //Private implementation of getNote
     var get_note = function(noteId) 
     {

     	chrome.storage.sync.get('notes', function(data) {
     		console.log("Note retrieved: "+ data['notes'][0][noteId]);
     		return data['notes'][0][noteId];
     	});
     };

     //Private implementation of getAllNotes
     var get_all_notes = function() 
     {
     	chrome.storage.sync.get('notes', function(data) {
     		console.log("Notes retrieved: "+ data['notes'][0]);
     		return data['notes'][0];
        });
     };




    //  ----- EXPOSED FUNCTIONS FOR DATA ACCESS LOGIC  ------

    //public save note function
    this.saveNote = function(title, text)
    {
    	try{
    		if(title || text){
    			return save_note(title, text);
    		}
    	}
    	catch(err){
    		console.log("Exception: save_note, Error: "+ err);
    	};
    	return "";
    };


    //public get note function
    this.getNote = function(noteId)
    {
    	try{
    		if(noteId && noteId.length == 8){
    			return get_note(noteId);
    		}
    	}
    	catch(err){
    		console.log("Exception: get_note, Error: "+ err);
    	};
    	console.log("Error: getNote invalid noteId: "+ noteId);
    	return "";
    };
    

    //public get all notes function
    this.getAllNotes = function()
    {
    	try{
    		return get_all_notes();
    	}
    	catch(err){
    		console.log("Exception: get_all_notes, Error: "+ err);
    	};
    	return "";
    };


        this.updateNote = function(noteId, title, text)
    {
        try{
            if((noteId && noteId.length == 8) && (title || text)) {
                return update_note(noteId, title, text);
            }
        }
        catch(err){
            console.log("Exception: get_note, Error: "+ err);
        };
        console.log("Error: getNote invalid noteId: "+ noteId);
        return "";
    };

    this.holaMundo = function(){
        return 'Hola mundo';
    }


};







