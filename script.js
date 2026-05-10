const STORAGE_KEY = "personal-website-content";
const chatboxMessages = document.querySelector("#chatbox-messages");
const chatboxForm = document.querySelector("#chatbox-form");
const chatboxInput = document.querySelector("#chatbox-input");
let lastChatContext = null;
let analyticsInjected = false;
let placeholderRotationId = null;
let pageViewPollId = null;
let geoChartLoaderPromise = null;
let geoChartReadyPromise = null;

const getSiteContent = () => {
  const defaults = window.defaultSiteContent || {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return defaults;
    }

    const parsed = JSON.parse(saved);
    return {
      ...defaults,
      ...parsed,
      profile: {
        ...(defaults.profile || {}),
        ...(parsed.profile || {})
      },
      chatbox: {
        ...(defaults.chatbox || {}),
        ...(parsed.chatbox || {})
      },
      cv: {
        ...(defaults.cv || {}),
        ...(parsed.cv || {})
      },
      footer: {
        ...(defaults.footer || {}),
        ...(parsed.footer || {})
      },
      analytics: {
        ...(defaults.analytics || {}),
        ...(parsed.analytics || {})
      }
    };
  } catch {
    return defaults;
  }
};

const loadGoogleGeoChart = () => {
  if (window.google?.charts?.load) {
    return Promise.resolve(window.google);
  }

  if (geoChartLoaderPromise) {
    return geoChartLoaderPromise;
  }

  geoChartLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-geochart-loader="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;
    script.dataset.geochartLoader = "true";
    script.addEventListener("load", () => resolve(window.google), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load Google Charts")), { once: true });
    document.head.appendChild(script);
  });

  return geoChartLoaderPromise;
};

const ensureGoogleGeoChartReady = () => {
  if (geoChartReadyPromise) {
    return geoChartReadyPromise;
  }

  geoChartReadyPromise = loadGoogleGeoChart().then((google) => new Promise((resolve, reject) => {
    if (!google?.charts?.load) {
      reject(new Error("Google Charts loader is unavailable"));
      return;
    }

    google.charts.load("current", {
      packages: ["geochart"]
    });

    google.charts.setOnLoadCallback(() => resolve(google));
    window.setTimeout(() => reject(new Error("GeoChart load timed out")), 8000);
  }));

  return geoChartReadyPromise;
};

const renderVisitorMap = (content) => {
  const section = document.querySelector("#visitor-map-section");
  const title = document.querySelector("#visitor-map-title");
  const note = document.querySelector("#visitor-map-note");
  const canvas = document.querySelector("#visitor-map-canvas");
  const status = document.querySelector("#visitor-map-status");
  const visitorMap = content.visitorMap || {};

  if (!section || !title || !note || !canvas || !status) {
    return;
  }

  if (!visitorMap.enabled) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  title.textContent = visitorMap.title || "Visitor Map";
  note.textContent = visitorMap.note || "A world map of where visitors come from.";
  status.textContent = "Loading map...";
  canvas.innerHTML = "";

  fetch(visitorMap.dataUrl || "visitor-map.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load visitor map data");
      }

      return response.json();
    })
    .then((payload) => {
      const rows = Array.isArray(payload?.locations) ? payload.locations : [];
      if (!rows.length) {
        status.textContent = payload?.message || "No visitor location data yet.";
        canvas.innerHTML = "";
        return null;
      }

      return ensureGoogleGeoChartReady().then((google) => ({ google, rows, payload }));
    })
    .then((result) => {
      if (!result) {
        return;
      }

      const { google, rows, payload } = result;
      try {
        const data = google.visualization.arrayToDataTable([
          ["Country", "Visitors"],
          ...rows.map((row) => [row.country, Number(row.count) || 0])
        ]);

        const chart = new google.visualization.GeoChart(canvas);
        if (google.visualization?.events) {
          google.visualization.events.addListener(chart, "error", (event) => {
            canvas.innerHTML = "";
            status.textContent = event?.message || "Map failed to render.";
          });
        }

        chart.draw(data, {
          backgroundColor: "transparent",
          datalessRegionColor: "#18213f",
          defaultColor: "#35508f",
          resolution: "countries",
          colorAxis: {
            colors: ["#7fa6ff", "#56b6ff", "#1f6bff"]
          },
          legend: {
            textStyle: {
              color: "#a8b3cf"
            }
          }
        });

        status.textContent = payload?.updatedAt
          ? `Updated ${payload.updatedAt}`
          : "Map updated.";
      } catch (error) {
        canvas.innerHTML = "";
        status.textContent = error?.message || "Map failed to render.";
      }
    })
    .catch((error) => {
      canvas.innerHTML = "";
      status.textContent = error?.message || "Map data is not ready yet.";
    });
};

const renderSiteContent = () => {
  const content = getSiteContent();

  document.title = content.pageTitle || document.title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && content.metaDescription) {
    metaDescription.setAttribute("content", content.metaDescription);
  }

  const profile = content.profile || {};
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && typeof value === "string") {
      element.textContent = value;
    }
  };

  setText("#profile-name", profile.name);
  setText("#profile-role", profile.role);
  setText("#profile-affiliation", profile.affiliation);
  setText("#profile-email-note", profile.emailNote);

  const githubLink = document.querySelector("#profile-github-link");
  if (githubLink && profile.links?.github) {
    githubLink.href = profile.links.github;
  }

  const linkedinLink = document.querySelector("#profile-linkedin-link");
  if (linkedinLink && profile.links?.linkedin) {
    linkedinLink.href = profile.links.linkedin;
  }

  const aboutContent = document.querySelector("#about-content");
  if (aboutContent && Array.isArray(content.about)) {
    aboutContent.innerHTML = content.about.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  setText("#publications-note", content.publicationsNote);

  const publicationsList = document.querySelector("#publications-list");
  if (publicationsList && Array.isArray(content.publications)) {
    publicationsList.innerHTML = content.publications
      .map((item) => `<article class="list-item"><p>${item}</p></article>`)
      .join("");
  }

  setText("#collaborations-heading", content.collaborationsHeading);

  const collaborationsNote = document.querySelector("#collaborations-note");
  if (collaborationsNote && content.collaborationsNote) {
    collaborationsNote.innerHTML = `<strong>${content.collaborationsNote}</strong>`;
  }

  const collaborationsList = document.querySelector("#collaborations-list");
  if (collaborationsList && Array.isArray(content.collaborations)) {
    collaborationsList.innerHTML = content.collaborations
      .map((item) => item.html.replace(/^Collaborating with\s*/i, ""))
      .join(" ");
  }

  const cvLink = document.querySelector("#cv-link");
  if (cvLink && content.cv) {
    cvLink.textContent = content.cv.label || "View CV";
    cvLink.href = content.cv.url || "#";
  }

  const cvStatus = document.querySelector("#cv-status");
  if (cvStatus) {
    cvStatus.textContent = content.cv?.status || "";
  }

  const footerPrefix = document.querySelector("#footer-prefix");
  const footerLink = document.querySelector("#footer-link");
  if (footerPrefix && content.footer?.text) {
    footerPrefix.textContent = content.footer.text;
  }
  if (footerLink && content.footer?.linkLabel) {
    footerLink.textContent = content.footer.linkLabel;
  }
  if (footerLink && content.footer?.linkUrl) {
    footerLink.href = content.footer.linkUrl;
  }

  const analyticsFooter = document.querySelector("#footer-analytics");
  const analyticsLink = document.querySelector("#analytics-link");
  const analyticsCounter = document.querySelector("#footer-counter");
  const analyticsCounterLabel = document.querySelector("#counter-label");
  const analyticsCounterValue = document.querySelector("#pageview-counter");
  const analytics = content.analytics || {};

  const renderGoatCounterValue = (site) => {
    if (!analyticsCounterValue) {
      return;
    }

    const path = encodeURIComponent("TOTAL");
    fetch(`https://${site}.goatcounter.com/counter/${path}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch page views");
        }

        return response.json();
      })
      .then((data) => {
        analyticsCounterValue.textContent = data.count || "--";
      })
      .catch(() => {
        analyticsCounterValue.textContent = "--";
      });
  };

  if (analyticsFooter && analyticsLink && analyticsCounter && analyticsCounterLabel) {
    if (analytics.enabled && analytics.provider === "goatcounter" && analytics.site) {
      analyticsFooter.hidden = false;
      analyticsCounter.hidden = false;
      analyticsLink.textContent = analytics.label || "Visitors";
      analyticsLink.href = analytics.dashboardUrl || `https://${analytics.site}.goatcounter.com`;
      analyticsCounterLabel.textContent = analytics.counterLabel || "Page Views";

      if (!analyticsInjected) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "//gc.zgo.at/count.js";
        script.dataset.goatcounter = `https://${analytics.site}.goatcounter.com/count`;
        document.body.appendChild(script);
        analyticsInjected = true;
      }

      renderGoatCounterValue(analytics.site);
      if (pageViewPollId) {
        clearInterval(pageViewPollId);
      }
      pageViewPollId = window.setInterval(() => {
        renderGoatCounterValue(analytics.site);
      }, 30000);
    } else {
      analyticsFooter.hidden = true;
      analyticsCounter.hidden = false;
      analyticsCounterLabel.textContent = analytics.counterLabel || "Page Views";
      if (analyticsCounterValue) {
        analyticsCounterValue.textContent = "Not enabled yet";
      }
      if (pageViewPollId) {
        clearInterval(pageViewPollId);
        pageViewPollId = null;
      }
    }
  }

  const appendChatMessage = (role, message) => {
    if (!chatboxMessages) {
      return;
    }

    const wrapper = document.createElement("article");
    wrapper.className = `chatbox-message ${role}`;
    wrapper.innerHTML = `
      <span class="chatbox-label">${role === "user" ? "You" : "Site Assistant"}</span>
      <p>${message}</p>
    `;
    chatboxMessages.appendChild(wrapper);
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
  };

  const resetChatMessages = () => {
    if (chatboxMessages) {
      chatboxMessages.innerHTML = "";
    }
  };

  const buildChatResponse = (question) => {
    const normalized = question.trim().toLowerCase();
    const knowledgeBase = Array.isArray(content.knowledgeBase) ? content.knowledgeBase : [];
    const stopwords = new Set([
      "the", "a", "an", "is", "are", "was", "were", "do", "does", "did", "have", "has",
      "can", "could", "would", "you", "your", "what", "which", "who", "where", "when",
      "how", "about", "with", "in", "on", "for", "to", "of", "and", "or", "me", "tell",
      "say", "use", "using", "work", "worked", "working", "experience", "any", "main"
    ]);
    const phraseRewrites = [
      ["machine learning", "ml"],
      ["deep transfer learning", "transfer learning"],
      ["artificial intelligence", "ai"],
      ["non probability", "nonprobability"],
      ["joint program in survey methodology", "jpsm"],
      ["alzheimer disease", "alzheimers"]
    ];
    const normalizeText = (text) => {
      let value = text.toLowerCase();
      phraseRewrites.forEach(([from, to]) => {
        value = value.replaceAll(from, to);
      });
      return value;
    };
    const normalizedQuestion = normalizeText(normalized);
    const normalizedTokens = normalizedQuestion
      .split(/[^a-z0-9.+#-]+/)
      .filter(Boolean)
      .filter((token) => !stopwords.has(token));
    const yesNoQuestion = /^(do|does|did|have|has|are|is|can|could|would)\b/.test(normalized);
    const currentYear = new Date().getFullYear();
    const birthYear = Number(content.profile?.birthYear);
    const followUpQuestion = /^(what about|and|also|how about|what else|anything else)\b/.test(normalizedQuestion);
    const referenceFollowUp = /\b(it|that|this|them|those|these|same topic|same area)\b/.test(normalizedQuestion);

    if ((normalizedQuestion.includes("how old") || normalizedTokens.includes("age")) && Number.isFinite(birthYear)) {
      const age = currentYear - birthYear;
      return `Kangrui is ${age} years old, based on a birth year of ${birthYear}.`;
    }

    const categoryHints = [
      { category: "research", phrases: ["research interest", "research interests", "main research", "research focus", "what do you work on"] },
      { category: "background", phrases: ["who are you", "what is your background", "current position", "what do you do"] },
      { category: "collaboration", phrases: ["collaborator", "collaborators", "collaboration", "work with", "who do you work with"] },
      { category: "publication", phrases: ["publication", "publications", "paper", "papers", "journal"] },
      { category: "tools", phrases: ["tool", "tools", "skill", "skills", "software", "programming", "use r", "use python"] },
      { category: "dementia", phrases: ["dementia", "alzheimer", "alzheimers"] },
      { category: "allostatic-load", phrases: ["allostatic load"] },
      { category: "research-motivation", phrases: ["why", "motivation", "interested in", "why research"] },
      { category: "iowa-state-fit", phrases: ["iowa state", "phd", "fit", "why iowa state"] }
    ];

    const scoreKnowledgeBase = (query) =>
      knowledgeBase
        .map((item) => {
          const haystack = normalizeText(`${item.category || ""} ${item.title} ${item.answer} ${(item.keywords || []).join(" ")}`);
          const queryTokens = normalizeText(query)
            .split(/[^a-z0-9.+#-]+/)
            .filter(Boolean)
            .filter((token) => !stopwords.has(token));
          let score = 0;

          if (haystack.includes(query)) {
            score += 10;
          }

          queryTokens.forEach((token) => {
            if (token.length < 2) {
              return;
            }

            if (haystack.includes(token)) {
              score += token.length > 4 ? 4 : 2;
            }
          });

          categoryHints.forEach((hint) => {
            if ((item.category || "") === hint.category && hint.phrases.some((phrase) => normalizedQuestion.includes(phrase))) {
              score += 8;
            }
          });

          if (followUpQuestion && lastChatContext?.category && lastChatContext.category === item.category) {
            score += 6;
          }

          if (followUpQuestion && Array.isArray(lastChatContext?.tokens)) {
            lastChatContext.tokens.forEach((token) => {
              if (haystack.includes(token)) {
                score += 2;
              }
            });
          }

          return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

    const extractTopicFromQuestion = () => {
      const patterns = [
        /(?:use|used|using)\s+(.+?)(?:\?|$)/,
        /(?:experience in|experience with)\s+(.+?)(?:\?|$)/,
        /(?:work on|worked on|working on)\s+(.+?)(?:\?|$)/,
        /(?:familiar with|know about)\s+(.+?)(?:\?|$)/,
        /(?:do you know)\s+(.+?)(?:\?|$)/,
        /(?:what are your main)\s+(.+?)(?:\?|$)/,
        /(?:tell me about)\s+(.+?)(?:\?|$)/
      ];

      for (const pattern of patterns) {
        const match = normalizedQuestion.match(pattern);
        if (match?.[1]) {
          return match[1].trim();
        }
      }

      return "";
    };

    const extractedTopic = extractTopicFromQuestion();
    const topicMatches = extractedTopic ? scoreKnowledgeBase(extractedTopic) : [];
    const scored = scoreKnowledgeBase(normalizedQuestion);
    const contextMatches =
      lastChatContext?.category
        ? knowledgeBase
            .filter((item) => item.category === lastChatContext.category)
            .map((item) => ({ ...item, score: 1 }))
        : [];

    const setContext = (item) => {
      if (!item) {
        return;
      }

      lastChatContext = {
        category: item.category || "",
        tokens: normalizedTokens
      };
    };

    const formatAnswer = (items, options = {}) => {
      const topItems = items.filter(Boolean);
      if (!topItems.length) {
        return content.chatbox?.fallback || "I could not find a strong match in the current website data.";
      }

      if (options.yesNo === "yes") {
        return `Yes. ${topItems.map((item) => item.answer).join(" ")}`;
      }

      if (options.yesNo === "no") {
        return options.fallback || "No. I do not currently list that experience in the public website knowledge base.";
      }

      if (/^(who)\b/.test(normalizedQuestion)) {
        return topItems[0].answer;
      }

      if (/^(what|tell me|describe|summarize)\b/.test(normalizedQuestion)) {
        return topItems.map((item) => item.answer).join(" ");
      }

      if (topItems.length === 1) {
        return topItems[0].answer;
      }

      return `${topItems[0].answer} ${topItems[1].answer}`;
    };

    if ((followUpQuestion || referenceFollowUp) && !extractedTopic && contextMatches.length) {
      const contextualAnswer = contextMatches.map((item) => item.answer).join(" ");
      return contextualAnswer;
    }

    if (yesNoQuestion && extractedTopic) {
      if (topicMatches.length && topicMatches[0].score >= 3) {
        setContext(topicMatches[0]);
        return formatAnswer([topicMatches[0]], { yesNo: "yes" });
      }

      return formatAnswer([], {
        yesNo: "no",
        fallback: `No. I do not currently list direct experience with ${extractedTopic} in the public website knowledge base.`
      });
    }

    if (scored.length && scored[0].score >= 6) {
      const topMatches = scored.slice(0, 2);
      setContext(topMatches[0]);
      return formatAnswer(topMatches);
    }

    if ((followUpQuestion || referenceFollowUp) && contextMatches.length) {
      setContext(contextMatches[0]);
      return formatAnswer(contextMatches.slice(0, 2));
    }

    if (!scored.length) {
      lastChatContext = null;
      return content.chatbox?.fallback || "I could not find a strong match in the current website data.";
    }

    setContext(scored[0]);
    return formatAnswer([scored[0]]);
  };

  if (chatboxMessages && chatboxMessages.childElementCount === 0) {
    appendChatMessage("assistant", content.chatbox?.intro || "Ask me about my experience.");
  }

  const chatboxTitle = document.querySelector("#chatbox-title");
  if (chatboxTitle && content.chatbox?.title) {
    chatboxTitle.textContent = content.chatbox.title;
  }

  const chatboxIntro = document.querySelector("#chatbox-intro");
  if (chatboxIntro && content.chatbox?.intro) {
    chatboxIntro.textContent = content.chatbox.intro;
  }

  if (chatboxInput) {
    const suggestedQuestions = Array.isArray(content.chatbox?.suggestedQuestions)
      ? content.chatbox.suggestedQuestions
      : [];
    const placeholderQuestions = suggestedQuestions.length
      ? suggestedQuestions
      : [content.chatbox?.placeholder || "Ask me about my experience."];
    let placeholderIndex = 0;

    const setPlaceholder = () => {
      const question = placeholderQuestions[placeholderIndex] || content.chatbox?.placeholder || "Ask me about my experience.";
      chatboxInput.placeholder = question;
      chatboxInput.dataset.currentPlaceholderQuestion = question;
      placeholderIndex = (placeholderIndex + 1) % placeholderQuestions.length;
    };

    setPlaceholder();

    if (placeholderRotationId) {
      clearInterval(placeholderRotationId);
    }

    if (placeholderQuestions.length > 1) {
      placeholderRotationId = window.setInterval(() => {
        if (document.activeElement !== chatboxInput && !chatboxInput.value.trim()) {
          setPlaceholder();
        }
      }, 3500);
    }
  }

  if (chatboxForm && !chatboxForm.dataset.bound) {
    chatboxForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = chatboxInput?.value.trim() || chatboxInput?.dataset.currentPlaceholderQuestion || "";

      if (!question) {
        return;
      }

      resetChatMessages();
      appendChatMessage("user", question);
      appendChatMessage("assistant", buildChatResponse(question));
      chatboxInput.value = "";
    });

    chatboxForm.dataset.bound = "true";
  }

  renderVisitorMap(content);
};

renderSiteContent();
