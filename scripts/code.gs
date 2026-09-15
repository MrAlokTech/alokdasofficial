/**
 * Google Apps Script — Dynamic Multi-Question Anonymous Polling & Contact Backend
 * for https://alokdasofficial.in
 *
 * Capabilities:
 * - Dynamic Polls: Reads polls from "Polls" tab.
 * - Multi-Question Surveys: Reads 1 to N questions from "Questions" tab.
 * - Types: choice (single), multiple choice (multiselect), descriptive (text).
 * - Anonymous Security: Single-use tokens, zero identity tracking, formula sanitization.
 * - Dynamic Results: Aggregates percentages for choice questions & counts for text responses.
 * - Human-Readable Sheets: Populates "Responses" tab with JSON + individual q1, q2 columns.
 * - Contact Registry: Securely stores contact page form submissions in "Contacts" tab.
 */

function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action || "status";
    var pollId = String(params.poll_id || params.id || "").trim();

    if (action === "list_polls") {
      return jsonResponse(handleListPolls());
    }

    if (action === "poll") {
      return jsonResponse(handleGetPoll(pollId));
    }

    if (action === "token") {
      return jsonResponse(handleGetToken(pollId));
    }

    if (action === "results") {
      return jsonResponse(handleGetResults(pollId));
    }

    if (action === "contact_status") {
      return jsonResponse({
        ok: true,
        service: "Alok Das Contact Submission Registry",
        status: "active",
      });
    }

    return jsonResponse({
      ok: true,
      service: "Alok Das Dynamic Survey & Contact Service",
      status: "active",
      serverTime: new Date().toISOString(),
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Acquire lock for atomic token validation, vote recording, and contact recording
    lock.waitLock(10000);

    var rawData =
      e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var body = {};
    try {
      body = JSON.parse(rawData);
    } catch (parseErr) {
      body = {};
    }
    var params = e && e.parameter ? e.parameter : {};

    // Determine if this is a contact form submission
    var isContact =
      body.action === "contact" ||
      params.action === "contact" ||
      body.form_type === "contact" ||
      params.form_type === "contact" ||
      (!body.poll_id && !params.poll_id && (body.name || params.name || body.email || params.email));

    if (isContact) {
      return jsonResponse(handleContactSubmission(body, params));
    }

    return jsonResponse(handleVoteSubmission(body, params));
  } catch (err) {
    return jsonResponse({ ok: false, status: "error", error: err.toString() });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

// ================= CONTACT SUBMISSION HANDLER =================

function handleContactSubmission(body, params) {
  var name = String(body.name || (params && params.name) || "").trim();
  var email = String(body.email || (params && params.email) || "").trim();
  var subject = String(body.subject || (params && params.subject) || "").trim();
  var message = String(body.message || (params && params.message) || "").trim();

  if (!name || !email || !message) {
    return {
      ok: false,
      status: "invalid_request",
      message: "Missing required contact fields: name, email, and message are required.",
    };
  }

  // Basic email structure validation
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    return {
      ok: false,
      status: "invalid_email",
      message: "Please provide a valid email address.",
    };
  }

  // Ensure "Contacts" sheet exists with header row
  var contactSheet = getOrCreateSheet("Contacts", [
    "timestamp",
    "name",
    "email",
    "subject",
    "message",
    "contact_id",
  ]);

  var contactId = "contact_" + Utilities.getUuid().substring(0, 12);
  var timestamp = new Date().toISOString();

  // Sanitize all inputs against spreadsheet formula injection
  var safeName = sanitizeFormula(name);
  var safeEmail = sanitizeFormula(email);
  var safeSubject = sanitizeFormula(subject || "General Inquiry");
  var safeMessage = sanitizeFormula(message);

  contactSheet.appendRow([
    timestamp,
    safeName,
    safeEmail,
    safeSubject,
    safeMessage,
    contactId,
  ]);

  return {
    ok: true,
    status: "success",
    message: "Contact message recorded successfully.",
    contact_id: contactId,
  };
}

// ================= POLL VOTE SUBMISSION HANDLER =================

function handleVoteSubmission(body, params) {
  var pollId = String(body.poll_id || (params && params.poll_id) || "").trim();
  var voteToken = String(body.vote_token || (params && params.vote_token) || "").trim();
  var answers = body.answers || {};

  if (!pollId || !voteToken) {
    return {
      ok: false,
      status: "invalid_request",
      message: "Missing poll_id or vote_token",
    };
  }

  // 1. Verify poll exists and is open
  var poll = getPollFromSheet(pollId);
  if (!poll) {
    return { ok: false, status: "poll_not_found" };
  }

  var now = new Date();
  if (poll.startDate && now < poll.startDate) {
    return { ok: false, status: "not_started" };
  }
  if (poll.endDate && now > poll.endDate) {
    return { ok: false, status: "closed" };
  }

  // 2. Validate one-time token in Tokens tab
  var tokenSheet = getOrCreateSheet("Tokens", [
    "poll_id",
    "token",
    "used",
    "issued_at",
    "used_at",
  ]);
  var tokenData = tokenSheet.getDataRange().getValues();
  var tokenRowIndex = -1;

  for (var i = 1; i < tokenData.length; i++) {
    var rowPollId = String(tokenData[i][0]).trim();
    var rowToken = String(tokenData[i][1]).trim();
    var rowUsed = tokenData[i][2];

    if (rowPollId === pollId && rowToken === voteToken) {
      if (rowUsed === true || String(rowUsed).toUpperCase() === "TRUE") {
        return { ok: false, status: "already_voted" };
      }
      tokenRowIndex = i + 1;
      break;
    }
  }

  if (tokenRowIndex === -1) {
    return { ok: false, status: "invalid_token" };
  }

  // 3. Mark token as consumed
  tokenSheet.getRange(tokenRowIndex, 3).setValue(true);
  tokenSheet.getRange(tokenRowIndex, 5).setValue(new Date().toISOString());

  // 4. Save response to Responses tab
  var responsesSheet = getOrCreateSheet("Responses", [
    "timestamp",
    "poll_id",
    "token_hash",
    "responses_json",
    "q1",
    "q2",
    "q3",
    "q4",
    "q5",
  ]);

  var tokenHash = hashString(voteToken);
  var sanitizedAnswers = {};

  // Sanitize each answer against spreadsheet formula injection
  for (var k in answers) {
    var val = answers[k];
    if (Array.isArray(val)) {
      sanitizedAnswers[k] = val.map(function (item) {
        return sanitizeFormula(item);
      });
    } else {
      sanitizedAnswers[k] = sanitizeFormula(val);
    }
  }

  var q1Val = formatAnswerForCell(sanitizedAnswers.q1);
  var q2Val = formatAnswerForCell(sanitizedAnswers.q2);
  var q3Val = formatAnswerForCell(sanitizedAnswers.q3);
  var q4Val = formatAnswerForCell(sanitizedAnswers.q4);
  var q5Val = formatAnswerForCell(sanitizedAnswers.q5);

  responsesSheet.appendRow([
    new Date().toISOString(),
    pollId,
    tokenHash,
    JSON.stringify(sanitizedAnswers),
    q1Val,
    q2Val,
    q3Val,
    q4Val,
    q5Val,
  ]);

  // Invalidate poll results cache so live stats update immediately
  try {
    var cache = CacheService.getScriptCache();
    cache.remove("alok_results_" + pollId);
    cache.remove("alok_list_polls_cache");
  } catch (e) {}

  return { ok: true, status: "success" };
}

// ================= ACTION HANDLERS =================

function handleListPolls() {
  var cache = CacheService.getScriptCache();
  var cacheKey = "alok_list_polls_cache";
  var cached = cache.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pollSheet = ss.getSheetByName("Polls");
  if (!pollSheet) {
    var emptyResult = { ok: true, polls: [] };
    try { cache.put(cacheKey, JSON.stringify(emptyResult), 60); } catch (e) {}
    return emptyResult;
  }

  var pollRows = pollSheet.getDataRange().getValues();
  if (pollRows.length <= 1) {
    var emptyResult = { ok: true, polls: [] };
    try { cache.put(cacheKey, JSON.stringify(emptyResult), 60); } catch (e) {}
    return emptyResult;
  }

  var allQuestionsMap = getAllQuestionsGrouped(ss);
  var polls = [];

  for (var i = 1; i < pollRows.length; i++) {
    var pId = String(pollRows[i][0] || "").trim();
    if (!pId) continue;

    var title = String(pollRows[i][1] || pId).trim();
    var desc = String(pollRows[i][2] || "").trim();
    var startVal = pollRows[i][3];
    var endVal = pollRows[i][4];
    var category = String(pollRows[i][5] || "Community").trim();

    var startDate = parseDateFlexible(startVal);
    var endDate = parseDateFlexible(endVal);

    var questionsList = allQuestionsMap[pId] || [
      {
        id: "q1",
        qNo: 1,
        question: title,
        type: "choice",
        options: [
          { id: "yes", label: "YES" },
          { id: "no", label: "NO" },
        ],
        required: true,
      },
    ];

    polls.push({
      id: pId,
      slug: pId,
      title: title,
      description: desc,
      question: questionsList[0] ? questionsList[0].question : title,
      options: questionsList[0] ? questionsList[0].options : [],
      questions: questionsList,
      startTime: startDate ? startDate.toISOString() : null,
      endTime: endDate ? endDate.toISOString() : null,
      category: category,
    });
  }

  var finalResult = { ok: true, polls: polls };
  try {
    cache.put(cacheKey, JSON.stringify(finalResult), 180); // 3 minutes cache
  } catch (e) {}

  return finalResult;
}

function handleGetPoll(pollId) {
  if (!pollId) return { ok: false, error: "Missing poll_id" };
  var poll = getPollFromSheet(pollId);
  if (!poll) return { ok: false, error: "Poll not found" };

  return {
    ok: true,
    poll: {
      id: poll.id,
      slug: poll.id,
      title: poll.title,
      description: poll.description,
      question: poll.questions[0] ? poll.questions[0].question : poll.title,
      options: poll.questions[0] ? poll.questions[0].options : [],
      questions: poll.questions,
      startTime: poll.startDate ? poll.startDate.toISOString() : null,
      endTime: poll.endDate ? poll.endDate.toISOString() : null,
      category: poll.category,
    },
  };
}

function handleGetToken(pollId) {
  if (!pollId) return { ok: false, error: "Missing poll_id" };

  var poll = getPollFromSheet(pollId);
  if (!poll) return { ok: false, error: "Poll not found" };

  var now = new Date();
  if (poll.endDate && now > poll.endDate) {
    return { ok: false, error: "Poll closed" };
  }

  var tokenSheet = getOrCreateSheet("Tokens", [
    "poll_id",
    "token",
    "used",
    "issued_at",
    "used_at",
  ]);
  var token = Utilities.getUuid().replace(/-/g, "").substring(0, 16);

  tokenSheet.appendRow([pollId, token, false, new Date().toISOString(), ""]);

  return { ok: true, token: token };
}

function handleGetResults(pollId) {
  if (!pollId) return { ok: false, error: "Missing poll_id" };

  var cache = CacheService.getScriptCache();
  var cacheKey = "alok_results_" + pollId;
  var cached = cache.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }

  var poll = getPollFromSheet(pollId);
  var questions = poll ? poll.questions : [];

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responsesSheet = ss.getSheetByName("Responses");
  if (!responsesSheet) {
    responsesSheet = ss.getSheetByName("Votes");
  }

  var totalSubmissions = 0;
  var responsesList = [];

  if (responsesSheet) {
    var rows = responsesSheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      var rowPollId = String(rows[i][1] || "").trim();
      if (rowPollId === pollId) {
        totalSubmissions++;
        var jsonCol = rows[i][3];
        if (jsonCol) {
          try {
            var parsed = JSON.parse(jsonCol);
            responsesList.push(parsed);
          } catch (e) {
            // If legacy single vote row
            responsesList.push({ q1: String(jsonCol).trim() });
          }
        }
      }
    }
  }

  // Aggregate results per question
  var questionResults = questions.map(function (q) {
    var qKey = q.id || "q" + q.qNo;
    var counts = {};
    var descCount = 0;

    for (var r = 0; r < responsesList.length; r++) {
      var ans = responsesList[r][qKey];
      if (ans !== undefined && ans !== null && ans !== "") {
        if (q.type === "multiple_choice" && Array.isArray(ans)) {
          for (var a = 0; a < ans.length; a++) {
            var item = String(ans[a]).trim();
            if (item) counts[item] = (counts[item] || 0) + 1;
          }
        } else if (q.type === "descriptive") {
          descCount++;
        } else {
          var singleAns = String(ans).trim();
          if (singleAns) counts[singleAns] = (counts[singleAns] || 0) + 1;
        }
      }
    }

    if (q.type === "descriptive") {
      return {
        qNo: q.qNo,
        id: qKey,
        type: "descriptive",
        total: descCount,
        descriptiveCount: descCount,
      };
    }

    var optionsSummary = q.options.map(function (opt) {
      var voteCount = counts[opt.id] || 0;
      var pct =
        totalSubmissions > 0
          ? Math.round((voteCount / totalSubmissions) * 100)
          : 0;
      return {
        optionId: opt.id,
        label: opt.label,
        votes: voteCount,
        percentage: pct,
      };
    });

    return {
      qNo: q.qNo,
      id: qKey,
      type: q.type,
      total: totalSubmissions,
      options: optionsSummary,
    };
  });

  var primaryOptions =
    questionResults[0] && questionResults[0].options
      ? questionResults[0].options
      : [];

  var finalResults = {
    ok: true,
    pollId: pollId,
    total: totalSubmissions,
    options: primaryOptions,
    questions: questionResults,
  };

  try {
    cache.put(cacheKey, JSON.stringify(finalResults), 60); // 1 minute cache
  } catch (e) {}

  return finalResults;
}

// ================= HELPERS =================

function getPollFromSheet(pollId, ssParam) {
  var ss = ssParam || SpreadsheetApp.getActiveSpreadsheet();
  var pollSheet = ss.getSheetByName("Polls");
  if (!pollSheet) return null;

  var rows = pollSheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var id = String(rows[i][0] || "").trim();
    if (id.toLowerCase() === pollId.toLowerCase()) {
      var questionsMap = getAllQuestionsGrouped(ss);
      var qList = questionsMap[id] || [
        {
          id: "q1",
          qNo: 1,
          question: String(rows[i][1] || id),
          type: "choice",
          options: [
            { id: "yes", label: "YES" },
            { id: "no", label: "NO" },
          ],
          required: true,
        },
      ];

      return {
        id: id,
        title: String(rows[i][1] || id),
        description: String(rows[i][2] || ""),
        startDate: parseDateFlexible(rows[i][3]),
        endDate: parseDateFlexible(rows[i][4]),
        category: String(rows[i][5] || "Community"),
        questions: qList,
      };
    }
  }
  return null;
}

function getAllQuestionsGrouped(ssParam) {
  var ss = ssParam || SpreadsheetApp.getActiveSpreadsheet();
  var qSheet = ss.getSheetByName("Questions");
  var grouped = {};
  if (!qSheet) return grouped;

  var rows = qSheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var pId = String(rows[i][0] || "").trim();
    if (!pId) continue;

    var qNo = parseInt(rows[i][1], 10) || 1;
    var questionText = String(rows[i][2] || "").trim();
    var rawType = String(rows[i][3] || "choice")
      .toLowerCase()
      .trim();
    var rawOptions = String(rows[i][4] || "").trim();
    var requiredVal = rows[i][5];
    var isRequired =
      requiredVal === undefined || requiredVal === null || requiredVal === ""
        ? true
        : Boolean(requiredVal);
    var helpText = String(rows[i][6] || "").trim();

    var normalizedType = "choice";
    if (rawType.indexOf("mult") > -1 || rawType.indexOf("check") > -1) {
      normalizedType = "multiple_choice";
    } else if (rawType.indexOf("desc") > -1 || rawType.indexOf("text") > -1) {
      normalizedType = "descriptive";
    }

    var options = [];
    if (normalizedType !== "descriptive" && rawOptions) {
      var items = rawOptions.split(/[|,]/);
      for (var j = 0; j < items.length; j++) {
        var label = items[j].trim();
        if (label) {
          var optId = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          options.push({
            id: optId || "opt_" + (j + 1),
            label: label,
          });
        }
      }
    }

    if (normalizedType !== "descriptive" && options.length === 0) {
      options = [
        { id: "yes", label: "YES" },
        { id: "no", label: "NO" },
      ];
    }

    if (!grouped[pId]) {
      grouped[pId] = [];
    }

    grouped[pId].push({
      id: "q" + qNo,
      qNo: qNo,
      question: questionText || "Question " + qNo,
      type: normalizedType,
      options: options,
      required: isRequired,
      helpText: helpText,
    });
  }

  // Sort each poll's questions by qNo
  for (var k in grouped) {
    grouped[k].sort(function (a, b) {
      return a.qNo - b.qNo;
    });
  }

  return grouped;
}

function parseDateFlexible(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  var str = String(val).trim();
  if (!str) return null;

  var d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  var parts = str.match(
    /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
  );
  if (parts) {
    var p1 = parseInt(parts[1], 10);
    var p2 = parseInt(parts[2], 10);
    var year = parseInt(parts[3], 10);
    var hour = parts[4] ? parseInt(parts[4], 10) : 0;
    var min = parts[5] ? parseInt(parts[5], 10) : 0;
    var sec = parts[6] ? parseInt(parts[6], 10) : 0;

    var day = p1;
    var month = p2 - 1;
    if (p2 > 12 && p1 <= 12) {
      day = p2;
      month = p1 - 1;
    }
    var res = new Date(year, month, day, hour, min, sec);
    return isNaN(res.getTime()) ? null : res;
  }
  return null;
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

function sanitizeFormula(str) {
  if (!str) return "";
  var s = String(str);
  if (/^[=+\-@]/.test(s)) {
    return "'" + s;
  }
  return s;
}

function formatAnswerForCell(val) {
  if (val === undefined || val === null) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

function hashString(str) {
  var signature = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    str,
    Utilities.Charset.UTF_8,
  );
  var hash = "";
  for (var i = 0; i < signature.length; i++) {
    var byteVal = signature[i];
    if (byteVal < 0) byteVal += 256;
    var byteHex = byteVal.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hash += byteHex;
  }
  return hash;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
