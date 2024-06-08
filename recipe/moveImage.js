let gMouseDownX = 0;
let gMouseDownY = 0;
let gMouseDownOffsetX = 0;
let gMouseDownOffsetY = 0;

const img = document.getElementById('cursorImage');
let scale = 0.5;
const scaleStep = 0.1;
const minScale = 0.1;
const maxScale = 5;

function updateImageTransform() {
  img.style.transformOrigin = `0 0`;
  img.style.transform = `scale(${scale})`;
}

window.onload = () => {
  img.onload = () => {
    updateImageTransform();
  };
};

img.addEventListener('wheel', (event) => {
  event.preventDefault();
  
  const rect = img.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  const offsetXPercent = offsetX / rect.width;
  const offsetYPercent = offsetY / rect.height;

  const oldScale = scale;
  if (event.deltaY < 0) {
    // Zoom in
    scale = Math.min(scale + scaleStep, maxScale);
  } else {
    // Zoom out
    scale = Math.max(scale - scaleStep, minScale);
  }

  // Calculate new image position to keep the mouse point fixed
  const newWidth = rect.width * scale / oldScale;
  const newHeight = rect.height * scale / oldScale;
  
  const deltaX = (newWidth - rect.width) * offsetXPercent;
  const deltaY = (newHeight - rect.height) * offsetYPercent;

  img.style.transformOrigin = `0 0`;
  img.style.transform = `scale(${scale})`;
  img.style.left = `${img.offsetLeft - deltaX}px`;
  img.style.top = `${img.offsetTop - deltaY}px`;
});

function addListeners() {
    document.getElementById('cursorImage').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
}

function mouseUp() {
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
    gMouseDownX = e.clientX;
    gMouseDownY = e.clientY;

    var div = document.getElementById('cursorImage');

    //The following block gets the X offset (the difference between where it starts and where it was clicked)
    let leftPart = "";
    if(!div.style.left)
        leftPart+="0px";    //In case this was not defined as 0px explicitly.
    else
        leftPart = div.style.left;
    let leftPos = leftPart.indexOf("px");
    let leftNumString = leftPart.slice(0, leftPos); // Get the X value of the object.
    gMouseDownOffsetX = gMouseDownX - parseInt(leftNumString,10);

    //The following block gets the Y offset (the difference between where it starts and where it was clicked)
    let topPart = "";
    if(!div.style.top)
        topPart+="0px";     //In case this was not defined as 0px explicitly.
    else
        topPart = div.style.top;
    let topPos = topPart.indexOf("px");
    let topNumString = topPart.slice(0, topPos);    // Get the Y value of the object.
    gMouseDownOffsetY = gMouseDownY - parseInt(topNumString,10);

    window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
    var div = document.getElementById('cursorImage');
    div.style.position = 'absolute';
    let topAmount = e.clientY - gMouseDownOffsetY;
    div.style.top = topAmount + 'px';
    let leftAmount = e.clientX - gMouseDownOffsetX;
    div.style.left = leftAmount + 'px';
}

addListeners();