// js/literary.js
document.addEventListener("DOMContentLoaded", function () {
  console.log("Literary.js loaded");
  window.initLiteraryPage = function () {
    console.log("Initializing literary page");

    if (typeof marked === "undefined") {
      console.error("Marked library not loaded! Loading it now...");
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      script.onload = function () {
        console.log("Marked library loaded successfully");
        loadLiterarySnippets();
        setupModalHandlers();
        setupSpeedReader();
      };
      document.head.appendChild(script);
    } else {
      console.log("Marked library already loaded");
      loadLiterarySnippets();
      setupModalHandlers();
      setupSpeedReader();
    }
  };

  function loadLiterarySnippets() {
    console.log("Loading literary snippets");
    const literaryPieces = document.querySelectorAll(".literary-piece");
    console.log(`Found ${literaryPieces.length} literary pieces`);

    literaryPieces.forEach((piece) => {
      const filename = piece.dataset.mdFile;
      const snippetContainer = piece.querySelector(".literary-snippet");

      console.log(`Loading snippet for ${filename}`);

      fetch(`content/writings/${filename}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((markdown) => {
          console.log(`Got markdown for ${filename}`);

          if (snippetContainer) {
            const firstParagraph = markdown.split("\n\n")[0];
            snippetContainer.innerHTML =
              marked.parse(firstParagraph) + "<p>...</p>";
          } else {
            console.log(
              `No snippet container for ${filename}, skipping snippet injection.`,
            );
          }
        })
        .catch((error) => {
          console.error(`Error loading markdown for ${filename}:`, error);
          if (snippetContainer) {
            snippetContainer.innerHTML = `<p class="error">Error loading content: ${error.message}</p>`;
          }
        });
    });
  }

  function setupModalHandlers() {
    console.log("Setting up modal handlers");
    const modal = document.getElementById("literary-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModal = document.querySelector(".close-modal");
    const readMoreButtons = document.querySelectorAll(".btn-read-more");
    // UNCOMMENT TO SHOW SPEED READ BUTTONS FOR ALL
    // const speedReadButtons = document.querySelectorAll(".btn-speed-read");
    // speedReadButtons.forEach((button) => {
    //   button.style.display = "inline-block";
    // });

    console.log(`Found ${readMoreButtons.length} read more buttons`);

    closeModal.addEventListener("click", () => {
      console.log("Closing modal");
      modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        console.log("Clicked outside modal, closing");
        modal.style.display = "none";
      }
    });

    readMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filename = button.dataset.file;
        console.log(`Read more clicked for ${filename}`);

        const literaryPiece = button.closest(".literary-piece");
        const title =
          literaryPiece.querySelector(".literary-title").textContent;
        const authorElement = literaryPiece.querySelector(".literary-author");

        if (authorElement) {
          modalTitle.innerHTML = `${title} <span class="modal-author">by ${authorElement.textContent}</span>`;
        } else {
          modalTitle.textContent = title;
        }

        modalContent.innerHTML = "<p>Loading...</p>";
        modal.style.display = "block";

        fetch(`content/writings/${filename}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then((markdown) => {
            console.log(`Got full markdown for ${filename}`);

            let cleanedMarkdown = markdown.replace(/^#\s+.*\n+/, "");

            // is it a poem?
            const isPoemButton =
              literaryPiece.querySelector(".literary-category").textContent ===
              "poem";

            if (isPoemButton) {
              // custom poem renderer instead of marked
              modalContent.innerHTML = renderPoem(cleanedMarkdown);
            } else {
              // normal markdown parsing for prose
              modalContent.innerHTML = marked.parse(cleanedMarkdown);
            }
          })
          .catch((error) => {
            console.error(
              `Error loading full markdown for ${filename}:`,
              error,
            );
            modalContent.innerHTML = `<p class="error">Error loading content: ${error.message}</p>`;
          });
      });
    });
  }

  function setupSpeedReader() {
    console.log("Setting up speed reader");

    const speedReader = document.getElementById("speed-reader");
    const closeButton = document.getElementById("sr-close");
    const slowerButton = document.getElementById("sr-slower");
    const fasterButton = document.getElementById("sr-faster");
    const pauseButton = document.getElementById("sr-pause");
    const wpmDisplay = document.getElementById("sr-wpm");

    let wordElement = document.getElementById("sr-word");
    if (!wordElement) {
      wordElement = document.createElement("div");
      wordElement.id = "sr-word";
      speedReader.appendChild(wordElement);
    }

    let words = [];
    let currentWordIndex = 0;
    let wpm = 300;
    let intervalId = null;
    let isPaused = false;
    let originalText = "";

    const speedReadButtons = document.querySelectorAll(".btn-speed-read");

    speedReadButtons.forEach((button) => {
      // button.style.display = "inline-block"; // uncomment for quick show all

      button.addEventListener("click", () => {
        const filename = button.dataset.file;
        console.log(`Speed read clicked for ${filename}`);

        fetch(`content/writings/${filename}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then((markdown) => {
            let cleanedMarkdown = markdown.replace(/^#\s+.*\n+/, "");
            originalText = cleanedMarkdown;

            prepareSpeedReading(cleanedMarkdown);

            speedReader.style.display = "flex";
            startReading();
          })
          .catch((error) => {
            console.error(`Error loading markdown for speed reading: ${error}`);
          });
      });
    });

    function prepareSpeedReading(text) {
      let plainText = text
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // rm links
        .replace(/[*_~`]/g, "") // rm markdown formatting characters
        .replace(/#+\s+/g, "") // rm headers
        .replace(/>/g, ""); // rm blockquotes

      words = plainText.split(/\s+/).filter((word) => word.length > 0);
      currentWordIndex = 0;
    }

    function startReading() {
      if (intervalId) clearInterval(intervalId);
      isPaused = false;
      pauseButton.textContent = "Pause";

      const msPerWord = 60000 / wpm;

      intervalId = setInterval(() => {
        if (currentWordIndex < words.length) {
          wordElement.textContent = words[currentWordIndex];
          currentWordIndex++;
        } else {
          clearInterval(intervalId);
          pauseButton.textContent = "Restart";
          isPaused = true;
        }
      }, msPerWord);
    }

    pauseButton.addEventListener("click", () => {
      if (currentWordIndex >= words.length) {
        currentWordIndex = 0;
        startReading();
        return;
      }

      if (isPaused) {
        startReading();
      } else {
        clearInterval(intervalId);
        isPaused = true;
        pauseButton.textContent = "Resume";
      }
    });

    fasterButton.addEventListener("click", () => {
      wpm += 50;
      wpmDisplay.textContent = `${wpm} WPM`;
      if (!isPaused) {
        startReading();
      }
    });

    slowerButton.addEventListener("click", () => {
      if (wpm > 50) {
        wpm -= 50;
        wpmDisplay.textContent = `${wpm} WPM`;
        if (!isPaused) {
          startReading();
        }
      }
    });

    closeButton.addEventListener("click", () => {
      clearInterval(intervalId);
      speedReader.style.display = "none";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && speedReader.style.display === "flex") {
        clearInterval(intervalId);
        speedReader.style.display = "none";
      }
    });
  }
  function renderPoem(poemText) {
    const stanzas = poemText.trim().split(/\n\s*\n/);

    const stanzaElements = stanzas.map((stanza) => {
      const stanzaHtml = stanza
        .trim()
        .split("\n")
        .map((line) => `<div class="poem-line">${line}</div>`)
        .join("");

      return `<div class="poem-stanza">${stanzaHtml}</div>`;
    });

    return `<div class="poem">${stanzaElements.join("")}</div>`;
  }
});
