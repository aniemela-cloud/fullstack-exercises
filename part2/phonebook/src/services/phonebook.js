import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
    .then(response => response.data)
}

const addNew = (newEntry) => {
    return axios.post(baseUrl, newEntry)
    .then(response => response.data)
}

const deleteById = (entryId) => {
    return axios.delete(`${baseUrl}/${entryId}`)
}

export default { getAll, addNew, deleteById }