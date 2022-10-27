import {api} from "../api";

export const admin = {
    state: {
        tabShowing: 0,
    },
    mutations: {
        setAdminTabShowing(state, newTab){
            state.tabShowing = newTab
        },
    },
    actions: {
    },
    getters: {
        adminTabShowing: (state) => state.tabShowing,
    }
}




