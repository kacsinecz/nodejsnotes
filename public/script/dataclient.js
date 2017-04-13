function init() {
    var req = new XMLHttpRequest();
    req.open("GET", "init", false);
    req.send(null);
    var obj = JSON.parse(req.responseText);
    return obj.notes;
}

function noteupload(id,text,x,y) {
    var req = new XMLHttpRequest();
    req.open("PUT","noteupload/?id=" + id + "&text=" + text + "&x=" + x + "&y=" + y,false);
    req.send(null);
}



