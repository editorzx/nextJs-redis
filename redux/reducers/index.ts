import { combineReducers } from 'redux'
import authenReducer from './authen.reducer'

const rootReducer = combineReducers({
  //  authentication: authReducer,
  authenReducer,
})

export default rootReducer