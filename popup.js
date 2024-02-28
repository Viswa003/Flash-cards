document.addEventListener('DOMContentLoaded', function () {
    var textButton = document.getElementById('textButton');
    var screenshotButton = document.getElementById('screenshotButton');
    var viewButton = document.getElementById('viewButton');

    textButton.addEventListener('click', function () {
        var text = prompt("Enter text:");
        if (text) {
            saveText(text);
        }
    });

    screenshotButton.addEventListener('click', function () {
        chrome.tabs.captureVisibleTab({ format: 'png' }, function (dataUrl) {
            console.log(dataUrl);
            saveScreenshot(dataUrl);
        });
    });

    viewButton.addEventListener('click', function () {
        // Open a new tab to view flashcards
        chrome.tabs.create({ url: chrome.runtime.getURL('flashcards.html') });
    });
});

function saveText(text) {
    chrome.storage.local.get({ flashcards: [] }, function (result) {
        var flashcards = result.flashcards;
        flashcards.push({ type: 'text', content: text });
        chrome.storage.local.set({ flashcards: flashcards }, function () {
            console.log('Text saved:', text);
        });
    });
}

function saveScreenshot(dataUrl) {
    chrome.storage.local.get({ flashcards: [] }, function (result) {
        var flashcards = result.flashcards;
        flashcards.push({ type: 'screenshot', content: dataUrl });
        chrome.storage.local.set({ flashcards: flashcards }, function () {
            console.log('Screenshot saved');
        });
    });
}
