import { AnyAction, createReducer } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { createContext } from 'react';


interface IPageState {
    user: {
        tel: string
        name: string
		uid: string
		position: number
    }
   /* product: {
        id: number
    }*/
}

export const initState: IPageState = {
    user: { 
        tel: typeof window !== "undefined" ? localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem('user')).tel : "" : "",
		name: typeof window !== "undefined" ? localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem('user')).name : "" : "", 
		uid: typeof window !== "undefined" ? localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem('user')).uid : "" : "", 
		position: typeof window !== "undefined" ? localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem('user')).position : 0 : 0
    },
   /* product: {
		id: 0,  
    },*/

}

export const reducer = createReducer<IPageState>(initState, {
    setUser: (state: IPageState, action) => { state.user = { ...state.user, ...action.payload } },
    clearUser: (state: IPageState)=>{state.user = {...initState.user}},
});

interface IProjectContext {
    stateMain?: IPageState,
    dispatchMain?: React.Dispatch<AnyAction>,
}

export const ProjectContext = createContext<IProjectContext>({});
export const SelectRowContext = createContext<any>({});
export default ProjectContext;