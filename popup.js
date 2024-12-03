document.addEventListener("DOMContentLoaded", () => {
  const wordForm = document.getElementById("wordForm");
  const wordList = document.getElementById("wordList");

  // Load words from storage
  function loadWords() {
    chrome.storage.local.get(["words"], (result) => {
      const words = result.words || [];
      wordList.innerHTML = ""; // Clear the list

      words.forEach((wordObj, index) => {
        const div = document.createElement("div");
        div.classList.add("word-item");
        div.innerHTML = `
            <h3>${wordObj.word}</h3>
            <p><strong>Meaning:</strong> ${wordObj.meaning}</p>
            <p><strong>Synonyms:</strong> ${wordObj.synonyms || "None"}</p>
            <p><strong>Antonyms:</strong> ${wordObj.antonyms || "None"}</p>
            <button data-index="${index}" class="delete-btn">Delete</button>
          `;
        wordList.appendChild(div);
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", deleteWord);
      });
    });
  }

  // Save word
  wordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const word = document.getElementById("word").value.trim();
    const meaning = document.getElementById("meaning").value.trim();
    const synonyms = document.getElementById("synonyms").value.trim();
    const antonyms = document.getElementById("antonyms").value.trim();

    if (word && meaning) {
      chrome.storage.local.get(["words"], (result) => {
        const words = result.words || [];
        words.push({ word, meaning, synonyms, antonyms });
        chrome.storage.local.set({ words }, () => {
          wordForm.reset();
          loadWords();
        });
      });
    }
  });

  // Delete word
  function deleteWord(event) {
    const index = event.target.dataset.index;
    chrome.storage.local.get(["words"], (result) => {
      const words = result.words || [];
      words.splice(index, 1);
      chrome.storage.local.set({ words }, loadWords);
    });
  }

  // Initial load
  loadWords();
});
