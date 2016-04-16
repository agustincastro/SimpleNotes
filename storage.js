// CHROME STORAGE
// refer to https://developer.chrome.com/extensions/storage

//var x= {'notes': [{"id1": {'title': 'mititulo', 'text': 'mitexto'}}, {"id2": {'title': 'mititulo2', 'text': 'mitexto2'}} ] };

function storage() {

    //Generates random alphanumeric string to use as Id of notes
    var generateID = function () {
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
    var save_note = function(title, text, callbackFunction) {
        var noteId = generateID();

        chrome.storage.sync.get('notes', function(data) {
         var noteData = {};
         if($.isEmptyObject(data)){
                //set notes first value
                noteData[noteId] = { 'title': title, 'text': text}
                chrome.storage.sync.set({'notes': [ noteData ] }, function() {
                    console.log("First note created, id: " + noteId);
                    callbackFunction(noteId);
                });
            }else{
                //already have notes array initialied
                noteData[noteId] = { 'title':title, 'text':text}
                //merges two objects recursively
                $.extend(true, data.notes, [ noteData ] );

                chrome.storage.sync.set( data, function() {
                    console.log("Note created, id: " + noteId);
                    callbackFunction(noteId);
                });
            }
        });
    };


    //Private implementation of updateNote
    var update_note = function(noteId, title, text){
        chrome.storage.sync.get('notes', function(data) {
          var noteData = {};
          if($.isEmptyObject(data)){
                //set notes first value
                noteData[noteId] = { 'title':title, 'text':text}
                chrome.storage.sync.set({'notes': [ noteData ] }, function() {
                    console.log("First note created in update, id: " + noteId);
                    return noteId;
                });
            }else{
                //already have notes array initialied
                noteData[noteId] = { 'title':title, 'text':text, 
                'color': data['notes'][0][noteId]['color']}
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
}


    //Private implementation of removeNote
    var remove_note = function(noteId, callbackFunction){
        chrome.storage.sync.get('notes', function(data) {
            if(!$.isEmptyObject(data)){
                //deletes the note
                delete data['notes'][0][noteId];
                chrome.storage.sync.set( data, function() {
                    console.log("Note deleted, id: " + noteId);
                    callbackFunction();
                });
            }
        });
    };    


     //Private implementation of updateNoteColor
     var update_note_color = function(noteId, color){
        chrome.storage.sync.get('notes', function(data) {
            if(!$.isEmptyObject(data)){
                var noteData = {};
                noteData[noteId] = { 'title':data['notes'][0][noteId]['title'], 
                'text':data['notes'][0][noteId]['text'], 'color': color}

                //deletes original object
                delete data['notes'][0][noteId];
                //merges two objects recursively
                $.extend(true, data.notes, [ noteData ] );

                chrome.storage.sync.set( data, function() {
                    console.log("Color updated, id: " + noteId);
                });    
            }
        });
    };   


    //Private implementation of removeAllNotes
    //Removes all notes as well as the checklists
    var remove_all_notes = function(callbackFunction){
        chrome.storage.sync.get('notes', function(data) {
            if(!$.isEmptyObject(data)){
                //deletes the note
                delete data['notes'][0];
                chrome.storage.sync.set( data, function() {
                    console.log("All notes removed");
                    callbackFunction();
                });
            }
        });
        chrome.storage.sync.get('checklists', function(data) {
            if(!$.isEmptyObject(data)){
                //deletes the note
                delete data['checklists'][0];
                chrome.storage.sync.set( data, function() {
                    console.log("All checklists removed");
                    callbackFunction();
                });
            }
        });
    };   


     //Private implementation of getNote
     var get_note = function(noteId){
        chrome.storage.sync.get('notes', function(data) {
            console.log("Note retrieved: "+ data['notes'][0][noteId]);
            return data['notes'][0][noteId];
        });
    };

     //Private implementation of getAllNotes
     var get_all_notes = function(callbackFunction) {
        chrome.storage.sync.get('notes', function(data) {
            if(!$.isEmptyObject(data)){
                var ret = data['notes'][0];
                callbackFunction(ret);
            }
        });
    };

     //Private implementation of getAllChecklists
     var get_all_checklists = function(callbackFunction){
        chrome.storage.sync.get('checklists', function(data) {
         if(!$.isEmptyObject(data)){
            var ret = data['checklists'][0];
            callbackFunction(ret);
        }
    });
    };


     //Private implementation of saveChecklist
     var save_checklist = function(callbackFunction){
        var checkId = generateID();
        var checkItemId = generateID();
        chrome.storage.sync.get('checklists', function(data) {
         var checkData = {};
         if($.isEmptyObject(data)){
                //set checklists first value
                debugger;
                checkData[checkId] = {};
                checkData[checkId][checkItemId] = {'title':'', 'checked':false};
                chrome.storage.sync.set({'checklists': [ checkData ] }, function() {
                    console.log("First check created, id: " + checkId);
                    callbackFunction(checkId, checkItemId);
                });
            }else{
                //already have notes array initialied
                debugger;
                checkData[checkId] = {};
                checkData[checkId][checkItemId] = {'title':'', 'checked':false};
                //merges two objects recursively
                $.extend(true, data.checklists, [ checkData ] );

                chrome.storage.sync.set( data, function() {
                    console.log("Check created, id: " + checkId);
                    callbackFunction(checkId, checkItemId);
                });
            }
        });
};


     //Private implementation of updateNote
     var update_check_title = function(checkId, checkItemId ,title){
        chrome.storage.sync.get('checklists', function(data) {
           var checkData = {};
           if($.isEmptyObject(data)){
                //set notes first value
                checkData[checkId] = {};
                checkData[checkId][checkItemId] = {'title':title, 'checked':false};
                chrome.storage.sync.set({'checklists': [ checkData ] }, function() {
                    console.log("First check created in update, id: " + checkId);
                    return checkId;
                });
            }else{
                //already have notes array initialied
                checkData[checkId] = {};
                checkData[checkId][checkItemId] = { 'title':title, 'checked':false};
                //deletes original object
                delete data['checklists'][0][checkId][checkItemId];
                //merges two objects recursively
                $.extend(true, data.checklists, [ checkData ] );

                chrome.storage.sync.set( data, function() {
                    console.log("Check updated, id: " + checkId);
                    return checkId;
                });
            }
        });
}


        var add_check = function(checkId, callbackFunction){
          var checkItemId = generateID();
          chrome.storage.sync.get('checklists', function(data) {
        //   var checkData = {};
        //    checkData[checkId] = {};
        //    checkData[checkId][checkItemId] = { 'title':'', 'checked':false};
           var checkData = {'title':'', 'checked':false};
           if($.isEmptyObject(data)){
                        //set notes first value
                        var check = {};
                        check[checkId] = {};
                        check[checkId][checkItemId] = checkData;
                        chrome.storage.sync.set({'checklists': check }, function() {
                            console.log("First check created in update, id: " + checkId);
                            callbackFunction(checkItemId);
                        });
                    }else{
                        //already have notes array initialied
                        data.checklists[0][checkId][checkItemId] = checkData;
                       // $.extend(true, data.checklists[checkId], checkData );

                        chrome.storage.sync.set( data, function() {
                            console.log("Check updated, id: " + checkId);
                            callbackFunction(checkItemId);
                        });
                    }
                });
        };

    //  ----- EXPOSED FUNCTIONS FOR DATA ACCESS LOGIC  ------

    this.holaMundo = function(){
        return 'Hola mundo';
    }

    //public save note function
    this.saveNote = function(title, text, callbackFunction){
        try{
            save_note(title, text, callbackFunction);
        }
        catch(err){
            console.log("Exception: save_note, Error: "+ err);
        }
    };


    //public get note function
    this.getNote = function(noteId){
        try{
            if(noteId && noteId.length == 8){
                return get_note(noteId);
            }
        }
        catch(err){
            console.log("Exception: get_note, Error: "+ err);
        }
        console.log("Error: getNote invalid noteId: "+ noteId);
        return "";
    };
    

    //public get all notes function
    this.getAllNotes = function(callbackFunction){
        try{
            get_all_notes(callbackFunction);
        }
        catch(err){
          console.log("Exception: get_all_notes, Error: "+ err);
      }
  };

  
  this.updateNote = function(noteId, title, text){
    try{
        if((noteId && noteId.length == 8) && (title || text)) {
            return update_note(noteId, title, text);
        }
    }   
    catch(err){
        console.log("Exception: get_note, Error: "+ err);
    }
    console.log("Error: getNote invalid noteId: "+ noteId);
};


this.removeNote = function(noteId, callbackFunction){
    try{
        if(noteId && noteId.length == 8){
            remove_note(noteId, callbackFunction);
        }
    }
    catch(err){
      console.log("Exception: remove_note, Error: "+ err);
  }
};


this.removeAllNotes = function(callbackFunction){
    try{
        remove_all_notes(callbackFunction);
    }
    catch(err){
      console.log("Exception: remove_note, Error: "+ err);
  }
};

this.updateNoteColor = function(noteId, color){
    try{
        update_note_color(noteId, color);
    }
    catch(err){
        console.log("Exception: update_note_color, Error: "+ err);
    }
};


// Checklist Functions

this.saveChecklist = function(callbackFunction){
    try{
        save_checklist(callbackFunction);
    }catch(err){
     console.log("Exception: save_checklist, Error: "+ err);
 }
};

this.updateCheckTitle = function(checkId, checkItemId ,title){
    try{
        if(checkId && checkId.length == 8 && title) {
            update_check_title(checkId, checkItemId, title);
        }
    }   
    catch(err){
        console.log("Exception: update_check_title, Error: "+ err);
    }
};

    //public get all notes function
    this.getAllChecklists = function(callbackFunction){
        try{
            get_all_checklists(callbackFunction);
        }
        catch(err){
          console.log("Exception: get_all_checklists, Error: "+ err);
      }
  };

  this.addCheck = function(checkId, callbackFunction){
    try{
       if(checkId && checkId.length == 8) {
        add_check(checkId, callbackFunction);
    }
}
catch(err){
  console.log("Exception: get_all_checklists, Error: "+ err);
}

};


}



