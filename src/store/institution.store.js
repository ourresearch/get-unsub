import {api} from "../api";
import {roleFromPermissions, permissionsFromRole, roles} from "../shared/userPermissions";
import {sleep} from "../shared/util";
import _ from "lodash"

export const institution = {
    state: {
        institutionId: null,
        institutionGridIds: [],
        institutionRorIds: [],
        institutionName:"",
        institutionUsers: [],
        institutionPublishers: [],
        isDemo: false,
    },
    mutations: {
        clearInstitution(state){
            state.institutionId =  null
            state.institutionGridIds =  []
            state.institutionRorIds =  []
            state.institutionName = ""
            state.institutionUsers =  []
            state.institutionPublishers =  []
            state.userIsAdmin = false
            state.isDemo = false
        },
        setInstitutionFromApiResp(state, apiResp){
            state.institutionId =  apiResp.id
            state.institutionGridIds =  apiResp.grid_ids.filter(g => !!g)
            state.institutionRorIds =  apiResp.ror_ids.filter(g => !!g)
            state.institutionName = apiResp.name
            state.institutionUsers = apiResp.user_permissions
            state.institutionUsers.forEach(user => {
            });
            state.institutionPublishers = apiResp.publishers
            state.isDemo = apiResp.is_demo

        },
        setUserPermissions(state, {email, permissions}) {
            console.log("setUserPermissions", email, permissions)
            const myUser = state.institutionUsers.find((u) => u.user_email === email)
            myUser.permissions = permissions
        },
        addUserPermission(state, addUserPermission){
            state.institutionUsers.push(addUserPermission)
        },
    },
    actions: {
        async fetchInstitution({commit, dispatch, getters}, id) {
            if (getters.institutionName) return
            const resp = await  api.get(`institution/${id}`)
            commit("setInstitutionFromApiResp", resp.data)
        },
        async setUserPermissions({commit, dispatch, getters}, {email, permissions}) {
            const myUser = getters.institutionUsers.find((u) => u.user_email === email)

            commit("setUserPermissions", {email, permissions})

            console.log("setUserPermissions", email, permissions, myUser)
            const url = `user-permissions?user_id=${myUser.user_id}&institution_id=${getters.institutionId}`
            const data = {permissions: permissions}
            const resp = await  api.post(url, data)
            return resp
        },
        async createGroupMember({commit, dispatch, getters}, {email, name, password, role}) {
            if (!password) password = ""
            if (!role) role = "Viewer"

            const newPermissionsObject = {
                user_email: email,
                user_name: name,
                institution_id: getters.institutionId,
                permissions:  permissionsFromRole(role),
            }
            commit("addUserPermission", newPermissionsObject)

            const newUser = {
                email,
                name,
                password,
                user_permissions: [
                    newPermissionsObject
                ]
            }
            const resp = await  api.post("user/new", newUser)
            return resp
        },

        async createPublisher({commit, dispatch, getters}, {publisherId, name}) {
            const url = "/publisher/new"
            const data = {
                name,
                publisher: publisherId,
                institution_id: getters.institutionId,
            }
            const resp = await api.post(url, data)
            console.log("got response from createPublisher call", resp)
            commit("addPublisher", {id: resp.data.id, name: resp.data.name})
            return resp
        },
    },
    getters: {
        institutionId: (state) => state.institutionId,
        institutionGridIds: (state) => state.institutionGridIds,
        institutionRorIds: (state) => state.institutionRorIds,
        institutionName: (state) => state.institutionName,
        institutionUsersWithRoles: (state) => {
            return state.institutionUsers.map(user => {
                const ret = {
                    ...user,
                    roles: roles,
                    role: roleFromPermissions(user.permissions),

                }
                return ret
            })
        },
        institutionIsLoading: (state) => state.institutionPublishers.length === 0,
        institutionPublishers: (state) => state.institutionPublishers,
        institutionUsers: (state) => state.institutionUsers,
        institutionIsDemo: (state) => state.isDemo,
    }
}




