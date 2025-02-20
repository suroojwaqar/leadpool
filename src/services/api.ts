const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUserActivity = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user-activity/`); // Fixed syntax error
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user activity:", error);
    throw error;
  }
};
