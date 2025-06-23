// js/skills.js
let currentRadarChart = null;

function initRadarChart_internal() {
  const canvas = document.getElementById("radarChart");
  if (!canvas) {
    if (currentRadarChart) {
      console.log("Radar canvas not found, destroying old chart instance.");
      currentRadarChart.destroy();
      currentRadarChart = null;
    }
    return;
  }

  if (currentRadarChart) {
    console.log(
      "Destroying previous radar chart instance before creating new one.",
    );
    currentRadarChart.destroy();
    currentRadarChart = null;
  }

  console.log("Getting styles and creating new radar chart instance...");
  const styles = getComputedStyle(document.body);
  const accentColor = styles.getPropertyValue("--accent").trim() || "#f0bbc2";
  const secondaryColor = styles.getPropertyValue("--text").trim() || "#87717d";
  const tertiaryColor =
    styles.getPropertyValue("--secondary").trim() || "#22203c";

  const ctx = canvas.getContext("2d");

  try {
    currentRadarChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Shellcraft", "OpSec", "Automation", "System Ops", "OSS/FOSS"],
        datasets: [
          {
            label: "Signal Strength",
            data: [80, 70, 65, 50, 95],
            backgroundColor: hexToRgba(accentColor, 0.15),
            borderColor: accentColor,
            borderWidth: 1.5,
            fill: true,

            pointBackgroundColor: accentColor,
            pointBorderColor:
              styles.getPropertyValue("--text").trim() || "#000",
            pointBorderWidth: 1,
            pointRadius: 4,

            pointHoverBackgroundColor: styles
              .getPropertyValue("--background")
              .trim(),
            pointHoverBorderColor: accentColor,
            pointHoverBorderWidth: 2,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor:
              styles.getPropertyValue("--terciary")?.trim() || "#1a1a2e",
            titleColor: accentColor,
            titleFont: {
              family: "ShureTechMonoNerdFontMono-Regular",
              weight: "bold",
            },
            bodyColor: secondaryColor,
            bodyFont: { family: "ShureTechMonoNerdFontMono-Regular" },
            borderColor: accentColor,
            borderWidth: 1,
            padding: 8,
            displayColors: false,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.r !== null) {
                  label += context.parsed.r;
                }
                return label;
              },
            },
          },
        },
        scales: {
          r: {
            angleLines: {
              color: hexToRgba(tertiaryColor, 0.5), // angle lines semi-transparent
              // or dashed lines:
              // color: tertiaryColor,
              // borderDash: [4, 4], // Pattern: 4px line, 4px gap
            },
            grid: {
              color: hexToRgba(tertiaryColor), // grid lines semi-transparent
              // or dashed lines:
              // color: tertiaryColor,
              borderDash: [4, 4],
            },
            pointLabels: {
              color: secondaryColor,
              font: { family: "ShureTechMonoNerdFontMono-Regular", size: 16 },
            },
            ticks: {
              display: false,
              color: hexToRgba(secondaryColor, 0.7),
              font: {
                family: "ShureTechMonoNerdFontMono-Regular",
                size: 9,
              },
              backdropColor: "transparent",
              stepSize: 5,
              padding: 8,
              showLabelBackdrop: false,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to create radar chart:", error);
    currentRadarChart = null;
  }
}

function hexToRgba(hex, alpha = 1) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((h) => h + h)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

window.initRadarChart = initRadarChart_internal;
console.log("initRadarChart function attached to window.");
