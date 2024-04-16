const makeApiRequest = async (url, method = 'GET', token, body = null) => {
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  };

  const config = {
      method: method,
      headers: headers,
      body: method !== 'GET' && method !== 'DELETE' ? JSON.stringify(body) : null
  };

  try {
      const response = await fetch(url, config);
      if (!response.ok) {
          const errorData = await response.text().then(text => text ? JSON.parse(text) : {});
          throw new Error(errorData.message || 'API request failed');
      }
      if (response.status !== 204) {
          return await response.json();
      } else {
          return { message: 'Success' };  
      }
  } catch (error) {
      console.error(`API request failed: ${error}`);
      throw error;
  }
};

export { makeApiRequest };
