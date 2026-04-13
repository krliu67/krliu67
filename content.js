// Update guide:
// 1. Edit the values below directly when you want to update your website.
// 2. For the chatbox, add new entries to `knowledgeBase`.
// 3. For the keyword search box, add new entries to `searchableExperience`.
// 4. For visible sections on the page, update `about`, `publications`, `collaborations`, and `cv`.
//
// Template: knowledgeBase item
// {
//   category: "short-topic-name",
//   title: "Displayed title",
//   answer: "A natural-language answer the chatbox can say directly.",
//   keywords: ["keyword 1", "keyword 2", "keyword 3"]
// }
//
// Template: searchableExperience item
// {
//   title: "Displayed result title",
//   summary: "One or two sentences describing the experience.",
//   keywords: ["keyword 1", "keyword 2", "keyword 3"]
// }

window.defaultSiteContent = {
  metaDescription: "Kangrui Liu's personal website.",
  pageTitle: "Kangrui Liu | RA@EPIB UMD",
  profile: {
    name: "Kangrui Liu",
    role: "Research Assistant@EPIB, M.S.@JPSM",
    affiliation: "University of Maryland, College Park",
    emailNote: "Email: A [at] B, where A = krliu67 and B = umd.edu",
    birthYear: 2001,
    links: {
      github: "https://github.com/krliu67",
      linkedin: "https://www.linkedin.com/in/kangrui-liu/"
    }
  },
  about: [
    "I am currently a Research Assistant working with Dr. Tianzhou Ma and Dr. Yan Li in the Department of Epidemiology and Biostatistics at the University of Maryland. I received my M.S. from the Joint Program in Survey Methodology at the University of Maryland.",
    "I am particularly interested in developing statistical methods that can draw credible conclusions from complex health data and apply them in real-world scenarios.",
    "I’m always happy to collaborate. If you’re interested in working together, feel free to reach out to me via email."
  ],
  chatbox: {
    title: "Ask About My Experience",
    intro:
      "Ask me about my research, collaborations, publications, training, or technical skills.",
    placeholder: "Try: Do you have experience in causal inference?",
    suggestedQuestions: [
      "What are your main research interests?",
      "Do you have experience in causal inference?",
      "Who do you collaborate with?",
      "What publications do you have?",
      "What technical tools do you use?"
    ],
    fallback:
      "I could not find a strong match in the current website data. Try asking about research interests, collaborations, publications, training, or tools."
  },
  publicationsNote: "* indicates co-authors.",
  publications: [
    "<strong>Kangrui Liu*</strong>, Lingxiao Wang*, Yan Li. “Gradient-Boosted Pseudo-Weighting: Methods for Population Inference from Nonprobability Samples.” <em>Submitted to Journal of Survey Statistics and Methodology</em>.",
    "Menglu Liang*, Z. Ye*, G. Velma*, <strong>Kangrui Liu</strong>, ..., Tianzhou Ma. “Population-Specific Risk Prediction for Alzheimer's Disease and Related Dementia in Racial and Ethnic Minority Groups Using Deep Transfer Learning.” <em>Submitted to The Lancet Public Health</em>.",
    "Paula D. Strassle, <strong>Kangrui Liu</strong>, ..., Edmond D. Shenassa. “Capturing Allostatic Load in the National Institutes of Health All of Us Research Program: Definitions and Recommendation.” <em>Submitted to Psychoneuroendocrinology</em>."
  ],
  searchableExperience: [
    {
      title: "Research Assistant with Yan Li and Lingxiao Wang",
      summary: "Worked on survey sampling, nonprobability samples, weighting, and population inference.",
      keywords: ["survey sampling", "nonprobability samples", "weighting", "population inference", "yan li", "lingxiao wang", "jpsm"]
    },
    {
      title: "Research Assistant with Tianzhou Ma",
      summary: "Worked on allostatic load, health data integration, mortality, and population health research.",
      keywords: ["allostatic load", "health data integration", "mortality", "population health", "tianzhou ma", "epib"]
    },
    {
      title: "Dementia Risk Prediction Project",
      summary: "Worked on dementia prediction, transfer learning, and AI-related health research with collaborators in Ma Lab.",
      keywords: ["dementia", "transfer learning", "ai", "ma lab", "menglu liang", "paula strassle"]
    },
    {
      title: "Graduate Training at JPSM",
      summary: "Completed M.S. training in survey methodology, causal inference, and statistical methods for population inference.",
      keywords: ["jpsm", "survey methodology", "causal inference", "statistics", "university of maryland"]
    }
  ],
  knowledgeBase: [
    {
      category: "research",
      title: "Research Interests",
      answer:
        "Kangrui Liu's research focuses on survey sampling, nonprobability samples, health data integration, causal inference, and statistical methods for population inference.",
      keywords: [
        "research",
        "interest",
        "focus",
        "survey sampling",
        "nonprobability samples",
        "health data integration",
        "causal inference",
        "population inference"
      ]
    },
    {
      category: "background",
      title: "Current Position",
      answer:
        "Kangrui is currently a Research Assistant in the Department of Epidemiology and Biostatistics at the University of Maryland, working with Dr. Tianzhou Ma and Dr. Yan Li.",
      keywords: [
        "current",
        "position",
        "background",
        "research assistant",
        "epib",
        "university of maryland",
        "tianzhou ma",
        "yan li"
      ]
    },
    {
      category: "personal",
      title: "Age",
      answer:
        "Kangrui was born in 2001.",
      keywords: ["age", "old", "how old", "birth year", "born", "birthday"]
    },
    {
      category: "collaboration",
      title: "Collaborators",
      answer:
        "Kangrui collaborates with Dr. Yan Li, Dr. Lingxiao Wang, Dr. Tianzhou Ma, Dr. Edmond D. Shenassa, Dr. Menglu Liang, and Dr. Paula Strassle across survey methodology, population health, and dementia-related research.",
      keywords: [
        "collaborator",
        "collaboration",
        "work with",
        "yan li",
        "lingxiao wang",
        "tianzhou ma",
        "edmond d. shenassa",
        "menglu liang",
        "paula strassle"
      ]
    },
    {
      category: "publication",
      title: "Publications",
      answer:
        "Kangrui currently lists submitted work in Journal of Survey Statistics and Methodology, The Lancet Public Health, and Psychoneuroendocrinology, with topics including nonprobability samples, dementia risk prediction, and allostatic load.",
      keywords: [
        "publication",
        "paper",
        "journal",
        "submitted",
        "lancet",
        "psychoneuroendocrinology",
        "jssam",
        "publication list"
      ]
    },
    {
      category: "tools",
      title: "Technical Tools",
      answer:
        "Kangrui's technical toolkit includes R, Python, survey methods, machine learning workflows, health data integration, and statistical modeling.",
      keywords: [
        "tool",
        "skill",
        "technical",
        "r",
        "python",
        "machine learning",
        "statistical modeling",
        "software"
      ]
    },
    {
      category: "dementia",
      title: "Dementia Research",
      answer:
        "Kangrui has experience in dementia-related research through work on population-specific risk prediction for Alzheimer's disease and related dementia using deep transfer learning and related work in Ma Lab.",
      keywords: [
        "dementia",
        "alzheimers",
        "alzheimer's",
        "adrd",
        "deep transfer learning",
        "ma lab"
      ]
    },
    {
      category: "allostatic-load",
      title: "Allostatic Load",
      answer:
        "Kangrui works on allostatic load research involving health data integration, mortality, population health, and cross-cohort analysis with collaborators in epidemiology and biostatistics.",
      keywords: [
        "allostatic load",
        "mortality",
        "population health",
        "health data",
        "cross-cohort",
        "biostatistics"
      ]
    },
    {
      category: "academic-background",
      title: "Academic Background",
      answer:
        "Kangrui's academic path began in computing science, where he built a foundation in probability, linear models, and computing. He later pursued an M.S. in Survey and Data Science, receiving rigorous training in survey statistics, complex survey designs, and machine learning.",
      keywords: [
        "background",
        "academic path",
        "computing science",
        "probability",
        "linear models",
        "survey and data science",
        "survey statistics",
        "machine learning"
      ]
    },
    {
      category: "research-motivation",
      title: "Research Motivation",
      answer:
        "Kangrui is interested in how data are actually collected and how statistical methods behave when real-world assumptions fail. Exposure to causal inference reframed many survey problems for him as questions about identifiability under explicit structural assumptions, rather than ad hoc fixes to weights.",
      keywords: [
        "motivation",
        "research motivation",
        "data collection",
        "causal inference",
        "identifiability",
        "exchangeability",
        "positivity",
        "weighting"
      ]
    },
    {
      category: "nonprobability-surveys",
      title: "Nonprobability Survey Research",
      answer:
        "In one project, Kangrui conducted simulation studies of nonprobability health surveys, comparing weighting and doubly robust estimators when selection depends on unmeasured or sparsely measured covariates. This work led to a first-author manuscript on when traditional calibration breaks down and how machine-learning-assisted propensity models can improve finite-population and causal estimation.",
      keywords: [
        "nonprobability survey",
        "simulation",
        "health survey",
        "doubly robust",
        "calibration weighting",
        "propensity score",
        "machine learning",
        "finite population",
        "causal estimation"
      ]
    },
    {
      category: "genomics-and-health",
      title: "Genomics and Health Data Research",
      answer:
        "Another ongoing project uses data from a large national cohort to construct and evaluate polygenic risk scores for allostatic load and Alzheimer's disease across racial groups, using linked EHR and genomic data.",
      keywords: [
        "polygenic risk score",
        "prs",
        "allostatic load",
        "alzheimers",
        "alzheimer's disease",
        "ehr",
        "genomic data",
        "racial groups",
        "cohort"
      ]
    },
    {
      category: "data-integration-challenges",
      title: "Data Integration Challenges",
      answer:
        "Working with linked health and genomic datasets has made the challenges of selection, missingness, and limited transportability very concrete for Kangrui. He is especially interested in the fact that large datasets are not necessarily representative, and naive analyses can unintentionally reinforce disparities.",
      keywords: [
        "data integration",
        "selection bias",
        "missingness",
        "transportability",
        "representativeness",
        "disparities",
        "health data"
      ]
    },
    {
      category: "phd-goals",
      title: "PhD Research Goals",
      answer:
        "Kangrui's long-term goal is to bridge survey samples, integrate different data sources, and develop estimators that remain stable under realistic violations of assumptions.",
      keywords: [
        "phd",
        "career goals",
        "research goals",
        "survey samples",
        "data sources",
        "estimators",
        "assumptions"
      ]
    }
  ],
  collaborationsHeading: "Collaborations",
  collaborationsNote:
    "It is my good fortune to work with these excellent scholars from different areas.",
  collaborations: [
    {
      date: "2023-12",
      html: "Started collaborating with <a href=\"https://jpsm.umd.edu/facultyprofile/li/yan\" target=\"_blank\" rel=\"noreferrer\">Dr. Yan Li</a> and <a href=\"https://as.virginia.edu/faculty-profile/lingxiao-wang\" target=\"_blank\" rel=\"noreferrer\">Dr. Lingxiao Wang</a> on survey sampling and population inference."
    },
    {
      date: "2025-05",
      html: "Started collaborating with <a href=\"https://sph.umd.edu/people/tianzhou-ma\" target=\"_blank\" rel=\"noreferrer\">Dr. Tianzhou Ma</a>, <a href=\"https://sph.umd.edu/people/edmond-d-shenassa\" target=\"_blank\" rel=\"noreferrer\">Dr. Edmond D. Shenassa</a>, <a href=\"https://sph.umd.edu/people/menglu-liang\" target=\"_blank\" rel=\"noreferrer\">Dr. Menglu Liang</a>, and <a href=\"https://sph.umd.edu/people/paula-strassle\" target=\"_blank\" rel=\"noreferrer\">Dr. Paula Strassle</a> on allostatic load and population health research. Also working with people from <a href=\"https://sites.google.com/umd.edu/malab/people\" target=\"_blank\" rel=\"noreferrer\">Ma Lab</a> on dementia prediction and other AI projects."
    }
  ],
  timelineEnd: "Now",
  cv: {
    label: "View CV",
    url: "#",
    status: "Not uploaded yet..."
  },
  footer: {
    text: "Powered by",
    linkLabel: "Codex",
    linkUrl: "https://chatgpt.com/codex"
  },
  analytics: {
    provider: "goatcounter",
    site: "",
    label: "Visitors",
    dashboardUrl: "",
    enabled: false
  }
};
