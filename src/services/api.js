const ENV_API_BASE = import.meta.env.VITE_API_BASE?.trim()
const API_BASE = ENV_API_BASE || ''
const API_URL = API_BASE ? `${API_BASE}/api` : '/api'

const apiService = {
  getToken: () => localStorage.getItem('token'),
  
  setToken: (token) => localStorage.setItem('token', token),
  
  removeToken: () => localStorage.removeItem('token'),

  resolveMediaUrl: (url) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    const base = API_BASE || window.location.origin
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  },

  getHeaders: (isFormData = false) => {
    const headers = {}
    const token = apiService.getToken()
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  },

  // ===== AUTHENTICATION =====
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json')
        ? await response.json().catch(() => ({}))
        : {}

      if (!response.ok) {
        const fallback = response.status >= 500
          ? 'Backend error. Please check backend server logs.'
          : `Login failed (HTTP ${response.status}).`
        return { success: false, message: data.message || fallback }
      }

      if (data.token) {
        apiService.setToken(data.token)
        return { token: data.token, ...data }
      }

      return { success: false, message: data.message || 'Login failed: invalid response from backend.' }
    } catch (error) {
      console.error('Login error:', error)
      const hintBase = API_BASE || 'backend via Vite proxy (/api -> http://localhost:5000)'
      return { success: false, message: `Cannot reach backend (${hintBase}). Start backend server on port 5000.` }
    }
  },

  logout: () => {
    apiService.removeToken()
  },

  // ===== ENQUIRIES =====
  getEnquiries: async () => {
    try {
      const response = await fetch(`${API_URL}/enquiries`, {
        method: 'GET',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching enquiries:', error)
      return { success: false, data: [] }
    }
  },

  createEnquiry: async (enquiry) => {
    try {
      const response = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating enquiry:', error)
      return { success: false, message: 'Network error' }
    }
  },

  submitEnquiry: async (enquiry) => apiService.createEnquiry(enquiry),

  deleteEnquiry: async (enquiryId) => {
    try {
      const response = await fetch(`${API_URL}/enquiries/${enquiryId}`, {
        method: 'DELETE',
        headers: apiService.getHeaders()
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      return { success: false, message: 'Network error' }
    }
  },

  downloadEnquiriesExcel: async () => {
    try {
      const token = apiService.getToken()
      const headers = {}

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}/enquiries/export`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await response.json().catch(() => ({}))
          return { success: false, message: data.message || 'Failed to download enquiries file' }
        }
        return { success: false, message: `Failed to download enquiries file (HTTP ${response.status})` }
      }

      const blob = await response.blob()
      const contentDisposition = response.headers.get('content-disposition') || ''
      const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i)
      const filename = fileNameMatch?.[1]?.replace(/"/g, '') || 'enquiries.xlsx'

      return { success: true, blob, filename }
    } catch (error) {
      console.error('Error downloading enquiries excel:', error)
      return { success: false, message: 'Network error while downloading enquiries file' }
    }
  },

  // ===== HIGH-SELLING PACKAGES =====
  getHighSellingPackages: async () => {
    try {
      const response = await fetch(`${API_URL}/high-selling-packages`, {
        method: 'GET',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching high-selling packages:', error)
      return { success: false, data: [] }
    }
  },

  createHighSellingPackage: async (packageData) => {
    try {
      const response = await fetch(`${API_URL}/high-selling-packages`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(packageData)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating high-selling package:', error)
      return { success: false, message: 'Network error' }
    }
  },

  deleteHighSellingPackage: async (packageId) => {
    try {
      const response = await fetch(`${API_URL}/high-selling-packages/${packageId}`, {
        method: 'DELETE',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting high-selling package:', error)
      return { success: false, message: 'Network error' }
    }
  },

  updateHighSellingPackage: async (packageId, packageData) => {
    try {
      const response = await fetch(`${API_URL}/high-selling-packages/${packageId}`, {
        method: 'PUT',
        headers: apiService.getHeaders(),
        body: JSON.stringify(packageData)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating high-selling package:', error)
      return { success: false, message: 'Network error' }
    }
  },

  // ===== ALL PACKAGES =====
  getPackages: async () => {
    try {
      const response = await fetch(`${API_URL}/packages`, {
        method: 'GET',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching packages:', error)
      return { success: false, data: [] }
    }
  },

  createAllPackage: async (packageData) => {
    try {
      const response = await fetch(`${API_URL}/packages`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(packageData)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating package:', error)
      return { success: false, message: 'Network error' }
    }
  },

  deleteAllPackage: async (packageId) => {
    try {
      const response = await fetch(`${API_URL}/packages/${packageId}`, {
        method: 'DELETE',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting package:', error)
      return { success: false, message: 'Network error' }
    }
  },

  updatePackage: async (packageId, packageData) => {
    try {
      const response = await fetch(`${API_URL}/packages/${packageId}`, {
        method: 'PUT',
        headers: apiService.getHeaders(),
        body: JSON.stringify(packageData)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating package:', error)
      return { success: false, message: 'Network error' }
    }
  },

  // ===== HOME IMAGES =====
  getHomeImages: async () => {
    try {
      const response = await fetch(`${API_URL}/home-images`, {
        method: 'GET',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching home images:', error)
      return { success: false, data: [] }
    }
  },

  uploadHomeImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/home-images`, {
        method: 'POST',
        headers,
        body: formData
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error uploading home image:', error)
      return { success: false, message: 'Network error' }
    }
  },

  deleteHomeImage: async (imageId) => {
    try {
      const response = await fetch(`${API_URL}/home-images/${imageId}`, {
        method: 'DELETE',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting home image:', error)
      return { success: false, message: 'Network error' }
    }
  },

  // ===== PACKAGE IMAGES =====
  uploadPackageImage: async (packageId, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/packages/${packageId}/image`, {
        method: 'POST',
        headers,
        body: formData
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error uploading package image:', error)
      return { success: false, message: 'Network error' }
    }
  },

  uploadHighSellingPackageImage: async (packageId, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/high-selling-packages/${packageId}/image`, {
        method: 'POST',
        headers,
        body: formData
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error uploading high-selling package image:', error)
      return { success: false, message: 'Network error' }
    }
  },

  // ===== ABOUT/HISTORY =====
  getAbout: async () => {
    try {
      const response = await fetch(`${API_URL}/about`, {
        method: 'GET',
        headers: apiService.getHeaders()
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching about:', error)
      return { success: false, data: { content: '', video: '' } }
    }
  },

  updateAbout: async (content) => {
    try {
      const response = await fetch(`${API_URL}/about`, {
        method: 'PUT',
        headers: apiService.getHeaders(),
        body: JSON.stringify(content)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating about:', error)
      return { success: false, message: 'Network error' }
    }
  },

  uploadAboutVideo: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/about/video`, {
        method: 'POST',
        headers,
        body: formData
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error uploading about video:', error)
      return { success: false, message: 'Network error' }
    }
  },

  // ===== USER MANAGEMENT =====
  getUsers: async () => {
    try {
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching users:', error)
      return { success: false, message: 'Network error' }
    }
  },

  createUser: async (userData) => {
    try {
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating user:', error)
      return { success: false, message: 'Network error' }
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating user:', error)
      return { success: false, message: 'Network error' }
    }
  },

  deleteUser: async (userId) => {
    try {
      const token = apiService.getToken()
      const headers = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting user:', error)
      return { success: false, message: 'Network error' }
    }
  }
}

export default apiService
