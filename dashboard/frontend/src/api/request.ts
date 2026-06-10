import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use((config) => config)

request.interceptors.response.use(
  (response) => {
    const body = response.data
    // 后端返回格式: {code: 0, data: ...}
    if (body && typeof body === 'object' && 'code' in body && body.code === 0) {
      return body.data
    }
    return body
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)

export default request