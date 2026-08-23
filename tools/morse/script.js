/* ============================================================
   tools/morse/script.js — Morse Code Studio Orchestrator & Engine
   Built by Alok Das (Static Vanilla JS, No module dependencies)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ── 1. MORSE DICTIONARY ── */
  const MORSE_MAP = {
    'A': '.-',     'B': '-...',   'C': '-.-.',   'D': '-..',
    'E': '.',      'F': '..-.',   'G': '--.',    'H': '....',
    'I': '..',     'J': '.---',   'K': '-.-',    'L': '.-..',
    'M': '--',     'N': '-.',     'O': '---',    'P': '.--.',
    'Q': '--.-',   'R': '.-.',    'S': '...',    'T': '-',
    'U': '..-',    'V': '...-',   'W': '.--',    'X': '-..-',
    'Y': '-.--',   'Z': '--..',
    '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
    '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
    '8': '---..',  '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.',
    '=': '-...-',  '+': '.-.-.',  '-': '-....-', '@': '.--.-.'
  };

  // Reverse mapping from Morse pattern to Character
  const REVERSE_MORSE_MAP = {};
  Object.keys(MORSE_MAP).forEach((char) => {
    REVERSE_MORSE_MAP[MORSE_MAP[char]] = char;
  });

  const LIST_LETTERS = Object.keys(MORSE_MAP).filter(c => c >= 'A' && c <= 'Z');
  const LIST_NUMBERS = Object.keys(MORSE_MAP).filter(c => c >= '0' && c <= '9');
  const LIST_SYMBOLS = Object.keys(MORSE_MAP).filter(c => !LIST_LETTERS.includes(c) && !LIST_NUMBERS.includes(c));

  /* ── 2. AUDIO & VISUAL SYNTHESIZER (WEB AUDIO API) ── */
  class MorseAudioSynthesizer {
    constructor() {
      this.audioCtx = null;
      this.isPlaying = false;
      this.stopFlag = false;
      this.currentTimeout = null;
      this.wpm = 15;
      this.pitch = 600;
      this.enableVisual = true;
    }

    initAudioContext() {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    getDotDurationMs() {
      // PARIS standard: 1 WPM = 50 dot units per min -> Dot time = 1200ms / WPM
      return 1200 / this.wpm;
    }

    triggerSignalVisual(active) {
      const signalLight = document.getElementById('signalLight');
      if (!signalLight || !this.enableVisual) return;
      if (active) {
        signalLight.classList.add('active');
      } else {
        signalLight.classList.remove('active');
      }
    }

    playTone(durationMs) {
      return new Promise((resolve) => {
        if (this.stopFlag || !this.audioCtx) {
          this.triggerSignalVisual(false);
          resolve();
          return;
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.pitch, this.audioCtx.currentTime);

        // Smooth envelope to prevent audio popping click
        const now = this.audioCtx.currentTime;
        const attack = 0.005;
        const release = 0.005;
        const durationSec = durationMs / 1000;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + attack);
        gain.gain.setValueAtTime(0.3, now + durationSec - release);
        gain.gain.linearRampToValueAtTime(0, now + durationSec);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + durationSec);

        this.triggerSignalVisual(true);

        this.currentTimeout = setTimeout(() => {
          this.triggerSignalVisual(false);
          resolve();
        }, durationMs);
      });
    }

    sleep(ms) {
      return new Promise((resolve) => {
        if (this.stopFlag) {
          resolve();
          return;
        }
        this.currentTimeout = setTimeout(resolve, ms);
      });
    }

    stop() {
      this.stopFlag = true;
      this.isPlaying = false;
      if (this.currentTimeout) {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = null;
      }
      this.triggerSignalVisual(false);
      this.updatePlayStopButtons(false);
    }

    updatePlayStopButtons(playing) {
      const playTextBtn = document.getElementById('playTextMorseBtn');
      const playMorseBtn = document.getElementById('playMorseInputBtn');
      const stopBtn = document.getElementById('stopAudioBtn');

      if (stopBtn) stopBtn.style.display = playing ? 'inline-flex' : 'none';
      if (playTextBtn) playTextBtn.style.display = playing ? 'none' : 'inline-flex';
      if (playMorseBtn) playMorseBtn.style.display = playing ? 'none' : 'inline-flex';
    }

    async playMorseSequence(morseStr, onComplete) {
      this.initAudioContext();
      if (!this.audioCtx) return;

      this.stop();
      this.stopFlag = false;
      this.isPlaying = true;
      this.updatePlayStopButtons(true);

      const dotMs = this.getDotDurationMs();
      const dashMs = dotMs * 3;
      const symbolGapMs = dotMs;
      const letterGapMs = dotMs * 3;
      const wordGapMs = dotMs * 7;

      const tokens = morseStr.trim().split(/(\s+|\/)/);

      for (let token of tokens) {
        if (this.stopFlag) break;

        if (token === '/') {
          await this.sleep(wordGapMs);
        } else if (token.trim() === '') {
          await this.sleep(letterGapMs);
        } else {
          // Token is a sequence of dots and dashes like ".-"
          const symbols = token.split('');
          for (let i = 0; i < symbols.length; i++) {
            if (this.stopFlag) break;
            const sym = symbols[i];

            if (sym === '.') {
              await this.playTone(dotMs);
            } else if (sym === '-' || sym === '−') {
              await this.playTone(dashMs);
            }

            if (i < symbols.length - 1 && !this.stopFlag) {
              await this.sleep(symbolGapMs);
            }
          }
          if (!this.stopFlag) {
            await this.sleep(letterGapMs);
          }
        }
      }

      this.isPlaying = false;
      this.triggerSignalVisual(false);
      this.updatePlayStopButtons(false);
      if (onComplete && !this.stopFlag) onComplete();
    }
  }

  const audioEngine = new MorseAudioSynthesizer();

  /* ── 3. TRANSLATOR LOGIC ── */
  function textToMorse(text) {
    if (!text) return '';
    const clean = text.toUpperCase().trim();
    const words = clean.split(/\s+/);

    return words.map(word => {
      const chars = word.split('');
      return chars.map(c => MORSE_MAP[c] || '?').join(' ');
    }).join(' / ');
  }

  function morseToText(morse) {
    if (!morse) return '';
    const clean = morse.trim();
    // Words are separated by / or multiple spaces
    const words = clean.split(/\s*\/\s*|\s{3,}/);

    return words.map(word => {
      const symbols = word.trim().split(/\s+/);
      return symbols.map(sym => {
        const normalized = sym.replace(/−/g, '-');
        return REVERSE_MORSE_MAP[normalized] || (sym ? '?' : '');
      }).join('');
    }).join(' ');
  }

  /* ── 4. PERSISTENT STORAGE CACHE ── */
  const STORAGE_KEY = 'alokdas_morse_progress';

  class MorseStorageManager {
    constructor() {
      this.data = this.loadData();
    }

    loadData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            attempts: parsed.attempts || {},
            streak: parsed.streak || 0,
            bestStreak: parsed.bestStreak || 0,
            totalSessions: parsed.totalSessions || 0,
            totalAttempts: parsed.totalAttempts || 0,
            totalCorrect: parsed.totalCorrect || 0
          };
        }
      } catch (e) {
        console.error('Failed to load morse cache:', e);
      }
      return {
        attempts: {},
        streak: 0,
        bestStreak: 0,
        totalSessions: 0,
        totalAttempts: 0,
        totalCorrect: 0
      };
    }

    saveData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error('Failed to save morse cache:', e);
      }
    }

    recordAttempt(char, isCorrect) {
      if (!char) return;
      const uppercaseChar = char.toUpperCase();
      if (!this.data.attempts[uppercaseChar]) {
        this.data.attempts[uppercaseChar] = { correct: 0, total: 0 };
      }

      this.data.attempts[uppercaseChar].total += 1;
      this.data.totalAttempts += 1;

      if (isCorrect) {
        this.data.attempts[uppercaseChar].correct += 1;
        this.data.totalCorrect += 1;
        this.data.streak += 1;
        if (this.data.streak > this.data.bestStreak) {
          this.data.bestStreak = this.data.streak;
        }
      } else {
        this.data.streak = 0;
      }

      this.saveData();
    }

    incrementSession() {
      this.data.totalSessions += 1;
      this.saveData();
    }

    getCharAccuracy(char) {
      const stats = this.data.attempts[char.toUpperCase()];
      if (!stats || stats.total === 0) return null;
      return Math.round((stats.correct / stats.total) * 100);
    }

    isMastered(char) {
      const stats = this.data.attempts[char.toUpperCase()];
      if (!stats || stats.total < 5) return false;
      return (stats.correct / stats.total) >= 0.8;
    }

    getMasteredCount() {
      const allChars = Object.keys(MORSE_MAP);
      return allChars.filter(c => this.isMastered(c)).length;
    }

    getOverallAccuracy() {
      if (this.data.totalAttempts === 0) return 0;
      return Math.round((this.data.totalCorrect / this.data.totalAttempts) * 100);
    }

    reset() {
      this.data = {
        attempts: {},
        streak: 0,
        bestStreak: 0,
        totalSessions: 0,
        totalAttempts: 0,
        totalCorrect: 0
      };
      this.saveData();
    }
  }

  const storageManager = new MorseStorageManager();

  /* ── 5. LEARNING TRAINER & QUIZ ENGINE ── */
  class MorseTrainerEngine {
    constructor() {
      this.level = 'alphabet';
      this.mode = 'listen';
      this.currentQuestion = null;
      this.sessionScore = 0;
      this.sessionTotal = 0;
      this.sessionStreak = 0;
      this.encodeInput = '';
      this.answeredCurrent = false;

      storageManager.incrementSession();
    }

    getPool() {
      if (this.level === 'alphabet') return LIST_LETTERS;
      if (this.level === 'numbers') return LIST_NUMBERS;
      if (this.level === 'symbols') return LIST_SYMBOLS;
      return Object.keys(MORSE_MAP); // mixed
    }

    generateQuestion() {
      const pool = this.getPool();
      const targetChar = pool[Math.floor(Math.random() * pool.length)];
      const targetMorse = MORSE_MAP[targetChar];

      // Generate 3 distractors
      const distractors = [];
      while (distractors.length < 3) {
        const randomChar = pool[Math.floor(Math.random() * pool.length)];
        if (randomChar !== targetChar && !distractors.includes(randomChar)) {
          distractors.push(randomChar);
        }
      }

      // Options array shuffled
      const options = [targetChar, ...distractors].sort(() => Math.random() - 0.5);

      this.currentQuestion = {
        targetChar,
        targetMorse,
        options
      };

      this.encodeInput = '';
      this.answeredCurrent = false;
      return this.currentQuestion;
    }

    submitAnswer(chosenValue) {
      if (this.answeredCurrent || !this.currentQuestion) return false;
      this.answeredCurrent = true;

      const isCorrect = chosenValue.toUpperCase().trim() === this.currentQuestion.targetChar;
      
      this.sessionTotal += 1;
      if (isCorrect) {
        this.sessionScore += 1;
        this.sessionStreak += 1;
      } else {
        this.sessionStreak = 0;
      }

      storageManager.recordAttempt(this.currentQuestion.targetChar, isCorrect);
      return isCorrect;
    }
  }

  const trainerEngine = new MorseTrainerEngine();

  /* ── 6. UI EVENT HANDLERS & BINDINGS ── */

  // TAB NAVIGATION
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) targetContent.classList.add('active');

      if (tabId === 'progress') {
        renderProgressCacheUI();
      } else if (tabId === 'cheatsheet') {
        renderCheatSheetUI();
      }
    });
  });

  // AUDIO CONTROLS
  const wpmRange = document.getElementById('wpmRange');
  const wpmValue = document.getElementById('wpmValue');
  const pitchRange = document.getElementById('pitchRange');
  const pitchValue = document.getElementById('pitchValue');
  const lightSignalToggle = document.getElementById('lightSignalToggle');

  if (wpmRange) {
    wpmRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      audioEngine.wpm = val;
      if (wpmValue) wpmValue.textContent = val;
    });
  }

  if (pitchRange) {
    pitchRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      audioEngine.pitch = val;
      if (pitchValue) pitchValue.textContent = val;
    });
  }

  if (lightSignalToggle) {
    lightSignalToggle.addEventListener('change', (e) => {
      audioEngine.enableVisual = e.target.checked;
    });
  }

  // INTERPRETER BINDINGS
  const plainTextInput = document.getElementById('plainTextInput');
  const morseOutputDisplay = document.getElementById('morseOutputDisplay');
  const morseTextInput = document.getElementById('morseTextInput');
  const textOutputDisplay = document.getElementById('textOutputDisplay');

  function updateTextToMorseOutput() {
    if (!plainTextInput || !morseOutputDisplay) return;
    const val = plainTextInput.value;
    if (!val.trim()) {
      morseOutputDisplay.innerHTML = `<span class="output-placeholder">Morse code output will appear here...</span>`;
      return;
    }
    const morse = textToMorse(val);
    morseOutputDisplay.textContent = morse;
  }

  function updateMorseToTextOutput() {
    if (!morseTextInput || !textOutputDisplay) return;
    const val = morseTextInput.value;
    if (!val.trim()) {
      textOutputDisplay.innerHTML = `<span class="output-placeholder">Translated English text will appear here...</span>`;
      return;
    }
    const text = morseToText(val);
    textOutputDisplay.textContent = text;
  }

  if (plainTextInput) {
    plainTextInput.addEventListener('input', updateTextToMorseOutput);
  }

  if (morseTextInput) {
    morseTextInput.addEventListener('input', updateMorseToTextOutput);
  }

  // PLAY AUDIO BUTTONS
  const playTextMorseBtn = document.getElementById('playTextMorseBtn');
  const playMorseInputBtn = document.getElementById('playMorseInputBtn');
  const stopAudioBtn = document.getElementById('stopAudioBtn');

  if (playTextMorseBtn) {
    playTextMorseBtn.addEventListener('click', () => {
      const morseText = morseOutputDisplay ? morseOutputDisplay.textContent : '';
      if (morseText && !morseText.includes('output will appear')) {
        audioEngine.playMorseSequence(morseText);
      }
    });
  }

  if (playMorseInputBtn) {
    playMorseInputBtn.addEventListener('click', () => {
      const morseVal = morseTextInput ? morseTextInput.value : '';
      if (morseVal) {
        audioEngine.playMorseSequence(morseVal);
      }
    });
  }

  if (stopAudioBtn) {
    stopAudioBtn.addEventListener('click', () => {
      audioEngine.stop();
    });
  }

  // COPY & CLEAR BUTTONS
  const copyMorseBtn = document.getElementById('copyMorseBtn');
  const clearTextBtn = document.getElementById('clearTextBtn');
  const copyTextBtn = document.getElementById('copyTextBtn');
  const clearMorseBtn = document.getElementById('clearMorseBtn');

  if (copyMorseBtn) {
    copyMorseBtn.addEventListener('click', () => {
      const text = morseOutputDisplay ? morseOutputDisplay.textContent : '';
      if (text && !text.includes('output will appear')) {
        navigator.clipboard.writeText(text);
        showTempToast(copyMorseBtn, 'Copied!');
      }
    });
  }

  if (clearTextBtn) {
    clearTextBtn.addEventListener('click', () => {
      if (plainTextInput) plainTextInput.value = '';
      updateTextToMorseOutput();
    });
  }

  if (copyTextBtn) {
    copyTextBtn.addEventListener('click', () => {
      const text = textOutputDisplay ? textOutputDisplay.textContent : '';
      if (text && !text.includes('will appear')) {
        navigator.clipboard.writeText(text);
        showTempToast(copyTextBtn, 'Copied!');
      }
    });
  }

  if (clearMorseBtn) {
    clearMorseBtn.addEventListener('click', () => {
      if (morseTextInput) morseTextInput.value = '';
      updateMorseToTextOutput();
    });
  }

  function showTempToast(btn, message) {
    const originalText = btn.textContent;
    btn.textContent = message;
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  }

  // VIRTUAL MORSE KEYPAD FOR TRANSLATOR
  const keypadDot = document.getElementById('keypadDot');
  const keypadDash = document.getElementById('keypadDash');
  const keypadCharSpace = document.getElementById('keypadCharSpace');
  const keypadWordSpace = document.getElementById('keypadWordSpace');
  const keypadBackspace = document.getElementById('keypadBackspace');

  function appendToMorseInput(str) {
    if (!morseTextInput) return;
    morseTextInput.value += str;
    updateMorseToTextOutput();
    morseTextInput.focus();
  }

  if (keypadDot) {
    keypadDot.addEventListener('click', () => {
      appendToMorseInput('.');
      audioEngine.playMorseSequence('.');
    });
  }

  if (keypadDash) {
    keypadDash.addEventListener('click', () => {
      appendToMorseInput('-');
      audioEngine.playMorseSequence('-');
    });
  }

  if (keypadCharSpace) {
    keypadCharSpace.addEventListener('click', () => appendToMorseInput(' '));
  }

  if (keypadWordSpace) {
    keypadWordSpace.addEventListener('click', () => appendToMorseInput(' / '));
  }

  if (keypadBackspace) {
    keypadBackspace.addEventListener('click', () => {
      if (!morseTextInput) return;
      morseTextInput.value = morseTextInput.value.slice(0, -1);
      updateMorseToTextOutput();
      morseTextInput.focus();
    });
  }

  /* ── 7. TRAINER & QUIZ LOGIC ── */
  const trainerLevelSelect = document.getElementById('trainerLevel');
  const trainerModeSelect = document.getElementById('trainerMode');
  const startNewQuestionBtn = document.getElementById('startNewQuestionBtn');
  const quizLevelBadge = document.getElementById('quizLevelBadge');
  const promptInstruction = document.getElementById('promptInstruction');
  const promptChar = document.getElementById('promptChar');
  const quizPlayAudioBtn = document.getElementById('quizPlayAudioBtn');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');
  const quizEncodeBox = document.getElementById('quizEncodeBox');
  const encodeInputDisplay = document.getElementById('encodeInputDisplay');
  const quizDotBtn = document.getElementById('quizDotBtn');
  const quizDashBtn = document.getElementById('quizDashBtn');
  const quizClearInputBtn = document.getElementById('quizClearInputBtn');
  const quizSubmitEncodeBtn = document.getElementById('quizSubmitEncodeBtn');
  const quizFeedback = document.getElementById('quizFeedback');
  const feedbackText = document.getElementById('feedbackText');
  const feedbackIcon = document.getElementById('feedbackIcon');

  const sessionStreak = document.getElementById('sessionStreak');
  const sessionScore = document.getElementById('sessionScore');
  const sessionAccuracy = document.getElementById('sessionAccuracy');

  if (trainerLevelSelect) {
    trainerLevelSelect.addEventListener('change', (e) => {
      trainerEngine.level = e.target.value;
      renderNextQuizQuestion();
    });
  }

  if (trainerModeSelect) {
    trainerModeSelect.addEventListener('change', (e) => {
      trainerEngine.mode = e.target.value;
      renderNextQuizQuestion();
    });
  }

  if (startNewQuestionBtn) {
    startNewQuestionBtn.addEventListener('click', () => {
      renderNextQuizQuestion();
    });
  }

  if (quizPlayAudioBtn) {
    quizPlayAudioBtn.addEventListener('click', () => {
      if (trainerEngine.currentQuestion) {
        audioEngine.playMorseSequence(trainerEngine.currentQuestion.targetMorse);
      }
    });
  }

  function renderNextQuizQuestion() {
    const q = trainerEngine.generateQuestion();

    if (quizFeedback) quizFeedback.className = 'quiz-feedback';

    // Update level badge
    const levelNameMap = {
      alphabet: 'Level 1 · Letters',
      numbers: 'Level 2 · Numbers',
      symbols: 'Level 3 · Punctuation',
      mixed: 'Level 4 · Master Challenge'
    };
    if (quizLevelBadge) quizLevelBadge.textContent = levelNameMap[trainerEngine.level] || 'Quiz';

    if (trainerEngine.mode === 'listen') {
      if (promptInstruction) promptInstruction.textContent = 'Listen to the Morse tone signal and select the matching character:';
      if (quizPlayAudioBtn) quizPlayAudioBtn.style.display = 'inline-flex';
      if (promptChar) promptChar.style.display = 'none';

      if (quizOptionsGrid) quizOptionsGrid.style.display = 'grid';
      if (quizEncodeBox) quizEncodeBox.style.display = 'none';

      // Auto play tone after brief delay
      setTimeout(() => {
        audioEngine.playMorseSequence(q.targetMorse);
      }, 250);

      // Render 4 choice buttons
      if (quizOptionsGrid) {
        quizOptionsGrid.innerHTML = '';
        q.options.forEach(option => {
          const btn = document.createElement('button');
          btn.className = 'choice-btn';
          btn.textContent = option;
          btn.addEventListener('click', () => handleChoiceSubmit(option, btn));
          quizOptionsGrid.appendChild(btn);
        });
      }
    } else {
      // Encode Mode: Read character -> Type Morse
      if (promptInstruction) promptInstruction.textContent = 'Read the character and enter its Morse Code representation:';
      if (quizPlayAudioBtn) quizPlayAudioBtn.style.display = 'none';
      if (promptChar) {
        promptChar.style.display = 'block';
        promptChar.textContent = q.targetChar;
      }

      if (quizOptionsGrid) quizOptionsGrid.style.display = 'none';
      if (quizEncodeBox) quizEncodeBox.style.display = 'flex';
      updateEncodeInputDisplay();
    }

    updateSessionStats();
  }

  function updateEncodeInputDisplay() {
    if (encodeInputDisplay) {
      encodeInputDisplay.textContent = trainerEngine.encodeInput || '...';
    }
  }

  if (quizDotBtn) {
    quizDotBtn.addEventListener('click', () => {
      trainerEngine.encodeInput += '.';
      updateEncodeInputDisplay();
      audioEngine.playMorseSequence('.');
    });
  }

  if (quizDashBtn) {
    quizDashBtn.addEventListener('click', () => {
      trainerEngine.encodeInput += '-';
      updateEncodeInputDisplay();
      audioEngine.playMorseSequence('-');
    });
  }

  if (quizClearInputBtn) {
    quizClearInputBtn.addEventListener('click', () => {
      trainerEngine.encodeInput = '';
      updateEncodeInputDisplay();
    });
  }

  if (quizSubmitEncodeBtn) {
    quizSubmitEncodeBtn.addEventListener('click', () => {
      if (!trainerEngine.encodeInput) return;
      const morseInput = trainerEngine.encodeInput.replace(/−/g, '-').trim();
      const expectedMorse = trainerEngine.currentQuestion.targetMorse;
      const isCorrect = (morseInput === expectedMorse);

      trainerEngine.answeredCurrent = true;
      trainerEngine.sessionTotal += 1;
      if (isCorrect) {
        trainerEngine.sessionScore += 1;
        trainerEngine.sessionStreak += 1;
      } else {
        trainerEngine.sessionStreak = 0;
      }

      storageManager.recordAttempt(trainerEngine.currentQuestion.targetChar, isCorrect);
      showQuizFeedback(isCorrect, expectedMorse);
      updateSessionStats();
    });
  }

  function handleChoiceSubmit(chosenChar, btnElement) {
    if (trainerEngine.answeredCurrent) return;

    const isCorrect = trainerEngine.submitAnswer(chosenChar);
    const allBtns = quizOptionsGrid ? quizOptionsGrid.querySelectorAll('.choice-btn') : [];

    allBtns.forEach(b => {
      if (b.textContent === trainerEngine.currentQuestion.targetChar) {
        b.classList.add('correct');
      } else if (b === btnElement && !isCorrect) {
        b.classList.add('wrong');
      }
    });

    showQuizFeedback(isCorrect, trainerEngine.currentQuestion.targetMorse);
    updateSessionStats();
  }

  function showQuizFeedback(isCorrect, expectedInfo) {
    if (!quizFeedback || !feedbackText || !feedbackIcon) return;

    quizFeedback.className = `quiz-feedback visible ${isCorrect ? 'correct' : 'wrong'}`;
    if (isCorrect) {
      feedbackIcon.textContent = '✓';
      feedbackText.textContent = `Correct! ${trainerEngine.currentQuestion.targetChar} is "${expectedInfo}"`;
    } else {
      feedbackIcon.textContent = '✕';
      feedbackText.textContent = `Incorrect. ${trainerEngine.currentQuestion.targetChar} is "${expectedInfo}"`;
    }
  }

  function updateSessionStats() {
    if (sessionStreak) sessionStreak.textContent = trainerEngine.sessionStreak;
    if (sessionScore) sessionScore.textContent = `${trainerEngine.sessionScore} / ${trainerEngine.sessionTotal}`;
    const acc = trainerEngine.sessionTotal > 0
      ? Math.round((trainerEngine.sessionScore / trainerEngine.sessionTotal) * 100)
      : 100;
    if (sessionAccuracy) sessionAccuracy.textContent = `${acc}%`;
  }

  // INITIALIZE FIRST QUESTION
  renderNextQuizQuestion();

  /* ── 8. PROGRESS CACHE UI RENDER ── */
  function renderProgressCacheUI() {
    const cacheOverallAccuracy = document.getElementById('cacheOverallAccuracy');
    const cacheTotalAttempts = document.getElementById('cacheTotalAttempts');
    const cacheMasteredCount = document.getElementById('cacheMasteredCount');
    const cacheBestStreak = document.getElementById('cacheBestStreak');
    const cacheTotalSessions = document.getElementById('cacheTotalSessions');
    const masteryMatrixGrid = document.getElementById('masteryMatrixGrid');

    if (cacheOverallAccuracy) cacheOverallAccuracy.textContent = `${storageManager.getOverallAccuracy()}%`;
    if (cacheTotalAttempts) cacheTotalAttempts.textContent = `${storageManager.data.totalAttempts} total attempts`;
    if (cacheMasteredCount) cacheMasteredCount.textContent = `${storageManager.getMasteredCount()} / 42`;
    if (cacheBestStreak) cacheBestStreak.textContent = storageManager.data.bestStreak;
    if (cacheTotalSessions) cacheTotalSessions.textContent = storageManager.data.totalSessions;

    if (masteryMatrixGrid) {
      masteryMatrixGrid.innerHTML = '';
      const allChars = Object.keys(MORSE_MAP);

      allChars.forEach(char => {
        const accuracy = storageManager.getCharAccuracy(char);
        const attempts = storageManager.data.attempts[char] ? storageManager.data.attempts[char].total : 0;
        const isMastered = storageManager.isMastered(char);

        let statusClass = 'unseen';
        let accText = 'Unseen';

        if (attempts > 0) {
          if (isMastered) {
            statusClass = 'mastered';
            accText = `${accuracy}%`;
          } else if (accuracy >= 50) {
            statusClass = 'learning';
            accText = `${accuracy}%`;
          } else {
            statusClass = 'practice';
            accText = `${accuracy}%`;
          }
        }

        const card = document.createElement('div');
        card.className = `matrix-card ${statusClass}`;
        card.innerHTML = `
          <span class="char">${char}</span>
          <span class="morse">${MORSE_MAP[char]}</span>
          <span class="acc-badge">${accText}</span>
        `;
        masteryMatrixGrid.appendChild(card);
      });
    }
  }

  // EXPORT & RESET CACHE
  const exportProgressBtn = document.getElementById('exportProgressBtn');
  const resetCacheBtn = document.getElementById('resetCacheBtn');

  if (exportProgressBtn) {
    exportProgressBtn.addEventListener('click', () => {
      const jsonStr = JSON.stringify(storageManager.data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse_learning_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (resetCacheBtn) {
    resetCacheBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all your cached Morse Code practice progress?')) {
        storageManager.reset();
        trainerEngine.sessionScore = 0;
        trainerEngine.sessionTotal = 0;
        trainerEngine.sessionStreak = 0;
        renderProgressCacheUI();
        updateSessionStats();
        alert('Learning cache reset successfully.');
      }
    });
  }

  /* ── 9. CHEAT SHEET UI RENDER ── */
  const cheatSearchInput = document.getElementById('cheatSearchInput');
  const cheatSheetGrid = document.getElementById('cheatSheetGrid');
  const cheatFilters = document.querySelectorAll('.cheat-filter');

  let activeCheatFilter = 'all';

  function renderCheatSheetUI() {
    if (!cheatSheetGrid) return;
    cheatSheetGrid.innerHTML = '';

    const query = cheatSearchInput ? cheatSearchInput.value.trim().toUpperCase() : '';

    let chars = Object.keys(MORSE_MAP);

    if (activeCheatFilter === 'letters') chars = LIST_LETTERS;
    else if (activeCheatFilter === 'numbers') chars = LIST_NUMBERS;
    else if (activeCheatFilter === 'symbols') chars = LIST_SYMBOLS;

    const filtered = chars.filter(c => {
      const morse = MORSE_MAP[c];
      return c.includes(query) || morse.includes(query);
    });

    if (filtered.length === 0) {
      cheatSheetGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text3);">No matching characters found</div>`;
      return;
    }

    filtered.forEach(char => {
      const morse = MORSE_MAP[char];
      const card = document.createElement('div');
      card.className = 'cheat-card';
      card.innerHTML = `
        <span class="cheat-char">${char}</span>
        <span class="cheat-morse">${morse}</span>
        <button class="cheat-play-btn" title="Listen Tone">
          🔊 Listen
        </button>
      `;

      const playBtn = card.querySelector('.cheat-play-btn');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          audioEngine.playMorseSequence(morse);
        });
      }

      cheatSheetGrid.appendChild(card);
    });
  }

  if (cheatSearchInput) {
    cheatSearchInput.addEventListener('input', renderCheatSheetUI);
  }

  cheatFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      cheatFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCheatFilter = btn.getAttribute('data-filter');
      renderCheatSheetUI();
    });
  });

  // KEYBOARD SHORTCUTS IN TRANSLATOR / QUIZ
  document.addEventListener('keydown', (e) => {
    // If user is typing in a textarea or input, do not hijack unless specific
    if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
      return;
    }

    if (e.key === '.') {
      audioEngine.playMorseSequence('.');
    } else if (e.key === '-') {
      audioEngine.playMorseSequence('-');
    }
  });
});
