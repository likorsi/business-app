import axios from 'axios'

const DATABASE_NAME = process.env.DATABASE_NAME

const instance = axios.create({
	baseURL: `https://${DATABASE_NAME}.firebasedatabase.app/`,
	params: {
        auth: localStorage.getItem('token')
    }
})

export default instance