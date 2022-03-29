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
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {Photo} from "../domain/Photo.js";

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
        this.nalogInfo = {
            useMyTaxOption: false,
            token: ''
        }
        this.publicInfo = {
            username: '',
            photo: new Photo(),
            helpText: ''
        }

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
                const photo = new Photo()
                photo.init(snapshot.val().photo)
                this.publicInfo = {
                    username: snapshot.val().username,
                    helpText: snapshot.val().helpText,
                    photo: photo
                }
            }
        });

        onValue(refDB(getDatabase(), `${localStorage.getItem('userId')}/nalog`), snapshot => {
            if (snapshot.exists()) {
                this.nalogInfo = snapshot.val()
            }
        });
    }

    getProfile = () => this.profile

    getPublicInfo = () => this.publicInfo

    getNalogInfo = () => this.nalogInfo

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
            // this.autoLogout(response._tokenResponse.expiresIn)

            if (isLogin) {
                const snapshot = await get(child(refDB(getDatabase()), `${localStorage.getItem('userId')}/nalog`))
                this.nalogInfo = snapshot.val()
                const snapshot2 = await get(child(refDB(getDatabase()), `${localStorage.getItem('userId')}/info`))
                const photo = new Photo()
                photo.init(snapshot2.val().photo)
                this.publicInfo = {
                    username: snapshot2.val().username,
                    helpText: snapshot2.val().helpText,
                    photo: photo
                }
            } else {
                await set(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
                    username: email,
                    photo: {
                        src: '',
                        fullPath: '',
                        name: ''
                    },
                    helpText: ''
                })
                await set(refDB(getDatabase(), `${localStorage.getItem('userId')}/nalog`), {
                    useMyTaxOption: false,
                    token: ''
                })
            }

            location.reload()

        } catch (e) {
            this.error = JSON.stringify(e)
            console.log(this.error)
        }
    }

    autoLogin = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            await this.logout()
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                await this.logout()
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
            await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
                username: username,
            })
        } catch (e) {
            this.error = e
        }
    }

    updateHelpText = async (text) => {
        try {
            this.error = null
            await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
                helpText: text,
            })
        } catch (e) {
            this.error = e
        }
    }

    updatePhotoUrl = async (photo) => {
        try {
            this.error = null

            if (photo) {
                const storageRef = ref(getStorage(), `${localStorage.getItem('userId')}/profile/${photo.name}`);
                await uploadBytes(storageRef, photo)

                const src = await getDownloadURL(ref(getStorage(), storageRef.fullPath))

                await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
                    photo: {
                        src: src,
                        fullPath: storageRef.fullPath,
                        name: storageRef.name
                    }
                })

            } else {
                await deleteObject(ref(getStorage(), this.publicInfo.photo.fullPath))
                await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/info`), {
                    photo: {
                        src: '',
                        fullPath: '',
                        name: ''
                    }
                })
            }

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

            await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/nalog`), {
                useMyTaxOption: true,
                token: nalogToken
            });
            // await this.updateCheckMyTaxOption(true)
        } catch (e) {
            this.error = e
        }
    }

    resetCheckMyTaxOption = async () => {
        try {
            this.error = null
            await update(refDB(getDatabase(), `${localStorage.getItem('userId')}/nalog`), {
                useMyTaxOption: false,
                token: ''
            });
        } catch (e) {
            this.error = e
        }
    }

    loadMyTaxOption = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(getDatabase()), `${localStorage.getItem('userId')}/nalog`))

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