import { UserActivity, UserActivityResponse } from '../types/userActivity';

export async function getUserActivities(): Promise<UserActivity[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-activity`);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    const data = await response.json();
    console.log("API Response:", data); // Add this line to debug
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
