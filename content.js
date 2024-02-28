chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'initiateScreenshot') {
        captureSelectedArea();
    }
});

function captureSelectedArea() {
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.cursor = 'crosshair';
    overlay.style.zIndex = '9999';

    document.body.appendChild(overlay);

    var startX, startY;

    function handleMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
        var width = e.clientX - startX;
        var height = e.clientY - startY;

        overlay.style.width = width + 'px';
        overlay.style.height = height + 'px';
    }

    function handleMouseUp(e) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Capture the selected area
        captureAndSaveScreenshot(startX, startY, e.clientX, e.clientY);

        // Remove the overlay
        overlay.remove();
    }

    overlay.addEventListener('mousedown', handleMouseDown);
}

function captureAndSaveScreenshot(startX, startY, endX, endY) {
    var width = Math.abs(endX - startX);
    var height = Math.abs(endY - startY);
    var top = Math.min(startY, endY);
    var left = Math.min(startX, endX);

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    context.drawWindow(window, left, top, width, height, 'rgb(255, 255, 255)');

    var dataUrl = canvas.toDataURL('image/png');
    chrome.runtime.sendMessage({ action: 'saveScreenshot', dataUrl: dataUrl });
}
