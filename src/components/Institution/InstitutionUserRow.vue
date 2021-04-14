<template>
    <v-list-item>
        <v-list-item-avatar>
            <v-icon>mdi-account-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title class="">
                {{person.user_email}}
                <span class="you" v-if="person.user_id === userId">(you)</span>
            </v-list-item-title>
            <v-list-item-subtitle>
                <span class="font-weight-bold">
                    {{ person.role }}
                </span>
            </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action v-if="iCanEdit">
            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn
                            icon
                            v-on="on"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-subheader class="body-2 text--secondary pa-1">Select role</v-subheader>
                    <v-list-item
                            v-for="role in rolesICanAssign"
                            :key="role"
                            @click="setRole(person.user_email, role)"
                    >
                        <v-list-item-title>
                            {{role}}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>


            <!--                                <span class="admin"></span>-->
            <!--                                <v-btn icon>-->
            <!--                                    <v-icon>mdi-pencil</v-icon>-->
            <!--                                </v-btn>-->
        </v-list-item-action>
    </v-list-item>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import {roleFromPermissions, permissionsFromRole, roleDescriptions, roles} from "../../shared/userPermissions";

    export default {
        name: "InstitutionUsersTab",
        components: {},
        props: {
            myRole: String,
            person: Object,
        },
        data() {
            return {
                isRoleUpdating: false,
                roles,
            }
        },
        methods: {
            ...mapMutations([
                "snackbar",
            ]),
            async setRole(email, role) {
                console.log("set role", email, role)
                this.isRoleUpdating = true
                const permissions = permissionsFromRole(role)
                try {
                    await this.$store.dispatch("setUserPermissions", {email, permissions})
                } catch (e) {

                }
                this.isRoleUpdating = false
                this.snackbar("User role updated.")
            },
        },
        computed: {
            ...mapGetters([
                'isLandingPage',
                'isLoggedIn',

                "userId",
                "userName",
                "userEmail",

                'institutionId',
                'institutionName',
                'institutionIsDemo',
                "institutionIsConsortium",
                "institutionUsersWithRoles",
                'userConsortia',
                'userInstitutions',

                'publisherId',
                'publisherName',
                'institutionPublishers',
                'publisherPublisher',
                'publisherIsOwnedByConsortium',

                'scenarioId',
                'scenarioName',
                'publisherScenarios',
                'selectedScenarioIsLoading',

            ]),
            iCanEdit() {
                console.log("my role is", this.myRole)

                // some roles are not allowed to edit anyone
                let iCanEdit = false

                // admins can edit people
                // ConsortiumAdmin can edit anyone
                if (this.myRole === "ConsortiumAdmin") iCanEdit = true

                // regular admin can edit anyone EXCEPT ConsortiumAdmins
                else if (this.myRole === "Admin" && this.person.role !== "ConsortiumAdmin") iCanEdit = true

                // you can't edit your own role
                if (this.person.user_id === this.userId) iCanEdit = false

                return iCanEdit
            },
            rolesICanAssign() {
                if (this.myRole === "ConsortiumAdmin") {
                    return this.roles  // everything
                } else if (this.myRole === "Admin") {
                    return this.roles.filter(roleName => {
                        return roleName !== "ConsortiumAdmin" // everything EXCEPT ConsortiumAdmin
                    })
                } else {
                    return [] // only admins can assign roles.
                }
            },
        },
        created() {
        },
        mounted() {
        },
        watch: {
            "foo": {
                immediate: true,
                handler: function (to, from) {
                }
            }
        }
    }
</script>

<style lang="scss">


</style>