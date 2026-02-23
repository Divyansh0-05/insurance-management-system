const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const TOKEN_KEY = 'ims_token'

function getToken(){
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token){
  if(!token){
    localStorage.removeItem(TOKEN_KEY)
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
}

export async function apiCall(endpoint, method = 'GET', data = null, options = {}){
  const token = options.token ?? getToken()
  const headers = { ...(options.headers ?? {}) }
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
  if(!options.skipContentType && !isFormData){
    headers['Content-Type'] = 'application/json'
  }
  if(token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: options.rawBody ?? (isFormData ? data : (data ? JSON.stringify(data) : undefined)),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if(response.ok && payload && typeof payload === 'object' && 'success' in payload){
    if(payload.success){
      return payload.data
    }
    throw new Error(payload.message || 'Request failed.')
  }

  if(!response.ok){
    const validationMessage =
      typeof payload === 'object' && payload?.errors?.[0]
        ? payload.errors[0].message || payload.errors[0].msg
        : null
    const message = typeof payload === 'string' ? payload : payload?.message || validationMessage
    throw new Error(message || `API error: ${response.status}`)
  }

  return payload
}

export const authApi = {
  register: (body) => apiCall('/auth/register', 'POST', body),
  login: (body) => apiCall('/auth/login', 'POST', body),
  me: () => apiCall('/auth/me', 'GET'),
}

export const userApi = {
  getDashboard: () => apiCall('/user/dashboard', 'GET'),
  getInsurance: () => apiCall('/user/insurance', 'GET'),
  getInsuranceById: (id) => apiCall(`/user/insurance/${id}`, 'GET'),
  purchase: (body) => apiCall('/user/purchase', 'POST', body),
  getPurchases: () => apiCall('/user/purchases', 'GET'),
  createClaim: (body) => apiCall('/user/claims', 'POST', body),
  getClaims: () => apiCall('/user/claims', 'GET'),
  getClaimById: (id) => apiCall(`/user/claims/${id}`, 'GET'),
  updateProfile: (body) => apiCall('/user/profile', 'PUT', body),
}

export const adminApi = {
  getDashboard: () => apiCall('/admin/dashboard', 'GET'),
  getUsers: () => apiCall('/admin/users', 'GET'),
  getUserById: (id) => apiCall(`/admin/users/${id}`, 'GET'),
  updateUser: (id, body) => apiCall(`/admin/users/${id}`, 'PUT', body),
  deleteUser: (id) => apiCall(`/admin/users/${id}`, 'DELETE'),
  createInsurance: (body) => apiCall('/admin/insurance', 'POST', body),
  getInsurance: () => apiCall('/admin/insurance', 'GET'),
  updateInsurance: (id, body) => apiCall(`/admin/insurance/${id}`, 'PUT', body),
  deleteInsurance: (id) => apiCall(`/admin/insurance/${id}`, 'DELETE'),
  getClaims: () => apiCall('/admin/claims', 'GET'),
  approveClaim: (id) => apiCall(`/admin/claims/${id}/approve`, 'PUT'),
  rejectClaim: (id, body) => apiCall(`/admin/claims/${id}/reject`, 'PUT', body),
  getReports: () => apiCall('/admin/reports', 'GET'),
  getSettings: () => apiCall('/admin/settings', 'GET'),
  updateSettings: (body) => apiCall('/admin/settings', 'PUT', body),
}

export default apiCall
