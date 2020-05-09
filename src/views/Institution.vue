<template>
    <v-container class="institution">

        <div class="page-title mt-8 mb-4 d-flex">
            <div class="mt-1 mr-2">
                <v-avatar tile size="60">
                    <img v-if="institutionIsDemo" src="https://i.imgur.com/oeSIBs7.png" alt="">
                    <v-icon x-large v-if="!institutionIsDemo">mdi-bank</v-icon>
                </v-avatar>
            </div>
            <div class="text">
                <div class="body-2">
                    Institution
                </div>
                <div class="display-2" v-if="!institutionIsLoading">
                    {{ institutionName }}
                </div>
                <div class="display-2 text--secondary" v-if="institutionIsLoading">
                    Loading institution...
                </div>
            </div>
        </div>


        <v-alert v-if="institutionIsDemo" color="info" text dense icon="mdi-information-outline">
            <div class="d-flex align-center">
                <div>
                    This is a demo institution; the data is real, but some functionality is restricted.
                </div>
                <v-spacer></v-spacer>
                <div>
                    <v-btn color="info" text small to="/purchase">upgrade</v-btn>
                </div>
            </div>
        </v-alert>

        <v-row>
            <v-col cols="4">
                <v-skeleton-loader
                        :loading="institutionIsLoading"
                        type="card-heading, list-item-avatar-two-line, list-item"
                >

                    <v-card>
                        <v-card-title class="pr-4 align-baseline">
                            <div>
                                Group members <span class="body-2">({{institutionUsersWithRoles.length}})</span>
                            </div>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom max-width="200" color="#333">
                                <template v-slot:activator="{on}">
                                    <v-icon v-on="on" small>mdi-help-circle-outline</v-icon>
                                </template>
                                <div>
                                    Manage who has access to your institutional dashboard.
                                </div>

                            </v-tooltip>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-item
                                    v-for="person in institutionUsersWithRoles"
                                    :key="person.email"
                            >
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
                                            {{ roleFromPermissions(person.permissions) }}
                                        </span>
                                    </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action v-if="userIsAdmin && person.user_id !== userId">
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
                                                    v-for="role in roles"
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
                            <v-list-item v-if="userIsAdmin" @click="openCreateGroupMemberDialog">
                                <v-list-item-avatar>
                                    <v-icon>mdi-plus</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content class="body-2 text--secondary">
                                    New group member
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>


                    </v-card>
                </v-skeleton-loader>


                <v-skeleton-loader
                        :loading="institutionIsLoading"
                        type="card-heading, list-item-avatar-two-line, list-item"
                >
                    <v-card class="mt-3">
                        <v-card-title class="pr-4">
                            <div>
                                ROR IDs <span class="body-2">({{institutionRorIds.length}})</span>
                            </div>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom max-width="300" color="#333">
                                <template v-slot:activator="{on}">
                                    <v-icon v-on="on" small>mdi-help-circle-outline</v-icon>
                                </template>
                                <div>
                                    A ROR ID is a unique ID (like an ISSN) for research institutions. We base your
                                    institutional citation and authorship counts on your institution's ROR ID(s).
                                </div>

                            </v-tooltip>
                        </v-card-title>
                        <v-divider></v-divider>

                        <v-list :dense="institutionRorIds.length > 1">
                            <v-list-item
                                    v-for="rorId in institutionRorIds"
                                    :key="rorId"
                            >
                                <v-list-item-avatar>
                                    <v-icon>mdi-map-marker-outline</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title class="" style="font-family: Monaco, monospace;" v-html="rorId"/>

                                    <v-list-item-subtitle v-if="rorId === '00xbe3815'">
                                        (demo ROR ID)
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-tooltip bottom color="#333" max-width="200">
                                        <template v-slot:activator="{on}">
                                            <v-btn v-on="on" icon :href="`https://ror.org/${rorId}`" target="_blank">
                                                <v-icon>mdi-open-in-new</v-icon>
                                            </v-btn>
                                        </template>
                                        <div>
                                            View record on www.ror.org
                                        </div>

                                    </v-tooltip>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item @click="dialogs.addRorId = true">
                                <v-list-item-avatar>
                                    <v-icon>mdi-plus</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content class="body-2 text--secondary">
                                    New ROR ID
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>


                    </v-card>
                </v-skeleton-loader>
            </v-col>

            <v-col cols="8">
                <v-skeleton-loader
                        :loading="institutionIsLoading"
                        type="card-heading, list-item-avatar-two-line, list-item"
                >
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
                                    :key="pub.id"
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
                                    <v-btn icon  :to="`/i/${institutionId}/p/${pub.id}`">
                                        <v-icon>mdi-eye-outline</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                                <v-list-item-action @click.stop="deleteInstitutionPublisher(pub.id)">
                                    <v-btn icon>
                                        <v-icon>mdi-delete-outline</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>


                            <v-list-item @click="openCreatePublisherDialog">
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
                </v-skeleton-loader>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbars.roleUpdated" bottom left>
            User role updated.
            <v-btn dark icon @click="snackbars.roleUpdated = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

        <v-snackbar v-model="snackbars.newGroupMember" bottom left>
            User created and welcome email sent.
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
                                autofocus
                                outlined
                                clearable
                                type="email"
                                label="Email"
                                @keydown.enter="createGroupMember"
                                v-model="newGroupMember.email"
                                prepend-icon="mdi-email-outline"
                        />
                        <v-select
                                outlined
                                label="Role"
                                v-model="newGroupMember.role"
                                :items="roles"
                                prepend-icon="mdi-account-key-outline"
                                :hint="roleDescriptions[newGroupMember.role]"
                                persistent-hint
                        />

                        <v-checkbox
                                v-model="sendNewUserWelcomeEmail"
                                label="Send automated welcome email"
                                readonly
                        />
                    </div>
                </v-card-text>
                <v-card-actions class="mt-6">
                    <v-spacer/>
                    <v-btn depressed
                           @click="dialogs.createGroupMember = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="createGroupMember"
                           color="primary"
                    >
                        Create group member
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogs.addRorId" max-width="400">
            <v-card v-if="dialogs.addRorId">
                <v-card-title class="headline">
                    Add ROR ID
                </v-card-title>
                <v-card-text class="pt-4">
                    Stay tuned...the ability to add new ROR IDs is coming soon.
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn depressed
                           @click="dialogs.addRorId = false"
                           color="primary"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogs.createPublisher" max-width="400">
            <v-card>
                <v-card-title class="headline">
                    Add Publisher
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        <v-select
                                outlined
                                label="Select publisher"
                                v-model="newPublisherItemSelected"
                                :items="newPublisherItems"
                                return-object
                                item-text="name"
                                item-value="name"
                        >
                            <template v-slot:item="{item}">
                                <img :src="item.logo" class="mr-3" style="height:30px; width: 30px;">
                                {{ item.name }}
                            </template>
                        </v-select>
                        <v-text-field
                                outlined
                                clearable
                                label="Publisher display name"
                                @keydown.enter="createPublisher"
                                v-model="newPublisherDisplayName"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn depressed
                           @click="dialogs.createPublisher = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="createPublisher"
                           color="primary"
                           :loading="newPublisherLoading"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-snackbar v-model="snackbars.copySuccess" bottom left>
            Password copied
            <v-btn dark icon @click="snackbars.copySuccess = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

        <v-snackbar v-model="snackbars.newPublisherSuccess" bottom left>
            Publisher added
            <v-btn dark icon @click="snackbars.newPublisherSuccess = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


    </v-container>
</template>

<script>

    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../api"
    import {roleFromPermissions, permissionsFromRole, roleDescriptions, roles} from "../shared/userPermissions";


    const short = require('short-uuid');

    export default {
        name: "Institution",
        components: {},
        data() {
            return {
                snackbars: {
                    newGroupMember: false,
                    roleUpdated: false,
                    copySuccess: false,
                    newPublisherSuccess: false,
                },
                dialogs: {
                    createGroupMember: false,
                    addRorId: false,
                    createPublisher: false,
                },
                newPublisherDisplayName: "",
                newPublisherItems: [
                    {
                        name: "Elsevier",
                        id: "Elsevier",
                        logo: "https://i.imgur.com/Qt1sOqp.png",
                    },
                    {
                        name: "Springer Nature",
                        id: "Springer Nature",
                        logo: "https://i.imgur.com/MLtg71P.png",
                    },
                    {
                        name: "Wiley",
                        id: "Wiley",
                        logo: "https://i.imgur.com/FFfCHXI.png",
                    },
                ],
                newPublisherItemSelected: {
                    name: "Elsevier",
                    id: "Elsevier",
                    logo: "https://i.imgur.com/Qt1sOqp.png",
                },
                newPublisherLoading: false,

                roles,
                roleDescriptions,
                roleFromPermissions,
                permissionsFromRole,

                newGroupMember: {
                    name: "",
                    email: "",
                    password: "",
                    role: "Collaborator",
                },
                sendNewUserWelcomeEmail: true,

                isRoleUpdating: false,
            }
        },
        computed: {
            ...mapGetters([
                "institutionName",
                "institutionRorIds",
                "institutionPublishers",
                "institutionUsersWithRoles",
                "institutionIsDemo",
                "userId",
                "institutionIsLoading",
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
            ...mapActions([
                "deleteInstitutionPublisher",
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
                this.snackbars.roleUpdated = true
            },
            async createGroupMember() {
                this.snackbars.newGroupMember = true
                this.dialogs.createGroupMember = false
                await this.$store.dispatch("createGroupMember", this.newGroupMember)
            },
            openCreateGroupMemberDialog() {
                this.newGroupMember.password = short.generate().slice(0, 8)
                this.dialogs.createGroupMember = true
            },

            async createPublisher() {
                console.log("create publisher!")
                this.newPublisherLoading = true

                const name = this.newPublisherDisplayName || "My " + this.newPublisherItemSelected.name
                const publisherId = this.newPublisherItemSelected.name
                await this.$store.dispatch("createPublisher", {publisherId, name})
                this.newPublisherLoading = false
                this.snackbars.newPublisherSuccess = true
                this.dialogs.createPublisher = false
            },
            openCreatePublisherDialog() {
                this.newGroupMember.password = short.generate().slice(0, 8)
                this.dialogs.createPublisher = true
            },


            async copyPassword() {
                const copyText = document.querySelector("#pw");
                copyText.select();
                document.execCommand("copy");
                // await this.$copyText(this.newGroupMember.password)
                this.snackbars.copySuccess = true
            }

        },
        async mounted() {
            console.log("Institution mount up!", this.institutionId)
            await this.$store.dispatch("fetchInstitution", this.institutionId)
            // await this.$store.dispatch("fetchPublisher", this.institutionPublishers[0].id)
        },
        destroyed() {
            // this.$store.commit("clearInstitution")

        },
        watch: {
            'newPublisherItemSelected': {
                immediate: true,
                handler: function (to) {
                    console.log("newPublisherValue changed", to)
                    this.newPublisherDisplayName = "My " + to.name
                },
            }
        }
    }
</script>

<style scoped>

</style>