import { UserActivity, UserActivityResponse } from '../types/userActivity';

export async function getUserActivities(): Promise<UserActivity[]> {
  try {
    const response = await fetch('https://useractivity.i-o.digital/user-activity');
    const data: UserActivityResponse[] = await response.json();
    return data.map(item => ({
      phoneNumber: item.phoneNumber,
      activityCount: item.activities.length
    }));
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
}
