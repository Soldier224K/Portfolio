import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

// Read token from Zustand persisted store (aligned with authStore)
function getAuthData() {
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.state || {}
    }
  } catch {
    // If parsing fails, return empty
  }
  return {}
}

api.interceptors.request.use((config) => {
  const { token, opsToken } = getAuthData()
  // If opsToken exists and the request is to an ops route, use opsToken.
  // For simplicity, we prioritize opsToken. If it fails for user routes, we can refine.
  if (opsToken && config.url && !config.url.includes('/auth/login') && !config.url.includes('/auth/register') && !config.url.includes('/visitors/log') && !config.url.includes('/bookings')) {
    config.headers.Authorization = `Bearer ${opsToken}`
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (opsToken) {
    // Fallback if it's a route we didn't explicitly exclude but we only have opsToken
    config.headers.Authorization = `Bearer ${opsToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { refreshToken } = getAuthData()
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          )
          // Update the Zustand persisted store with new token
          const stored = JSON.parse(localStorage.getItem('auth-storage') || '{}')
          if (stored.state) {
            stored.state.token = data.token
            localStorage.setItem('auth-storage', JSON.stringify(stored))
          }
          originalRequest.headers.Authorization = `Bearer ${data.token}`
          return api(originalRequest)
        } catch {
          // Refresh failed — clear auth and redirect
          localStorage.removeItem('auth-storage')
          window.location.href = '/pro'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api