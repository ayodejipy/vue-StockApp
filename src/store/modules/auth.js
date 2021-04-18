/* eslint-disable prettier/prettier */
// import Stocks from "../data/data";
import axios from "axios";
import router from "../../router";

const state = {
    user: null,
    userId: null,
    idToken: null
};

const getters = {
    isAuthenticated: (state) => {
        return state.idToken !== null;
    },
    getUserID: ( state ) => {
        return state.userId;
    },
    getUser: ( state ) => {
        return state.user;
    }
};

const mutations = {
    authenticateUser: (state, userData) => {
        // To authenticate our user, we need to have the user ID and the auth ID, which are all passed in the userData object, basically save user info
        state.userId = userData.userId;
        state.idToken = userData.idToken;
    },
    storeUser: (state, user) => {
        // We need to store the user to our state, hence we're passing user as an argument here
        state.user = user;
    },
    clearAuthData: (state) => {
        state.user = null,
        state.userId = null,
        state.idToken = null
    }
};

const actions = {
    signUp: ({ commit, dispatch }, userData) => {
        const api_key = process.env.VUE_APP_FIREBASE_API_KEY;
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`, {
            email: userData.email,
            password: userData.password,
            returnSecureToken: true
        })
        .then( res => {
            // After post userdata to DB, we need to store it in our state. We need to commit our authenticateUser mutation
            console.log(res.data);
            console.log("Auth Data", userData);
            
            const authData = {
                idToken: res.data.idToken,
                userId: res.data.localId
            }
            commit('authenticateUser', authData);
            localStorage.setItem('token', res.data.idToken)
            localStorage.setItem('email', res.data.email)
            localStorage.setItem('user-id', res.data.localId)

            // Dispatch action to send details to the database, do not send password
            const DataToDB = {
                email: userData.email,
                name: userData.name,
            }
            dispatch('sendDataToDB', DataToDB)

            setTimeout(function() {
                router.push('/stocks')
            }, 1000)
        })
        .catch( error => {
            console.log(error);
        })
    },
    sendDataToDB: ({ state }, userInfo) => {
        if( !state.idToken ) return
        axios.put('/users/' + state.userId + '.json' + '?auth=' + state.idToken, userInfo)
        .then(res => console.log("Sending Data: ", res))
        .catch( error => console.log(error))
    },
    signIn: ({ commit }, userData) => {
        const api_key = process.env.VUE_APP_FIREBASE_API_KEY;
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`, {
            email: userData.email,
            password: userData.password,
            returnSecureToken: true
        })
        .then( res => {
            // After login, store user ID and token in our state. We need to commit our authenticateUser mutation
            console.log(res.data);
            const authData = {
                idToken: res.data.idToken,
                userId: res.data.localId
            }
            commit('authenticateUser', authData);
            // Save these credentials to localStorage so we can have access to it later on our Frontend
            localStorage.setItem('token', res.data.idToken)
            localStorage.setItem('email', res.data.email)
            localStorage.setItem('user-id', res.data.localId)

            router.push('/stocks')
        })
        .catch( error => {
            console.log(error);
        })
    },
    signout: ({ commit }) => {
        commit('clearAuthData')
        // Delete off our credentials from localStorage, done this in our header 
        // localStorage.removeItem('token')
        // localStorage.removeItem('user-id')
        // localStorage.removeItem('email')

        router.replace('/signin')
    },
    autoLogin: ({ commit }) => {
        const token = localStorage.getItem('token');
        if(!token) return;

        const userId = localStorage.getItem('user-id');
        const userToken = localStorage.getItem('token');
        // console.log(userId, " - ", userToken)
        commit('authenticateUser', {
            userId: userId,
            idToken: userToken
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};