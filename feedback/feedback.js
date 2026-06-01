/**
 * feedback.js — Orchestrates the multi-step interactive comic feedback form.
 * Pure Vanilla JS — compatible with offline file:// and standard http:// protocols.
 */

(function () {
  'use strict';

  // --- CONFIG & STATE ---
  var currentStep = 1;
  var selectedPath = ''; // 'review' or 'survey'
  var ideaVotes = {};    // dynamically populated based on DOM or sheet load
  var releasedApps = []; // dynamic catalog of released apps

  // --- DOM ELEMENTS ---
  var progressBar      = document.getElementById('progress-bar');
  var panelSelector    = document.getElementById('panel-selector');
  var panelReview      = document.getElementById('panel-review');
  var panelSurvey      = document.getElementById('panel-survey');
  var panelContact     = document.getElementById('panel-contact');
  var panelSuccess     = document.getElementById('panel-success');

  var btnPathReview    = document.getElementById('btn-path-review');
  var btnPathSurvey    = document.getElementById('btn-path-survey');
  var btnContactBack   = document.getElementById('btn-contact-back');

  var btnReviewContinue = document.getElementById('btn-review-continue');
  var btnSurveyContinue = document.getElementById('btn-survey-continue');

  var gasFeedbackForm  = document.getElementById('gas-feedback-form');
  var btnSubmitFeedback = document.getElementById('btn-submit-feedback');
  var formErrorBanner  = document.getElementById('form-error-banner');

  // Rating Bursts
  var ratingBursts     = document.querySelectorAll('.rating-burst');
  var ratingDescText   = document.getElementById('rating-desc-text');
  var ratingHidden     = document.getElementById('hidden-rating');

  // Voting Chips (Static reference)
  var voteChips        = document.querySelectorAll('.vote-chip');

  // Input Fields
  var txtLovedFeatures = document.getElementById('txt-loved-features');
  var txtImprovements  = document.getElementById('txt-improvements');
  var txtNewIdea       = document.getElementById('txt-new-idea');
  var txtName          = document.getElementById('txt-name');
  var txtEmail         = document.getElementById('txt-email');
  var selectApp        = document.getElementById('select-app');
  var selectRole       = document.getElementById('select-role');

  // Hidden Inputs
  var hiddenFormType         = document.getElementById('hidden-form-type');
  var hiddenSelectedApp      = document.getElementById('hidden-selected-app');
  var hiddenLovedFeatures    = document.getElementById('hidden-loved-features');
  var hiddenAppImprovements  = document.getElementById('hidden-app-improvements');
  var hiddenNewIdeasInterest = document.getElementById('hidden-new-ideas-interest');
  var hiddenNewIdeaSuggest   = document.getElementById('hidden-new-idea-suggestions');

  // Preview Container
  var appPreviewContainer = document.getElementById('app-preview-container');

  // --- INITIALIZATION ---
  window.addEventListener('DOMContentLoaded', function () {
    initEventListeners();
    updateProgress(20);
    fetchDynamicIdeas();
  });

  // --- EVENT LISTENERS ---
  function initEventListeners() {
    // 1. Path Selection
    if (btnPathReview) {
      btnPathReview.addEventListener('click', function () {
        selectPath('review');
      });
    }

    if (btnPathSurvey) {
      btnPathSurvey.addEventListener('click', function () {
        selectPath('survey');
      });
    }

    // 2. Navigation / Back Actions
    document.querySelectorAll('.back-link').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var prevStep = btn.getAttribute('data-prev');
        if (prevStep === '1') {
          goToStep(1);
        }
      });
    });

    if (btnContactBack) {
      btnContactBack.addEventListener('click', function () {
        if (selectedPath === 'review') {
          goToStep(2, 'review');
        } else {
          goToStep(2, 'survey');
        }
      });
    }

    // 3. star/burst Ratings
    ratingBursts.forEach(function (burst) {
      burst.addEventListener('click', function () {
        var value = parseInt(burst.getAttribute('data-value'), 10);
        setRating(value);
      });
    });

    // 4. Voting Chips (For static/fallback elements initially in HTML)
    voteChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var parentRow = chip.parentElement;
        var ideaName = parentRow.getAttribute('data-idea');
        var voteVal = chip.getAttribute('data-value');

        // Deselect siblings in the same row
        parentRow.querySelectorAll('.vote-chip').forEach(function (c) {
          c.classList.remove('active');
        });

        // Toggle active status
        chip.classList.add('active');
        ideaVotes[ideaName] = voteVal;
      });
    });

    // 5. Continuation Button Actions
    if (btnReviewContinue) {
      btnReviewContinue.addEventListener('click', function () {
        // Collect app review step data
        hiddenSelectedApp.value = selectApp.value;
        hiddenLovedFeatures.value = txtLovedFeatures.value.trim();
        hiddenAppImprovements.value = txtImprovements.value.trim();

        // Check if rating has been selected
        if (!ratingHidden.value) {
          setRating(3); // Give default rating 3 (Good) if not selected
        }

        goToStep(3);
      });
    }

    if (btnSurveyContinue) {
      btnSurveyContinue.addEventListener('click', function () {
        // Collect prototype survey step data
        hiddenNewIdeasInterest.value = JSON.stringify(ideaVotes);
        hiddenNewIdeaSuggest.value = txtNewIdea.value.trim();

        goToStep(3);
      });
    }

    // 6. Form Submission
    if (gasFeedbackForm) {
      gasFeedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();
        validateAndSubmit();
      });
    }
  }

  // --- STATE TRANSITIONS (Steps) ---
  function selectPath(path) {
    selectedPath = path;
    hiddenFormType.value = path;

    if (path === 'review') {
      goToStep(2, 'review');
    } else {
      goToStep(2, 'survey');
    }
  }

  function goToStep(step, subPath) {
    currentStep = step;

    // Hide all panels first
    panelSelector.classList.remove('active');
    panelReview.classList.remove('active');
    panelSurvey.classList.remove('active');
    panelContact.classList.remove('active');
    panelSuccess.classList.remove('active');

    // Show designated panel and update progress
    if (step === 1) {
      panelSelector.classList.add('active');
      updateProgress(20);
    } else if (step === 2) {
      if (subPath === 'review') {
        panelReview.classList.add('active');
      } else {
        panelSurvey.classList.add('active');
      }
      updateProgress(50);
    } else if (step === 3) {
      panelContact.classList.add('active');
      updateProgress(80);
    } else if (step === 4) {
      panelSuccess.classList.add('active');
      updateProgress(100);
    }

    // Scroll to top of card on step transition
    var card = document.getElementById('feedback-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function updateProgress(percent) {
    if (progressBar) {
      progressBar.style.width = percent + '%';
    }
  }

  // --- RATING BURST CONTROLLER ---
  function setRating(rating) {
    ratingHidden.value = rating;

    // Toggle active classes on rating bursts
    ratingBursts.forEach(function (burst) {
      var val = parseInt(burst.getAttribute('data-value'), 10);
      if (val <= rating) {
        burst.classList.add('active');
      } else {
        burst.classList.remove('active');
      }
    });

    // Update descriptive feedback bubble
    var descText = '';
    switch (rating) {
      case 1:
        descText = 'MEH 😕 — COULD BE MUCH BETTER!';
        break;
      case 2:
        descText = 'OKAY 😐 — AVERAGE EXPERIENCE';
        break;
      case 3:
        descText = 'GOOD! 🙂 — PRETTY SOLID UTILITY';
        break;
      case 4:
        descText = 'GREAT! ⚡ — HIGHLY USEFUL!';
        break;
      case 5:
        descText = 'MIND-BLOWING! 🚀 — MASTERPIECE!';
        break;
      default:
        descText = 'SELECT A RATING! ⚡';
    }
    
    if (ratingDescText) {
      ratingDescText.textContent = descText;
    }
  }

  // --- GOOGLE DRIVE DIRECT IMAGE URL CONVERTER ---
  function formatImageUrl(url) {
    if (!url) return '';
    url = url.trim();
    
    // 1. Google Drive direct share matching (docs.google.com/file/d/ID/view)
    var driveFileRegex = /\/file\/d\/([a-zA-Z0-9_-]+)\/(view|edit)?/;
    var match = url.match(driveFileRegex);
    if (match && match[1]) {
      return 'https://drive.google.com/uc?export=view&id=' + match[1];
    }
    
    // 2. Google Drive query matching (drive.google.com/open?id=ID)
    var driveIdRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
    var matchId = url.match(driveIdRegex);
    if (matchId && matchId[1] && (url.indexOf('drive.google.com') !== -1 || url.indexOf('docs.google.com') !== -1)) {
      return 'https://drive.google.com/uc?export=view&id=' + matchId[1];
    }
    
    // 3. Return public web urls or emoji fallbacks unchanged
    return url;
  }

  // --- DYNAMIC DATA LOADER (GET Google Sheet API) ---
  function fetchDynamicIdeas() {
    if (!FEEDBACK_GAS_URL) {
      console.log("No FEEDBACK_GAS_URL configured, utilizing static fallback databases.");
      initializeStaticVotingState();
      initializeStaticAppsState();
      return;
    }

    // Set a tiny fallback timeout (4s) so slow sheet responses don't break page load
    var fetchTimeout = setTimeout(function() {
      console.warn("Dynamic ideas fetch timed out. Keeping static fallback databases.");
      initializeStaticVotingState();
      initializeStaticAppsState();
    }, 4000);

    fetch(FEEDBACK_GAS_URL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        clearTimeout(fetchTimeout);
        if (data && data.status === 'success') {
          // A. Build Upcoming Prototypes
          if (data.ideas && data.ideas.length > 0) {
            renderDynamicIdeas(data.ideas);
          } else {
            initializeStaticVotingState();
          }

          // B. Build Evaluator dropdown
          if (data.apps && data.apps.length > 0) {
            renderDynamicApps(data.apps);
          } else {
            initializeStaticAppsState();
          }
        } else {
          console.log("Empty data or error from server. Keeping static fallback databases.");
          initializeStaticVotingState();
          initializeStaticAppsState();
        }
      })
      .catch(function (error) {
        clearTimeout(fetchTimeout);
        console.warn("Error fetching dynamic content, keeping static fallback databases:", error);
        initializeStaticVotingState();
        initializeStaticAppsState();
      });
  }

  // --- FALLBACK STATIC STATES (For offline and unconfigured setups) ---
  function initializeStaticVotingState() {
    // Read static rows in HTML DOM to ensure ideaVotes state matches perfectly
    document.querySelectorAll('.idea-voting-row').forEach(function (row) {
      var ideaId = row.getAttribute('data-idea');
      if (ideaId && !ideaVotes.hasOwnProperty(ideaId)) {
        ideaVotes[ideaId] = '';
      }
    });
  }

  function initializeStaticAppsState() {
    // Hardcoded released apps dataset mirroring your portfolio projects
    releasedApps = [
      { id: 'alomole', title: 'Alomole — Chemistry Companion ⚗️', image: '⚗️', link: 'https://alomolecule.web.app' },
      { id: 'mileage', title: 'Mileage Tracker — Fuel & Cost 🚗', image: '🚗', link: 'https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage' },
      { id: 'tickly', title: 'Tickly — ToDo App 📋', image: '📋', link: '' },
      { id: 'classnotes', title: 'ClassNotes — Shared Notes Platform 📂', image: '📂', link: '' }
    ];

    // Wire up change listener
    if (selectApp) {
      selectApp.addEventListener('change', function () {
        updateAppPreview(selectApp.value);
      });
      // Initial Preview Card rendering
      updateAppPreview(selectApp.value);
    }
  }

  // --- DYNAMIC RENDERERS ---

  // 1. Rebuild dropdown & Preview Card
  function renderDynamicApps(apps) {
    if (!selectApp) return;

    // Reset dropdown
    selectApp.innerHTML = '';
    releasedApps = apps;

    apps.forEach(function (app) {
      var id = app.id || app.id_code || '';
      var title = app.title || app.name || 'Prototype';

      if (!id) return;

      var option = document.createElement('option');
      option.value = id;
      option.textContent = title;
      selectApp.appendChild(option);
    });

    // Append standard generic portfolio choice
    var generalOption = document.createElement('option');
    generalOption.value = 'general';
    generalOption.textContent = 'Overall Portfolio / Other Work 💻';
    selectApp.appendChild(generalOption);

    // Wire up change listener
    selectApp.addEventListener('change', function () {
      updateAppPreview(selectApp.value);
    });

    // Initial render
    updateAppPreview(selectApp.value);
  }

  // 2. Render dynamic preview card details
  function updateAppPreview(selectedId) {
    if (!appPreviewContainer) return;

    // Hide preview card by default
    appPreviewContainer.classList.remove('active');
    appPreviewContainer.innerHTML = '';

    if (selectedId === 'general') {
      // Create a nice overall portfolio preview chip
      appPreviewContainer.innerHTML = 
        '<div class="app-preview-icon"><span>💻</span></div>' +
        '<div class="app-preview-info">' +
        '  <h4 class="app-preview-title">MrAlokTech Portfolio</h4>' +
        '  <p class="idea-desc">Systematic review of design theme, speed, or offline sections.</p>' +
        '</div>';
      appPreviewContainer.classList.add('active');
      return;
    }

    // Find app record in catalog
    var app = null;
    for (var i = 0; i < releasedApps.length; i++) {
      if (releasedApps[i].id === selectedId) {
        app = releasedApps[i];
        break;
      }
    }

    if (!app) return;

    var image = app.image || '';
    var title = app.title || 'App Details';
    var link = app.link || '';

    // Create container inner HTML
    var iconHTML = '';
    var formattedImg = formatImageUrl(image);

    if (formattedImg && (formattedImg.indexOf('http') === 0 || formattedImg.indexOf('/') === 0)) {
      iconHTML = '<div class="app-preview-icon"><img src="' + formattedImg + '" alt="' + title + '" /></div>';
    } else {
      var iconDisplay = image || '🚀';
      iconHTML = '<div class="app-preview-icon"><span>' + iconDisplay + '</span></div>';
    }

    var infoHTML = '<div class="app-preview-info"><h4 class="app-preview-title">' + title + '</h4>';
    if (link) {
      infoHTML += '<a href="' + link + '" target="_blank" rel="noopener" class="app-preview-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live App</a>';
    }
    infoHTML += '</div>';

    appPreviewContainer.innerHTML = iconHTML + infoHTML;
    appPreviewContainer.classList.add('active');
  }

  // 3. Renderdynamic survey voting deck
  function renderDynamicIdeas(ideas) {
    var deck = document.querySelector('.voting-deck');
    if (!deck) return;

    // Reset current dynamic votes state
    ideaVotes = {};

    // Clear static fallback deck
    deck.innerHTML = '';

    ideas.forEach(function (idea) {
      // Safely read properties
      var id = idea.id || idea.id_code || '';
      var icon = idea.icon || '💡';
      var title = idea.title || idea.name || 'Prototype Idea';
      var desc = idea.description || idea.desc || 'No description provided.';
      var image = idea.image || '';
      var link = idea.link || '';

      if (!id) return; // skip row if no ID is found

      // Initialize votes state
      ideaVotes[id] = '';

      // Build DOM Nodes
      var card = document.createElement('div');
      card.className = 'idea-card';
      card.setAttribute('role', 'listitem');

      var header = document.createElement('div');
      header.className = 'idea-header';

      var iconSpan = document.createElement('span');
      iconSpan.className = 'idea-icon';

      // Load direct image or fallback emoji
      var formattedImg = formatImageUrl(image);
      if (formattedImg && (formattedImg.indexOf('http') === 0 || formattedImg.indexOf('/') === 0)) {
        var img = document.createElement('img');
        img.src = formattedImg;
        img.alt = title;
        iconSpan.appendChild(img);
      } else {
        iconSpan.textContent = icon;
      }

      var meta = document.createElement('div');
      meta.className = 'idea-meta';

      var titleH3 = document.createElement('h3');
      titleH3.className = 'idea-title';
      titleH3.textContent = title;

      var descP = document.createElement('p');
      descP.className = 'idea-desc';
      descP.textContent = desc;

      meta.appendChild(titleH3);
      meta.appendChild(descP);

      // Add Prototype visit link in info deck if set!
      if (link) {
        var linkA = document.createElement('a');
        linkA.href = link;
        linkA.target = '_blank';
        linkA.rel = 'noopener';
        linkA.className = 'app-preview-link';
        linkA.style.marginTop = '4px';
        linkA.style.padding = '3px 10px';
        linkA.style.fontSize = '0.75rem';
        linkA.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Prototype';
        meta.appendChild(linkA);
      }

      header.appendChild(iconSpan);
      header.appendChild(meta);

      var votingRow = document.createElement('div');
      votingRow.className = 'idea-voting-row';
      votingRow.setAttribute('data-idea', id);

      var chipHigh = document.createElement('button');
      chipHigh.type = 'button';
      chipHigh.className = 'vote-chip';
      chipHigh.setAttribute('data-value', 'high');
      chipHigh.textContent = 'HIGH INTEREST ⚡';

      var chipMaybe = document.createElement('button');
      chipMaybe.type = 'button';
      chipMaybe.className = 'vote-chip';
      chipMaybe.setAttribute('data-value', 'maybe');
      chipMaybe.textContent = 'MAYBE 🤔';

      var chipNo = document.createElement('button');
      chipNo.type = 'button';
      chipNo.className = 'vote-chip';
      chipNo.setAttribute('data-value', 'no');
      chipNo.textContent = 'NO INTEREST 💤';

      votingRow.appendChild(chipHigh);
      votingRow.appendChild(chipMaybe);
      votingRow.appendChild(chipNo);

      card.appendChild(header);
      card.appendChild(votingRow);
      deck.appendChild(card);

      // Attach voting listeners to newly constructed chips
      var chips = votingRow.querySelectorAll('.vote-chip');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          votingRow.querySelectorAll('.vote-chip').forEach(function (c) {
            c.classList.remove('active');
          });
          chip.classList.add('active');
          ideaVotes[id] = chip.getAttribute('data-value');
        });
      });
    });
  }

  // --- VALIDATION & GAS TRANSMISSION ---
  function validateAndSubmit() {
    var isValid = true;

    // Reset error visuals
    txtName.classList.remove('invalid');
    txtEmail.classList.remove('invalid');
    document.getElementById('error-name').style.display = 'none';
    document.getElementById('error-email').style.display = 'none';
    if (formErrorBanner) formErrorBanner.style.display = 'none';

    // 1. Name Check
    if (!txtName.value.trim()) {
      txtName.classList.add('invalid');
      document.getElementById('error-name').style.display = 'block';
      isValid = false;
    }

    // 2. Email Check
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!txtEmail.value.trim() || !emailPattern.test(txtEmail.value.trim())) {
      txtEmail.classList.add('invalid');
      document.getElementById('error-email').style.display = 'block';
      isValid = false;
    }

    if (!isValid) {
      if (formErrorBanner) formErrorBanner.style.display = 'block';
      return;
    }

    // 3. If Valid: Transmit Payload
    transmitSignal();
  }

  function transmitSignal() {
    // Disable submit button and show loading text
    if (btnSubmitFeedback) {
      btnSubmitFeedback.disabled = true;
      btnSubmitFeedback.textContent = '⚡ TRANSMITTING SIGNAL...';
    }

    // Prepare JSON payload
    var payload = {
      formType: hiddenFormType.value,
      selectedApp: hiddenSelectedApp.value,
      rating: ratingHidden.value,
      lovedFeatures: hiddenLovedFeatures.value,
      appImprovements: hiddenAppImprovements.value,
      newIdeasInterest: hiddenNewIdeasInterest.value,
      newIdeaSuggestions: hiddenNewIdeaSuggest.value,
      name: txtName.value.trim(),
      email: txtEmail.value.trim(),
      role: selectRole.value
    };

    // Global analytics tracking if firebase is active
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('feedback_submit', 'path_' + selectedPath, {
        name: payload.name,
        role: payload.role
      });
    }

    // Check if Google Apps Script URL exists
    if (!FEEDBACK_GAS_URL) {
      console.warn("FEEDBACK_GAS_URL is missing in js/config.js. Simulating offline transmission...");
      
      // Simulate network delay and route to success screen
      setTimeout(function () {
        goToStep(4);
      }, 1200);
      return;
    }

    // Execute standard post request to Google Sheets
    // Using no-cors mode guarantees bypass of Google's 302 redirect blocks.
    fetch(FEEDBACK_GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(function () {
      // Transition to comic success panel
      goToStep(4);
    })
    .catch(function (error) {
      console.error("Submission failed, executing fallback success transition.", error);
      goToStep(4);
    });
  }

})();
