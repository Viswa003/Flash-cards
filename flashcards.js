document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get({ flashcards: [] }, function (result) {
        var flashcards = result.flashcards;
        displayFlashcards(flashcards);
    });
});

function displayFlashcards(flashcards) {
    var container = document.getElementById('flashcards-container');
    container.innerHTML = '';

    if (flashcards.length === 0) {
        container.innerHTML = '<p>No flashcards available.</p>';
    } else {
        flashcards.forEach(function (card, index) {
            var cardElement = createCardElement(card, index);
            container.appendChild(cardElement);
        });
    }
}

function createCardElement(card, index) {
    var cardElement = document.createElement('div');
    cardElement.classList.add('flashcard');
    cardElement.style.position = 'relative'; // Add this line

    if (card.type === 'textarea') {
        var textElement = document.createElement('p');
        textElement.textContent = card.content;
        textElement.style.whiteSpace = 'pre-wrap'; // Preserve white-spaces and line breaks
        textElement.classList.add('flashcard-text'); // Add this line
        cardElement.appendChild(textElement);
    }
     else if (card.type === 'screenshot') {
        var imgElement = document.createElement('img');
        imgElement.src = card.content;
        imgElement.alt = 'Screenshot';
        imgElement.classList.add('flashcard-img'); // Add this line
        cardElement.appendChild(imgElement);
    }
    
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.position = 'absolute'; // Add this line
    deleteButton.style.bottom = '10px'; // Add this line
    deleteButton.style.right = '10px'; // Add this line
    deleteButton.addEventListener('click', function () {
        deleteFlashcard(index);
    });

    cardElement.appendChild(deleteButton);
    return cardElement;
}



function deleteFlashcard(index) {
    chrome.storage.local.get({ flashcards: [] }, function (result) {
        var flashcards = result.flashcards;
        flashcards.splice(index, 1);
        chrome.storage.local.set({ flashcards: flashcards }, function () {
            displayFlashcards(flashcards);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // ... (your ex isting code)

    // Event listener to open modal on flashcard click
    document.getElementById('flashcards-container').addEventListener('click', function (event) {
        var flashcard = event.target.closest('.flashcard');
        if (flashcard) {
            openModal(flashcard.innerHTML);
        }
    });

    // Event listener to close modal
    document.getElementById('modal-container').addEventListener('click', function (event) {
        if (event.target.id === 'modal-container' || event.target.id === 'close-modal') {
            closeModal();
        }
    });
});

function openModal(content) {
    var modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = content;
    document.getElementById('modal-container').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
    document.getElementById('modal-content').innerHTML = '';
}
