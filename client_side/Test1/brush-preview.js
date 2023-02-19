var w = 360;
var h = 80;

var croquis = new Croquis();
croquis.lockHistory(); //not using history
croquis.setCanvasSize(w, h);
croquis.addLayer();
croquis.fillLayer('#4e4e4e');
croquis.addLayer();
croquis.selectLayer(1);
var brush = new Croquis.Brush();
brush.setSize(20);
brush.setColor('#fff');
brush.setSpacing(0.25);
brush.setFlow(0.7);
croquis.setTool(brush);
croquis.setToolStabilizeLevel(0); //not using stabilizer

var croquisDOMElement = croquis.getDOMElement();
var canvasArea = document.getElementById('canvas-area');
canvasArea.appendChild(croquisDOMElement);

var pointerContainer = document.getElementById('pointer-container');
var sizeSlider = document.getElementById('size-slider');
var flowSlider = document.getElementById('flow-slider');
var spacingSlider = document.getElementById('spacing-slider');
var angleSlider = document.getElementById('angle-slider');
var normalSpreadSlider = document.getElementById('normal-spread-slider');
var tangentSpreadSlider = document.getElementById('tangent-spread-slider');
var rotateToDirectionCheckbox = document.getElementById('rotate-to-direction-checkbox');
var alphaThresholdSlider = document.getElementById('alpha-threshold-slider');
var simulatePressureCheckbox = document.getElementById('simulate-pressure-checkbox');

sizeSlider.value = brush.getSize();
flowSlider.value = brush.getFlow() * 100;
spacingSlider.value = brush.getSpacing() * 100;
angleSlider.value = brush.getAngle();
normalSpreadSlider.value = brush.getNormalSpread() * 100;
tangentSpreadSlider.value = brush.getTangentSpread() * 100;
alphaThresholdSlider.value = 0x20;
simulatePressureCheckbox.checked = true;

sizeSlider.onchange = function () {
    brush.setSize(sizeSlider.value);
    updatePointer();
    updatePreview();
};
flowSlider.onchange = function () {
    brush.setFlow(flowSlider.value * 0.01);
    updatePreview();
};
spacingSlider.onchange = function () {
    brush.setSpacing(spacingSlider.value * 0.01);
    updatePreview();
};
angleSlider.onchange = function () {
    brush.setAngle(angleSlider.value);
    updatePointer();
    updatePreview();
};
normalSpreadSlider.onchange = function () {
    brush.setNormalSpread(normalSpreadSlider.value * 0.01);
    updatePreview();
};
tangentSpreadSlider.onchange = function () {
    brush.setTangentSpread(tangentSpreadSlider.value * 0.01);
    updatePreview();
};
rotateToDirectionCheckbox.onchange = function () {
    brush.setRotateToDirection(rotateToDirectionCheckbox.checked);
    updatePreview();
};
alphaThresholdSlider.onchange = function () {
    updatePointer();
    updatePreview();
};
simulatePressureCheckbox.onchange = function () {
    updatePreview();
};

var circleBrush = document.getElementById('circle-brush');
var brushImages = document.getElementsByClassName('brush-image');
var currentBrush = circleBrush;
Array.prototype.map.call(brushImages, function (brush) {
    brush.addEventListener('mousedown', brushImageMouseDown);
});
function brushImageMouseDown(e) {
    var image = e.currentTarget;
    image.className = 'brush-image on';
    currentBrush.className = 'brush-image';
    currentBrush = image;
    brush.setImage((image == circleBrush) ? null : image);
    updatePointer();
    updatePreview();
}

function updatePointer() {
    var size = sizeSlider.value;
    var angle = angleSlider.value;
    var alphaThreshold = alphaThresholdSlider.value;
    var pointerImage = Croquis.createBrushPointer(
        brush.getImage(), size, angle, alphaThreshold, true, '#fff');
    pointerContainer.innerHTML = '';
    pointerContainer.appendChild(pointerImage);
}

function updatePreview() {
    var deg360 = Math.PI * 2;
    var deg180 = Math.PI;
    var halfH = h >> 1;
    var padding = 30;
    var paddedWidth = w - padding * 2;
    var amplitude = halfH - padding;
    var pressure = simulatePressureCheckbox.checked ? 0 : 1;
    brush.setRandomFunction((new Croquis.Random.LFSR113).get);
    croquis.clearLayer();
    croquis.down(padding, halfH, pressure);
    for (var t = 0; t < 1; t += 0.01) {
        var horizontalPos = t * paddedWidth + padding;
        var verticalPos = -Math.sin(deg360 * t) * amplitude + halfH;
        pressure = simulatePressureCheckbox.checked ?
            1 - Math.abs(t * 2 - 1) : 1;
        croquis.move(horizontalPos, verticalPos, pressure);
    }
    croquis.up(w - padding, halfH, pressure);
}

updatePointer();
updatePreview();
    // ]]>