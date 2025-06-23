document.addEventListener("DOMContentLoaded", function () {
  console.log("Setting up project card handler");

  function initRepoCards() {
    const repoCards = document.querySelectorAll(
      ".project-repo-card[data-repo]",
    );
    console.log("Found repo cards:", repoCards.length);

    if (repoCards.length === 0) return;

    repoCards.forEach((card) => {
      const repoPath = card.getAttribute("data-repo");
      const imageUrl = `https://opengraph.githubassets.com/1/${repoPath}`;
      card.style.setProperty("--repo-bg-image", `url(${imageUrl})`);
      card.addEventListener("click", () => {
        window.open(`https://github.com/${repoPath}`, "_blank");
      });
    });
  }

  initRepoCards();

  const observer = new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        console.log("Content changed, checking for repo cards");
        initRepoCards();
      }
    }
  });

  const contentArea = document.getElementById("content-area");
  if (contentArea) {
    observer.observe(contentArea, { childList: true, subtree: true });
  }
});
