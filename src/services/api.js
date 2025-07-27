import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://abbebe0fec3b.ngrok-free.app/api';


async function preparednessScore(level, years) {
    level = level.toLowerCase().trim();

    // Base weights
    const levelWeights = {
        beginner: 20,
        intermediate: 40,
        advanced: 70,
        expert: 90
    };

    // Get base score (default to 0 if invalid level)
    const baseScore = levelWeights[level] || 0;

    // Experience bonus (capped at 30 points)
    const expBonus = Math.min(years * 5, 30);

    // Calculate final score (max 100)
    const finalScore = Math.min(baseScore + expBonus, 100);

    return Math.round(finalScore);
}
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


// Auth API
export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
}

export async function register(userData) {
  const res = await axios.post(`${API_URL}/auth/register`, userData);
  return res.data;
}

export async function getAuthProfile() {
  const res = await axios.get(`${API_URL}/auth/profile`, { headers: getAuthHeader() });
  return res.data;
}

// Skills API
// export async function getSkills() {
//   const res = await axios.get(`${API_URL}/skills`, { headers: getAuthHeader() });
//   return res.data;
// }

export async function addSkill(skill) {
  const res = await axios.post(`${API_URL}/skills`, skill, { headers: getAuthHeader() });
  return res.data;
}

export async function updateSkill(id, skill) {
  const res = await axios.put(`${API_URL}/skills/${id}`, skill, { headers: getAuthHeader() });
  return res.data;
}

export async function deleteSkill(id) {
  const res = await axios.delete(`${API_URL}/skills/${id}`, { headers: getAuthHeader() });
  return res.data;
}

// // Mock function for skills stats (you can replace with real API later)
// export async function getSkillsStats() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         { name: 'JavaScript', level: 'Advanced', progress: 85 },
//         { name: 'React', level: 'Intermediate', progress: 70 },
//         { name: 'Node.js', level: 'Intermediate', progress: 65 },
//         { name: 'Python', level: 'Beginner', progress: 40 }
//       ]);
//     }, 500);
//   });
// }


export async function getSkillsStats() {
  const res = await axios.get(`${API_URL}/skills`, { headers: getAuthHeader() });
  // Transform the API response to the required format
  console.log(res.data);
  return Promise.all(res.data.map(async skill => ({
    name: skill.name,
    level: skill.proficiency || 'Beginner',
    // prgress : 10
    progress: await preparednessScore(skill.proficiency, skill.yearsOfExperience)
  })));
}



// export async function getSkillsStats() {
//   return new Promise(async (resolve) => {
//     // setTimeout(() => {
//         const res = await axios.get(`${API_URL}/skills`, { headers: getAuthHeader() });
//   return res.data;;
//     // }, 500);
//   });
// }


// Profile API
export async function getProfile() {
  const res = await axios.get(`${API_URL}/users/me`, { headers: getAuthHeader() });
  return res.data;
}

// export async function updateProfile(updates) {
//   const res = await axios.put(`${API_URL}/users/me`, updates, { headers: getAuthHeader() });
//   return res.data;
// }



export async function updateProfile(updates) {
  const res = await axios.put(`${API_URL}/users/me`, updates, { 
    headers: getAuthHeader() 
  });
  return res.data.user; // Return the updated user object
}




// Add this function to your existing api.js

// export async function analyzeLinkedInProfile() {
//   try {
//     const res = await axios.post(`${API_URL}/users/analyze-linkedin`, {}, {
//       headers: getAuthHeader(),
//       timeout: 50000 // Extended timeout for AI analysis
//     });
//     return res.data;
//   } catch (error) {
//     console.error('LinkedIn analysis failed:', error);
//     throw error;
//   }
// }


export async function searchUsers(query) {
  const res = await axios.get(`${API_URL}/users/search?q=${query}`, { headers: getAuthHeader() });
  return res.data;
}

// Matches API
export async function getMatches() {
  const res = await axios.get(`${API_URL}/matches`, { headers: getAuthHeader() });
  return res.data;
}

export async function getRecommendations() {
  const res = await axios.post(`${API_URL}/matches/recommend`, {}, { headers: getAuthHeader() });
  return res;
}


// Add these new functions to your existing api.js

export async function getDashboardData() {
  try {
    const res = await axios.get(`${API_URL}/users/dashboard-data`, {
      headers: getAuthHeader(),
      timeout: 10000
    });
    return res.data;
  } catch (error) {
    console.error('Dashboard data fetch failed:', error);
    throw error;
  }
}

export async function getCareerInspiration(userId) {
  try {
    const res = await axios.post(`${API_URL}/users/${userId}/get-inspiration`, {}, {
      headers: getAuthHeader(),
      timeout: 50000
    });
    return res.data;
  } catch (error) {
    console.error('Career inspiration failed:', error);
    throw error;
  }
}

// Update the existing analyzeLinkedInProfile function to ensure it stores data
export async function analyzeLinkedInProfile() {
  try {
    const res = await axios.post(`${API_URL}/users/analyze-linkedin`, {}, {
      headers: getAuthHeader(),
      timeout: 50000
    });
    return res.data;
  } catch (error) {
    console.error('LinkedIn analysis failed:', error);
    throw error;
  }
}





// Enhanced AI recommendations with Gemini
export async function getAIEnhancedRecommendations(preferences = {}) {
  try {
    const res = await axios.post(`${API_URL}/matches/ai-enhanced`, 
      { preferences }, 
      { 
        headers: getAuthHeader(),
        timeout: 50000 // Extended timeout for AI processing
      }
    );
    return res.data;
  } catch (error) {
    console.error('AI recommendations failed:', error);
    throw error;
  }
}

// Check AI service status
export async function getAIServiceStatus() {
  try {
    const res = await axios.get(`${API_URL}/matches/ai-status`, {
      headers: getAuthHeader(),
      timeout: 5000
    });
    return res.data;
  } catch (error) {
    return { ai_service_status: 'offline', error: error.message };
  }
}

// Get AI-powered profile insights
export async function getProfileInsights() {
  try {
    const res = await axios.get(`${API_URL}/users/ai-insights`, {
      headers: getAuthHeader(),
      timeout: 35000
    });
    return res.data;
  } catch (error) {
    console.error('Profile insights failed:', error);
    throw error;
  }
}

// Existing functions remain the same...
export async function getSkills() {
  const res = await axios.get(`${API_URL}/skills`, { headers: getAuthHeader() });
  return res.data;
}




// Add these new functions to your existing api.js

export async function sendConnectionRequest(userId, message = '', connectionType = 'general') {
  try {
    const res = await axios.post(`${API_URL}/users/${userId}/connect`, {
      message,
      connection_type: connectionType
    }, {
      headers: getAuthHeader(),
      timeout: 10000
    });
    return res.data;
  } catch (error) {
    console.error('Connection request failed:', error);
    throw error;
  }
}

export async function getConnections() {
  try {
    const res = await axios.get(`${API_URL}/users/connections`, {
      headers: getAuthHeader(),
      timeout: 10000
    });
    return res.data;
  } catch (error) {
    console.error('Get connections failed:', error);
    throw error;
  }
}

export async function respondToConnection(connectionId, status) {
  try {
    const res = await axios.patch(`${API_URL}/users/connections/${connectionId}`, 
      { status }, 
      {
        headers: getAuthHeader(),
        timeout: 10000
      }
    );
    return res.data;
  } catch (error) {
    console.error('Respond to connection failed:', error);
    throw error;
  }
}



// Banner API functions
export async function getBannerForToday() {
  try {
    const res = await axios.get(`${API_URL}/banners/today`, {
      headers: getAuthHeader(),
      timeout: 15000
    });
    return res.data;
  } catch (error) {
    console.error('Get today banner failed:', error);
    throw error;
  }
}

export async function generateNewBanner() {
  try {
    const res = await axios.post(`${API_URL}/banners/generate`, {}, {
      headers: getAuthHeader(),
      timeout: 60000 // 1 minute timeout for generation
    });
    return res.data;
  } catch (error) {
    console.error('Generate new banner failed:', error);
    throw error;
  }
}

export async function getBannerHistory() {
  try {
    const res = await axios.get(`${API_URL}/banners/history`, {
      headers: getAuthHeader(),
      timeout: 10000
    });
    return res.data;
  } catch (error) {
    console.error('Get banner history failed:', error);
    throw error;
  }
}

export async function getFlexWallToday() {
  const res = await axios.get(`${API_URL}/flexwall/today`, {
    headers: getAuthHeader()
  });
  return res.data;
}


export async function compareSkills({ compareTo }) {
  const res = await axios.post(`${API_URL}/users/compare-skills`, {
    compareTo
  }, {
    headers: getAuthHeader()
  });
  return res.data;
}

export async function flexSkill({ skill, progress, reason }) {
  const res = await axios.post(`${API_URL}/flexwall/flex`, {
    skill,
    progress,
    reason
  }, {
    headers: getAuthHeader()
  });
  return res.data;
}


// export async function getProfile() {
//   const res = await axios.get(`${API_URL}/users/me`, { headers: getAuthHeader() });
//   return res.data;
// }
