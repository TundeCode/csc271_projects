/*
  Author: Babatunde Fajolujo
  Date: 2025-10-25
  File: script.js
  Desc: Simple calculator for the flashcard generator that estimates
        study time and cost based on deck size and options.
*/

// =====================
// Constants
// =====================
const SITE_NAME = "QuickCards";
const PRICE_PER_CARD = 0.25;
const STUDY_SECONDS_PER_CARD = 30;

// =====================
// DOM selections
// =====================
const mainTitle = document.getElementById("main-title");
const navLinks = document.getElementsByClassName("nav-link");
const paragraphs = document.getElementsByTagName("p");
const form = document.querySelector("form");
const sizeRadios = document.querySelectorAll('input[name="size"]');

// =====================
// Basic page updates
// =====================
if (mainTitle) {
  mainTitle.textContent = SITE_NAME + " - Study Tool";
}

if (paragraphs.length > 0 && !form) {
  const firstParagraph = paragraphs[0];
  firstParagraph.innerHTML =
    firstParagraph.innerHTML +
    " <em><strong>Tip:</strong> Try our calculator on the Generator page!</em>";
}

// =====================
// Helpers (pure functions)
// =====================

/** Returns currently selected deck size as a number; 0 if none */
function getSelectedDeckSize() {
  const selected = document.querySelector('input[name="size"]:checked');
  return selected ? Number(selected.value) : 0;
}

/** Computes total study minutes from card count and shuffle state */
function computeStudyMinutes(numCards, shuffleOn) {
  let secPerCard = STUDY_SECONDS_PER_CARD + (shuffleOn ? 5 : 0);
  const totalSeconds = numCards * secPerCard;
  return Math.ceil(totalSeconds / 60);
}

/** Computes pricing with a 10% bulk discount at 20+ cards */
function computeCost(numCards, pricePerCard) {
  const subtotal = numCards * pricePerCard;
  const discount = numCards >= 20 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  return { subtotal, discount, total };
}

/** Quick input guard */
function hasValidInputs(topic, numCards) {
  return topic.trim().length > 0 && Number(numCards) > 0;
}

/** Format currency to 2 decimals */
function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

// =====================
// UI helpers (side effects)
// =====================

/** Render estimate block */
function renderEstimate(topic, numCards, minutes, totals) {
  let resultDiv = document.getElementById("calculator-result");
  if (!resultDiv) {
    resultDiv = document.createElement("div");
    resultDiv.id = "calculator-result";
    form.insertAdjacentElement("afterend", resultDiv);
  }

  resultDiv.innerHTML =
    "<h3>Estimate for Your Deck:</h3>" +
    `<p><strong>Topic:</strong> ${topic}</p>` +
    `<p><strong>Cards:</strong> ${numCards}</p>` +
    `<p><strong>Study Time:</strong> <em>~${minutes} minutes</em></p>` +
    `<p><strong>Cost:</strong> ${formatCurrency(totals.total)}` +
    (totals.discount > 0
      ? " <span style='color: green;'>(10% discount applied!)</span>"
      : "") +
    "</p>";
}

/** Basic function: no params, no return */
function showGreeting() {
  const banner = document.getElementById("greeting-banner");
  if (banner) banner.textContent = "Welcome back! Ready to study smarter?";
}
showGreeting();

// =====================
// Calculator (generator page only)
// =====================
if (form) {
  const topicInput = document.getElementById("topic");
  const shuffleCheck = document.querySelector('input[name="shuffle"]');

  function calculate() {
    const topic = topicInput ? topicInput.value : "";
    const numCards = getSelectedDeckSize();
    if (!hasValidInputs(topic, numCards)) {
      const existing = document.getElementById("calculator-result");
      if (existing) existing.textContent = "";
      return;
    }
    const minutes = computeStudyMinutes(numCards, !!(shuffleCheck && shuffleCheck.checked));
    const totals = computeCost(numCards, PRICE_PER_CARD);
    renderEstimate(topic.trim(), numCards, minutes, totals);
  }

  // Event listeners
  if (topicInput) topicInput.addEventListener("input", calculate);
  sizeRadios.forEach(r => r.addEventListener("change", calculate));
  if (shuffleCheck) shuffleCheck.addEventListener("change", calculate);

  // Initial run
  calculate();
}