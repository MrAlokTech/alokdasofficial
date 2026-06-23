/* ── CONSTANTS & DOM ── */
const BASE = "https://speed.cloudflare.com";
const $ = (id) => document.getElementById(id);
const num = $("numDisplay");
const unit = $("unitDisplay");
const phase = $("phaseLabel");
const needle = $("gaugeNeedle");
const needleLine = $("needleLine");
const btn = $("startBtn");
const errMsg = $("errMsg");
const server = $("serverInfo");

const cards = { ping: $("pingCard"), dl: $("dlCard"), ul: $("ulCard") };
const vals = { ping: $("pingVal"), dl: $("dlVal"), ul: $("ulVal") };

/* ── DASHBOARD SETUP ── */
function initTicks() {
    const tickGroup = $("gaugeTicks");
    const totalTicks = 40;

    for (let i = 0; i <= totalTicks; i++) {
        const angle = -135 + (i / totalTicks) * 270;
        const isMajor = i % 5 === 0;

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line",
        );
        line.setAttribute("x1", 130);
        line.setAttribute("x2", 130);
        line.setAttribute("y1", isMajor ? 12 : 20);
        line.setAttribute("y2", 28);

        // Using CSS variables ensures ticks update seamlessly when theme toggles
        line.setAttribute(
            "stroke",
            isMajor ? "var(--text3)" : "var(--border)",
        );
        line.setAttribute("stroke-width", isMajor ? "2" : "1.5");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("transform", `rotate(${angle} 130 130)`);

        tickGroup.appendChild(line);
    }
}
initTicks();

/* ── HELPERS ── */
function fmt(v, dp = 1) {
    if (v == null) return "—";
    return v >= 100 ? Math.round(v).toString() : v.toFixed(dp);
}

function setGauge(speed, maxMbps) {
    const ratio = Math.min(speed / maxMbps, 1);
    const angle = -135 + ratio * 270;
    needle.style.transform = `rotate(${angle}deg)`;
}

function setNum(v, dp = 1) {
    num.textContent = v == null ? "—" : fmt(v, dp);
}

function setPhase(text, live = false) {
    phase.textContent = text;
    phase.className = "phase" + (live ? " live" : "");
}

function highlightCard(key) {
    Object.entries(cards).forEach(([k, el]) => {
        // Retain 'done' class if it was already marked done
        const isDone = el.classList.contains("done");
        el.className =
            "stat" +
            (k === key ? " active" : "") +
            (isDone && k !== key ? " done" : "");
    });
}

function markCard(key, value, unitStr) {
    const el = vals[key];
    el.innerHTML = `${fmt(value, key === "ping" ? 0 : 1)}<span class="unit"> ${unitStr}</span>`;
    cards[key].classList.add("done");
}

function resetUI() {
    setNum(null);
    unit.textContent = "Mbps";
    setPhase("Ready to test");
    needle.style.transform = `rotate(-135deg)`;
    needleLine.style.stroke = "var(--accent)";
    errMsg.textContent = "";
    Object.entries(cards).forEach(([k, el]) => {
        el.className = "stat";
        vals[k].innerHTML = `—<span class="unit">  </span>`;
    });
}

/* ── MEASUREMENT FUNCTIONS ── */
async function measurePing() {
    const times = [];
    for (let i = 0; i < 8; i++) {
        const t = performance.now();
        await fetch(`${BASE}/__down?bytes=200&_=${t}`, { cache: "no-store" });
        times.push(performance.now() - t);
    }
    times.sort((a, b) => a - b);
    const trimmed = times.slice(0, 6);
    return trimmed.reduce((s, t) => s + t, 0) / trimmed.length;
}

async function measureDownload(onProgress) {
    const plan = [500e3, 2e6, 5e6, 10e6, 25e6];
    let totalBits = 0,
        totalTime = 0;

    for (const bytes of plan) {
        const url = `${BASE}/__down?bytes=${bytes}&_=${Date.now()}`;
        const t0 = performance.now();
        const res = await fetch(url, { cache: "no-store" });
        const rdr = res.body.getReader();
        let got = 0;

        while (true) {
            const { done, value } = await rdr.read();
            if (done) break;
            got += value.byteLength;
            const elapsed = (performance.now() - t0) / 1000;
            if (elapsed > 0.05) {
                onProgress((got * 8) / elapsed / 1e6);
            }
        }
        const elapsed = (performance.now() - t0) / 1000;
        totalBits += got * 8;
        totalTime += elapsed;
    }
    return totalBits / totalTime / 1e6;
}

async function measureUpload(onProgress) {
    const plan = [256e3, 1e6, 3e6, 8e6];
    let totalBits = 0,
        totalTime = 0;

    for (const bytes of plan) {
        const buf = new Uint8Array(bytes);
        crypto.getRandomValues(buf.subarray(0, Math.min(bytes, 65536)));

        const t0 = performance.now();
        await fetch(`${BASE}/__up`, {
            method: "POST",
            body: buf,
            cache: "no-store",
            headers: { "Content-Type": "text/plain" },
        });
        const elapsed = (performance.now() - t0) / 1000;
        totalBits += bytes * 8;
        totalTime += elapsed;
        onProgress(totalBits / totalTime / 1e6);
    }
    return totalBits / totalTime / 1e6;
}

async function fetchTrace() {
    try {
        const r = await fetch(`${BASE}/cdn-cgi/trace`, { cache: "no-store" });
        const text = await r.text();
        const data = {};
        text
            .trim()
            .split("\n")
            .forEach((l) => {
                const [k, ...v] = l.split("=");
                if (k) data[k] = v.join("=");
            });
        return data;
    } catch {
        return null;
    }
}

/* ── MAIN TEST RUNNER ── */
let testing = false;

async function runTest() {
    if (testing) return;
    testing = true;
    btn.disabled = true;
    btn.textContent = "Testing…";
    resetUI();
    needle.classList.remove("instant");

    fetchTrace().then((d) => {
        if (!d) return;
        const parts = [];
        if (d.ip) parts.push(`<span class="val">${d.ip}</span>`);
        if (d.loc) parts.push(`<span class="val">${d.loc}</span>`);
        if (d.colo) parts.push(`Server <span class="val">${d.colo}</span>`);
        server.innerHTML = parts.join(" · ");
    });

    try {
        /* Phase 1 — Ping */
        setPhase("Measuring ping…", true);
        highlightCard("ping");
        unit.textContent = "ms";
        needleLine.style.stroke = "var(--text2)";

        const ping = await measurePing();
        setNum(ping, 0);
        setGauge(Math.min(ping, 300), 300);
        markCard("ping", ping, "ms");
        await sleep(400);

        /* Phase 2 — Download */
        setPhase("Testing download…", true);
        highlightCard("dl");
        unit.textContent = "Mbps";
        setNum(0);
        needle.style.transform = `rotate(-135deg)`;
        needleLine.style.stroke = "var(--text)";

        let dlMax = 80;
        let dlLast = 0;

        const dlResult = await measureDownload((speed) => {
            dlLast = speed;
            if (speed > dlMax * 0.85) dlMax = speed * 1.4;
            setNum(speed);
            setGauge(speed, dlMax);
            vals.dl.innerHTML = `${fmt(speed)}<span class="unit"> Mbps</span>`;
        });

        markCard("dl", dlResult, "Mbps");
        setNum(dlResult);
        setGauge(dlResult, dlMax);
        await sleep(500);

        /* Phase 3 — Upload */
        setPhase("Testing upload…", true);
        highlightCard("ul");
        setNum(0);
        needle.style.transform = `rotate(-135deg)`;
        needleLine.style.stroke = "var(--text2)";

        let ulMax = Math.max(dlResult * 0.5, 20);

        const ulResult = await measureUpload((speed) => {
            if (speed > ulMax * 0.85) ulMax = speed * 1.4;
            setNum(speed);
            setGauge(speed, ulMax);
            vals.ul.innerHTML = `${fmt(speed)}<span class="unit"> Mbps</span>`;
        });

        markCard("ul", ulResult, "Mbps");
        setNum(ulResult);
        setGauge(ulResult, ulMax);

        /* Done */
        await sleep(400);
        setPhase("Test complete");

        // Clean up highlights, leave "done" state active
        Object.values(cards).forEach((el) => el.classList.remove("active"));

        // Reset Speedometer
        needle.style.transform = `rotate(-135deg)`;
        needleLine.style.stroke = "var(--accent)";
        setNum(null);
    } catch (e) {
        setPhase("Test failed");
        errMsg.textContent =
            "Could not reach speed server — check your connection.";
        needle.style.transform = `rotate(-135deg)`;
        needleLine.style.stroke = "var(--danger)";
        console.error(e);
    }

    testing = false;
    btn.disabled = false;
    btn.textContent = "Test Again";
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
