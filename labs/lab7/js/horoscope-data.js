const zodiacSign = "Libra";
const birthMonth = "October";
const birthday = 13;
const luckyNumber = 5;
const horoscopeDescription = "diplomatic, sociable, and charming, with a love for beauty and partnership";
const believeInAstrology = false;

// match existing HTML
document.querySelector("h1").textContent = zodiacSign;


document.querySelector(".birthday").textContent = "Birthday: " + birthMonth + " " + birthday + "rd";


document.querySelector(".luckyNum").textContent = "Lucky Number: " + luckyNumber;


var paragraphs = document.querySelectorAll("p");


paragraphs[0].textContent = horoscopeDescription;
paragraphs[1].innerHTML += "<b>" + believeInAstrology + "</b>";

// Mood ratings

if (paragraphs[2]) {
    paragraphs[2].id = "moodRating"; // Assign an ID to the third paragraph for easy selection
}
const myMoodRating = 4.5; 
const partner1MoodRating = 3.8; 
const partner2MoodRating = 4.0; 

// Calculate average mood rating
const averageMoodRating = ((myMoodRating + partner1MoodRating + partner2MoodRating) / 3).toFixed(1);

// Select the new paragraph and display the message
const moodParagraph = document.getElementById("moodRating");
if (moodParagraph) {
    moodParagraph.textContent = `Today's mood rating for Libra: ${myMoodRating} out of 5. The average mood rating of Libra, Leo, and Gemini is: ${averageMoodRating}.`;
}

