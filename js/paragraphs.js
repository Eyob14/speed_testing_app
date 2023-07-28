export default async function fetchParagraph() {
  const response = await fetch(
    "https://baconipsum.com/api/?type=meat-and-filler"
  );
  const data = await response.json();
  return data.join(" ");
}

// if (charIndex >= characters.length - 1 || timeLeft === 0) {
//   const userProgress = {
//     mistakes: mistakes,
//     wpm: parseInt(wpmTag.innerText),
//     cpm: parseInt(cpmTag.innerText),
//     accuracy: parseFloat(accuracy),
//     timestamp: new Date().toISOString(),
//   };

//   // Fetch existing user progress from local storage
//   const existingUserProgress =
//     JSON.parse(localStorage.getItem("userProgress")) || [];

//   // Add the new progress to the existing progress array
//   existingUserProgress.push(userProgress);

//   // Save the updated progress array back to local storage
//   localStorage.setItem("userProgress", JSON.stringify(existingUserProgress));
//   console.log("Stored in local storage:", userProgress);
// }
