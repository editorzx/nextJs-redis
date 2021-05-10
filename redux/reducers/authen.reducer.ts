import { LOGIN,CLEAR,SET } from '../types';
import React, { ReactElement } from 'react'

const initialState = {
    token: null,
    user:  null,
    sidebarShow: 'responsive'
}

const initxState = () => {
    return {
        token : JSON.parse(localStorage.getItem('token')) || null,
        user : JSON.parse(localStorage.getItem('user')) || "5558",
        sidebarShow: 'responsive'
    }
}

export default (state = initxState, { type, payload }) => {
    switch (type) {
		case LOGIN:
			return { 
					...state, 
					token: payload.token, 
					user: {
						tel: payload.user.tel, 
						name: payload.user.name, 
						uid: payload.user.uid, 
						position : payload.user.position
					} 
				}
		
		case CLEAR:
			return initialState
		case SET:
			return {...state, ...payload }
    default:
        return state
    }
}
