
/*
  Author: Babatunde Fajolujo
  Date: 2025-10-25 (updated 2025-11-02)
  File: script.js
  Desc: Decision tree + loops for the flashcard generator.
        - External script loaded on pages.
        - Implements at least 3 boolean decisions (with a logical operator).
        - Uses if/else-if/else.
        - Adds two different loop types (for + while) that update the DOM.
        - Loops through a NodeList with .length check.
*/

// =====================
// Variables (strings and numbers)
// =====================
const SITE_NAME = "QuickCards";
const PRICE_PER_CARD = 0.25;
const STUDY_SECONDS_PER_CARD = 30;

// =====================
// Select elements using different DOM methods
// =====================
const mainTitle = document.getElementById("main-title");
const navLinks = document.getElementsByClassName("nav-link");
const paragraphs = document.getElementsByTagName("p");
const form = document.querySelector("form");
const sizeRadios = document.querySelectorAll('input[name="size"]');

// =====================
// Update page content (visible on load)
// =====================
if (mainTitle) {
  mainTitle.textContent = SITE_NAME + " - Study Tool";
}

// Add a small tip on non-generator pages
if (paragraphs.length > 0 && !form) {
  const firstParagraph = paragraphs[0];
  firstParagraph.innerHTML = firstParagraph.innerHTML +
    " <em><strong>Tip:</strong> Try our calculator on the Generator page!</em>";
}

// =====================
// NodeList loop (requirement): loop through size radios with .length check
// Adds event listeners and accessibility labels using a classic for loop.
// =====================
if (sizeRadios && sizeRadios.length > 0) {
  for (let i = 0; i < sizeRadios.length; i++) { // using length explicitly
    const radio = sizeRadios[i];
    // Add an aria-label so screen readers announce the size
    if (!radio.getAttribute("aria-label")) {
      radio.setAttribute("aria-label", `Deck size ${radio.value} cards`);
    }
    // Event listeners are attached below when form exists; this ensures radios are annotated on any page
  }
}

// =====================
// Feature list (for loop requirement):
// Renders a short list of site features under an element with id="features".
// Uses a for loop and product-relevant data to create repeated DOM content.
// =====================
const FEATURES = [
  "Auto-calculate study time based on deck size and shuffle mode",
  "Bulk discount for larger decks (20+ cards)",
  "Live updates as you type your topic",
  "Accessible controls with labeled options"
];

(function renderFeatures() {
  const featuresContainer = document.getElementById("features");
  if (!featuresContainer) return;
  const ul = document.createElement("ul");
  ul.id = "features-list";
  // FOR LOOP: iterate fixed-size array to render repeated items
  for (let i = 0; i < FEATURES.length; i++) {
    const li = document.createElement("li");
    li.textContent = FEATURES[i];
    ul.appendChild(li);
  }
  featuresContainer.innerHTML = "";
  featuresContainer.appendChild(ul);
})();

// =====================
// Calculator (only on generator page)
// =====================
if (form) {
  // Select input fields
  const topicInput = document.getElementById("topic");
  const shuffleCheck = document.querySelector('input[name="shuffle"]');

  // Create a result area to show calculations
  const resultDiv = document.createElement("div");
  resultDiv.id = "calculator-result";
  form.insertAdjacentElement("afterend", resultDiv);

  // Create a sessions area (for while loop output)
  const sessionsDiv = document.createElement("div");
  sessionsDiv.id = "sessions-plan";
  resultDiv.insertAdjacentElement("afterend", sessionsDiv);

  // Attach change listeners to radios via NodeList loop (again using length)
  if (sizeRadios && sizeRadios.length > 0) {
    for (let i = 0; i < sizeRadios.length; i++) {
      sizeRadios[i].addEventListener("change", calculate);
    }
  }

  if (topicInput) topicInput.addEventListener("input", calculate);
  if (shuffleCheck) shuffleCheck.addEventListener("change", calculate);

  // Main calculator following the decision tree
  function calculate() {
    const topic = (topicInput && topicInput.value) ? topicInput.value.trim() : "";
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const numCards = selectedSize ? Number(selectedSize.value) : 0;

    // ===== Decisions (at least three; includes logical operator) =====
    // Decision 1: Topic entered?
    // Decision 2: Deck size chosen?
    // Decision 3: Shuffle checked?
    // Decision 4: Bulk discount?
    // Using a logical operator (||) to guard rendering
    if (!topic || numCards === 0) {
      resultDiv.textContent = "";    // hide estimate when missing inputs
      sessionsDiv.textContent = "";  // hide sessions plan
      return;
    }

    // Base time per card, change with shuffle (decision 3)
    let timePerCard = STUDY_SECONDS_PER_CARD;
    if (shuffleCheck && shuffleCheck.checked) {
      timePerCard = timePerCard + 5; // extra cognitive switching time
    }

    const totalSeconds = numCards * timePerCard;
    const minutes = Math.ceil(totalSeconds / 60);

    // Pricing with bulk discount (decision 4 via if/else-if/else)
    const subtotal = numCards * PRICE_PER_CARD;
    let discountRate = 0;
    if (numCards >= 30) {
      discountRate = 0.15; // slightly better break for 30
    } else if (numCards >= 20) {
      discountRate = 0.10;
    } else {
      discountRate = 0;
    }
    const discount = subtotal * discountRate;
    const total = subtotal - discount;

    // Extra conditional using logical AND to show a "Quick session" badge
    const quickTag = (minutes <= 2 && numCards <= 10) ?
      "<span style='color: #0a0; font-weight:600'>(Quick session)</span>" : "";

    // ===== Visible output =====
    resultDiv.innerHTML =
      "<h3>Estimate for Your Deck:</h3>" +
      "<p><strong>Topic:</strong> " + topic + "</p>" +
      "<p><strong>Cards:</strong> " + numCards + "</p>" +
      "<p><strong>Study Time:</strong> <em>~" + minutes + " minutes</em> " + quickTag + "</p>" +
      "<p><strong>Cost:</strong> $" + total.toFixed(2) +
      (discountRate > 0 ? " <span style='color: green;'>(" + (discountRate*100) + "% discount applied!)</span>" : "") +
      "</p>";

    // ===== While loop requirement: build a simple "study sessions" plan =====
    // Break the deck into sessions of 5 cards to encourage spaced practice.
    // We use a while loop since we don't know how many iterations up front—
    // it depends on numCards and remainder.
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

    // Render sessions
    const sessList = document.createElement("ol");
    for (let i = 0; i < sessions.length; i++) {
      const li = document.createElement("li");
      li.textContent = sessions[i];
      sessList.appendChild(li);
    }
    sessionsDiv.innerHTML = "<h4>Your Study Sessions</h4>";
    sessionsDiv.appendChild(sessList);
  }

  // Initial run
  calculate();
}