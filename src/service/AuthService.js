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
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import NalogAPI from "moy-nalog";
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
        this.startUrl = localStorage.getItem('userId') || ''
        this.token = localStorage.getItem('token') || ''
        this.error = null
        this.profile = null
        this.nalogInfo = {
            useMyNalogOption: false,
            refreshToken: '',
            incomeName: '',
            inn: '',
            deviceId: ''
        }
        this.publicInfo = {
            username: '',
            photo: new Photo(),
            helpText: ''
        }
        this.nalogApi = new NalogAPI({autologin: false})

        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                this.profile = user
            } else {
                await this.logout()
                console.log('User is signed out')
            }
        });

        onValue(refDB(getDatabase(), `${this.startUrl}/info`), snapshot => {
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

        onValue(refDB(getDatabase(), `${this.startUrl}/nalog`), snapshot => {
            if (snapshot.exists()) {
                console.log('this.nalogInfo updated')
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
            localStorage.setItem('token', this.token)
            localStorage.setItem('userId', response.user.uid)
            this.startUrl = localStorage.getItem('userId')

            if (isLogin) {
                const snapshot = await get(child(refDB(getDatabase()), `${this.startUrl}/nalog`))
                this.nalogInfo = snapshot.val()
                const snapshot2 = await get(child(refDB(getDatabase()), `${this.startUrl}/info`))
                const photo = new Photo()
                photo.init(snapshot2.val().photo)
                this.publicInfo = {
                    username: snapshot2.val().username,
                    helpText: snapshot2.val().helpText,
                    photo: photo
                }
                this.nalogApi.refreshToken = this.nalogInfo.trefreshTokenoken
            } else {
                await set(refDB(getDatabase(), `${this.startUrl}/info`), {
                    username: email,
                    photo: {
                        src: '',
                        fullPath: '',
                        name: ''
                    },
                    helpText: ''
                })
                await set(refDB(getDatabase(), `${this.startUrl}/nalog`), {
                    useMyNalogOption: false,
                    refreshToken: '',
                    incomeName: '',
                    inn: '',
                    deviceId: ''
                })
            }

            location.reload()

        } catch (e) {
            this.error = JSON.stringify(e)
        }
    }

    updateUsername = async (username) => {
        try {
            this.error = null
            await updateProfile(getAuth().currentUser, {
                displayName: username
            })
            await update(refDB(getDatabase(), `${this.startUrl}/info`), {
                username: username,
            })
        } catch (e) {
            this.error = e
        }
    }

    updateHelpText = async (text) => {
        try {
            this.error = null
            await update(refDB(getDatabase(), `${this.startUrl}/info`), {
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
                const storageRef = ref(getStorage(), `${this.startUrl}/profile/${photo.name}`);
                await uploadBytes(storageRef, photo)

                const src = await getDownloadURL(ref(getStorage(), storageRef.fullPath))

                await update(refDB(getDatabase(), `${this.startUrl}/info`), {
                    photo: {
                        src: src,
                        fullPath: storageRef.fullPath,
                        name: storageRef.name
                    }
                })

            } else {
                await deleteObject(ref(getStorage(), this.publicInfo.photo.fullPath))
                await update(refDB(getDatabase(), `${this.startUrl}/info`), {
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

    updateUserEmail = async (newEmail, password) => {
        try {
            this.error = null
            await signInWithEmailAndPassword(getAuth(), getAuth().currentUser.email, password)
            await updateEmail(getAuth().currentUser, newEmail)
        } catch (e) {
            this.error = e
        }
    }

    updateUserPassword = async (newPassword, password) => {
        try {
            this.error = null
            await signInWithEmailAndPassword(getAuth(), getAuth().currentUser.email, password)
            await updatePassword(getAuth().currentUser, newPassword)
        } catch (e) {
            this.error = e
        }
    }

    deleteUserAccount = async (password) => {
        try {
            this.error = null
            await signInWithEmailAndPassword(getAuth(), getAuth().currentUser.email, password)
            await remove(refDB(getDatabase(), `${this.startUrl}`))
            await deleteUser(getAuth().currentUser)
            location.reload()
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

    loginToMyNalog = async (login, password) => {
        try {
            this.error = null

            await this.nalogApi.auth(login, password)
            await update(refDB(getDatabase(), `${this.startUrl}/nalog`), {
                useMyNalogOption: true,
                refreshToken: this.nalogApi.refreshToken,
                inn: login,
                deviceId: this.nalogApi.sourceDeviceId
            });
        } catch (e) {
            this.error = e
        }
    }

    resetCheckMyNalogOption = async () => {
        try {
            this.error = null
            await update(refDB(getDatabase(), `${this.startUrl}/nalog`), {
                useMyNalogOption: false,
                refreshToken: '',
                inn: '',
                deviceId: ''
            });
        } catch (e) {
            this.error = e
        }
    }

    loadMyNalogOption = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(getDatabase()), `${this.startUrl}/nalog`))

            if (snapshot.exists()) {
                this.nalogInfo.useMyNalogOption = snapshot.val().useMyNalogOption
            }

        } catch (e) {
            this.error = e
        }
    }

    editIncomeName = async (newIncomeName) => {
        try {
            this.error = null

            await update(refDB(getDatabase(), `${this.startUrl}/nalog`), {
                incomeName: newIncomeName,
            });
        } catch (e) {
            this.error = e
        }
    }


    logout = async () => {
        try {
            this.error = null
            await signOut(this.getAuth)

            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            this.token = null

        } catch (e) { this.error = null }
    }

    refreshToken = () => {
        
    }

}

export default new AuthService()