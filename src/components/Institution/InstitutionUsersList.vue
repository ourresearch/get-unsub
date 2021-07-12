<template>
    <v-card flat>
<!--        <v-card-title class="pr-4 align-baseline">-->
<!--            <div>-->
<!--                Group members <span class="body-2">({{institutionUsersWithRoles.length}})</span>-->
<!--            </div>-->
<!--        </v-card-title>-->
        <v-list>
            <institution-user-row
                    v-for="person in institutionUsersWithRoles"
                    :key="person.user_email"
                    :person="person"
                    :my-role="myRole"
            />
            <v-list-item v-if="iCanAddGroupMembers" @click="openCreateGroupMemberDialog">
                <v-list-item-avatar>
                    <v-icon>mdi-plus</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="body-2 text--secondary">
                    New group member
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-dialog v-model="dialogs.createGroupMember" max-width="400" persistent>
            <v-card v-if="dialogs.createGroupMember">
                <v-card-title class="headline">
                    Add group member
                </v-card-title>
                <v-card-text class="pt-4">
                    <v-form
                            ref="newGroupMemberForm"
                            v-model="newGroupMemberFormIsValid"
                    >
                        <v-text-field
                                autofocus
                                outlined
                                clearable
                                type="email"
                                label="Email"
                                @keydown.enter="createGroupMember"
                                v-model="newGroupMember.email"
                                prepend-icon="mdi-email-outline"
                                :rules="emailRules"
                        />
                        <v-select
                                outlined
                                label="Role"
                                v-model="newGroupMember.role"
                                :items="rolesICanAssign"
                                prepend-icon="mdi-account-key-outline"
                                :hint="roleDescriptions[newGroupMember.role]"
                                persistent-hint
                        />
                        <div class="mt-6 d-flex">
                            <v-icon class="mr-3">mdi-email-send-outline</v-icon>
                            When you create this user, we'll send them an automated welcome email.
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions class="">
                    <v-spacer/>
                    <v-btn depressed
                           @click="dialogs.createGroupMember = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="createGroupMember"
                           color="primary"
                           :disabled="!newGroupMemberFormIsValid"
                    >
                        Create group member
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </v-card>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import {roleDescriptions, roles} from "../../shared/userPermissions";
    import InstitutionUserRow from "./InstitutionUserRow";

    const shortUuid = require('short-uuid');

    export default {
        name: "InstitutionUsersList",
        components: {
            InstitutionUserRow,
        },
        props: {
            myRole: String,
        },
        data() {
            return {
                roles,
                roleDescriptions,
                newGroupMember: {
                    name: "",
                    email: "",
                    password: "",
                    role: "Collaborator",
                },
                newGroupMemberFormIsValid: true,
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /^\S+@\S+\.\S+$/.test(v) || 'E-mail must be valid',
                ],
                dialogs: {
                    createGroupMember: false,
                }
            }
        },
        methods: {
            ...mapMutations([
                "snackbar",
            ]),
            async createGroupMember() {
                this.snackbar("New user created, and welcome email sent.")
                this.dialogs.createGroupMember = false
                await this.$store.dispatch("createGroupMember", this.newGroupMember)
            },
            openCreateGroupMemberDialog() {
                this.newGroupMember.password = shortUuid.generate().slice(0, 8)
                this.dialogs.createGroupMember = true
            },
        },
        computed: {
            ...mapGetters([
                'institutionId',
                'institutionName',
                'institutionIsDemo',
                "institutionIsConsortium",
                "institutionUsersWithRoles",
                'userConsortia',
                'userInstitutions',
            ]),


            iCanAddGroupMembers() {
                return ['ConsortiumAdmin', 'Admin'].includes(this.myRole)
            },


            // this is copy-pasted from InstitutionUserRow, which is not ideal.
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