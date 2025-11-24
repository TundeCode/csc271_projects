
/*
  Author: Babatunde Fakolujo
  Date: 2025-11-24
  File: deck.js
  Desc: Class-based object model for QuickCards decks + demo render.
        AI-assisted suggestion: class skeleton, pricing & time helpers.
        See detailed AI notes in coursework documentation.
*/

// Constants aligned with existing site behavior
const PRICE_PER_CARD = 0.25;      // matches pricing hints
const STUDY_SECONDS_PER_CARD = 30;// base; shuffle adds small penalty

class Deck {
  constructor({ topic, size, shuffle=false, definitionsFirst=false, cards=[],
                pricePerCard = PRICE_PER_CARD }) {
    this.topic = topic;
    this.size = size;
    this.shuffle = !!shuffle;
    this.definitionsFirst = !!definitionsFirst;
    this.cards = Array.isArray(cards) ? cards.slice(0, size) : [];
    this.pricePerCard = pricePerCard;
    this.createdAt = new Date();
  }

  // --- Behavior ---
  estimateStudyMinutes() {
    let per = STUDY_SECONDS_PER_CARD + (this.shuffle ? 5 : 0);
    const seconds = Math.max(0, this.size) * per;
    return Math.ceil(seconds / 60);
  }

  getSubtotal() {
    return this.size * this.pricePerCard;
  }

  getDiscountRate() {
    if (this.size >= 30) return 0.15;
    if (this.size >= 20) return 0.10;
    return 0;
  }

  getTotal() {
    const rate = this.getDiscountRate();
    return this.getSubtotal() * (1 - rate);
  }

  addCard(card) {
    if (this.cards.length < this.size) this.cards.push(card);
  }

  removeCard(index) {
    if (index >= 0 && index < this.cards.length) this.cards.splice(index, 1);
  }

  toggleShuffle() { this.shuffle = !this.shuffle; }
  toggleDefinitionsFirst() { this.definitionsFirst = !this.definitionsFirst; }

  // Simple preview for the page
  toHTML() {
    const mins = this.estimateStudyMinutes();
    const rate = this.getDiscountRate();
    const total = this.getTotal().toFixed(2);
    const badge = (mins <= 2 && this.size <= 10) ? "(Quick session)" : "";
    return `
      <article class="card">
        <h3>Deck: ${this.topic}</h3>
        <p><strong>Cards:</strong> ${this.size} • <strong>Shuffle:</strong> ${this.shuffle ? "On" : "Off"} • <strong>Defs First:</strong> ${this.definitionsFirst ? "Yes" : "No"}</p>
        <p><strong>Study Time:</strong> ~${mins} min <em>${badge}</em></p>
        <p><strong>Cost:</strong> $${total} ${rate ? `<span style="color:green;">(${rate*100}% off)</span>` : ""}</p>
        <details>
          <summary>Show first 3 cards</summary>
          <ol>${this.cards.slice(0,3).map(c => `<li><strong>${c.term}:</strong> ${c.definition}</li>`).join("")}</ol>
        </details>
      </article>`;
  }
}

// ================= Demo wiring =================
// If a #deck-demo container exists, render two example objects
(function renderDeckExamples() {
  const mount = document.getElementById("deck-demo");
  if (!mount) return;

  const ww2 = new Deck({
    topic: "World War II",
    size: 10,
    shuffle: true,
    definitionsFirst: false,
    cards: [
      { term: "Allied Powers", definition: "US, UK, USSR and allies against Axis." },
      { term: "Axis Powers", definition: "Germany, Italy, Japan alliance." },
      { term: "D-Day", definition: "Allied invasion of Normandy, June 6, 1944." },
    ]
  });

  const cells = new Deck({
    topic: "Cell Parts",
    size: 20,
    shuffle: false,
    definitionsFirst: true,
    cards: [
      { term: "Mitochondria", definition: "ATP production via cellular respiration." },
      { term: "Ribosome", definition: "Builds proteins from amino acids." },
      { term: "Golgi", definition: "Modifies and packages proteins/lipids." },
    ]
  });

  mount.innerHTML = "<h2>Deck Model Demo</h2>" + ww2.toHTML() + cells.toHTML();
})();
