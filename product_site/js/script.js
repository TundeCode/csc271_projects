/*
  Author: Babatunde Fajolujo
  Date: 2025-10-25 (updated 2025-11-02)
  File: script.js
  Desc: Decision tree + loops for the flashcard generator (no cost section).
*/


/* /js/script.js — aria-live for dynamic results (keep rest of your file) */
// const resultDiv = document.createElement("div");
// resultDiv.id = "calculator-result";
// resultDiv.setAttribute("aria-live", "polite"); // announce updates
// form.insertAdjacentElement("afterend", resultDiv);

// =====================
// Variables
// =====================
const SITE_NAME = "QuickCards";
const STUDY_SECONDS_PER_CARD = 30;

// =====================
// Select elements
// =====================
const mainTitle = document.getElementById("main-title");
const paragraphs = document.getElementsByTagName("p");
const form = document.querySelector("form");
const sizeRadios = document.querySelectorAll('input[name="size"]');

// =====================
// Page updates
// =====================
if (mainTitle) {
  mainTitle.textContent = SITE_NAME + " - Study Tool";
}

if (paragraphs.length > 0 && !form) {
  const firstParagraph = paragraphs[0];
  firstParagraph.innerHTML +=
    " <em><strong>Tip:</strong> Try our calculator on the Generator page!</em>";
}

// =====================
// Radio accessibility loop
// =====================
if (sizeRadios && sizeRadios.length > 0) {
  for (let i = 0; i < sizeRadios.length; i++) {
    const radio = sizeRadios[i];
    if (!radio.getAttribute("aria-label")) {
      radio.setAttribute("aria-label", `Deck size ${radio.value} cards`);
    }
  }
}

// =====================
// Feature list loop
// =====================
const FEATURES = [
  "Auto-calculate study time based on deck size and shuffle mode",
  "Live updates as you type your topic",
  "Accessible controls with labeled options"
];

(function renderFeatures() {
  const featuresContainer = document.getElementById("features");
  if (!featuresContainer) return;
  const ul = document.createElement("ul");
  for (let i = 0; i < FEATURES.length; i++) {
    const li = document.createElement("li");
    li.textContent = FEATURES[i];
    ul.appendChild(li);
  }
  featuresContainer.innerHTML = "";
  featuresContainer.appendChild(ul);
})();

// =====================
// Calculator
// =====================
if (form) {
  const topicInput = document.getElementById("topic");
  const shuffleCheck = document.querySelector('input[name="shuffle"]');

  const resultDiv = document.createElement("div");
  resultDiv.id = "calculator-result";
  form.insertAdjacentElement("afterend", resultDiv);

  const sessionsDiv = document.createElement("div");
  sessionsDiv.id = "sessions-plan";
  resultDiv.insertAdjacentElement("afterend", sessionsDiv);

  if (sizeRadios && sizeRadios.length > 0) {
    for (let i = 0; i < sizeRadios.length; i++) {
      sizeRadios[i].addEventListener("change", calculate);
    }
  }

  if (topicInput) topicInput.addEventListener("input", calculate);
  if (shuffleCheck) shuffleCheck.addEventListener("change", calculate);

  function calculate() {
    const topic = (topicInput && topicInput.value) ? topicInput.value.trim() : "";
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const numCards = selectedSize ? Number(selectedSize.value) : 0;

    if (!topic || numCards === 0) {
      resultDiv.textContent = "";
      sessionsDiv.textContent = "";
      return;
    }

    let timePerCard = STUDY_SECONDS_PER_CARD;
    if (shuffleCheck && shuffleCheck.checked) {
      timePerCard += 5;
    }

    const totalSeconds = numCards * timePerCard;
    const minutes = Math.ceil(totalSeconds / 60);

    const quickTag = (minutes <= 2 && numCards <= 10)
      ? "<span style='color: #0a0; font-weight:600'>(Quick session)</span>"
      : "";

    resultDiv.innerHTML =
      "<h3>Estimate for Your Deck:</h3>" +
      "<p><strong>Topic:</strong> " + topic + "</p>" +
      "<p><strong>Cards:</strong> " + numCards + "</p>" +
      "<p><strong>Study Time:</strong> <em>~" + minutes + " minutes</em> " + quickTag + "</p>";

    let remaining = numCards;
    let sessionIndex = 1;
    const sessionSize = 5;
    const sessions = [];
    while (remaining > 0) {
      const take = Math.min(sessionSize, remaining);
      const sessionTimeMin = Math.ceil((take * timePerCard) / 60);
      sessions.push(`Session ${sessionIndex}: Study ${take} cards (~${sessionTimeMin} min)`);
      remaining -= take;
      sessionIndex++;
    }

    const sessList = document.createElement("ol");
    for (let i = 0; i < sessions.length; i++) {
      const li = document.createElement("li");
      li.textContent = sessions[i];
      sessList.appendChild(li);
    }
    sessionsDiv.innerHTML = "<h4>Your Study Sessions</h4>";
    sessionsDiv.appendChild(sessList);
  }

  calculate();

  // =====================
  // Form Events
  // =====================
  const topicMsg = document.createElement("p");
  topicMsg.id = "topic-feedback";
  topicMsg.style.marginTop = "6px";
  topicMsg.style.fontSize = "0.9rem";
  form.insertBefore(topicMsg, form.children[2]);

  topicInput.addEventListener("focus", function () {
    topicMsg.textContent = "Enter a topic (cannot be blank, max 80 characters).";
    topicMsg.style.color = "#555";
  });

  topicInput.addEventListener("blur", function () {
    const value = topicInput.value.trim();
    if (value.length === 0) {
      topicMsg.textContent = "Error: Topic cannot be blank.";
      topicMsg.style.color = "red";
    } else {
      topicMsg.textContent = "";
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const success = document.createElement("p");
    success.textContent = "Your responses were successfully recorded!";
    success.style.color = "green";
    form.insertAdjacentElement("afterend", success);
  });
}
