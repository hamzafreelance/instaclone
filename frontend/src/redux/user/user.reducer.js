const INITIAL_STATE = {
    token: null,
    name: null,
    email: null,
    id: null,
    loggedIn: false,
    registered: false,
    following: [],
    followers: [],
    errors: []
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'GET_USER':
            return {
                ...state
            };
            break;
        case 'SET_USER':
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
                token: action.payload.token,
                name: action.payload.name,
                email: action.payload.email,
                id: action.payload.id,
                errors: []
            };
            break;
        case 'SET_USER_FOLLOWING':
                return {
                    ...state,
                    following: action.payload
                };
                break;
        case 'USER_ERRORS':
            return {
                ...state,
                errors: action.payload
            };
            break;           
        default:
            return state;
    }
};

export default userReducer;
