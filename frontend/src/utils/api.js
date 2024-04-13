export async function makeApiRequest(url, method, token, body = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    const config = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    };
  
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }
      return response.json();  // Assuming the server responds with JSON
    } catch (error) {
      console.error(`API request failed: ${error}`);
      throw error;
    }
  }
  