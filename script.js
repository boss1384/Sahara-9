// =======================
// SAHARA FLASH PRO MAX
// FIXED VERSION (REAL API)
// =======================

const API_KEY = "da01d7158a60be461c607c6d31470b4e";
const BASE_URL = "https://v3.football.api-sports.io";

// =======================
// API CALL
// =======================

async function apiCall(endpoint, params = {}) {

    const url = new URL(BASE_URL + endpoint);

    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

    try {

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "x-apisports-key": API_KEY
            }
        });

        const data = await res.json();

        if (!data.response) return [];

        return data.response;

    } catch (error) {

        console.log("API ERROR:", error);

        return [];
    }
}

// =======================
// SHOW SECTION
// =======================

function showSection(section) {

    document.querySelectorAll(".section")
        .forEach(s => s.classList.remove("active"));

    document.getElementById(section + "-section")
        .classList.add("active");

    if (section === "live") loadLiveMatches();
    if (section === "fixtures") loadFixtures();
    if (section === "standings") loadStandings();
    if (section === "news") loadNews();
}

// =======================
// LIVE MATCHES
// =======================

async function loadLiveMatches() {

    const box = document.getElementById("live-matches");

    box.innerHTML = "<p>Loading live matches...</p>";

    const matches = await apiCall("/fixtures", { live: "all" });

    box.innerHTML = "";

    if (!matches.length) {
        box.innerHTML = "<p>No live matches now</p>";
        return;
    }

    matches.forEach(m => {

        const card = document.createElement("div");
        card.className = "match-card";

        card.innerHTML = `
            <div class="match-header">
                <div>${m.league.name}</div>
                <div>🔴 LIVE ${m.fixture.status.elapsed || 0}'</div>
            </div>

            <div class="teams">
                <div>${m.teams.home.name}</div>

                <div class="score">
                    ${m.goals.home ?? 0} - ${m.goals.away ?? 0}
                </div>

                <div>${m.teams.away.name}</div>
            </div>
        `;

        box.appendChild(card);
    });
}

// =======================
// FIXTURES
// =======================

async function loadFixtures() {

    const box = document.getElementById("fixtures");

    box.innerHTML = "<p>Loading fixtures...</p>";

    const matches = await apiCall("/fixtures", { next: 20 });

    box.innerHTML = "";

    if (!matches.length) {
        box.innerHTML = "<p>No fixtures found</p>";
        return;
    }

    matches.forEach(m => {

        const card = document.createElement("div");
        card.className = "match-card";

        card.innerHTML = `
            <div class="match-header">
                <div>${m.league.name}</div>
                <div>${new Date(m.fixture.date).toLocaleString()}</div>
            </div>

            <div class="teams">
                <div>${m.teams.home.name}</div>
                <div class="score">VS</div>
                <div>${m.teams.away.name}</div>
            </div>
        `;

        box.appendChild(card);
    });
}

// =======================
// STANDINGS
// =======================

async function loadStandings() {

    const box = document.getElementById("standings-body");

    box.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    const data = await apiCall("/standings", {
        league: 39,
        season: 2025
    });

    box.innerHTML = "";

    if (!data.length) {
        box.innerHTML = "<tr><td colspan='3'>No data</td></tr>";
        return;
    }

    const table = data[0].league.standings[0];

    table.forEach(team => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${team.rank}</td>
            <td>${team.team.name}</td>
            <td>${team.points}</td>
        `;

        box.appendChild(row);
    });
}

// =======================
// NEWS
// =======================

function loadNews() {

    document.getElementById("news-content").innerHTML = `
        <p>⚽ Live football updates active</p>
        <p>🔥 Transfer news coming soon</p>
        <p>🏆 European leagues available</p>
    `;
}

// =======================
// SEARCH
// =======================

function searchTeams() {

    const input = document.getElementById("searchInput")
        .value.toLowerCase();

    document.querySelectorAll(".match-card")
        .forEach(card => {

            const text = card.innerText.toLowerCase();

            card.style.display =
                text.includes(input) ? "block" : "none";
        });
}

// =======================
// AUTO LOAD
// =======================

window.onload = () => {

    loadLiveMatches();

    setInterval(() => {

        if (document.getElementById("live-section").classList.contains("active")) {
            loadLiveMatches();
        }

    }, 30000);
};
