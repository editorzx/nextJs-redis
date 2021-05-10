import { useRouter } from 'next/dist/client/router';
import { Account } from './../../types/Accounts';
import { LOGIN, CLEAR } from './../types';

const setLoginReducer = (payload) => ({
    type: LOGIN,
    payload
})

const clearLoginReducer = () => ({
    type: CLEAR
})

const login = ({tel, name, uid, position}:Account) => {
    return dispatch=>{
        setTimeout(() => {
            const randtoken = Math.random().toString()
            dispatch(setLoginReducer({ token : randtoken, user:{tel, name, uid, position} }))
            localStorage.setItem('token', JSON.stringify(randtoken))
            localStorage.setItem('user', JSON.stringify({tel, name, uid, position}))
        }, 2000);
    }
}

const clear = () => {
    return dispatch=> {
        dispatch(clearLoginReducer())
    }
}

export default {
    login,
    clear
}