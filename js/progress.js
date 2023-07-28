function fetchAllUserProgress() {
  const userProgress = JSON.parse(localStorage.getItem("userProgress")) || [];
  return userProgress;
}

function displayUserProgressTable() {
  const userProgress = fetchAllUserProgress();

  const tableBody = document.getElementById("progress-table-body");

  tableBody.innerHTML = "";

  userProgress.forEach((progress, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${progress.wpm}</td>
        <td>${progress.cpm}</td>
        <td>${progress.mistakes}</td>
        <td>${progress.accuracy}</td>
        <td>${new Date(progress.timestamp).toLocaleString()}</td>
      `;
    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayUserProgressTable();
});
