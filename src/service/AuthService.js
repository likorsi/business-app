import { initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    getAuth,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser,
    sendPasswordResetEmail
} from "firebase/auth";
import {getDatabase, set, ref as refDB, update, onValue, get, child, remove} from "firebase/database";
import NalogAPI from "moy-nalog";

class AuthService {
    constructor() {
        initializeApp({
            apiKey: process.env.API_KEY,
            authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
            databaseURL: `https://${process.env.DATABASE_NAME}.firebasedatabase.app/`,
            projectId: process.env.PROJECT_ID,
            storageBucket: `${process.env.STORAGE_BUCKET}.appspot.com`
        })
        this.getAuth = getAuth()
        this.user = localStorage.getItem('userId')
        this.token = localStorage.getItem('token')
        this.error = null
        this.profile = null
        this.useMyTax = false

        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                this.profile = user
                console.log('profile', this.profile)

            } else {
                await this.logout()
                localStorage.removeItem('token')
                console.log('User is signed out')
            }
        });

        onValue(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), snapshot => {
            if (snapshot.exists()) {
                this.useMyTax = snapshot.val().useMyTaxOption
            }
        });
    }

    getProfile = () => this.profile

    getError = () => this.error

    getToken = () => this.token

    auth = async (email, password, isLogin) => {
        try {
            this.error = null
            let response = null
            if (isLogin) {
                response = await signInWithEmailAndPassword(this.getAuth, email, password)
            } else {
                response = await createUserWithEmailAndPassword(this.getAuth, email, password)
            }

            this.token = response.user.accessToken
            this.user = response.user.uid
            localStorage.setItem('token', this.token)
            localStorage.setItem('userId', this.user)
            const expirationDate = new Date(new Date().getTime() + response._tokenResponse.expiresIn * 1000)
            localStorage.setItem('expirationDate', expirationDate)
            this.autoLogout(response._tokenResponse.expiresIn)

            if (isLogin) {
                const snapshot = await get(child(refDB(getDatabase()), `${localStorage.getItem('userId')}/info`))
                this.useMyTax = snapshot.val().useMyTaxOption
            } else {
                await set(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
                    user: localStorage.getItem('userId'),
                    useMyTaxOption: false
                })
            }

        } catch (e) {
            this.error = JSON.stringify(e)
            console.log(this.error)
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
        // setTimeout(() => this.logout(), time * 10000)
    }

    updateUsername = async (username) => {
        try {
            this.error = null
            await updateProfile(getAuth().currentUser, {
                displayName: username
            })
        } catch (e) {
            this.error = e
        }
    }

    updateUserEmail = async (newEmail, email, password) => {
        try {
            this.error = null
            await signInWithEmailAndPassword(getAuth(), email, password)
            await updateEmail(getAuth().currentUser, newEmail)
        } catch (e) {
            this.error = e
        }
    }

    updateUserPassword = async (newPassword, email, password) => {
        try {
            this.error = null
            await signInWithEmailAndPassword(getAuth(), email, password)
            await updatePassword(getAuth().currentUser, newPassword)
        } catch (e) {
            this.error = e
        }
    }

    deleteUserAccount = async () => {
        try {
            this.error = null
            await deleteUser(getAuth().currentUser)
            await remove(refDB(getDatabase(), `${localStorage.getItem('userId')}`));
        } catch (e) {
            this.error = e
        }
    }

    resetPassword = async (email) => {
        try {
            this.error = null
            await sendPasswordResetEmail(getAuth(), email)
        } catch (e) {
            this.error = e
        }
    }

    loginToMyTax = async (login, password) => {
        try {
            this.error = null
            console.log(login, password)
            const nalog = new NalogAPI({autologin: false})

            await nalog.auth(login, password)

            const nalogToken = await nalog.getToken()
            console.log(nalogToken)

            // await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
            //     useMyTaxOption: true,
            //     nalogToken: nalogToken
            // });
            // await this.updateCheckMyTaxOption(true)
        } catch (e) {
            this.error = e
        }
    }

    updateCheckMyTaxOption = async (flag) => {
        try {
            this.error = null
            await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
                useMyTaxOption: flag
            });
        } catch (e) {
            this.error = e
        }
    }

    loadMyTaxOption = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(getDatabase()), `${localStorage.getItem('userId')}/info`))

            if (snapshot.exists()) {
                this.useMyTax = snapshot.val().useMyTaxOption
            }

        } catch (e) {
            this.error = e
        }
    }


    logout = async () => {
        try {
            await signOut(this.getAuth)

            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('expirationDate')
            this.token = null
            this.user = null

        } catch (e) { console.log(e) }
    }
}

export default new AuthService()