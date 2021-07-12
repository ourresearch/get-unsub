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
        institutionConsortialProposalSets: [],
        institutionPublishersLive: [],
        isDemo: false,
        isConsortium: false,
        tabShowing: 0,
        isJisc: false,
    },
    mutations: {
        clearInstitution(state){
            state.institutionId =  null
            state.institutionGridIds =  []
            state.institutionRorIds =  []
            state.institutionName = ""
            state.institutionUsers =  []
            state.institutionPublishers =  []
            state.institutionPublishersLive = []
            state.institutionConsortialProposalSets = []
            state.userIsAdmin = false
            state.isDemo = false
            state.isConsortium = false
            state.tabShowing = 0
            state.isJisc = false
        },
        setInstitutionFromApiResp(state, apiResp){
            state.institutionId =  apiResp.id
            state.institutionGridIds =  apiResp.grid_ids.filter(g => !!g)
            state.institutionRorIds =  apiResp.ror_ids.filter(g => !!g)
            state.institutionName = apiResp.name
            state.institutionUsers = apiResp.user_permissions
            apiResp.publishers.forEach(p => {
                state.institutionPublishers.push(p)
                if (!p.is_deleted) state.institutionPublishersLive.push(p)
            })
            state.institutionConsortialProposalSets = apiResp.consortial_proposal_sets
            state.isDemo = apiResp.is_demo
            state.isConsortium = apiResp.is_consortium
            state.isJisc = apiResp.is_jisc
            if (apiResp.id === "institution-testinggWwB9iSCivMt") {
                state.isJisc = true
            }


        },
        setUserPermissions(state, {email, permissions}) {
            console.log("setUserPermissions", email, permissions)
            const myUser = state.institutionUsers.find((u) => u.user_email === email)
            myUser.permissions = permissions
        },
        addUserPermission(state, addUserPermission){
            state.institutionUsers.push(addUserPermission)
        },
        setPublisherDeleted(state, id){
            console.log("setPublisherDeleted", id)
            const myIndex = state.institutionPublishersLive.findIndex(p => p.id === id)
            if (myIndex < 0) return
            state.institutionPublishersLive.splice(myIndex, 1)
        },
        addPublisher(state, publisherObject){
            state.institutionPublishers.push(publisherObject)
            state.institutionPublishersLive.push(publisherObject)
        },
        setInstitutionTabShowing(state, newTab){
            state.tabShowing = newTab
        },
        setInstitutionId(state, id){
            state.institutionId = id
        },
    },
    actions: {
        async fetchInstitution({commit, dispatch, getters}, id) {
            if (getters.institutionId === id) return
            commit("clearInstitution")
            commit("setInstitutionId", id)
            const resp = await  api.get(`institution/${id}`)
            commit("clearInstitution")
            commit("setInstitutionFromApiResp", resp.data)
        },
        async refreshInstitution({commit, dispatch, getters}) {
            const resp = await  api.get(`institution/${getters.institutionId}`)
            commit("clearInstitution")
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

        async createPublisher({commit, dispatch, getters}, {publisher, name}) {
            const url = "publisher/new"
            const data = {
                name,
                publisher,
                institution_id: getters.institutionId,
            }
            const resp = await api.post(url, data)
            console.log("got response from createPublisher call", resp)
            commit("addPublisher", {id: resp.data.id, publisher, name: resp.data.name})
            return resp
        },

        async deletePublisher({commit, dispatch, getters}, id) {
            const url = `publisher/${id}`
            const data = {is_deleted: true}
            console.log("deletePublisher", url, data)
            const resp = await  api.post(url, data)
            commit("setPublisherDeleted", id)
            return resp
        },
        async renamePublisher({commit, dispatch, getters}, {publisherId, name}) {
            const url = `publisher/${publisherId}`
            const data = {name}
            const resp = await  api.post(url, data)
            await dispatch("refreshInstitution")
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
            }).filter(u => {
                if (!u.user_email) return true
                return u.user_email.indexOf("@ourresearch.org") === -1
            })
        },
        institutionIsLoading: (state) => !state.institutionName,
        institutionPublishers: (state) => state.institutionPublishersLive,
        institutionOwnPublishers: (state) => state.institutionPublishersLive.filter(p => !p.is_owned_by_consortium),
        institutionConsortialFeederPublishers: (state) => state.institutionPublishersLive.filter(p => p.is_owned_by_consortium),
        institutionConsortialProposalSets: (state) => state.institutionConsortialProposalSets,
        institutionUsers: (state) => state.institutionUsers,
        institutionIsDemo: (state) => state.isDemo,
        institutionIsConsortium: (state) => state.isConsortium,
        institutionTabShowing: (state) => state.tabShowing,
        institutionIsJisc: (state) => state.isJisc,
    }
}




