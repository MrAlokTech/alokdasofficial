/* ---------- Scheduling engine ---------- */

const STUDY_START = new Date(2026, 7, 1); // Aug 1, 2026 — fixed, not "today" on reload
STUDY_START.setHours(0, 0, 0, 0);

const TARGET_EXAM_DATE = new Date(2028, 1, 3); // Feb 3, 2028
TARGET_EXAM_DATE.setHours(0, 0, 0, 0);

const SECTION_LABEL = { physical: 'Physical', inorganic: 'Inorganic', organic: 'Organic' };

// Deterministic PRNG (mulberry32) — same seed always produces the same shuffle,
// so the "random" week order is fixed forever, not re-rolled per session.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, seed) {
  const rand = mulberry32(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const WEEK_SEED = 20280219; // fixed forever — do not change, or everyone's order shifts
const WEEK_ORDER = seededShuffle(TOPICS.map((_, i) => i), WEEK_SEED);
const CYCLE_WEEKS = TOPICS.length;
const CYCLE_DAYS = CYCLE_WEEKS * 7;

function daysBetween(a, b) {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / 86400000);
}

function scheduleFor(dateObj) {
  const d = new Date(dateObj);
  d.setHours(0, 0, 0, 0);
  const diff = daysBetween(STUDY_START, d);
  const effectiveDiff = Math.max(0, diff);
  const round = Math.floor(effectiveDiff / CYCLE_DAYS) + 1;
  const posInCycle = effectiveDiff % CYCLE_DAYS;
  const weekInCycle = Math.floor(posInCycle / 7);
  const dayInWeek = posInCycle % 7; // 0-4 study, 5-6 review
  const topicIdx = WEEK_ORDER[weekInCycle];
  const topic = TOPICS[topicIdx];
  const isReview = dayInWeek > 4;
  const entry = isReview ? null : topic.days[dayInWeek];
  return {
    diff, round, weekInCycle, dayInWeek, topicIdx, topic, isReview, entry,
    globalDayIndex: diff, // stable unique key for progress tracking
    weekStart: new Date(STUDY_START.getTime() + (effectiveDiff - dayInWeek) * 86400000),
  };
}

/* ---------- Progress storage (localStorage) ---------- */

const STORE_KEY = 'gate2028_progress_v1';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : { done: {} };
  } catch (e) { return { done: {} }; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { }
}
let PROGRESS = loadProgress();

function dayKey(globalDayIndex) { return 'd' + globalDayIndex; }

function isDone(globalDayIndex) { return !!PROGRESS.done[dayKey(globalDayIndex)]; }

function setDone(globalDayIndex, val) {
  if (val) PROGRESS.done[dayKey(globalDayIndex)] = Date.now();
  else delete PROGRESS.done[dayKey(globalDayIndex)];
  saveProgress(PROGRESS);
}

function getMaxCompletedDayIndex() {
  const keys = Object.keys(PROGRESS.done);
  if (keys.length === 0) return -1;
  const indices = keys.map(k => parseInt(k.replace('d', ''), 10)).filter(n => !isNaN(n));
  return indices.length > 0 ? Math.max(...indices) : -1;
}

function getMaxReachedDayIndex() {
  const maxDone = getMaxCompletedDayIndex();
  const currentViewSched = scheduleFor(currentViewDate);
  return Math.max(todaySchedule.globalDayIndex, maxDone, currentViewSched.globalDayIndex);
}

function computeStreak(today) {
  let streak = 0;
  let cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  const maxIterations = 1000;
  let iterations = 0;
  while (iterations < maxIterations) {
    iterations++;
    const s = scheduleFor(cursor);
    if (s.diff < 0) break;
    if (isDone(s.globalDayIndex)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
      cursor.setHours(0, 0, 0, 0);
    } else {
      break;
    }
  }
  return streak;
}

/* ---------- Rendering ---------- */

const $ = sel => document.querySelector(sel);
const todayObj = new Date();
todayObj.setHours(0, 0, 0, 0);
const todaySchedule = scheduleFor(todayObj);

let currentViewDate = new Date(todayObj);
let calViewDate = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1);

function fmtDate(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function renderAll(animateCard = false) {
  calViewDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), 1);
  renderHero();
  renderStats();
  renderWeekStrip();
  renderRoadmap();
  renderCalendar();
  if (animateCard) {
    playDrawAnimation();
  }
}

function renderHero() {
  const current = scheduleFor(currentViewDate);
  const root = $('#hero-card');
  root.className = '';
  const sectionClass = 'sec-' + current.topic.section;
  root.classList.add(sectionClass);

  const weekNum = current.weekInCycle + 1;
  const dayNum = current.dayInWeek + 1;

  const isRealToday = current.diff === todaySchedule.diff;
  const dayLabel = isRealToday ? 'Today' : fmtDate(currentViewDate);

  const eyebrow = `Week ${weekNum} · Day ${dayNum} of 7 · ${dayLabel}${current.round > 1 ? ` · Round ${current.round}` : ''}`;
  const doneState = isDone(current.globalDayIndex);

  let doneBtnText = '';
  if (doneState) {
    doneBtnText = '✓ Marked done';
  } else if (isRealToday) {
    doneBtnText = 'Mark today done';
  } else {
    doneBtnText = `Mark Day ${dayNum} done`;
  }

  if (current.isReview) {
    root.innerHTML = `
      <div class="card-eyebrow">${eyebrow} <span class="tag tag-${current.topic.section}">${SECTION_LABEL[current.topic.section]}</span></div>
      <h1 class="card-title">Review &amp; Recall</h1>
      <p class="card-sub">No new capsule today — close the loop on "<strong>${current.topic.title}</strong>" instead.</p>
      <ul class="card-bullets">
        <li>Recall this week's five capsules without looking, in one line each.</li>
        <li>Redo any formula or mechanism that didn't come from memory.</li>
        <li>Skim ahead — glance at next week's topic in the roadmap below.</li>
      </ul>
      <button class="btn-done" id="mark-done" aria-pressed="${doneState}">
        ${doneBtnText}
      </button>
    `;
  } else {
    const e = current.entry;
    root.innerHTML = `
      <div class="card-eyebrow">${eyebrow} <span class="tag tag-${current.topic.section}">${SECTION_LABEL[current.topic.section]}</span></div>
      <div class="card-topic">${current.topic.title}</div>
      <h1 class="card-title">${e.t}</h1>
      <ul class="card-bullets">
        ${e.b.map(x => `<li>${x}</li>`).join('')}
      </ul>
      <div class="card-tip"><span class="tip-label">Exam tip</span> ${e.tip}</div>
      <button class="btn-done" id="mark-done" aria-pressed="${doneState}">
        ${doneBtnText}
      </button>
    `;
  }

  $('#mark-done').addEventListener('click', () => {
    const wasDone = isDone(current.globalDayIndex);
    const nowDone = !wasDone;
    setDone(current.globalDayIndex, nowDone);

    if (nowDone) {
      const nextDate = new Date(currentViewDate);
      nextDate.setDate(nextDate.getDate() + 1);
      currentViewDate = nextDate;
      renderAll(true);
    } else {
      renderAll(false);
    }
  });
}

function renderStats() {
  const daysLeft = Math.max(0, daysBetween(todayObj, TARGET_EXAM_DATE));
  const streak = computeStreak(todayObj);
  const doneCount = Object.keys(PROGRESS.done).length;
  const current = scheduleFor(currentViewDate);

  if ($('#stat-days-left')) $('#stat-days-left').textContent = daysLeft;
  if ($('#banner-days-left')) $('#banner-days-left').textContent = daysLeft;
  $('#stat-streak').textContent = streak;
  $('#stat-done').textContent = doneCount;
  $('#stat-cycle').textContent = `Round ${current.round}`;
}

function renderWeekStrip() {
  const wrap = $('#week-strip');
  wrap.innerHTML = '';
  const current = scheduleFor(currentViewDate);
  const maxReached = getMaxReachedDayIndex();

  for (let i = 0; i < 7; i++) {
    const d = new Date(current.weekStart.getTime() + i * 86400000);
    const s = scheduleFor(d);
    const idx = s.globalDayIndex;

    const isToday = (s.diff === todaySchedule.diff);
    const isCompleted = isDone(idx);
    const isSkipped = (!isCompleted && !isToday && idx >= 0 && idx < maxReached);

    const dot = document.createElement('div');
    dot.className = 'day-dot';
    if (isToday) dot.classList.add('is-today');
    if (i === current.dayInWeek) dot.classList.add('is-active');
    if (isCompleted) dot.classList.add('is-done');
    else if (isSkipped) dot.classList.add('is-skipped');
    if (s.isReview) dot.classList.add('is-review');

    dot.title = `${fmtDate(d)}${s.isReview ? ' — review' : ' — ' + s.entry.t}`;
    dot.textContent = s.isReview ? 'R' : String(i + 1);
    dot.addEventListener('click', () => {
      currentViewDate = new Date(d);
      renderAll(true);
    });
    wrap.appendChild(dot);
  }
}

function renderRoadmap() {
  const wrap = $('#roadmap');
  wrap.innerHTML = '';
  const current = scheduleFor(currentViewDate);
  const maxReached = getMaxReachedDayIndex();

  WEEK_ORDER.forEach((topicIdx, weekInCycle) => {
    const topic = TOPICS[topicIdx];
    const weekStartOffset = weekInCycle * 7;
    const weekStartDate = new Date(STUDY_START.getTime() + weekStartOffset * 86400000);
    const isCurrentWeek = weekInCycle === current.weekInCycle;

    const item = document.createElement('div');
    item.className = 'roadmap-item sec-' + topic.section + (isCurrentWeek ? ' is-current open' : '');

    const daysHtml = topic.days.map((day, i) => {
      const globalIdx = weekStartOffset + i;
      const done = isDone(globalIdx);
      const isToday = (globalIdx === todaySchedule.globalDayIndex);
      const skipped = (!done && !isToday && globalIdx >= 0 && globalIdx < maxReached);
      const isSelected = globalIdx === current.globalDayIndex;

      let itemClass = '';
      if (done) itemClass = 'done';
      else if (skipped) itemClass = 'skipped';
      if (isSelected) itemClass += ' is-selected';

      return `<li class="${itemClass.trim()}" data-global-idx="${globalIdx}"><span class="rd-day">Day ${i + 1}</span><span class="rd-title">${day.t}</span></li>`;
    }).join('');

    item.innerHTML = `
      <button class="roadmap-head" aria-expanded="${isCurrentWeek}">
        <span class="rm-week">Week ${weekInCycle + 1}</span>
        <span class="rm-title">${topic.title}</span>
        <span class="tag tag-${topic.section}">${SECTION_LABEL[topic.section]}</span>
        <span class="rm-date">${fmtDate(weekStartDate)}</span>
        <svg class="rm-chevron" width="14" height="14" viewBox="0 0 14 14"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <ul class="roadmap-days">${daysHtml}</ul>
    `;

    const head = item.querySelector('.roadmap-head');
    head.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      head.setAttribute('aria-expanded', String(open));
    });

    const dayItems = item.querySelectorAll('.roadmap-days li');
    dayItems.forEach(li => {
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        const globalIdx = parseInt(li.getAttribute('data-global-idx'), 10);
        currentViewDate = new Date(STUDY_START.getTime() + globalIdx * 86400000);
        renderAll(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    wrap.appendChild(item);
  });
}

function renderCalendar() {
  const grid = $('#cal-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const monthYearLabel = $('#cal-month-year');
  if (monthYearLabel) {
    monthYearLabel.textContent = calViewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  const year = calViewDate.getFullYear();
  const month = calViewDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Blank padding cells for start of month
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cal-day empty';
    grid.appendChild(emptyCell);
  }

  const currentViewSched = scheduleFor(currentViewDate);
  const maxReached = getMaxReachedDayIndex();

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    cellDate.setHours(0, 0, 0, 0);
    const s = scheduleFor(cellDate);
    const idx = s.globalDayIndex;

    const isTarget = (year === 2028 && month === 1 && d === 3);
    const isToday = (s.diff === todaySchedule.diff);
    const isSel = (s.diff === currentViewSched.diff);
    const isCompleted = isDone(idx);
    const isSkipped = (!isCompleted && !isToday && idx >= 0 && idx < maxReached);

    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = String(d);

    if (isTarget) cell.classList.add('is-target');
    if (isToday) cell.classList.add('is-today');
    if (isCompleted) cell.classList.add('is-done');
    else if (isSkipped) cell.classList.add('is-skipped');
    if (isSel) cell.classList.add('is-selected');

    cell.title = `${fmtDate(cellDate)}${isTarget ? ' — GATE CY 2028 EXAM TARGET' : (s.isReview ? ' — Review' : ' — ' + (s.entry ? s.entry.t : ''))}`;

    cell.addEventListener('click', () => {
      currentViewDate = new Date(cellDate);
      renderAll(true);
    });

    grid.appendChild(cell);
  }
}

function playDrawAnimation() {
  const stage = $('#card-stage');
  stage.classList.remove('dealing', 'dealt');
  void stage.offsetWidth;
  stage.classList.add('dealing');
  requestAnimationFrame(() => {
    setTimeout(() => stage.classList.add('dealt'), 30);
  });
}

/* ---------- Init ---------- */

function init() {
  renderAll(true);

  $('#toggle-roadmap').addEventListener('click', () => {
    const panel = $('#roadmap-panel');
    const open = panel.classList.toggle('open');
    $('#toggle-roadmap').setAttribute('aria-expanded', String(open));
    $('#toggle-roadmap').textContent = open ? 'Hide full roadmap' : 'See full roadmap';
    if (open) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if ($('#cal-prev')) {
    $('#cal-prev').addEventListener('click', () => {
      calViewDate.setMonth(calViewDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if ($('#cal-next')) {
    $('#cal-next').addEventListener('click', () => {
      calViewDate.setMonth(calViewDate.getMonth() + 1);
      renderCalendar();
    });
  }

  if ($('#nav-home')) {
    $('#nav-home').addEventListener('click', () => {
      currentViewDate = new Date(todayObj);
      calViewDate = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1);
      renderAll(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
