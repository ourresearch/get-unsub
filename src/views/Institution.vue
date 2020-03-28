<template>
    <v-container class="institution">
        <div class="page-title mt-8 mb-4">
            <div class="body-2">
                <v-icon small>mdi-bank</v-icon>
                Institution
            </div>
            <div class="display-2">
                {{ institutionName }}
            </div>
        </div>

        <v-row>
            <v-col cols="4">
                <v-card>
                    <v-card-title>
                        <div>
                            Institution details
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-bank</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="">
                                    {{ institutionName }}
                                </div>
                                <v-list-item-subtitle>
                                    Name
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                    </v-list>

                    <v-card-title class="pr-4 mt-10">
                        <div>
                            GRID IDs <span class="body-2">({{institutionGridIds.length}})</span>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon>mdi-help-circle-outline</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list dense>
                        <v-list-item
                                v-for="gridId in institutionGridIds"
                                :v-key="gridId"
                        >
                            <v-list-item-avatar>
                                <v-icon>mdi-map-marker-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="" v-html="gridId"/>

                                <v-list-item-subtitle v-if="/example|424899|433631/.test(gridId)">
                                    (demo ID)
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon :href="`https://www.grid.ac/institutes/${gridId}`" target="_blank">
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-btn>
                            </v-list-item-action>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item @click="dialogs.addGridId = true">
                            <v-list-item-avatar>
                                <v-icon>mdi-plus</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="body-2 text--secondary">
                                New GRID ID
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>


                    <v-card-title class="pr-4 mt-10">
                        <div>
                            Group members <span class="body-2">({{institutionUsersWithRoles.length}})</span>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon>mdi-help-circle-outline</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list>
                        <v-list-item
                                v-for="person in institutionUsersWithRoles"
                                :v-key="person.email"
                        >
                            <v-list-item-avatar>
                                <v-icon>mdi-account-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="">
                                    <span v-if="person.user_name">
                                        {{person.user_name}}
                                        <span class="you" v-if="person.user_id === userId">(you)</span>
                                    </span>
                                    <span v-if="!person.user_name">Nameless Person</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{person.user_email}}
                                </v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action v-if="!userIsAdmin">
                                {{person.role}}
                            </v-list-item-action>

                            <v-list-item-action v-if="userIsAdmin">
                                <v-menu>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                text
                                                small
                                                v-on="on"
                                        >
                                            {{roleFromPermissions(person.permissions)}}
                                            <v-icon>mdi-menu-down</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list v-if="!person.is_authenticated_user">
                                        <v-list-item
                                                v-for="role in roles"
                                                :key="role"
                                                @click="setRole(person.user_email, role)"
                                        >
                                            <v-list-item-content>
                                                {{role}}
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                    <v-list v-if="person.is_authenticated_user">
                                        <v-list-item @click="">
                                            <v-list-item-content>
                                                Admin
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item
                                                v-for="role in roles.filter(r => r !== 'Admin')"
                                                :key="role"
                                        >
                                            <v-list-item-content class="text--disabled">
                                                {{role}}
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>


                                <!--                                <span class="admin"></span>-->
                                <!--                                <v-btn icon>-->
                                <!--                                    <v-icon>mdi-pencil</v-icon>-->
                                <!--                                </v-btn>-->
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item v-if="userIsAdmin" @click="dialogs.createGroupMember = true">
                            <v-list-item-avatar>
                                <v-icon>mdi-plus</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="body-2 text--secondary">
                                New group member
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col cols="8">
                <v-card>
                    <v-card-title>
                        <div>
                                Publishers
                                <span class="body-2">({{institutionPublishers.length}})</span>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list>
                        <v-list-item
                                v-for="pub in institutionPublishers"
                                :v-key="pub.id"
                                :to="`/i/${institutionId}/p/${pub.id}`"
                        >
                            <v-list-item-avatar tile size="50">
                                <!--                                <v-icon class="mr-2">mdi-book-multiple</v-icon>-->
                                <v-img src="https://i.imgur.com/Qt1sOqp.png"></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title class="headline font-weight-bold">
                                    {{pub.name}}
                                </v-list-item-title>

                                <v-list-item-subtitle v-if="pub.is_demo">
                                    Demo publisher; some functionality restricted
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn text>view</v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item @click="" :disabled="true">
                            <v-list-item-avatar size="50">
                                <v-btn icon>
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title class="body-2 text--secondary">
                                    New publisher
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                    </v-list>
                    <v-card-text
                            v-if="false"
                            class="mt-6"
                            style="height: 100px; position: relative; background: #fff; border-top:1px solid #ddd;"
                    >
                        <v-btn
                                absolute
                                light
                                small
                                fab
                                top
                                right
                                color="white"
                                @click="showSnackbarNoPermissions = true"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-text>


                </v-card>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbars.roleUpdated" bottom left>
            User role updated.
            <v-btn dark icon @click="snackbars.roleUpdated = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

        <v-snackbar v-model="snackbars.newGroupMember" bottom left>
            New group member created.
            <v-btn dark icon @click="snackbars.newGroupMember = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


        <v-dialog v-model="dialogs.createGroupMember" max-width="400" persistent>
            <v-card v-if="dialogs.createGroupMember">
                <v-card-title class="headline">
                    Add group member
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        <v-text-field
                                outlined
                                type="text"
                                label="Name"
                                v-model="newGroupMember.name"
                        />
                        <v-text-field
                                outlined
                                type="email"
                                label="Email"
                                v-model="newGroupMember.email"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn depressed
                           @click="dialogs.createGroupMember = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="createGroupMember"
                           color="primary"
                           :disabled="!(newGroupMember.name && newGroupMember.email)"
                    >
                        Create group member
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogs.addGridId" max-width="400" persistent>
            <v-card v-if="dialogs.addGridId">
                <v-card-title class="headline">
                    Add GRID ID
                </v-card-title>
                <v-card-text class="pt-4">
                    Coming soon...
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn depressed
                           @click="dialogs.addGridId = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click=""
                           color="primary"
                    >
                        Add GRID ID
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {roleFromPermissions, permissionsFromRole, roles} from "../shared/userPermissions";

    export default {
        name: "Institution",
        components: {},
        data() {
            return {
                snackbars: {
                    newGroupMember: false,
                    roleUpdated: false
                },
                dialogs: {
                    createGroupMember: false,
                    addGridId: false,
                },

                roles,
                roleFromPermissions,
                permissionsFromRole,

                newGroupMember: {
                    name: "",
                    email: "",
                },

                isRoleUpdating: false,
            }
        },
        computed: {
            ...mapGetters([
                "institutionName",
                "institutionGridIds",
                "institutionPublishers",
                "institutionUsersWithRoles",
                "userId",
            ]),
            institutionId() {
                return this.$route.params.institutionId
            },
            userIsAdmin() {
                const authenticatedUserPermissisonObject = this.institutionUsersWithRoles.find(u => {
                    return u.user_id === this.userId
                })
                return authenticatedUserPermissisonObject && authenticatedUserPermissisonObject.role === "Admin"
            },

        },
        methods: {
            ...mapMutations([]),
            ...mapActions([]),
            async setRole(email, role) {
                console.log("set role", email, role)
                this.isRoleUpdating = true
                const permissions = permissionsFromRole(role)
                try {
                    await this.$store.dispatch("setUserPermissions", {email, permissions})
                } catch (e) {

                }
                this.isRoleUpdating = false
                this.snackbars.roleUpdated = true
            },
            async createGroupMember() {
                await this.$store.dispatch("createGroupMember", this.newGroupMember)
                this.snackbars.newGroupMember = true
                this.dialogs.createGroupMember = false

            }

        },
        mounted() {
            console.log("Institution mount up!", this.institutionId)
            this.$store.commit("clearPublisher")
            this.$store.dispatch("fetchInstitution", this.institutionId)
        },
        destroyed() {
            // this.$store.commit("clearInstitution")

        }
    }
</script>

<style scoped>

</style>