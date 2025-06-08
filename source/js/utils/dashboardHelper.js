// source/utils/dashboardHelper.js

export function getThisWeeksApplications(applications) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return applications.filter((app) => {
    if (!app.dateApplied) return false;
    const appDate = new Date(app.dateApplied);
    return appDate >= startOfWeek;
  });
}

export function getPreviousWeeksApplications(applications) {
  const today = new Date();
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - today.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfPrevWeek = new Date(startOfThisWeek);
  startOfPrevWeek.setDate(startOfThisWeek.getDate() - 7);
  const endOfPrevWeek = new Date(startOfThisWeek);
  endOfPrevWeek.setMilliseconds(-1);

  return applications.filter((app) => {
    if (!app.dateApplied) return false;
    const appDate = new Date(app.dateApplied);
    return appDate >= startOfPrevWeek && appDate <= endOfPrevWeek;
  });
}

export function getUpcomingInterviews(applications) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return applications.filter((app) => {
    if (app.status !== 'Interviewing') return false;

    if (app.importantDates) {
      const interviewDateStr =
        app.importantDates['Technical Interview'] ||
        app.importantDates['Phone Interview'] ||
        app.importantDates['Interview'];

      if (interviewDateStr) {
        const interviewDate = new Date(interviewDateStr);
        return interviewDate >= today;
      }
    }
    return false;
  });
}

export function getAwaitingFeedback(applications) {
  return applications.filter(
    (app) => app.status === 'Applied' || app.status === 'Screening'
  );
}

export function getNewOffers(applications) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return applications.filter((app) => {
    if (app.status !== 'Offer' && app.status !== 'Offered') return false;

    const dateToCheck = app.statusUpdateDate || app.dateApplied;
    if (!dateToCheck) return false;

    const parsedDate = new Date(dateToCheck);
    return parsedDate >= oneWeekAgo;
  });
}

export function getApplicationsByMonth(applications) {
  const monthMap = {};

  applications.forEach((app) => {
    const [year, month] = app.dateApplied.split('-').map(Number);
    const yearMonth = `${year}-${month - 1}`;

    if (!monthMap[yearMonth]) {
      monthMap[yearMonth] = { applications: 0, interviews: 0 };
    }

    monthMap[yearMonth].applications++;

    if (app.status === 'Interviewing' || app.status === 'Offer') {
      monthMap[yearMonth].interviews++;
    }
  });

  const sortedKeys = Object.keys(monthMap).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return yearA - yearB || monthA - monthB;
  });

  const months = sortedKeys.map((key) => {
    const [year, month] = key.split('-').map(Number);
    return new Date(year, month - 1).toLocaleString('en-US', { month: 'short' });
  });

  const applicationsArr = sortedKeys.map((key) => monthMap[key].applications);
  const interviewsArr = sortedKeys.map((key) => monthMap[key].interviews);

  return {
    months,
    applications: applicationsArr,
    interviews: interviewsArr
  };
}
