/**
 * Google Apps Script — Anonymous Poll Backend for alokdasofficial.in
 * 
 * Target Stack: Google Apps Script bound to Google Sheet (SpreadsheetApp, ContentService, LockService, Utilities)
 * 
 * ============================================================================
 * SHEET SCHEMA SPECIFICATION (polls.md Section 3)
 * ============================================================================
 * 
 * 1. "Polls" Tab:
 *    Columns: poll_id | title | description | start_time | end_time
 *    (Status is auto-computed via getPollStatus, NEVER manually stored).
 * 
 * 2. "Questions" Tab:
 *    Columns: poll_id | q_no | question | type | options
 *    (The 'options' column uses '|' as the delimiter, e.g. "Yes|No|Maybe". Empty for descriptive).
 * 
 * 3. "Response_<poll_id>" Tabs:
 *    Columns: response_id | timestamp | vote_token | ans_q1 | ans_q2 | ...
 *    (Created dynamically per poll on first response if not already present).
 * 
 * 4. "Tokens" Tab:
 *    Columns: poll_id | token | used | issued_at | used_at
 *    (Zero personal identity fields stored: no name, email, IP, fingerprint, device ID).
 * 
 * ============================================================================
 * DEPLOYMENT INSTRUCTIONS (polls.md Section 39)
 * ============================================================================
 * 1. Create/open the Google Sheet "Alok Das Anonymous Polls".
 * 2. Ensure tabs "Polls", "Questions", and "Tokens" exist with the header rows defined above.
 * 3. Open Extensions > Apps Script and paste this code into Code.gs.
 * 4. Click "Deploy" > "New deployment".
 *    - Type: "Web app"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 5. Copy the Web App URL and configure it in your environment:
 *    NEXT_PUBLIC_POLLS_ENDPOINT="https://actual.url"
 */

// Fallback polls removed. Sheets data is the sole authority.
const FALLBACK_POLLS = {};

// ============================================================================
// SECTION 5: OPTIONS HELPERS
// ============================================================================

/**
 * Parses pipe-delimited option strings safely.
 * e.g. "Yes|No|Maybe" -> ["Yes", "No", "Maybe"]
 */
function splitOptions(str) {
  if (!str || typeof str !== "string") return [];
  return str
    .split("|")
    .map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 0; });
}

/**
 * Joins an array of options with the standard pipe delimiter.
 * e.g. ["Yes", "No", "Maybe"] -> "Yes|No|Maybe"
 */
function joinOptions(arr) {
  if (!Array.isArray(arr)) return "";
  return arr
    .map(function (s) { return typeof s === "string" ? s.trim() : ""; })
    .filter(function (s) { return s.length > 0; })
    .join("|");
}

// ============================================================================
// SECTION 6: AUTO-COMPUTED POLL STATUS
// ============================================================================

/**
 * Computes poll status dynamically based on server clock.
 * Exact cutoff semantic:
 * now < start_time -> "DRAFT"
 * now >= end_time  -> "CLOSED"
 * otherwise        -> "ACTIVE"
 */
function getPollStatus(poll) {
  const now = new Date();
  const startTime = new Date(poll.start_time);
  const endTime = new Date(poll.end_time);

  if (now < startTime) return "DRAFT";
  if (now >= endTime) return "CLOSED";

  return "ACTIVE";
}

// ============================================================================
// SECTION 4: REUSABLE POLL & QUESTION LOADERS (BATCH OPERATIONS)
// ============================================================================

/**
 * Loads a poll from the "Polls" sheet by ID using batch getValues().
 */
function getPollById(pollId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Polls");
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      // Skip header row: poll_id | title | description | start_time | end_time
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim() === pollId) {
          return {
            poll_id: data[i][0].toString().trim(),
            title: data[i][1] ? data[i][1].toString() : "",
            description: data[i][2] ? data[i][2].toString() : "",
            start_time: new Date(data[i][3]),
            end_time: new Date(data[i][4]),
          };
        }
      }
    }
  } catch (err) {
    // Sheet access error, will check fallback below
  }

  return FALLBACK_POLLS[pollId] || null;
}

/**
 * Loads and normalizes questions for a given poll using batch getValues().
 * Filters by poll_id, sorts by numeric q_no, and parses options with splitOptions().
 */
function getQuestionsForPoll(pollId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Questions");
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const list = [];
      // Skip header: poll_id | q_no | question | type | options
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim() === pollId) {
          list.push({
            pollId: data[i][0].toString().trim(),
            qNo: Number(data[i][1]) || 1,
            question: data[i][2] ? data[i][2].toString() : "",
            type: data[i][3] ? data[i][3].toString().trim() : "single_choice",
            options: splitOptions(data[i][4] ? data[i][4].toString() : ""),
          });
        }
      }

      if (list.length > 0) {
        list.sort(function (a, b) { return a.qNo - b.qNo; });
        return list;
      }
    }
  } catch (err) {
    // Sheet access error, fallback below
  }

  const fallback = FALLBACK_POLLS[pollId];
  return fallback && fallback.questions ? fallback.questions : [];
}

// ============================================================================
// SECTION 9, 10, 11: TOKEN GENERATION, VALIDATION & CONSUMPTION
// ============================================================================

/**
 * Generates an opaque, cryptographically random vote token for an ACTIVE poll.
 * Stores in "Tokens" sheet: poll_id | token | used | issued_at | used_at
 */
function generateVoteToken(pollId) {
  const poll = getPollById(pollId);
  if (!poll) {
    return { ok: false, status: "invalid_poll" };
  }

  const status = getPollStatus(poll);
  if (status !== "ACTIVE") {
    return { ok: false, status: status === "CLOSED" ? "closed" : "not_started" };
  }

  // Generate opaque random token using UUID
  const token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().substring(0, 8);
  const nowIso = new Date().toISOString();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let tokensSheet = ss.getSheetByName("Tokens");
  if (!tokensSheet) {
    tokensSheet = ss.insertSheet("Tokens");
    tokensSheet.appendRow(["poll_id", "token", "used", "issued_at", "used_at"]);
  }

  tokensSheet.appendRow([pollId, token, false, nowIso, ""]);

  return {
    ok: true,
    token: token,
    status: "active",
  };
}

/**
 * Validates whether a token exists, belongs to pollId, is unused, and poll is ACTIVE.
 * Returns { valid: boolean, reason?: string, rowIndex?: number }
 */
function validateVoteToken(pollId, token) {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "INVALID" };
  }

  const poll = getPollById(pollId);
  if (!poll) {
    return { valid: false, reason: "NOT_FOUND" };
  }

  if (getPollStatus(poll) !== "ACTIVE") {
    return { valid: false, reason: "POLL_NOT_ACTIVE" };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Tokens");
    if (!sheet) {
      return { valid: false, reason: "NOT_FOUND" };
    }

    const data = sheet.getDataRange().getValues();
    // Headers: poll_id | token | used | issued_at | used_at
    for (let i = 1; i < data.length; i++) {
      const rowPoll = data[i][0] ? data[i][0].toString().trim() : "";
      const rowToken = data[i][1] ? data[i][1].toString().trim() : "";
      const rowUsed = data[i][2] === true || data[i][2] === "true";

      if (rowPoll === pollId && rowToken === token) {
        if (rowUsed) {
          return { valid: false, reason: "USED" };
        }
        return { valid: true, rowIndex: i + 1 }; // 1-indexed row number
      }
    }
  } catch (err) {
    return { valid: false, reason: "SERVER_ERROR" };
  }

  return { valid: false, reason: "NOT_FOUND" };
}

/**
 * Marks a token as used in the "Tokens" sheet with server timestamp.
 */
function markTokenUsed(pollId, token, rowIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Tokens");
  if (!sheet) return false;

  const nowIso = new Date().toISOString();

  if (rowIndex && rowIndex > 1) {
    sheet.getRange(rowIndex, 3, 1, 3).setValues([[true, sheet.getRange(rowIndex, 4).getValue(), nowIso]]);
    return true;
  }

  // Fallback search if rowIndex not provided
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === pollId && data[i][1] === token) {
      sheet.getRange(i + 1, 3).setValue(true);
      sheet.getRange(i + 1, 5).setValue(nowIso);
      return true;
    }
  }
  return false;
}

// ============================================================================
// SECTION 12, 13, 14, 15: DOPOST SUBMISSION FLOW & ANSWER VALIDATION
// ============================================================================

/**
 * Handle incoming POST submissions.
 * Recommended sequence:
 * 1. Parse request.
 * 2. Validate payload.
 * 3. Load poll.
 * 4. Compute status.
 * 5. Require ACTIVE.
 * 6. Validate token.
 * 7. Load authoritative questions.
 * 8. Validate all answers.
 * 9. Acquire LockService lock.
 * 10. Re-check status/token.
 * 11. Write response row to Response_<poll_id>.
 * 12. Mark token used.
 * 13. Release lock.
 * 14. Return success.
 */
function doPost(e) {
  // 1. Parse Request
  let data = {};
  try {
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }
  } catch (err) {
    return jsonResponse({ ok: false, status: "server_error" });
  }

  const pollId = sanitizeResponseText(data.poll_id || data.pollId);
  const voteToken = (data.vote_token || data.token || "").toString().trim();
  const answers = data.answers || (data.optionId ? { q1: data.optionId } : {});

  // 2. Validate Payload
  if (!pollId || !voteToken || !answers || Object.keys(answers).length === 0) {
    return jsonResponse({ ok: false, status: "invalid_answer" });
  }

  // 3. Load Poll
  const poll = getPollById(pollId);
  if (!poll) {
    return jsonResponse({ ok: false, status: "closed" });
  }

  // 4 & 5. Compute Status & Require ACTIVE
  const status = getPollStatus(poll);
  if (status === "DRAFT") {
    return jsonResponse({ ok: false, status: "not_started" });
  }
  if (status === "CLOSED") {
    return jsonResponse({ ok: false, status: "closed" });
  }

  // 6. Validate Token Initial Check
  const tokenCheck = validateVoteToken(pollId, voteToken);
  if (!tokenCheck.valid) {
    if (tokenCheck.reason === "USED") {
      return jsonResponse({ ok: false, status: "token_used" });
    }
    if (tokenCheck.reason === "POLL_NOT_ACTIVE") {
      return jsonResponse({ ok: false, status: "closed" });
    }
    return jsonResponse({ ok: false, status: "invalid_token" });
  }

  // 7. Load Authoritative Questions
  const questions = getQuestionsForPoll(pollId);
  if (!questions || questions.length === 0) {
    return jsonResponse({ ok: false, status: "invalid_answer" });
  }

  // 8. Validate All Answers
  const answerEntries = [];
  for (let q = 0; q < questions.length; q++) {
    const qObj = questions[q];
    const key = "q" + qObj.qNo;
    const rawAnswer = answers[key] || answers[qObj.qNo];

    if (!rawAnswer) {
      return jsonResponse({ ok: false, status: "invalid_answer" });
    }

    if (qObj.type === "single_choice") {
      // Validate option belongs to question options
      if (qObj.options && qObj.options.length > 0 && !qObj.options.includes(rawAnswer)) {
        return jsonResponse({ ok: false, status: "invalid_answer" });
      }
      answerEntries.push(sanitizeResponseText(rawAnswer));
    } else if (qObj.type === "descriptive") {
      // Descriptive: check reasonable length (max 1000 chars)
      const clean = sanitizeResponseText(rawAnswer);
      if (clean.length > 1000) {
        return jsonResponse({ ok: false, status: "invalid_answer" });
      }
      answerEntries.push(clean);
    } else {
      answerEntries.push(sanitizeResponseText(rawAnswer));
    }
  }

  // 9. Acquire GAS LockService to prevent race conditions & duplicate token consumption
  const lock = LockService.getScriptLock();
  try {
    const hasLock = lock.tryLock(10000); // Wait up to 10 seconds
    if (!hasLock) {
      return jsonResponse({ ok: false, status: "server_error" });
    }

    // 10. Re-check authoritative status & token inside lock
    if (getPollStatus(poll) !== "ACTIVE") {
      return jsonResponse({ ok: false, status: "closed" });
    }

    const recheck = validateVoteToken(pollId, voteToken);
    if (!recheck.valid) {
      if (recheck.reason === "USED") {
        return jsonResponse({ ok: false, status: "token_used" });
      }
      return jsonResponse({ ok: false, status: "invalid_token" });
    }

    // 11. Write Response Row to Response_<poll_id>
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "Response_" + pollId;
    let responseSheet = ss.getSheetByName(sheetName);
    if (!responseSheet) {
      responseSheet = ss.insertSheet(sheetName);
      // Header: response_id | timestamp | vote_token | ans_q1 | ans_q2 | ...
      const header = ["response_id", "timestamp", "vote_token"];
      for (let h = 0; h < questions.length; h++) {
        header.push("ans_q" + questions[h].qNo);
      }
      responseSheet.appendRow(header);
    }

    const responseId = "resp_" + Utilities.getUuid().substring(0, 12);
    const nowIso = new Date().toISOString();
    const rowToWrite = [responseId, nowIso, voteToken].concat(answerEntries);

    responseSheet.appendRow(rowToWrite);

    // 12. Mark Token as Used (only AFTER confirmed write)
    markTokenUsed(pollId, voteToken, recheck.rowIndex);

    // 13. Release Lock
    lock.releaseLock();

    // 14. Return Success
    return jsonResponse({
      ok: true,
      status: "recorded",
    });
  } catch (err) {
    try {
      lock.releaseLock();
    } catch (ignored) { }
    return jsonResponse({ ok: false, status: "server_error" });
  }
}

// ============================================================================
// SECTION 21 & 22: DOGET REQUEST HANDLING & AGGREGATE RESULTS RETRIEVAL
// ============================================================================

/**
 * Handle GET requests:
 * - action=token: Issue opaque vote token for an ACTIVE poll
 * - action=results: Return privacy-preserving aggregate results
 * - default: Service status & timestamp
 */
function doGet(e) {
  const action = e.parameter ? e.parameter.action : "";
  const pollId = e.parameter ? sanitizeResponseText(e.parameter.poll_id || e.parameter.pollId) : "";

  // 1. Issue Anonymous Vote Token
  if (action === "token" && pollId) {
    const tokenResult = generateVoteToken(pollId);
    return jsonResponse(tokenResult);
  }

  // 2. Aggregate Results Query
  if (action === "results" && pollId) {
    const results = getPollResults(pollId);
    return jsonResponse(results);
  }

  // Default Health & Server Time
  return jsonResponse({
    ok: true,
    service: "Alok Das Anonymous Poll Service",
    status: "active",
    serverTime: new Date().toISOString(),
  });
}

/**
 * Calculate aggregate results from Response_<poll_id> sheet without exposing individual rows.
 * Format adheres strictly to Section 21 of polls.md.
 */
function getPollResults(pollId) {
  let total = 0;
  const countMap = {};

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Response_" + pollId);
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      // Headers: response_id | timestamp | vote_token | ans_q1 | ...
      // Assume ans_q1 is at column index 3 (0-indexed)
      for (let i = 1; i < data.length; i++) {
        const optionId = data[i][3] ? data[i][3].toString().trim() : "";
        if (optionId) {
          total++;
          countMap[optionId] = (countMap[optionId] || 0) + 1;
        }
      }
    }
  } catch (err) {
    // Sheet read failure
  }

  // Map to options array
  const options = [];
  const keys = Object.keys(countMap);
  for (let k = 0; k < keys.length; k++) {
    const optId = keys[k];
    const votes = countMap[optId];
    const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;
    options.push({
      optionId: optId,
      votes: votes,
      percentage: percentage,
    });
  }

  return {
    ok: true,
    pollId: pollId,
    total: total,
    options: options,
  };
}

// ============================================================================
// SECTION 15: FORMULA INJECTION SANITIZATION
// ============================================================================

/**
 * Sanitizes user input to protect Google Sheets from formula injection.
 * Treats values beginning with =, +, -, @ as plain text by prepending an apostrophe.
 */
function sanitizeResponseText(value) {
  if (typeof value !== "string") return value || "";
  const clean = value.trim();
  if (/^[=+\-@]/.test(clean)) {
    return "'" + clean;
  }
  return clean;
}

// ============================================================================
// SECTION 28: STRUCTURED JSON RESPONSE WITH CORS HEADERS
// ============================================================================

/**
 * Creates ContentService JSON response.
 */
function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

