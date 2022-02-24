import axios from "axios";

const API_KEY = process.env.API_KEY

class AuthService {
    constructor() {
        this.token = null
        this.error = null
    }

    getError = () => this.error

    getToken = () => this.token

    auth = async (email, password, isLogin) => {
        const authData = {
            email, password,
            returnSecureToken: true,
        }

        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`

        if (isLogin) {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
        }

        try {
            this.error = null
            const {data} = await axios.post(url, authData)
            const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

            localStorage.setItem('token', data.idToken)
            localStorage.setItem('userId', data.localId)
            localStorage.setItem('expirationDate', expirationDate)
            this.token = data.idToken
            this.autoLogout(data.expiresIn)
        } catch (e) {
            this.error = JSON.stringify(e)
        }
    }

    autoLogin = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            this.logout()
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                this.logout()
            } else {
                this.token = token
                this.autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
            }
        }
    }

    autoLogout = (time) => {
        setTimeout(() => this.logout(), time * 1000)
    }


    logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('expirationDate')
        this.token = null
    }
}

export default new AuthService()