const apiUrl = (process.env.API_URL || "http://localhost:3001").replace(/\/$/, "")

const request = async (path, token, options = {}) => {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    throw new Error(
      `The API at ${apiUrl} returned a non-JSON response. Start the API server on port 3001 and keep the frontend on port 1234.`,
    )
  }

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || `Request failed with status ${response.status}.`)
  }
  return result
}

export const fetchUserSheet = async (getToken) => {
  const token = await getToken()
  if (!token) throw new Error("Clerk did not provide an authentication token.")
  const result = await request("/api/sheet", token)
  return result.sheet
}

export const saveUserSheet = async (getToken, sheet) => {
  const token = await getToken()
  if (!token) throw new Error("Clerk did not provide an authentication token.")
  return request("/api/sheet", token, {
    method: "PUT",
    body: JSON.stringify({ sheet }),
  })
}
