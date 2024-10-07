//upload can be any, disabling because it is intended behavior
/* eslint-disable @typescript-eslint/no-explicit-any */

//type can be POST or PUT
export const httpRequest = async (
  urlString: string,
  upload: any,
  type: string
) => {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const response = await fetch(urlString, {
    method: type,
    body: JSON.stringify(upload),
    headers: myHeaders,
  });

  // Check if the response is not ok (status not in the 2xx range)
  if (!response.ok) {
    const errorData = await response.text(); // Read the error as text
    // Try to parse as JSON if possible
    let message;
    try {
      const json = JSON.parse(errorData);
      message = json.message || response.statusText;
    } catch {
      message = errorData || response.statusText;
    }
    throw new Error(message); // Throw an error
  }

  // Handle responses that do not have a body (like 204 No Content)
  if (response.status < 300) {
    return {}; // Return an empty object or handle as needed
  }

  return response.json(); // Return the parsed JSON response
};

export const httpDelete = async (urlString: string) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("content-type", "application/json");

    await fetch(urlString, {
      method: "DELETE",
      headers: myHeaders,
    });
  } catch (e) {
    console.log(e);
  }
};
