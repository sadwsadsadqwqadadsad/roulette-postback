
exports.handler = async (event) => {
  try {
    // Allow GET and POST requests
    if (!["GET", "POST"].includes(event.httpMethod)) {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
    }

    // Read parameters from URL
    const query = event.queryStringParameters || {};

    // Read parameters from POST body too
    let bodyParams = {};

    if (event.body) {
      const contentType =
        event.headers?.["content-type"] || "";

      if (event.isBase64Encoded) {
        return {
          statusCode: 400,
          body: "Unsupported encoded request"
        };
      }

      if (contentType.includes("application/json")) {
        bodyParams = JSON.parse(event.body);
      } else {
        bodyParams = Object.fromEntries(
          new URLSearchParams(event.body)
        );
      }
    }

    // Support the expected player ID parameter
    const userId =
      query.event_id || bodyParams.event_id;

    if (
      !userId ||
      typeof userId !== "string" ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(userId)
    ) {
      return {
        statusCode: 400,
        body: "Invalid or missing event_id"
      };
    }

    // Firebase configuration
    const projectId = "roulette-strategy-7b22d";

    const firebaseUrl =
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/approved_users/${encodeURIComponent(userId)}`;

    // Firebase REST API request
    const response = await fetch(firebaseUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          active: {
            booleanValue: true
          },
          referred_via: {
            stringValue:
              "https://one-vv2957.com/?open=register&p=k2ry"
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Firebase error:",
        response.status,
        errorText
      );

      return {
        statusCode: 502,
        body: "Firebase update failed"
      };
    }

    console.log("Postback processed successfully");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        message: "Postback processed"
      })
    };

  } catch (error) {
    console.error("Postback error:", error);

    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
};
