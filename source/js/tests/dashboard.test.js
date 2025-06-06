/**
 * @jest-environment jsdom
 */

import {
    getApplicationsByMonth,
    getAwaitingFeedback,
    getNewOffers,
    getPreviousWeeksApplications,
    getThisWeeksApplications,
    getUpcomingInterviews
} from '../utils/dashboardHelper.js';

describe('dashboardHelpers', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-06-05'));  // Thursday, June 5th 2025
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getThisWeeksApplications()', () => {
    it('returns only applications from this week', () => {
      const applications = [
        { id: 1, dateApplied: '2025-06-02' },
        { id: 2, dateApplied: '2025-06-05' },
        { id: 3, dateApplied: '2025-05-30' },
      ];
      const result = getThisWeeksApplications(applications);
      expect(result).toEqual([
        { id: 1, dateApplied: '2025-06-02' },
        { id: 2, dateApplied: '2025-06-05' }
      ]);
    });
  });

  describe('getPreviousWeeksApplications()', () => {
    it('returns only applications from previous week', () => {
      const applications = [
        { id: 1, dateApplied: '2025-05-27' },
        { id: 2, dateApplied: '2025-05-30' },
        { id: 3, dateApplied: '2025-06-03' }
      ];
      const result = getPreviousWeeksApplications(applications);
      expect(result).toEqual([
        { id: 1, dateApplied: '2025-05-27' },
        { id: 2, dateApplied: '2025-05-30' }
      ]);
    });
  });

  describe('getUpcomingInterviews()', () => {
    it('returns only upcoming interviews', () => {
      const applications = [
        { id: 1, status: 'Interviewing', importantDates: { 'Technical Interview': '2025-06-06' } },
        { id: 2, status: 'Interviewing', importantDates: { 'Phone Interview': '2025-06-02' } },
        { id: 3, status: 'Interviewing', importantDates: { 'Interview': '2025-06-07' } },
        { id: 4, status: 'Applied' }
      ];
      const result = getUpcomingInterviews(applications);
      expect(result).toEqual([
        { id: 1, status: 'Interviewing', importantDates: { 'Technical Interview': '2025-06-06' } },
        { id: 3, status: 'Interviewing', importantDates: { 'Interview': '2025-06-07' } }
      ]);
    });
  });

  describe('getAwaitingFeedback()', () => {
    it('returns Applied or Screening only', () => {
      const applications = [
        { id: 1, status: 'Applied' },
        { id: 2, status: 'Screening' },
        { id: 3, status: 'Interviewing' },
        { id: 4, status: 'Offer' }
      ];
      const result = getAwaitingFeedback(applications);
      expect(result).toEqual([
        { id: 1, status: 'Applied' },
        { id: 2, status: 'Screening' }
      ]);
    });
  });

  describe('getNewOffers()', () => {
    it('returns only offers from last 7 days', () => {
      const applications = [
        { id: 1, status: 'Offer', statusUpdateDate: '2025-06-01' },
        { id: 2, status: 'Offer', statusUpdateDate: '2025-05-25' },
        { id: 3, status: 'Offered', statusUpdateDate: '2025-06-04' },
        { id: 4, status: 'Applied', statusUpdateDate: '2025-06-03' }
      ];
      const result = getNewOffers(applications);
      expect(result).toEqual([
        { id: 1, status: 'Offer', statusUpdateDate: '2025-06-01' },
        { id: 3, status: 'Offered', statusUpdateDate: '2025-06-04' }
      ]);
    });
  });

  describe('getApplicationsByMonth()', () => {
    it('groups applications correctly by month', () => {
      const applications = [
        { id: 1, dateApplied: '2025-01-15', status: 'Applied' },
        { id: 2, dateApplied: '2025-03-10', status: 'Interviewing' },
        { id: 3, dateApplied: '2025-03-20', status: 'Offer' },
        { id: 4, dateApplied: '2025-05-01', status: 'Rejected' },
        { id: 5, dateApplied: '2024-12-15', status: 'Applied' }
      ];
  
      const result = getApplicationsByMonth(applications);
  
      expect(result).toEqual({
        months: ['Dec', 'Jan', 'Mar', 'May'],
        applications: [1, 1, 2, 1],
        interviews: [0, 0, 2, 0]
      });
    });
  
    it('handles empty data', () => {
      const result = getApplicationsByMonth([]);
      expect(result).toEqual({
        months: [],
        applications: [],
        interviews: []
      });
    });
  });  
});