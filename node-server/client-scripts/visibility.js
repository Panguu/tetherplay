function toggleIDVisibility(id){
    var obj = document.getElementById(id);
    var classes = obj.classList;
    classes.toggle('hidden');
    
}
function showIDVisibility(id){
    var obj = document.getElementById(id);
    var classes = obj.classList;
    classes.add('hidden');
    
}
function hideIDVisibility(id){
    var obj = document.getElementById(id);
    var classes = obj.classList;
    classes.remove('hidden');
    
}
function toggleClassVisibility(classname){
    var elem = document.getElementsByClassName(classname),
        clsslst = elem.classList;
    clsslst.toggle('hidden');
}
function toggleParentIDVisibility(id){
    var obj = parent.document.getElementById(id);
    var classes = obj.classList;
    classes.toggle('hidden'); 
}

