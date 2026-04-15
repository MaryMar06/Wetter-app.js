
const input = document.getElementById("StadtInput");
const button = document.getElementById("addierenButton");
const table = document.getElementById("WetterTable");
const error = document.getElementById("error");

// API-Schlüssel von OpenWeatherMap
const API_KEY = "4fb1ee1018945ed729683a00b00ee082";
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") { 
        button.click(); 
    }
});
button.onclick = () => {
    const stadt = input.value.trim(); // Stadt aus dem Eingabefeld
    if (!stadt) {
        error.textContent = "Bitte eine Stadt eingeben";
        return;
    }

    getWeather(stadt); // Wetterdaten abrufen
    input.value = "";   
    error.textContent = "";
};

async function getWeather(stadt) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${stadt}&appid=${API_KEY}&units=metric&lang=de`
        );
        const data = await res.json();
        console.log(data);

        if (Number(data.cod) !== 200) {
            error.textContent = "Stadt nicht gefunden";
            return;
        }

        renderWeather(data); // Daten in Tabelle einfügen

    } catch (err) {
        error.textContent = "Fehler beim Laden";
        console.error(err);
    }
}

// Wetterdaten in die Tabelle einfügen
function renderWeather(data) {
    const row = document.createElement("tr");

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.main.temp} °C</td>
        <td>${data.main.feels_like} °C</td>
        <td><img src="${iconUrl}"> ${data.weather[0].description}</td>
        <td><button class´="deletedButton" onclick="this.closest('tr').remove()">❌</button></td>
    `;

    table.appendChild(row);
}
// Speichert die aktuelle Tabelle in LocalStorage
function saveCities() {
    const rows = table.querySelectorAll("tr");
    const cities = [];
    rows.forEach(row => {
        const name = row.children[0].textContent;
        const temp = row.children[1].textContent;
        const weather = row.children[2].innerHTML; // inklusive Icon
        cities.push({name, temp, weather});
    });
    localStorage.setItem("cities", JSON.stringify(cities));
}
// Lädt gespeicherte Städte aus LocalStorage
function loadCities() {
    const saved = localStorage.getItem("cities");
    if (!saved) return;
    const cities = JSON.parse(saved);

    cities.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.name}</td>
            <td>${c.temp}</td>
            <td>${c.weather}</td>
            <td><button onclick="this.closest('tr').remove(); saveCities()">❌</button></td>
        `;
        table.appendChild(row);
    });
}

// Beim Laden der Seite ausführen
window.onload = loadCities;
