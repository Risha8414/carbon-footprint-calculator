document.getElementById("footprint-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const transport = parseFloat(document.getElementById("transport").value);
    const electricity = parseFloat(document.getElementById("electricity").value);
    const meat = parseFloat(document.getElementById("meat").value);
    const waste = parseFloat(document.getElementById("waste").value);
    const location = document.getElementById("location").value;
  
    const electricityFactorMap = {
      india: 0.82 * 12,
      usa: 0.45 * 12,
      germany: 0.36 * 12
    };
  
    const transportFactor = 0.21 * 52;
    const electricityFactor = electricityFactorMap[location] || 0.5 * 12;
    const meatFactor = 7 * 52;
    const wasteFactor = 0.9 * 52;
  
    const transportEmission = transport * transportFactor;
    const electricityEmission = electricity * electricityFactor;
    const meatEmission = meat * meatFactor;
    const wasteEmission = waste * wasteFactor;
  
    const totalEmission = transportEmission + electricityEmission + meatEmission + wasteEmission;
  
    document.getElementById("total-emission").innerText = totalEmission.toFixed(2);
  
    const statusEl = document.getElementById("status");
    if (totalEmission < 4000) {
      statusEl.innerText = "Low";
      statusEl.style.backgroundColor = "green";
    } else if (totalEmission < 8000) {
      statusEl.innerText = "Moderate";
      statusEl.style.backgroundColor = "orange";
    } else {
      statusEl.innerText = "High";
      statusEl.style.backgroundColor = "red";
    }
  
    drawBarChart([transportEmission, electricityEmission, meatEmission, wasteEmission]);
    drawPieChart([transportEmission, electricityEmission, meatEmission, wasteEmission]);
  
    // Suggestions
    const suggestions = [];
    if (transportEmission > 2000) suggestions.push("🚗 Try carpooling or using public transportation.");
    if (electricityEmission > 2000) suggestions.push("💡 Use energy-efficient devices and unplug unused electronics.");
    if (meatEmission > 2000) suggestions.push("🥦 Try eating more plant-based meals.");
    if (wasteEmission > 1000) suggestions.push("🗑️ Recycle more and reduce plastic usage.");
  
    const suggestionsList = document.getElementById("suggestions-list");
    suggestionsList.innerHTML = "";
    suggestions.slice(0, 3).forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      suggestionsList.appendChild(li);
    });
  });
  
  // Chart rendering
  let barChart, pieChart;
  
  function drawBarChart(data) {
    const ctx = document.getElementById("barChart").getContext("2d");
    if (barChart) barChart.destroy();
    barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Transport", "Electricity", "Meat", "Waste"],
        datasets: [{
          label: "Emissions (kg CO₂/year)",
          data: data,
          backgroundColor: ["#264653", "#2a9d8f", "#e76f51", "#f4a261"],
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }
  
  function drawPieChart(data) {
    const ctx = document.getElementById("pieChart").getContext("2d");
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Transport", "Electricity", "Meat", "Waste"],
        datasets: [{
          data: data,
          backgroundColor: ["#264653", "#2a9d8f", "#e76f51", "#f4a261"],
        }]
      },
      options: { responsive: true }
    });
  }
  