var note = null;
var txtarea = null;
var offset_x = 0;
var offset_y = 0;
var noteid = 0;

var notes = init();
notes.forEach(function(element) {
    createNote(element.note_id,element.x,element.y,element.text);
});

addEventListener("mousemove",function(event){
    if(note !== null) {
        note.style.left = (event.clientX - offset_x) + "px";
        note.style.top = (event.clientY - offset_y) + "px";
    }

});

function createNote(id,x,y,text) {
    var ta = document.createElement("textarea");
    ta.addEventListener("click",function(event) {
        txtarea = this;
        event.stopPropagation();
    });
    
    ta.addEventListener("mousemove",function(event) {
        event.stopPropagation();
    });

    ta.addEventListener("blur",function(event) {
        noteupload(this.parentNode.id,this.value,this.parentNode.style.left.replace("px",""),this.parentNode.style.top.replace("px",""));
    });
    
    ta.value = text;

    var dv = document.createElement("div");
    dv.addEventListener("mousedown",function(event) {
        note = this;
        var rect = dv.getBoundingClientRect();
        offset_x = event.clientX - rect.left;
        offset_y = event.clientY - rect.top;

        var other_notes = document.querySelectorAll("div");
        for(i=0;i<other_notes.length;i++) {
            other_notes[i].style.zIndex = 1;
        }
        this.style.zIndex = 2;
    });

    dv.addEventListener("mouseup",function(event) {
        note = null;
        var ta = this.getElementsByTagName("textarea");
        if(ta.length > 0) {
            noteupload(this.id,ta[0].value,this.style.left.replace("px",""),this.style.top.replace("px",""));
        }
    });
    dv.appendChild(ta);
    dv.id = id;
    dv.style.left = x + "px";
    dv.style.top = y + "px";
    document.body.appendChild(dv);
}
            
var newNote = document.getElementById("new_note");
newNote.addEventListener("click",function() {
    var other_notes = document.querySelectorAll("div");
    var number_id,max_number_id = 0;
    for(i=0;i<other_notes.length;i++) {
        number_id = Number(other_notes[i].id.replace("note_",""));
        if(number_id > max_number_id) {
            max_number_id = number_id;
        }
    }
    max_number_id++;
    createNote("note_" + max_number_id,5,5,"");
});

document.body.onbeforeunload = function(){
    if(txtarea !== null) {
        noteupload(txtarea.parentNode.id,txtarea.value,txtarea.parentNode.style.left.replace("px",""),txtarea.parentNode.style.top.replace("px",""));
    }


}; 


