document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");

  function applyTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "theme-rac") {
      document.body.className = "theme-rac";
      console.log(`> using saved theme: ${savedTheme}`);
    } else {
      document.body.className = "theme-eid";
      if (!savedTheme) {
        console.log(`> using default theme: theme-eid`);
      } else if (savedTheme !== "theme-eid") {
        console.log(
          `> using theme-eid (fallback from invalid theme '${savedTheme}')`,
        );
      } else {
        console.log(`> using saved theme: ${savedTheme}`);
      }
    }
  }

  applyTheme();

  toggle.addEventListener("click", () => {
    const body = document.body;
    let newTheme;

    if (body.classList.contains("theme-rac")) {
      body.classList.replace("theme-rac", "theme-eid");
      newTheme = "theme-eid";
    } else {
      body.classList.replace("theme-eid", "theme-rac");
      newTheme = "theme-rac";
    }

    localStorage.setItem("theme", newTheme);
    console.log(`> Theme saved: ${newTheme}`);

    const skillsNavLink = document.querySelector('.nav-item[href="#skills"]');
    const isSkillsPage =
      skillsNavLink && skillsNavLink.classList.contains("active");
    const radarCanvasExists = document.getElementById("radarChart");
    const initFunctionExists = typeof window.initRadarChart === "function";

    console.log(
      `Checking conditions: isSkillsPage=${isSkillsPage} (via nav active), radarCanvasExists=${!!radarCanvasExists}, initFunctionExists=${initFunctionExists}`,
    );

    if (isSkillsPage && radarCanvasExists && initFunctionExists) {
      console.log(
        "Theme toggled on skills page (nav active). Re-initializing chart...",
      );
      setTimeout(() => {
        window.initRadarChart();
      }, 50);
    } else {
      console.log("Not re-initializing chart. Reason(s):");
      if (!isSkillsPage) console.log(" - Skills nav link is not active.");
      if (!radarCanvasExists)
        console.log(" - #radarChart canvas not found in DOM.");
      if (!initFunctionExists)
        console.log(" - window.initRadarChart is not a function.");
    }
  });
});
