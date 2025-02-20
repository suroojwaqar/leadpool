export interface Activity {
  category: string;
  type: string;
  source: string;
  client: string;
  createDate: string;
  otherInformation: {
    name: string;
    Phone: string;
    Country: string;
    City: string;
    emailAdress: string;
  };
  _id: string;
}

export interface UserData {
  _id: string;
  phoneNumber: string;
  createDate: string;
  activities: Activity[];
}

export const processData = (data: UserData[]) => {
  const uniqueUsers = data?.length || 0;
  const totalLeads = data?.reduce((acc, user) => acc + (user.activities?.length || 0), 0) || 0;
  
  // Calculate category counts with safety checks
  const categoryCount = data?.flatMap(user => user.activities || [])
    .reduce((acc, activity) => {
      if (activity.category) {
        acc[activity.category] = (acc[activity.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

  // Calculate source counts with safety checks
  const sourceCount = data?.flatMap(user => user.activities || [])
    .reduce((acc, activity) => {
      if (activity.source) {
        acc[activity.source] = (acc[activity.source] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

  // Calculate client activity with safety checks
  const clientActivity = data?.flatMap(user => user.activities || [])
    .reduce((acc, activity) => {
      if (activity.client) {
        acc[activity.client] = (acc[activity.client] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

  // Get monthly trends with safety checks
  const monthlyTrends = data?.flatMap(user => user.activities || [])
    .reduce((acc, activity) => {
      if (activity.createDate) {
        const month = new Date(activity.createDate).toLocaleDateString('en-US', { month: 'long' });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

  return {
    uniqueUsers,
    totalLeads,
    categoryCount,
    sourceCount,
    clientActivity,
    monthlyTrends,
  };
};

export const getRecentLeads = (data: UserData[]) => {
  return data
    .flatMap(user => user.activities.map(activity => ({
      name: activity.otherInformation.name,
      // Changed to use the user's phone number instead of activity's phone
      phone: user.phoneNumber,
      category: activity.category,
      source: activity.source,
      date: new Date(activity.createDate).toLocaleDateString(),
    })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
};
