import './components/job-card.js'; // Ensure the component is registered

const jobData = [
  {
    company: "Acme Corp",
    title: "Senior UX Designer",
    position: "Full-Time",
    logo: "https://example.com/logo1.png",
    requirements: [
      "5+ years experience",
      "Portfolio",
      "Good communication"
    ]
  },
  {
    company: "Globex Inc.",
    title: "Frontend Developer",
    position: "Remote",
    logo: "https://example.com/logo2.png",
    requirements: [
      "React",
      "JavaScript",
      "CSS"
    ]
  }
];

// Add cards to <main>
const main = document.querySelector('main');

jobData.forEach(job => {
  const card = document.createElement('job-app-card');
  card.data = job;
  main.appendChild(card);
});
