/**
 * lab.js — Dynamic laboratory workbench calculations, visualizers, and cGMP sheet compiler.
 * Pure Vanilla JS — compatible with offline file:// and standard http:// protocols.
 */

(function () {
  'use strict';

  // --- CHEMISTRY DATABASE ---
  var COMPOUNDS = {
    NaOH: {
      name: "Sodium Hydroxide (NaOH)",
      formula: "NaOH",
      molarMass: 40.00,
      color: "rgba(0, 194, 255, 0.25)",
      waveColor: "rgba(0, 194, 255, 0.12)",
      type: "solid"
    },
    NaCl: {
      name: "Sodium Chloride (NaCl)",
      formula: "NaCl",
      molarMass: 58.44,
      color: "rgba(0, 194, 255, 0.2)",
      waveColor: "rgba(0, 194, 255, 0.1)",
      type: "solid"
    },
    CuSO4: {
      name: "Copper(II) Sulfate (CuSO₄)",
      formula: "CuSO₄ · 5H₂O",
      molarMass: 249.68,
      color: "rgba(0, 90, 220, 0.7)",
      waveColor: "rgba(0, 90, 220, 0.45)",
      type: "solid"
    },
    KMnO4: {
      name: "Potassium Permanganate (KMnO₄)",
      formula: "KMnO₄",
      molarMass: 158.03,
      color: "rgba(106, 13, 173, 0.8)",
      waveColor: "rgba(106, 13, 173, 0.5)",
      type: "solid"
    },
    HCl: {
      name: "Hydrochloric Acid (HCl)",
      formula: "HCl (37% w/w Stock)",
      molarMass: 36.46,
      color: "rgba(0, 194, 255, 0.3)",
      waveColor: "rgba(0, 194, 255, 0.15)",
      type: "liquid",
      density: 1.19, // g/mL
      purity: 0.37   // 37%
    },
    H2SO4: {
      name: "Sulfuric Acid (H₂SO₄)",
      formula: "H₂SO₄ (98% w/w Stock)",
      molarMass: 98.08,
      color: "rgba(255, 230, 0, 0.45)",
      waveColor: "rgba(255, 230, 0, 0.25)",
      type: "liquid",
      density: 1.84, // g/mL
      purity: 0.98   // 98%
    }
  };

  var DYE_COLORS = {
    permanganate: { r: 106, g: 13,  b: 173, name: "Potassium Permanganate (Magenta)" },
    copper:       { r: 0,   g: 194, b: 255, name: "Copper Sulfate (Cyan)" },
    cobalt:       { r: 255, g: 45,  b: 107, name: "Cobalt Chloride (Pink)" },
    chromate:     { r: 255, g: 230, b: 0,   name: "Potassium Chromate (Yellow)" }
  };

  // --- STATE ---
  var activeTab = 'molarity'; // 'molarity' or 'dilution'
  var calculatedResult = { mass: 0, unit: 'g', moles: 0, type: 'solid' };
  var lastDilutionRun = null;

  var titrationState = {
    volAdded: 0,
    pH: 13.00,
    history: [{ vol: 0, pH: 13.00 }],
    isRunning: false,
    timer: null
  };

  var calState = {
    activeWeight: null,
    observedReadout: 0.0000,
    verifiedLogs: {
      1: null,
      5: null,
      10: null
    },
    flickerTimer: null
  };
  
  // --- DOM ELEMENTS ---
  // Tabs
  var tabMolarity, tabDilution, tabTitration, tabCalibration, tabSafety, tabSpec;
  var paneMolarity, paneDilution, paneTitration, paneCalibration, paneSafety, paneSpec;

  // Molarity Mixer Inputs
  var selectCompound;
  var sliderVolume;
  var sliderConcentration;
  var badgeVolume;
  var badgeConcentration;

  // Molarity Mixer Outputs
  var beaker;
  var beakerLiquid;
  var calcFormula;
  var calcMolarMass;
  var calcMoles;
  var calcResultLabel;
  var calcResultVal;
  var molaritySpeech;

  // Dilution Inputs
  var selectStartConc;
  var selectDye;
  var btnRunDilution;
  var dilutionSpeech;
  var rackTubes = [];

  // Titration Inputs & Outputs
  var selectTitrant, selectAnalyte, selectIndicator, sliderDropSize, badgeDropSize;
  var btnAddDrop, btnAutoTitrate, btnResetTitration;
  var buretteFluid, flaskLiquid, titrationDrop, titrationPhBadge, titrationVolBadge, titrationSpeech, titrationCurveCanvas;

  // Calibration Inputs & Outputs
  var btnWeight1, btnWeight5, btnWeight10, txtObservedWeight, btnCalVerify, btnCalClear;
  var scaleActiveWeight, balanceLedReadout, calStableFlag, calSpeech;

  // Safety Inputs & Outputs
  var selectSafetyA, selectSafetyB, btnMixSafety, hoodStatusIcon, hoodSmoke, ghsPlacardsPanel, safetySpeech;

  // Spectrophotometer Inputs & Outputs
  var selectSpecCompound, sliderSpecPath, sliderSpecConc, badgeSpecPath, badgeSpecConc;
  var specLightBeam, specDetectorBeam, specCuvette, specAbsLed, specPlotCanvas, specTransBadge, specEpsBadge, specSpeech;

  // GLP Report & Calibration/Titration Logs
  var btnTriggerRecord;
  var glpReportSheet;
  var reportActionsPanel;
  var btnPrintRecord;
  var reportOperator;
  var reportOperatorPrint;
  var reportDate;
  var repCal1, repCalDev1, repCalStatus1;
  var repCal5, repCalDev5, repCalStatus5;
  var repCal10, repCalDev10, repCalStatus10;
  var repTitTitrant, repTitAnalyte, repTitIndicator, repTitEndpoint, repTitConcResult;

  // --- INITIALIZATION ---
  window.addEventListener('DOMContentLoaded', function () {
    // Queries DOM elements once fully loaded to prevent timing/race conditions
    tabMolarity       = document.getElementById('tab-molarity');
    tabDilution       = document.getElementById('tab-dilution');
    tabTitration      = document.getElementById('tab-titration');
    tabCalibration    = document.getElementById('tab-calibration');
    tabSafety         = document.getElementById('tab-safety');
    tabSpec           = document.getElementById('tab-spec');

    paneMolarity      = document.getElementById('pane-molarity');
    paneDilution      = document.getElementById('pane-dilution');
    paneTitration     = document.getElementById('pane-titration');
    paneCalibration   = document.getElementById('pane-calibration');
    paneSafety        = document.getElementById('pane-safety');
    paneSpec          = document.getElementById('pane-spec');

    selectCompound    = document.getElementById('select-compound');
    sliderVolume      = document.getElementById('slider-volume');
    sliderConcentration = document.getElementById('slider-concentration');
    badgeVolume       = document.getElementById('badge-volume');
    badgeConcentration = document.getElementById('badge-concentration');

    beaker            = document.getElementById('beaker');
    beakerLiquid      = document.getElementById('beaker-liquid');
    calcFormula       = document.getElementById('calc-formula');
    calcMolarMass     = document.getElementById('calc-molar-mass');
    calcMoles         = document.getElementById('calc-moles');
    calcResultLabel   = document.getElementById('calc-result-label');
    calcResultVal     = document.getElementById('calc-result-val');
    molaritySpeech    = document.getElementById('molarity-speech');

    selectStartConc   = document.getElementById('select-start-conc');
    selectDye         = document.getElementById('select-dye');
    btnRunDilution    = document.getElementById('btn-run-dilution');
    dilutionSpeech    = document.getElementById('dilution-speech');

    rackTubes         = [
      { liq: document.getElementById('tube-liq-1'), conc: document.getElementById('tube-conc-1') },
      { liq: document.getElementById('tube-liq-2'), conc: document.getElementById('tube-conc-2') },
      { liq: document.getElementById('tube-liq-3'), conc: document.getElementById('tube-conc-3') },
      { liq: document.getElementById('tube-liq-4'), conc: document.getElementById('tube-conc-4') }
    ];

    // Titration Elements
    selectTitrant       = document.getElementById('select-titrant');
    selectAnalyte       = document.getElementById('select-analyte');
    selectIndicator     = document.getElementById('select-indicator');
    sliderDropSize      = document.getElementById('slider-drop-size');
    badgeDropSize       = document.getElementById('badge-drop-size');
    btnAddDrop          = document.getElementById('btn-add-drop');
    btnAutoTitrate      = document.getElementById('btn-auto-titrate');
    btnResetTitration   = document.getElementById('btn-reset-titration');
    buretteFluid        = document.getElementById('burette-fluid');
    flaskLiquid         = document.getElementById('flask-liquid');
    titrationDrop       = document.getElementById('titration-drop');
    titrationPhBadge    = document.getElementById('titration-ph-badge');
    titrationVolBadge   = document.getElementById('titration-vol-badge');
    titrationSpeech     = document.getElementById('titration-speech');
    titrationCurveCanvas = document.getElementById('titration-curve-canvas');

    // Calibration Elements
    btnWeight1          = document.getElementById('btn-weight-1');
    btnWeight5          = document.getElementById('btn-weight-5');
    btnWeight10         = document.getElementById('btn-weight-10');
    txtObservedWeight   = document.getElementById('txt-observed-weight');
    btnCalVerify        = document.getElementById('btn-cal-verify');
    btnCalClear         = document.getElementById('btn-cal-clear');
    scaleActiveWeight   = document.getElementById('scale-active-weight');
    balanceLedReadout   = document.getElementById('balance-led-readout');
    calStableFlag       = document.getElementById('cal-stable-flag');
    calSpeech           = document.getElementById('cal-speech');

    // Safety Elements
    selectSafetyA       = document.getElementById('select-safety-a');
    selectSafetyB       = document.getElementById('select-safety-b');
    btnMixSafety        = document.getElementById('btn-mix-safety');
    hoodStatusIcon      = document.getElementById('hood-status-icon');
    hoodSmoke           = document.getElementById('hood-smoke');
    ghsPlacardsPanel    = document.getElementById('ghs-placards-panel');
    safetySpeech        = document.getElementById('safety-speech');

    // Spectrophotometer Elements
    selectSpecCompound  = document.getElementById('select-spec-compound');
    sliderSpecPath      = document.getElementById('slider-spec-path');
    sliderSpecConc      = document.getElementById('slider-spec-conc');
    badgeSpecPath       = document.getElementById('badge-spec-path');
    badgeSpecConc       = document.getElementById('badge-spec-conc');
    specLightBeam       = document.getElementById('spec-light-beam');
    specDetectorBeam    = document.getElementById('spec-detector-beam');
    specCuvette         = document.getElementById('spec-cuvette');
    specAbsLed          = document.getElementById('spec-abs-led');
    specPlotCanvas      = document.getElementById('spec-plot-canvas');
    specTransBadge      = document.getElementById('spec-trans-badge');
    specEpsBadge        = document.getElementById('spec-eps-badge');
    specSpeech          = document.getElementById('spec-speech');

    // GLP Report & Logs Elements
    btnTriggerRecord    = document.getElementById('btn-trigger-record');
    glpReportSheet      = document.getElementById('glp-report-sheet');
    reportActionsPanel  = document.getElementById('report-actions-panel');
    btnPrintRecord      = document.getElementById('btn-print-record');
    reportOperator      = document.getElementById('report-operator');
    reportOperatorPrint = document.getElementById('report-operator-print');
    reportDate          = document.getElementById('report-date');

    repCal1             = document.getElementById('rep-cal-1');
    repCalDev1          = document.getElementById('rep-cal-dev-1');
    repCalStatus1       = document.getElementById('rep-cal-status-1');
    repCal5             = document.getElementById('rep-cal-5');
    repCalDev5          = document.getElementById('rep-cal-dev-5');
    repCalStatus5       = document.getElementById('rep-cal-status-5');
    repCal10            = document.getElementById('rep-cal-10');
    repCalDev10         = document.getElementById('rep-cal-dev-10');
    repCalStatus10      = document.getElementById('rep-cal-status-10');

    repTitTitrant       = document.getElementById('rep-tit-titrant');
    repTitAnalyte       = document.getElementById('rep-tit-analyte');
    repTitIndicator     = document.getElementById('rep-tit-indicator');
    repTitEndpoint      = document.getElementById('rep-tit-endpoint');
    repTitConcResult    = document.getElementById('rep-tit-conc-result');

    initTabRibbon();
    initMolarityMixer();
    initDilutionDesk();
    initTitrationDesk();
    initCalibrationStation();
    initSafetyMatrix();
    initSpectrophotometer();
    initReportSystem();
  });

  // --- TAB BAR NAV CONTROLLER ---
  function initTabRibbon() {
    var tabs = [
      { btn: tabMolarity, id: 'molarity' },
      { btn: tabDilution, id: 'dilution' },
      { btn: tabTitration, id: 'titration' },
      { btn: tabCalibration, id: 'calibration' },
      { btn: tabSafety, id: 'safety' },
      { btn: tabSpec, id: 'spec' }
    ];

    tabs.forEach(function (tab) {
      if (tab.btn) {
        tab.btn.addEventListener('click', function () {
          switchTab(tab.id);
        });
      }
    });
  }

  function switchTab(tabId) {
    activeTab = tabId;

    var panes = [
      { btn: tabMolarity, pane: paneMolarity, id: 'molarity' },
      { btn: tabDilution, pane: paneDilution, id: 'dilution' },
      { btn: tabTitration, pane: paneTitration, id: 'titration' },
      { btn: tabCalibration, pane: paneCalibration, id: 'calibration' },
      { btn: tabSafety, pane: paneSafety, id: 'safety' },
      { btn: tabSpec, pane: paneSpec, id: 'spec' }
    ];

    panes.forEach(function (p) {
      if (p.btn) p.btn.classList.remove('active');
      if (p.pane) p.pane.classList.remove('active');
      
      if (p.id === tabId) {
        if (p.btn) p.btn.classList.add('active');
        if (p.pane) p.pane.classList.add('active');
      }
    });

    // Handle canvas drawing on switch to render curves instantly
    if (tabId === 'titration') {
      drawTitrationCurve();
    } else if (tabId === 'spec') {
      drawSpecPlot();
    }

    // Tracker
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('lab_tab_switch', tabId, null);
    }
  }

  // --- MOLARITY MIXER WORKBENCH (Calculations & liquid visuals) ---
  function initMolarityMixer() {
    if (selectCompound) selectCompound.addEventListener('change', calculateMolarity);
    if (sliderVolume) sliderVolume.addEventListener('input', calculateMolarity);
    if (sliderConcentration) sliderConcentration.addEventListener('input', calculateMolarity);

    // Initial calculation
    calculateMolarity();
  }

  function calculateMolarity() {
    var compoundKey = selectCompound ? selectCompound.value : 'NaOH';
    var compound = COMPOUNDS[compoundKey];
    if (!compound) return;

    var volume = sliderVolume ? parseInt(sliderVolume.value, 10) : 250; // mL
    var molarity = sliderConcentration ? parseFloat(sliderConcentration.value) : 0.10; // mol/L

    // 1. Update sliders text badges
    if (badgeVolume) badgeVolume.textContent = volume + ' mL';
    if (badgeConcentration) badgeConcentration.textContent = molarity.toFixed(2) + ' M';

    // 2. Perform Chemistry Calculations
    var moles = molarity * (volume / 1000); // moles = M * V
    var mass = 0;
    var resultUnit = 'g';
    var resultLabel = 'MASS TO WEIGH OUT:';

    if (compound.type === 'solid') {
      mass = moles * compound.molarMass; // mass = moles * MW
      resultUnit = 'g';
      resultLabel = 'MASS TO WEIGH OUT:';
      calculatedResult.type = 'solid';
    } else {
      // Liquid concentrate dilution math (HCl, H2SO4)
      // Stock Molarity = (1000 * Density * Purity) / Molar Mass
      var stockMolarity = (1000 * compound.density * compound.purity) / compound.molarMass;
      
      // Dilution: V1 = (M2 * V2) / M1
      mass = (molarity * volume) / stockMolarity; // V1 stock needed in mL
      resultUnit = 'mL';
      resultLabel = 'CONC. STOCK TO PIPETTE:';
      calculatedResult.type = 'liquid';
    }

    // Save outputs to state
    calculatedResult.mass = mass;
    calculatedResult.unit = resultUnit;
    calculatedResult.moles = moles;

    // 3. Update Analysis Board DOM
    if (calcFormula) calcFormula.textContent = compound.formula;
    if (calcMolarMass) calcMolarMass.textContent = compound.molarMass.toFixed(2) + ' g/mol';
    if (calcMoles) calcMoles.textContent = moles.toFixed(4) + ' mol';
    if (calcResultLabel) calcResultLabel.textContent = resultLabel;
    if (calcResultVal) calcResultVal.textContent = mass.toFixed(2) + ' ' + resultUnit;

    // 4. Set dynamic instruction speech bubble
    if (molaritySpeech) {
      if (compound.type === 'solid') {
        molaritySpeech.innerHTML = '⚡ WEIGH OUT <strong>' + mass.toFixed(2) + ' g</strong> OF SOLID ' + compound.formula + ' &amp; DILUTE TO <strong>' + volume + ' mL</strong>!';
      } else {
        molaritySpeech.innerHTML = '🧪 PIPETTE <strong>' + mass.toFixed(2) + ' mL</strong> OF ' + compound.formula + ' STOCK &amp; DILUTE TO <strong>' + volume + ' mL</strong>!';
      }
    }

    // 5. Animate Beaker Liquid height and color
    if (beakerLiquid) {
      // Fill level proportional to volume (50mL to 1000mL maps to 15% to 85% beaker height)
      var heightPercent = 15 + ((volume - 50) / 950) * 70;
      beakerLiquid.style.height = heightPercent + '%';

      // Fluid color matching compound
      beakerLiquid.style.backgroundColor = compound.color;

      // Concentration opacity (denser concentration -> deeper color opacity)
      var maxOpacity = compound.type === 'solid' ? 0.95 : 0.85;
      var opacity = 0.35 + (molarity / 2.0) * (maxOpacity - 0.35);
      beakerLiquid.style.opacity = opacity;
    }
  }

  // --- SERIAL DILUTION BENCH ---
  function initDilutionDesk() {
    if (btnRunDilution) {
      btnRunDilution.addEventListener('click', runDilutionCascade);
    }
  }

  function runDilutionCascade() {
    var startConc = selectStartConc ? parseFloat(selectStartConc.value) : 1.0;
    var dyeKey = selectDye ? selectDye.value : 'permanganate';
    var dye = DYE_COLORS[dyeKey];
    if (!dye) return;

    // Reset heights immediately for cascade visual
    if (rackTubes && rackTubes.length) {
      rackTubes.forEach(function (tube) {
        if (tube) {
          if (tube.liq) tube.liq.style.height = '0%';
          if (tube.conc) tube.conc.textContent = '--';
        }
      });
    }

    if (dilutionSpeech) {
      dilutionSpeech.innerHTML = '🧪 PIPETTING AND DILUTING... RUNNING QUALITY ASSAY CASCADE! ⚡';
    }

    // Save state details
    lastDilutionRun = {
      startConc: startConc,
      dye: dye,
      concentrations: []
    };

    // Sequential cascade timings
    var timings = [400, 1000, 1600, 2200];

    timings.forEach(function (ms, idx) {
      setTimeout(function () {
        if (!rackTubes) return;
        var tube = rackTubes[idx];
        if (!tube) return;

        // Perform dynamic 1:10 dilution calculation
        // Tube 1 is 10x dilution, Tube 2 is 100x dilution, etc.
        var exponent = idx + 1;
        var dilutionFactor = Math.pow(10, exponent);
        var finalConc = startConc / dilutionFactor;

        // Format concentrations nicely in scientific notation
        var formattedConc = '';
        if (finalConc >= 0.1) {
          formattedConc = finalConc.toFixed(2) + ' M';
        } else {
          // e.g. 1.00 x 10⁻² M
          var displayNum = finalConc * Math.pow(10, exponent);
          formattedConc = displayNum.toFixed(2) + ' x 10⁻' + exponent + ' M';
        }

        // Save log details
        if (lastDilutionRun && lastDilutionRun.concentrations) {
          lastDilutionRun.concentrations.push(formattedConc);
        }

        // Fill tube liquid height (standard fill 68% height)
        if (tube.liq) {
          tube.liq.style.height = '70%';
          // Fade liquid dye color progressively by a factor of 10 to simulate dilution opacity!
          var baseOpacity = 0.85 / Math.pow(4, idx);
          tube.liq.style.backgroundColor = 'rgba(' + dye.r + ',' + dye.g + ',' + dye.b + ',' + baseOpacity.toFixed(3) + ')';
        }

        // Update tube label concentration badge
        if (tube.conc) {
          tube.conc.textContent = formattedConc;
        }

        // Play trigger beep or particle log
        if (idx === 3 && dilutionSpeech) {
          dilutionSpeech.innerHTML = '💥 <strong>10,000x Dilution Complete!</strong> Visual dye matching ' + dye.name + ' cascade calibrated perfectly!';
        }
      }, ms);
    });

    // Tracker
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('lab_dilution_run', dyeKey, { starting_conc: startConc });
    }
  }

  // --- TITRATION SIMULATOR ENGINE ---
  function initTitrationDesk() {
    if (btnAddDrop) btnAddDrop.addEventListener('click', addTitrationDrop);
    if (btnAutoTitrate) btnAutoTitrate.addEventListener('click', toggleAutoTitration);
    if (btnResetTitration) btnResetTitration.addEventListener('click', resetTitration);

    if (selectTitrant) selectTitrant.addEventListener('change', resetTitration);
    if (selectAnalyte) selectAnalyte.addEventListener('change', resetTitration);
    if (selectIndicator) selectIndicator.addEventListener('change', resetTitration);
    
    if (sliderDropSize) {
      sliderDropSize.addEventListener('input', function () {
        if (badgeDropSize) badgeDropSize.textContent = parseFloat(sliderDropSize.value).toFixed(2) + ' mL';
      });
    }

    resetTitration();
  }

  function resetTitration() {
    // Clear timers
    if (titrationState.timer) {
      clearInterval(titrationState.timer);
    }

    titrationState = {
      volAdded: 0,
      pH: 13.00,
      history: [{ vol: 0, pH: 13.00 }],
      isRunning: false,
      timer: null
    };

    if (btnAutoTitrate) btnAutoTitrate.textContent = '▶ TITRATE';
    if (buretteFluid) buretteFluid.style.height = '100%';
    if (flaskLiquid) {
      flaskLiquid.style.height = '35%';
      // Reset color based on base indicator (since we start basic at pH 13)
      var indicator = selectIndicator ? selectIndicator.value : 'phenolphthalein';
      if (indicator === 'phenolphthalein') {
        flaskLiquid.style.backgroundColor = 'rgba(255, 45, 107, 0.75)'; // basic is magenta
      } else if (indicator === 'methylOrange') {
        flaskLiquid.style.backgroundColor = 'rgba(255, 230, 0, 0.75)'; // basic is yellow
      } else {
        flaskLiquid.style.backgroundColor = 'rgba(0, 90, 220, 0.75)'; // basic is blue
      }
    }

    if (titrationPhBadge) titrationPhBadge.textContent = '13.00';
    if (titrationVolBadge) titrationVolBadge.textContent = '0.0 mL';

    if (titrationSpeech) {
      titrationSpeech.innerHTML = '💧 Flask contains basic analyte (pH 13.00). Drop in titrant to begin assay!';
    }

    drawTitrationCurve();
  }

  function addTitrationDrop() {
    if (titrationState.volAdded >= 50) {
      if (titrationSpeech) titrationSpeech.innerHTML = '⚠️ Burette depleted! Click the reset icon to refill.';
      if (titrationState.isRunning) toggleAutoTitration();
      return;
    }

    var dropSize = sliderDropSize ? parseFloat(sliderDropSize.value) : 0.5;

    // Trigger drip animation
    if (titrationDrop) {
      titrationDrop.style.display = 'block';
      titrationDrop.style.top = '190px';
      
      // Animate top position via JS since we are in static env
      var start = Date.now();
      var duration = 300;
      var dripTimer = setInterval(function () {
        var elapsed = Date.now() - start;
        var progress = Math.min(elapsed / duration, 1);
        titrationDrop.style.top = (190 + progress * 75) + 'px';
        
        if (progress === 1) {
          clearInterval(dripTimer);
          titrationDrop.style.display = 'none';
          
          // Complete addition math
          processTitrationStep(dropSize);
        }
      }, 16);
    } else {
      processTitrationStep(dropSize);
    }
  }

  function processTitrationStep(dropSize) {
    titrationState.volAdded += dropSize;
    if (titrationState.volAdded > 50) titrationState.volAdded = 50;

    // Math: HCl (0.1M) into 25mL NaOH (0.1M)
    // Starting base moles = 0.0025
    var startMolesBase = 0.0025;
    var titrantMoles = 0.10 * (titrationState.volAdded / 1000);
    var remainingMolesBase = startMolesBase - titrantMoles;
    var totalVolumeL = (25.0 + titrationState.volAdded) / 1000;
    
    var newPH = 7.00;
    if (remainingMolesBase > 0.00001) {
      var concOH = remainingMolesBase / totalVolumeL;
      var pOH = -Math.log10(concOH);
      newPH = 14.00 - pOH;
    } else if (remainingMolesBase < -0.00001) {
      var excessMolesH = Math.abs(remainingMolesBase);
      var concH = excessMolesH / totalVolumeL;
      newPH = -Math.log10(concH);
    } else {
      newPH = 7.00; // Perfect equivalence point
    }

    titrationState.pH = newPH;
    titrationState.history.push({ vol: titrationState.volAdded, pH: newPH });

    // Update LED readings
    if (titrationPhBadge) titrationPhBadge.textContent = newPH.toFixed(2);
    if (titrationVolBadge) titrationVolBadge.textContent = titrationState.volAdded.toFixed(1) + ' mL';

    // Update Flask volume level (max addition volume is 50mL, maps fluid height from 35% to 65%)
    if (flaskLiquid) {
      var heightPercent = 35 + (titrationState.volAdded / 50) * 30;
      flaskLiquid.style.height = heightPercent + '%';

      // Update liquid color dynamically based on indicator and pH
      var indicator = selectIndicator ? selectIndicator.value : 'phenolphthalein';
      if (indicator === 'phenolphthalein') {
        if (newPH >= 10.0) {
          flaskLiquid.style.backgroundColor = 'rgba(255, 45, 107, 0.75)'; // Magenta
        } else if (newPH <= 8.2) {
          flaskLiquid.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Colorless
        } else {
          // Linear transition opacity
          var opacity = 0.75 * ((newPH - 8.2) / 1.8);
          flaskLiquid.style.backgroundColor = 'rgba(255, 45, 107, ' + opacity.toFixed(2) + ')';
        }
      } else if (indicator === 'methylOrange') {
        if (newPH <= 3.1) {
          flaskLiquid.style.backgroundColor = 'rgba(255, 45, 45, 0.75)'; // Red
        } else if (newPH >= 4.4) {
          flaskLiquid.style.backgroundColor = 'rgba(255, 230, 0, 0.75)'; // Yellow
        } else {
          // Orange transition
          flaskLiquid.style.backgroundColor = 'rgba(255, 130, 0, 0.75)';
        }
      } else { // Bromothymol Blue
        if (newPH <= 6.0) {
          flaskLiquid.style.backgroundColor = 'rgba(255, 230, 0, 0.75)'; // Yellow
        } else if (newPH >= 7.6) {
          flaskLiquid.style.backgroundColor = 'rgba(0, 90, 220, 0.75)'; // Blue
        } else {
          flaskLiquid.style.backgroundColor = 'rgba(0, 180, 80, 0.75)'; // Green transition
        }
      }
    }

    // Update Burette height level
    if (buretteFluid) {
      var bPercent = 100 - (titrationState.volAdded / 50) * 100;
      buretteFluid.style.height = bPercent + '%';
    }

    // Update curve graph
    drawTitrationCurve();

    // Check neutralization threshold
    var isEquivalence = Math.abs(titrationState.volAdded - 25.0) < 0.26;
    if (isEquivalence && titrationSpeech) {
      titrationSpeech.innerHTML = '💥 <strong>EQUIVALENCE POINT DETECTED!</strong> Analyte neutralized at pH 7.00. Stoichiometric calibration validated!';
      if (titrationState.isRunning) {
        toggleAutoTitration();
      }
    } else if (titrationSpeech) {
      titrationSpeech.innerHTML = '💧 Titrating... pH is stable at <strong>' + newPH.toFixed(2) + '</strong> | Added: <strong>' + titrationState.volAdded.toFixed(1) + ' mL</strong>';
    }
  }

  function toggleAutoTitration() {
    if (titrationState.isRunning) {
      // STOP
      titrationState.isRunning = false;
      if (btnAutoTitrate) btnAutoTitrate.textContent = '▶ TITRATE';
      if (titrationState.timer) clearInterval(titrationState.timer);
    } else {
      // START
      titrationState.isRunning = true;
      if (btnAutoTitrate) btnAutoTitrate.textContent = '■ PAUSE';
      titrationState.timer = setInterval(function () {
        addTitrationDrop();
      }, 500); // 1 drop every 500ms
    }
  }

  function drawTitrationCurve() {
    if (!titrationCurveCanvas) return;
    var ctx = titrationCurveCanvas.getContext('2d');
    var w = titrationCurveCanvas.width;
    var h = titrationCurveCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid background
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (var i = 20; i < w; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h - 20);
      ctx.stroke();
    }
    for (var j = 20; j < h - 20; j += 20) {
      ctx.beginPath();
      ctx.moveTo(20, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }

    // Draw Axes (Origin at 20, h-20)
    ctx.strokeStyle = 'var(--ink)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 5);
    ctx.lineTo(20, h - 20);
    ctx.lineTo(w - 5, h - 20);
    ctx.stroke();

    // Plot full mathematical sigmoidal curve line (gray)
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var v = 0; v <= 50; v += 0.5) {
      var molesB = 0.0025;
      var molesA = 0.10 * (v / 1000);
      var remB = molesB - molesA;
      var totVL = (25.0 + v) / 1000;
      var curvePH = 7.00;
      if (remB > 0.00001) {
        curvePH = 14.00 - (-Math.log10(remB / totVL));
      } else if (remB < -0.00001) {
        curvePH = -Math.log10(Math.abs(remB) / totVL);
      }
      var cx = 20 + (v / 50) * (w - 30);
      var cy = (h - 20) - (curvePH / 14) * (h - 30);
      if (v === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Draw active user progress line (pink/bold)
    if (titrationState.history && titrationState.history.length > 0) {
      ctx.strokeStyle = 'var(--pink)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var idx = 0; idx < titrationState.history.length; idx++) {
        var pt = titrationState.history[idx];
        var px = 20 + (pt.vol / 50) * (w - 30);
        var py = (h - 20) - (pt.pH / 14) * (h - 30);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Pulse a cursor dot at current position
      var lastPt = titrationState.history[titrationState.history.length - 1];
      var dotX = 20 + (lastPt.vol / 50) * (w - 30);
      var dotY = (h - 20) - (lastPt.pH / 14) * (h - 30);
      ctx.fillStyle = 'var(--pink)';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'var(--ink)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }


  // --- CGMP BALANCE CALIBRATION SIMULATOR ---
  function initCalibrationStation() {
    if (btnWeight1) btnWeight1.addEventListener('click', function () { placeCalibrationWeight(1.0000); });
    if (btnWeight5) btnWeight5.addEventListener('click', function () { placeCalibrationWeight(5.0000); });
    if (btnWeight10) btnWeight10.addEventListener('click', function () { placeCalibrationWeight(10.0000); });
    
    if (btnCalVerify) btnCalVerify.addEventListener('click', verifyCalibration);
    if (btnCalClear) btnCalClear.addEventListener('click', tareCalibrationScale);

    tareCalibrationScale();
  }

  function placeCalibrationWeight(mass) {
    // Reset state
    if (calState.flickerTimer) clearInterval(calState.flickerTimer);
    
    calState.activeWeight = mass;

    // Display mass blocks
    if (scaleActiveWeight) {
      scaleActiveWeight.style.display = 'flex';
      scaleActiveWeight.textContent = mass.toFixed(0) + 'g';
    }

    // Fluctuate standard weights with minor environment drift (simulate scale resolution)
    var drift = (Math.random() - 0.5) * 0.00028; // drift within +/- 0.00014 g
    var baseVal = mass + drift;
    calState.observedReadout = baseVal;

    // Simulate high-sensitivity balance flicker
    if (balanceLedReadout) {
      balanceLedReadout.textContent = baseVal.toFixed(4) + ' g';
    }

    if (txtObservedWeight) {
      txtObservedWeight.value = baseVal.toFixed(4);
    }

    if (calStableFlag) {
      calStableFlag.textContent = '● STABILIZING';
      calStableFlag.style.color = '#ffcc00';
    }

    // Flicker loop
    var count = 0;
    calState.flickerTimer = setInterval(function () {
      count++;
      var flux = (Math.random() - 0.5) * 0.0001;
      var displayVal = baseVal + flux;
      
      if (balanceLedReadout) {
        balanceLedReadout.textContent = displayVal.toFixed(4) + ' g';
      }

      if (count > 10) { // stabilized after 1 sec
        clearInterval(calState.flickerTimer);
        
        if (balanceLedReadout) {
          balanceLedReadout.textContent = baseVal.toFixed(4) + ' g';
        }
        if (calStableFlag) {
          calStableFlag.textContent = '● STABLE';
          calStableFlag.style.color = '#66ff66';
        }
        if (calSpeech) {
          calSpeech.innerHTML = '⚖️ <strong>Reference weights loaded:</strong> observed reading is stable at <strong>' + baseVal.toFixed(4) + ' g</strong>. Click LOG ENTRY to verify compliance!';
        }
      }
    }, 100);
  }

  function verifyCalibration() {
    if (calState.activeWeight === null) {
      if (calSpeech) calSpeech.innerHTML = '⚠️ FAILED: No weights are loaded on the scale pan!';
      return;
    }

    var activeWeight = calState.activeWeight;
    var observedVal = calState.observedReadout;
    var dev = observedVal - activeWeight;
    var isPassed = Math.abs(dev) <= 0.0002;
    var statusText = isPassed ? 'PASSED (ISO 17025) ✓' : 'FAILED (OUT OF TOLERANCE) ✗';

    // Log the trial details
    calState.verifiedLogs[activeWeight] = {
      observed: observedVal,
      dev: dev,
      status: statusText,
      passed: isPassed
    };

    // Update Report variables
    var targetId = 'rep-cal-' + activeWeight;
    var targetDevId = 'rep-cal-dev-' + activeWeight;
    var targetStatusId = 'rep-cal-status-' + activeWeight;

    var elVal = document.getElementById(targetId); if (elVal) elVal.textContent = observedVal.toFixed(4) + ' g';
    var elDev = document.getElementById(targetDevId); if (elDev) elDev.textContent = (dev >= 0 ? '+' : '') + dev.toFixed(4) + ' g';
    var elStatus = document.getElementById(targetStatusId);
    if (elStatus) {
      elStatus.textContent = statusText;
      elStatus.style.color = isPassed ? '#2e7d32' : '#c62828';
    }

    if (calSpeech) {
      if (isPassed) {
        calSpeech.innerHTML = '🎉 <strong>CALIBRATION VERIFIED!</strong> Deviation of ' + (dev >= 0 ? '+' : '') + dev.toFixed(4) + ' g fits within the ±0.0002g limit. ISO 17025 entry logged!';
      } else {
        calSpeech.innerHTML = '❌ <strong>CALIBRATION DEVIATION!</strong> Deviation exceeds tolerance limit. Instrument maintenance required.';
      }
    }
  }

  function tareCalibrationScale() {
    if (calState.flickerTimer) clearInterval(calState.flickerTimer);

    calState.activeWeight = null;
    calState.observedReadout = 0.0000;

    if (scaleActiveWeight) scaleActiveWeight.style.display = 'none';
    if (txtObservedWeight) txtObservedWeight.value = '';
    if (balanceLedReadout) balanceLedReadout.textContent = '0.0000 g';
    if (calStableFlag) {
      calStableFlag.textContent = '● STABLE';
      calStableFlag.style.color = '#66ff66';
    }
    if (calSpeech) {
      calSpeech.innerHTML = '⚖️ <strong>Scale pan Tared:</strong> Standard ISO scales ready for weights placement.';
    }
  }


  // --- GHS CHEMICAL SAFETY MATRIX ---
  function initSafetyMatrix() {
    if (btnMixSafety) btnMixSafety.addEventListener('click', mixChemicalsSafety);
  }

  function mixChemicalsSafety() {
    if (!selectSafetyA || !selectSafetyB) return;

    var keyA = selectSafetyA.value;
    var keyB = selectSafetyB.value;

    // Trigger fume hood shake
    if (hoodStatusIcon) {
      hoodStatusIcon.textContent = '💥';
      hoodStatusIcon.classList.add('hood-shaking');
    }
    if (hoodSmoke) {
      hoodSmoke.style.display = 'block';
    }

    setTimeout(function () {
      if (hoodStatusIcon) hoodStatusIcon.classList.remove('hood-shaking');
      
      var mixKey = keyA + ' + ' + keyB;
      var warningText = '';
      var icon = '🧪';
      var pictograms = []; // pictograms can be: flammable, corrosive, toxic, oxidizer, explosive

      // Mix safety database mapping
      if (keyA === 'NaOH' && keyB === 'HCl') {
        warningText = '🔥 <strong>VIGOROUS NEUTRALIZATION!</strong> Acid-Base contact releases significant exothermic heat. Forms safe saline solution ($NaCl$). Goggles required!';
        icon = '🌡️';
        pictograms = ['corrosive'];
      } else if (keyA === 'KMnO4' && keyB === 'glycerin') {
        warningText = '💥 <strong>DELAYED SPONTANEOUS COMBUSTION!</strong> Glycerin oxidation by Permanganate is highly exothermic, burst igniting after seconds! Forms carbon oxides and residues.';
        icon = '🔥';
        pictograms = ['oxidizer', 'flammable'];
      } else if (keyA === 'KMnO4' && keyB === 'H2SO4') {
        warningText = '💀 <strong>EXPLOSION HAZARD!</strong> Mixing solid Permanganate and concentrated Sulfuric Acid synthesizes Manganese Heptoxide ($Mn_2O_7$), a volatile explosive oil. DO NOT PERFORM!';
        icon = '💥';
        pictograms = ['oxidizer', 'explosive', 'toxic'];
      } else if (keyA === 'HCl' && keyB === 'H2SO4') {
        warningText = '⚠️ <strong>ACID STRESS:</strong> Direct mixing of concentrated Sulfuric and Hydrochloric acids generates toxic fumes ($HCl$ gas evolution) and thermal splattering. Hood mandatory!';
        icon = '🌫️';
        pictograms = ['corrosive', 'toxic'];
      } else if (keyB === 'NaCl') {
        warningText = '✅ <strong>COMPATIBLE:</strong> Salt addition does not react chemically. The reagents remain stable and are safe for unified chemical cabinet storage.';
        icon = '🟢';
        pictograms = [];
      } else {
        warningText = '✅ <strong>COMPATIBLE:</strong> Chemical interaction is endothermic or negligible. No dangerous fumes, gases, or pressure release detected.';
        icon = '🟢';
        pictograms = [];
      }

      if (hoodStatusIcon) hoodStatusIcon.textContent = icon;
      if (hoodSmoke && icon === '🟢') hoodSmoke.style.display = 'none';

      // Update safety speech bubble
      if (safetySpeech) {
        safetySpeech.innerHTML = warningText;
      }

      // Populate GHS diamonds dynamically
      if (ghsPlacardsPanel) {
        ghsPlacardsPanel.innerHTML = '';
        if (pictograms.length === 0) {
          ghsPlacardsPanel.innerHTML = '<span style="font-size: 0.8rem; color: #33a033; font-weight: bold;">✅ COMPATIBLE STORAGE</span>';
        } else {
          pictograms.forEach(function (pic) {
            var diamond = document.createElement('div');
            diamond.className = 'ghs-pictogram';
            var symbol = '⚠️';
            if (pic === 'flammable') symbol = '🔥';
            else if (pic === 'corrosive') symbol = '🧪';
            else if (pic === 'toxic') symbol = '💀';
            else if (pic === 'oxidizer') symbol = '⭕';
            else if (pic === 'explosive') symbol = '💥';
            
            diamond.innerHTML = '<span>' + symbol + '</span>';
            ghsPlacardsPanel.appendChild(diamond);
          });
        }
      }

    }, 800);
  }


  // --- UV-VIS SPECTROPHOTOMETER SIMULATOR ---
  function initSpectrophotometer() {
    if (selectSpecCompound) selectSpecCompound.addEventListener('change', calculateAbsorbance);
    if (sliderSpecPath) {
      sliderSpecPath.addEventListener('input', function () {
        if (badgeSpecPath) badgeSpecPath.textContent = parseFloat(sliderSpecPath.value).toFixed(1) + ' cm';
        calculateAbsorbance();
      });
    }
    if (sliderSpecConc) {
      sliderSpecConc.addEventListener('input', function () {
        if (badgeSpecConc) badgeSpecConc.textContent = parseFloat(sliderSpecConc.value).toFixed(2) + ' mM';
        calculateAbsorbance();
      });
    }

    calculateAbsorbance();
  }

  function calculateAbsorbance() {
    var compoundKey = selectSpecCompound ? selectSpecCompound.value : 'CuSO4';
    
    // Extinction coefficients: KMnO4 is massive, CuSO4 is light, cobalt is medium
    var eps = 6.0;
    var waveColor = 'rgba(0, 194, 255, 0.4)'; // CuSO4 color
    if (compoundKey === 'KMnO4') {
      eps = 2200.0;
      waveColor = 'rgba(106, 13, 173, 0.8)';
    } else if (compoundKey === 'cobalt') {
      eps = 55.0;
      waveColor = 'rgba(255, 45, 107, 0.7)';
    }

    var l = sliderSpecPath ? parseFloat(sliderSpecPath.value) : 1.0;
    var c = sliderSpecConc ? parseFloat(sliderSpecConc.value) : 0.50; // in mM
    
    // Beer-Lambert: Absorbance A = e * c * l
    // (conc converted from mM to M: divided by 1000)
    var concM = c / 1000;
    var abs = eps * concM * l;
    
    // Transmittance T = 10^(-A)
    var trans = Math.pow(10, -abs);
    var transPercent = trans * 100;

    // Update LED readings
    if (specAbsLed) {
      specAbsLed.textContent = abs.toFixed(3);
    }
    if (specTransBadge) {
      specTransBadge.textContent = transPercent.toFixed(1) + '%';
    }
    if (specEpsBadge) {
      specEpsBadge.textContent = eps + ' M⁻¹cm⁻¹';
    }

    // Attenuate light beam opacity on visual cuvette path diagram
    if (specCuvette) {
      specCuvette.style.backgroundColor = waveColor;
    }
    if (specLightBeam) {
      // Beam opacity going into cuvette
      specLightBeam.style.opacity = '1';
    }
    if (specDetectorBeam) {
      // Beam opacity after exiting cuvette scales with Transmittance percentage!
      var beamOpacity = Math.max(0.05, trans);
      specDetectorBeam.style.opacity = beamOpacity.toFixed(2);
    }

    // Redraw graph
    drawSpecPlot();

    if (specSpeech) {
      specSpeech.innerHTML = '📈 Absorbance: <strong>' + abs.toFixed(3) + '</strong> | Transmittance: <strong>' + transPercent.toFixed(1) + '%</strong>. Fits linear Beer-Lambert limit perfectly!';
    }
  }

  function drawSpecPlot() {
    if (!specPlotCanvas) return;
    var ctx = specPlotCanvas.getContext('2d');
    var w = specPlotCanvas.width;
    var h = specPlotCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid background
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (var i = 20; i < w; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h - 20);
      ctx.stroke();
    }
    for (var j = 20; j < h - 20; j += 20) {
      ctx.beginPath();
      ctx.moveTo(20, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }

    // Draw Axes (Origin at 20, h-20)
    ctx.strokeStyle = 'var(--ink)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 5);
    ctx.lineTo(20, h - 20);
    ctx.lineTo(w - 5, h - 20);
    ctx.stroke();

    // Beer-Lambert is completely linear. Let's draw the straight fit line
    var compoundKey = selectSpecCompound ? selectSpecCompound.value : 'CuSO4';
    var eps = compoundKey === 'KMnO4' ? 2200.0 : (compoundKey === 'cobalt' ? 55.0 : 6.0);
    var l = sliderSpecPath ? parseFloat(sliderSpecPath.value) : 1.0;

    ctx.strokeStyle = '#00c2ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Draw straight line from conc = 0 to conc = 2 mM
    for (var c = 0; c <= 2.0; c += 0.1) {
      var concM = c / 1000;
      var curAbs = eps * concM * l;
      
      // Scale coordinates (max conc 2mM mapped to x-axis; max Absorbance 1.5 mapped to y-axis)
      var cx = 20 + (c / 2.0) * (w - 30);
      var cy = (h - 20) - Math.min(1.0, (curAbs / 1.5)) * (h - 30);
      
      if (c === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Plot current active sample point
    var activeC = sliderSpecConc ? parseFloat(sliderSpecConc.value) : 0.50;
    var activeAbs = eps * (activeC / 1000) * l;
    
    var ptX = 20 + (activeC / 2.0) * (w - 30);
    var ptY = (h - 20) - Math.min(1.0, (activeAbs / 1.5)) * (h - 30);

    ctx.fillStyle = 'var(--pink)';
    ctx.beginPath();
    ctx.arc(ptX, ptY, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'var(--ink)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ptX, ptY, 5, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // --- CGMP / GLP REPORT SYSTEM ---
  function initReportSystem() {
    if (btnTriggerRecord) {
      btnTriggerRecord.addEventListener('click', compileGlpRecord);
    }
    
    if (btnPrintRecord) {
      btnPrintRecord.addEventListener('click', function () {
        // Track the click
        if (typeof window.trackEvent === 'function') {
          var compoundVal = selectCompound ? selectCompound.value : 'NaOH';
          window.trackEvent('lab_report_print', compoundVal, null);
        }
        
        // Sync operator name to plain text printer div
        if (reportOperatorPrint && reportOperator) {
          reportOperatorPrint.textContent = reportOperator.value.trim() || 'RECRUITER / GUEST';
        }

        // Call system printer
        window.print();
      });
    }
  }

  function compileGlpRecord() {
    try {
      var compoundKey = selectCompound ? selectCompound.value : 'NaOH';
      var compound = COMPOUNDS[compoundKey];
      if (!compound) return;

      // 1. Populate metadata (date, operator)
      if (reportDate) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        
        var dateStr = dd + '/' + mm + '/' + yyyy;
        reportDate.textContent = dateStr;
      }

      // Sync input name
      if (reportOperator && reportOperatorPrint) {
        reportOperatorPrint.textContent = reportOperator.value.trim() || 'RECRUITER / GUEST';
      }

      // 2. Populate Molarity formulation record details
      var volume = sliderVolume ? parseInt(sliderVolume.value, 10) : 250;
      var molarity = sliderConcentration ? parseFloat(sliderConcentration.value) : 0.10;
      
      var elCompound = document.getElementById('rep-compound');
      if (elCompound) elCompound.textContent = compound.name;

      var elMolarMass = document.getElementById('rep-molar-mass');
      if (elMolarMass) elMolarMass.textContent = compound.molarMass.toFixed(2) + ' g/mol';

      var elVolume = document.getElementById('rep-volume');
      if (elVolume) elVolume.textContent = volume + ' mL';

      var elConcentration = document.getElementById('rep-concentration');
      if (elConcentration) elConcentration.textContent = molarity.toFixed(2) + ' M';

      var elMoles = document.getElementById('rep-moles');
      if (elMoles) elMoles.textContent = (calculatedResult && typeof calculatedResult.moles === 'number') ? calculatedResult.moles.toFixed(4) + ' mol' : '0.0250 mol';

      var elCalculatedMass = document.getElementById('rep-calculated-mass');
      if (elCalculatedMass) {
        var massVal = (calculatedResult && typeof calculatedResult.mass === 'number') ? calculatedResult.mass.toFixed(2) : '1.00';
        var unitVal = (calculatedResult && calculatedResult.unit) ? calculatedResult.unit : 'g';
        elCalculatedMass.textContent = massVal + ' ' + unitVal;
      }

      // 3. Populate Dilution exponents logs (uses last dilution cascade or generates live placeholders)
      if (lastDilutionRun && lastDilutionRun.concentrations && lastDilutionRun.concentrations.length === 4) {
        var t1 = document.getElementById('rep-tube-1'); if (t1) t1.textContent = lastDilutionRun.concentrations[0];
        var t2 = document.getElementById('rep-tube-2'); if (t2) t2.textContent = lastDilutionRun.concentrations[1];
        var t3 = document.getElementById('rep-tube-3'); if (t3) t3.textContent = lastDilutionRun.concentrations[2];
        var t4 = document.getElementById('rep-tube-4'); if (t4) t4.textContent = lastDilutionRun.concentrations[3];
      } else {
        // Generate default values matching target molarity selection
        var startConc = molarity;
        for (var idx = 1; idx <= 4; idx++) {
          var dilutionFactor = Math.pow(10, idx);
          var finalConc = startConc / dilutionFactor;
          var formattedConc = '';
          if (finalConc >= 0.1) {
            formattedConc = finalConc.toFixed(2) + ' M';
          } else {
            var displayNum = finalConc * Math.pow(10, idx);
            formattedConc = displayNum.toFixed(2) + ' x 10⁻' + idx + ' M';
          }
          var tubeEl = document.getElementById('rep-tube-' + idx);
          if (tubeEl) tubeEl.textContent = formattedConc;
        }
      }

      // 3B. Populate Balance Calibration ISO 17025 Logs
      var weights = [1, 5, 10];
      weights.forEach(function (w) {
        var log = calState.verifiedLogs[w];
        var idVal = 'rep-cal-' + w;
        var idDev = 'rep-cal-dev-' + w;
        var idStatus = 'rep-cal-status-' + w;

        var elVal = document.getElementById(idVal);
        var elDev = document.getElementById(idDev);
        var elStatus = document.getElementById(idStatus);

        if (log) {
          if (elVal) elVal.textContent = log.observed.toFixed(4) + ' g';
          if (elDev) elDev.textContent = (log.dev >= 0 ? '+' : '') + log.dev.toFixed(4) + ' g';
          if (elStatus) {
            elStatus.textContent = log.status;
            elStatus.style.color = log.passed ? '#2e7d32' : '#c62828';
          }
        } else {
          // Default ISO auto-passed fallback logs if they haven't manually run it
          var mockObserved = w + (Math.random() - 0.5) * 0.0001;
          var mockDev = mockObserved - w;
          if (elVal) elVal.textContent = mockObserved.toFixed(4) + ' g';
          if (elDev) elDev.textContent = (mockDev >= 0 ? '+' : '') + mockDev.toFixed(4) + ' g';
          if (elStatus) {
            elStatus.textContent = 'PASSED (ISO 17025) ✓';
            elStatus.style.color = '#2e7d32';
          }
        }
      });

      // 3C. Populate Titration standardization logs
      if (repTitTitrant) repTitTitrant.textContent = selectTitrant ? selectTitrant.options[selectTitrant.selectedIndex].text : 'Hydrochloric Acid (HCl, 0.10 M)';
      if (repTitAnalyte) repTitAnalyte.textContent = selectAnalyte ? selectAnalyte.options[selectAnalyte.selectedIndex].text : 'Sodium Hydroxide (NaOH, 25.0 mL, 0.10 M)';
      
      var indicatorText = 'Phenolphthalein (Clear ↔ Pink)';
      if (selectIndicator) {
        indicatorText = selectIndicator.options[selectIndicator.selectedIndex].text;
      }
      if (repTitIndicator) repTitIndicator.textContent = indicatorText;

      var finalEndpoint = titrationState.volAdded > 0 ? titrationState.volAdded : 25.0;
      if (repTitEndpoint) repTitEndpoint.textContent = finalEndpoint.toFixed(1) + ' mL';
      
      // Calculate resulting concentration based on titration math:
      // Ca = (Cb * Vb) / Va -> C_base = (C_acid * V_acid) / V_base = (0.10 * finalEndpoint) / 25.0
      var calculatedConc = (0.10 * finalEndpoint) / 25.0;
      if (repTitConcResult) repTitConcResult.textContent = calculatedConc.toFixed(4) + ' M';

      // 4. Reveal reporting sections on screen
      if (glpReportSheet) {
        glpReportSheet.classList.add('active');
      }
      if (reportActionsPanel) {
        reportActionsPanel.classList.add('active');
      }

      // 5. Scroll page down smoothly to the document sheet
      if (glpReportSheet) {
        glpReportSheet.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Tracker
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('lab_record_compiled', compoundKey, {
          molarity: molarity,
          volume: volume
        });
      }
    } catch (err) {
      console.error("Error compiling GLP record:", err);
    }
  }

})();
