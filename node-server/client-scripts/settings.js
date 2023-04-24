function buttonSize(){
    var slider = document.getElementById('button-slider');
    parent.document.documentElement.style.setProperty('--button-diameter', `${slider.value/3}em`);
    document.documentElement.style.setProperty('--button-diameter', `${slider.value/3}em`);
}
function reachSize(){
    var slider = document.getElementById('reach-slider');
    parent.document.documentElement.style.setProperty('--reach', `calc(var(--button-diameter)*${slider.value}`);
}

function toggleDarkMode(){
    var elem = parent.document.body;
    elem.classList.toggle("dark-mode");
    document.body.classList.toggle("dark-mode");
}
function toggleGPMode(){
    var elem = parent.document.body;
    elem.classList.toggle("ps");
}

function gamePadbuttons(className){
    var north = parent.document.getElementById('gp-north').classList;
    var east = parent.document.getElementById('gp-east').classList;
    var gamepad = parent.document.getElementById('gamepad').classList;
    if (className == "of-2"){
        north.add('hidden');
        east.add('hidden');
        gamepad.remove('of-3') || gamepad.remove('of-4');
        gamepad.add('of-2');
    } else if (className == "of-3"){
        east.remove('hidden');
        north.add('hidden');
        gamepad.remove('of-2') || gamepad.remove('of-4');
        gamepad.add('of-3');
    } else {
        east.remove('hidden');
        north.remove('hidden');
        gamepad.remove('of-2') || gamepad.remove('of-3');
        gamepad.add('of-4');
    }
}

