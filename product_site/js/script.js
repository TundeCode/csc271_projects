/*
  Author: Babatunde Fajolujo
  Date: 2025-10-25
  File: script.js
  Desc: Simple calculator for the flashcard generator that estimates
        study time and cost based on deck size and options.
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

// getElementById - select the main title
const mainTitle = document.getElementById("main-title");

// getElementsByClassName - select all navigation links
const navLinks = document.getElementsByClassName("nav-link");

// getElementsByTagName - select all paragraphs
const paragraphs = document.getElementsByTagName("p");

// querySelector - select the form (only on generator page)
const form = document.querySelector("form");

// querySelectorAll - select radio buttons for deck size
const sizeRadios = document.querySelectorAll('input[name="size"]');

// =====================
// Update page content
// =====================

// Use textContent to update the main title (if it exists)
if (mainTitle) {
  mainTitle.textContent = SITE_NAME + " - Study Tool";
}

// Use innerHTML to add a tip to the first paragraph (not on generator page)
if (paragraphs.length > 0 && !form) {
  const firstParagraph = paragraphs[0];
  firstParagraph.innerHTML = firstParagraph.innerHTML + 
    " <em><strong>Tip:</strong> Try our calculator on the Generator page!</em>";
}

// =====================
// Calculator (only runs on generator page)
// =====================

if (form) {
  // Select input fields
  const topicInput = document.getElementById("topic");
  const shuffleCheck = document.querySelector('input[name="shuffle"]');
  
  // Create a result area to show calculations
  const resultDiv = document.createElement("div");
  resultDiv.id = "calculator-result";
  form.insertAdjacentElement("afterend", resultDiv);

  // Function to calculate and display results
  function calculate() {
    // Get values
    const topic = topicInput.value.trim();
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const numCards = selectedSize ? Number(selectedSize.value) : 0;
    
    // Only show results if we have valid input
    if (!topic || numCards === 0) {
      resultDiv.textContent = "";
      return;
    }

    // =====================
    // Arithmetic calculations
    // =====================
    
    // Calculate study time
    let timePerCard = STUDY_SECONDS_PER_CARD;
    if (shuffleCheck && shuffleCheck.checked) {
      timePerCard = timePerCard + 5; // Add extra time for shuffle mode
    }
    const totalSeconds = numCards * timePerCard;
    const minutes = Math.ceil(totalSeconds / 60);
    
    // Calculate cost with bulk discount
    const subtotal = numCards * PRICE_PER_CARD;
    const discount = numCards >= 20 ? subtotal * 0.10 : 0;
    const total = subtotal - discount;

    // =====================
    // Display results using innerHTML
    // =====================
    resultDiv.innerHTML = 
      "<h3>Estimate for Your Deck:</h3>" +
      "<p><strong>Topic:</strong> " + topic + "</p>" +
      "<p><strong>Cards:</strong> " + numCards + "</p>" +
      "<p><strong>Study Time:</strong> <em>~" + minutes + " minutes</em></p>" +
      "<p><strong>Cost:</strong> $" + total.toFixed(2) + 
      (discount > 0 ? " <span style='color: green;'>(10% discount applied!)</span>" : "") + 
      "</p>";
  }

  // Add event listeners to update calculator
  topicInput.addEventListener("input", calculate);
  sizeRadios.forEach(radio => {
    radio.addEventListener("change", calculate);
  });
  if (shuffleCheck) {
    shuffleCheck.addEventListener("change", calculate);
  }

  // Run calculation once on page load
  calculate();
}