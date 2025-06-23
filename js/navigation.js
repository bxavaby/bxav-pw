// js/navigation.js
document.addEventListener("DOMContentLoaded", () => {
  const contentArea = document.getElementById("content-area");
  const navItems = document.querySelectorAll(".nav-item");

  loadContent("home");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const pageId = item.getAttribute("href").substring(1);

      navItems.forEach((navItem) => navItem.classList.remove("active"));
      item.classList.add("active");

      loadContent(pageId);
    });
  });

  function loadContent(pageId) {
    contentArea.innerHTML = '<div class="loading">Loading</div>';

    fetch(`content/${pageId}.html`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Page not found");
        }
        return response.text();
      })
      .then((html) => {
        setTimeout(() => {
          contentArea.innerHTML = html;

          if (pageId === "home") {
            console.log("Home page loaded, INTEGRATED VERTICAL CORE online.");

            let isTyping = false;
            let originalTagline = "";
            const taglineElement = document.getElementById("tagline-display");
            if (taglineElement) {
              originalTagline =
                taglineElement.textContent || "// CLI/TUI Enthusiast_";
            } else {
              console.warn("Tagline element not found for copy feedback.");
            }

            function typeMessage(element, message, callback) {
              if (isTyping || !element) return;
              isTyping = true;
              element.classList.add("typing-active");
              let i = 0;
              let currentText = "";
              element.textContent = "|";
              const intervalId = setInterval(() => {
                if (i < message.length) {
                  currentText += message.charAt(i);
                  element.textContent = currentText + "|";
                  i++;
                } else {
                  clearInterval(intervalId);
                  element.textContent = currentText;
                  setTimeout(() => {
                    element.textContent = originalTagline;
                    element.classList.remove("typing-active");
                    isTyping = false;
                    if (callback) callback();
                  }, 2500);
                }
              }, 55);
            }

            const emailWrapper = document.getElementById("email-copy-wrapper");
            const emailAddressSpan = document.getElementById("email-address");

            if (emailWrapper && emailAddressSpan) {
              emailWrapper.addEventListener("click", () => {
                if (isTyping) {
                  console.log("Typing feedback active, copy deferred.");
                  return;
                }
                const email = emailAddressSpan.textContent;
                navigator.clipboard
                  .writeText(email)
                  .then(() => {
                    console.log("Data copied:", email);
                    if (taglineElement) {
                      typeMessage(
                        taglineElement,
                        ">> email copied to clipboard_",
                      );
                    }
                  })
                  .catch((err) => {
                    console.error("COPY FAILED:", err);
                    if (taglineElement) {
                      typeMessage(
                        taglineElement,
                        ">> err: clipboard access denied_",
                      );
                    }
                    emailWrapper.classList.add("copy-error");
                    setTimeout(() => {
                      emailWrapper.classList.remove("copy-error");
                    }, 1000);
                  });
              });
            } else {
              console.warn("Email/Copy elements not found.");
            }

            const timezoneSpan = document.getElementById("timezone-info");
            let timezoneIntervalId = null;

            function updateTimezoneTime() {
              if (!timezoneSpan) return;
              try {
                const now = new Date();
                const startCEST = new Date(now.getFullYear(), 2, 31);
                startCEST.setDate(31 - startCEST.getDay());
                const endCEST = new Date(now.getFullYear(), 9, 31);
                endCEST.setDate(31 - endCEST.getDay());
                let timeZoneName = "CET";
                let utcOffset = "+1";
                let tz = "Etc/GMT-1";
                if (now >= startCEST && now < endCEST) {
                  timeZoneName = "CEST";
                  utcOffset = "+2";
                  tz = "Etc/GMT-2";
                }
                const timeString = now.toLocaleTimeString("en-GB", {
                  timeZone: tz,
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                });
                timezoneSpan.textContent = `${timeString} ${timeZoneName} (UTC${utcOffset})`;
              } catch (error) {
                console.error("SYNC ERROR:", error);
                timezoneSpan.textContent = `ERR_SYNC ${timeZoneName || "CET"} (UTC${utcOffset || "+1"})`;
              }
            }

            if (timezoneSpan) {
              updateTimezoneTime();
              timezoneIntervalId = setInterval(updateTimezoneTime, 1000 * 30);
              console.log("Time SYNC active.");
            } else {
              console.warn("SYNC module offline.");
            }

            if (typeof window.initMusicPlayer === "function") {
              window.initMusicPlayer();
            }
          }

          if (pageId === "literary") {
            console.log("Literary page loaded, initializing...");

            if (typeof window.initLiteraryPage === "function") {
              window.initLiteraryPage();
            } else {
              console.error("Literary initialization function not found!");
            }
          }
          if (pageId === "skills") {
            console.log(
              "Skills page loaded, initializing radar chart via window.initRadarChart...",
            );
            requestAnimationFrame(() => {
              if (typeof window.initRadarChart === "function") {
                window.initRadarChart();
              } else {
                console.error(
                  "Skills radar chart initialization function (window.initRadarChart) not found!",
                );
              }
            });
          }
        }, 300);
      })
      .catch((error) => {
        contentArea.innerHTML = `<div class="error">Error loading content: ${error.message}</div>`;
      });
  }
});
