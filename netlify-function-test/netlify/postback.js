exports.handler = async (event, context) => {
  // 1. Read the 'event_id' parameter from the URL (which 1win fills with the player ID)
  const userId = event.queryStringParameters.event_id;

  if (!userId) {
    return { statusCode: 400, body: "No user ID provided" };
  }

  // 2. Your Firebase Project ID
  const projectId = "roulette-strategy-7b22d";
  
  // 3. Firebase REST API URL
  const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/approved_users/${userId}`;

  try {
    // 4. Write the user to Firebase automatically
    const response = await fetch(firebaseUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          active: { booleanValue: true },
          referred_via: { stringValue: 'https://one-vv2957.com/?open=register&p=k2ry' }
        }
      })
    });

    if (!response.ok) {
        throw new Error(`Firebase error: ${response.statusText}`);
    }

    return { statusCode: 200, body: "Success" };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};