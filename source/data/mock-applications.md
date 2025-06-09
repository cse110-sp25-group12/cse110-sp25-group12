# Mock Application Card Data (With Comments)

This file documents the structure and content of the mock JSON used for simulating application cards in the UI.
To access the actual JSON file, it can be found in source/data/applications.json

Add a comment here.

```jsonc
[
  {
    // Application to Apple for a Machine Learning Engineer position
    "id": 1,
    "company": "Apple",
    "jobPosition": "Machine Learning Engineer", // Role applied for
    "salary": 265000, // Base salary in USD
    "location": "San Francisco, CA", // Job location

    "contact": {
      "name": "Mark Spears", // Recruiter or hiring contact
      "email": "mark.spears@apple.com",
      "phoneNumber": "417-525-2998"
    },

    "notes": "Waiting to hear back from the recruiter screen I did last week", // Personal tracking note
    "dateApplied": "2025-03-19", // Date when application was submitted

    "importantDates": {
      "Phone Interview": "2025-04-05", // First round interview
      "Technical Interview": "2025-04-12" // Second round interview
    },

    "status": "Applied" // Current status shown in dropdown
  },
  {
    // Google Software Developer role application
    "id": 2,
    "company": "Google",
    "jobPosition": "Software Developer",
    "salary": 120000,
    "location": "San Diego, CA",

    "contact": {
      "name": "Alex Jobs",
      "email": "alex.jobs@google.com",
      "phoneNumber": "999-999-9999"
    },

    "notes": "Have finished the coding challenge, waiting for results",
    "dateApplied": "2025-04-19",

    "importantDates": {
      "Challenge Submission": "2025-04-24" // Assessment task completion
    },

    "status": "Interviewing"
  },
  {
    // Netflix Product Designer offer
    "id": 3,
    "company": "Netflix",
    "jobPosition": "Product Designer",
    "salary": 145000,
    "location": "Chicago, IL",

    "contact": {
      "name": "Joe Davis",
      "email": "joe.davis@netflix.com",
      "phoneNumber": "888-888-8888"
    },

    "notes": "Have received the offer, reviewing benefits and stock options",
    "dateApplied": "2025-03-29",

    "importantDates": {
      "Offer Deadline": "2025-05-20" // Final date to accept or reject
    },

    "status": "Offered"
  }
]
