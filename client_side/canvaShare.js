window.onload=setup;
function setup() {
    req=new XMLHttpRequest();
    req1=new XMLHttpRequest();
}

//////////-=Requests=-/////////////////
var firstTime = true;

function getCode() {
    var query = window.location.search.substring(1);
    var vars = query.split("=");
    var ID= vars[1];
    return ID;
}

getCode();

function getCurrImg() {
    //https://cpsc.hiram.edu/jacobsdj/canvas
    if (!drawing) {
        req.open("GET","https://cpsc.hiram.edu/jacobsdj/canvas/id="+getCode());
        //http://localhost:5002/canvas/id="+getCode()
        req.addEventListener("load",handleGetImage);
        req.send();
    }
    
}


function sendCurrImg() {
    if (!drawing && !firstTime) {
        req1.open("POST","https://cpsc.hiram.edu/jacobsdj/canvas/id="+getCode());
        //http://localhost:5002/canvas/id="+getCode()
        req1.addEventListener("load",handleSendResponse);
        req1.setRequestHeader("Content-Type", "application/json");

        //-=-=-=-=-==-==--=-=-=--=-=-=-
        let yah = document.getElementById('canvas-area2');
        let blah = croquis.createFlattenThumbnail();
        //console.log(blah);

        var image = new Image();
        image.id = "pic";
        image.src = blah.toDataURL();
        //console.log(blah.toDataURL());

        var reqBody = {
            img: blah.toDataURL()
        
        }

        //console.log(JSON.stringify(reqBody));
        req1.send(JSON.stringify(reqBody));
        

    }
    

}

// var a = setInterval(getCurrImg,300);
// var b = setInterval(sendCurrImg,350);
var drawing = false;



////////////-=Responses=-////////////////

function handleGetImage() {
    console.log("Canvas Recieved");


    let sen = JSON.parse(req.response);

    let image = new Image();
    image.src = sen.img;

    let yah = document.getElementById('canvas-area2');

    let canv = document.getElementById('painting');
    ctx = canv.getContext('2d');
    ctx.drawImage(image,0,0);

    firstTime = false;

    // yah.innerHTML="";
    // yah.appendChild(image);

    
}

function handleSendResponse() {
    console.log("Canvas was sent");

}



// Initialize croquis functions from Croquis.js library.
var croquis = new Croquis();
croquis.lockHistory();
croquis.setCanvasSize(800, 800);
croquis.addLayer();
croquis.fillLayer('#fff');
croquis.addLayer();
croquis.selectLayer(1);
croquis.unlockHistory();


var brush = new Croquis.Brush();
brush.setSize(40);
brush.setColor('#000');
brush.setSpacing(0.2);

croquis.setTool(brush);
croquis.setToolStabilizeLevel(10);
croquis.setToolStabilizeWeight(0);

var croquisDOMElement = croquis.getDOMElement();
var canvasArea = document.getElementById('canvas-area');
canvasArea.appendChild(croquisDOMElement);



function canvasPointerDown(e) {
    drawing = true;
    setPointerEvent(e);
    var pointerPosition = getRelativePosition(e.clientX, e.clientY);
    if (pointerEventsNone)
        canvasArea.style.setProperty('cursor', 'none');
    if (e.pointerType === "pen" && e.button == 5)
        croquis.setPaintingKnockout(true);
    croquis.down(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
    document.addEventListener('pointermove', canvasPointerMove);
    document.addEventListener('pointerup', canvasPointerUp);
    
    
}



function canvasPointerMove(e) {
    setPointerEvent(e);
    var pointerPosition = getRelativePosition(e.clientX, e.clientY);
    croquis.move(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
    
}
function canvasPointerUp(e) {
    setPointerEvent(e);
    var pointerPosition = getRelativePosition(e.clientX, e.clientY);
    if (pointerEventsNone)
        canvasArea.style.setProperty('cursor', 'crosshair');
    croquis.up(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
    if (e.pointerType === "pen" && e.button == 5)
        setTimeout(function() {croquis.setPaintingKnockout(selectEraserCheckbox.checked)}, 30);//timeout should be longer than 20 (knockoutTickInterval in Croquis)
    document.removeEventListener('pointermove', canvasPointerMove);
    document.removeEventListener('pointerup', canvasPointerUp);
    drawing = false;
    //firstTime = false;
    
}
function getRelativePosition(absoluteX, absoluteY) {
    var rect = croquisDOMElement.getBoundingClientRect();
    return {x: absoluteX - rect.left, y: absoluteY - rect.top};
}
croquisDOMElement.addEventListener('pointerdown', canvasPointerDown);




//brush images
var circleBrush = document.getElementById('circle-brush');
var brushImages = document.getElementsByClassName('brush-image');
var currentBrush = circleBrush;

Array.prototype.map.call(brushImages, function (brush) {
    brush.addEventListener('pointerdown', brushImagePointerDown);
});

function brushImagePointerDown(e) {
    var image = e.currentTarget;
    currentBrush.className = 'brush-image';
    image.className = 'brush-image on';
    currentBrush = image;
    if (image == circleBrush)
        image = null;
    brush.setImage(image);
    updatePointer();
}

// checking pointer-events property support
var pointerEventsNone = document.documentElement.style.pointerEvents !== undefined;

//brush pointer
var brushPointerContainer = document.createElement('div');
brushPointerContainer.className = 'brush-pointer';

if (pointerEventsNone) {
    croquisDOMElement.addEventListener('pointerover', function () {
        croquisDOMElement.addEventListener('pointermove', croquisPointerMove);
        document.body.appendChild(brushPointerContainer);
    });
    croquisDOMElement.addEventListener('pointerout', function () {
        croquisDOMElement.removeEventListener('pointermove', croquisPointerMove);
        brushPointerContainer.parentElement.removeChild(brushPointerContainer);
    });
}

function croquisPointerMove(e) {
    if (pointerEventsNone) {
        var x = e.clientX + window.pageXOffset;
        var y = e.clientY + window.pageYOffset;
        brushPointerContainer.style.setProperty('left', x + 'px');
        brushPointerContainer.style.setProperty('top', y + 'px');
    }
}

function updatePointer() {
    if (pointerEventsNone) {
        var image = currentBrush;
        var threshold;
        if (currentBrush == circleBrush) {
            image = null;
            threshold = 0xff;
        }
        else {
            threshold = 0x30;
        }
        var brushPointer = Croquis.createBrushPointer(
            image, brush.getSize(), brush.getAngle(), threshold, true);
        brushPointer.style.setProperty('margin-left',
            '-' + (brushPointer.width * 0.5) + 'px');
        brushPointer.style.setProperty('margin-top',
            '-' + (brushPointer.height * 0.5) + 'px');
        brushPointerContainer.innerHTML = '';
        brushPointerContainer.appendChild(brushPointer);
    }
}
updatePointer();


//color picker
var colorVal = document.getElementById('color-pickerer');
colorVal.addEventListener('change', setColor);;

function setColor() {
    var newColor = document.getElementById('color-pickerer').value;
    brush.setColor(newColor);
}


//brush shelf
var selectEraserCheckbox =
    document.getElementById('select-eraser-checkbox');
var brushSizeSlider = document.getElementById('brush-size-slider');
var brushOpacitySlider = document.getElementById('brush-opacity-slider');
brushSizeSlider.value = brush.getSize();
brushOpacitySlider.value = croquis.getPaintingOpacity() * 100;


selectEraserCheckbox.onchange = function () {
    croquis.setPaintingKnockout(selectEraserCheckbox.checked);
}
brushSizeSlider.onchange = function () {
    brush.setSize(brushSizeSlider.value);
    updatePointer();
}
brushOpacitySlider.onchange = function () {
    croquis.setPaintingOpacity(brushOpacitySlider.value * 0.01);
    setColor();
}


// Platform variables
var mac = navigator.platform.indexOf('Mac') >= 0;

//keyboard
document.addEventListener('keydown', documentKeyDown);
function documentKeyDown(e) {
    if (mac ? e.metaKey : e.ctrlKey) {
        switch (e.keyCode) {
        case 89: //ctrl + y
            croquis.redo();
            break;
        case 90: //ctrl + z
            croquis[e.shiftKey ? 'redo' : 'undo']();
            break;
        }
    }
}

function setPointerEvent(e) {
    if (e.pointerType !== "pen" && Croquis.Tablet.pen() && Croquis.Tablet.pen().pointerType) {//it says it's not a pen but it might be a wacom pen
        e.pointerType = "pen";
        e.pressure = Croquis.Tablet.pressure();
        if (Croquis.Tablet.isEraser()) {
            Object.defineProperties(e, {
                "button": { value: 5 },
                "buttons": { value: 32 }
            });
        }
    }
}
