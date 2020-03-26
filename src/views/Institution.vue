<template>
    <v-container class="institution">
        <div class="display-2 my-8">
            <v-icon x-large>mdi-bank</v-icon>
            {{ institutionName }}
        </div>
        <v-row>
            <v-col cols="5">
                <v-card>
                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-content>
                                <div class="display-1">
                                    {{ institutionName }}
                                </div>
                                <v-list-item-subtitle>
                                    Name
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                    </v-list>
                </v-card>
                <v-card class="mt-4">
                    <v-toolbar dark color="#555">
                        <v-icon class="d-none">mdi-bank</v-icon>
                        <v-toolbar-title>
                            GRID IDs <span class="body-2">({{institutionGridIds.length}})</span>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogs.addGridId = true">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn icon>
                            <v-icon>mdi-help-circle-outline</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-list>
                        <v-list-item
                                v-for="gridId in institutionGridIds"
                                :v-key="gridId"
                        >
                            <v-list-item-content>
                                <v-list-item-title class="" v-html="gridId"/>

                                <v-list-item-subtitle v-if="/example|424899|433631/.test(gridId)">
                                    (demo ID)
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>

                <v-card class="mt-4" :loading="isRoleUpdating">
                    <v-toolbar dark color="#555">
                        <v-icon class="d-none">mdi-bank</v-icon>
                        <v-toolbar-title>
                            Group members <span class="body-2">({{institutionUsersWithRoles.length}})</span>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogs.createGroupMember = true">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn icon>
                            <v-icon>mdi-help-circle-outline</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-list>
                        <v-list-item
                                v-for="person in institutionUsersWithRoles"
                                :v-key="person.email"
                        >
                            <v-list-item-content>
                                <v-list-item-title class="">
                                    <span v-if="person.user_name">{{person.user_name}}</span>
                                    <span v-if="!person.user_name">Nameless Person</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{person.user_email}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-menu>
                                    <template v-slot:activator="{ on }">
                                        <v-btn text v-on="on" :disabled="person.is_authenticated_user">
                                            {{roleFromPermissions(person.permissions)}}
                                            <v-icon>mdi-menu-down</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list v-if="true">
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
                                </v-menu>


                                <!--                                <span class="admin"></span>-->
                                <!--                                <v-btn icon>-->
                                <!--                                    <v-icon>mdi-pencil</v-icon>-->
                                <!--                                </v-btn>-->
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col>
                <v-card>
                    <v-toolbar dark color="#555">
                        <v-icon class="mr-2">mdi-book-multiple</v-icon>
                        <v-toolbar-title>
                            <div class="">
                                Your Publishers
                                <span class="body-2">({{institutionPublishers.length}})</span>
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-list>
                        <v-list-item
                                v-for="pub in institutionPublishers"
                                :v-key="pub.id"
                                @click=""
                        >
                            <v-list-item-content>
                                <v-list-item-title class="">
                                    {{pub.name}}
                                </v-list-item-title>

                                <v-list-item-subtitle>

                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action v-if="0">
                                <div class="body-2">
                                    <v-icon small color="grey lighten-1">mdi-alert-circle-outline</v-icon>
                                    Demonstration institution
                                </div>
                            </v-list-item-action>
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
                    <v-spacer />
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
                    <v-spacer />
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
            ]),
            institutionId() {
                return this.$route.params.institutionId
            }
        },
        methods: {
            ...mapMutations([]),
            ...mapActions([]),
            async setRole(email, role) {
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
            this.$store.dispatch("fetchInstitution", this.institutionId)
        },
    }
</script>

<style scoped>

</style>