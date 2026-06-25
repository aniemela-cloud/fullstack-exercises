import axios from 'axios'
const baseUrl = import.meta.env.PROD ? '/api/blogs' : 'http://localhost:3003/api/blogs'

let userToken = null

const setToken = (newToken) => {
  userToken = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlogObject) => {
  const config = {
    headers: { Authorization: userToken }
  }
  const response = await axios.post(baseUrl, newBlogObject, config)
  return response.data
}


export default { getAll, create, setToken }