<template>
    <v-container class="user">
        <div class="page-title mt-8 d-flex">
            <v-avatar size="50" class="mt-3 mr-3">
                <v-gravatar v-show="!isLoading" default-img="mm" class="gravatar" :email="gravatarStr" :size="50"></v-gravatar>
                <v-progress-circular
                        size="50"
                        v-show="isLoading"
                        indeterminate
                />
            </v-avatar>

            <div class="text">
                <div class="body-2">
                    <span v-if="isLoading">Loading...</span>
                    <span v-if="!isLoading">Account</span>
                </div>
                <div class="display-2">
                    Your account
                </div>

            </div>
        </div>


        <v-alert v-if="userIsDemo && !isLoading" color="info" text dense icon="mdi-information-outline">
            <div class="d-flex align-center">
                <div>
                    This is a demo account; some functionality is restricted.
                </div>
                <v-spacer></v-spacer>
                <div>
                    <v-btn color="info" text small to="/purchase">upgrade</v-btn>
                </div>
            </div>
        </v-alert>

        <v-alert v-if="!userEmail && !isLoading" color="warning" text dense icon="mdi-email-alert-outline">
            <div class="d-flex align-center">
                <div>
                    Please set your email address.
                </div>
            </div>
        </v-alert>

        <v-row v-if="!isLoading">
            <v-col cols="4">
                <v-card>
                    <!--                    <v-toolbar flat>-->
                    <!--                        <v-toolbar-title>-->
                    <!--                        </v-toolbar-title>-->
                    <!--                    </v-toolbar>-->
                    <v-card-title>
                        Account details
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-account-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="">
                                    {{userName}}
                                </div>
                                <v-list-item-subtitle>
                                    Your name
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="openDialogToEditUserInfo('name')">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon v-if="userEmail">mdi-email-outline</v-icon>
                                <v-icon v-if="!userEmail" color="warning">mdi-email-alert-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-if="userEmail" v-html="userEmail" class=""/>
                                <v-list-item-title v-if="!userEmail" color="warning">
                                   <em class="warning--text">
                                        None set
                                    </em>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Your email
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="openDialogToEditUserInfo('email')">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>


                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon v-if="!userPasswordIsSet">mdi-shield-alert-outline</v-icon>
                                <v-icon v-if="userPasswordIsSet">mdi-shield-check-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="">
                                    <span v-if="!userPasswordIsSet"><em>None set</em></span>
                                    <span v-if="userPasswordIsSet">••••••••</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Your password
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="openDialogToEditUserInfo('password')">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="8">
                <v-card>

                    <v-card-title>
                        <div>
                            Your Institutions
                            <span class="body-2">({{userInstitutions.length}})</span>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-list>
                        <v-list-item
                                v-for="insti in userInstitutions"
                                :key="insti.institution_id"
                                @click="goToInstitution(insti.institution_id)"
                        >
                            <v-list-item-avatar tile>
                                <v-icon large>mdi-bank</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="headline font-weight-bold">
                                    {{ insti.institution_name}}
                                </div>

                                <v-list-item-subtitle>
                                    <!--                                    <span v-if="/\bdemo\b|\bDemo\b/.test(insti.institution_name)">-->
                                    <!--                                        Demo institution, some functionality restricted-->
                                    <!--                                    </span>-->

                                    <span>
                                        Your're a<template
                                            v-if="insti.permissions.includes('admin')">n</template>  <strong>{{roleFromPermissions(insti.permissions) }}</strong> for this institution
                                    </span>
                                </v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action v-if="0">
                                <div
                                        v-if="insti.institution_id === institutionId"
                                        class="primary--text font-weight-bold"
                                >
                                    <v-icon color="primary">mdi-check</v-icon>
                                    Selected
                                </div>
                                <div
                                        v-if="insti.institution_id === institutionId"
                                        class="primary--text font-weight-bold"
                                >
                                    <v-icon color="primary">mdi-check</v-icon>
                                    <v-btn text>
                                        Select
                                    </v-btn>
                                </div>
                            </v-list-item-action>


                        </v-list-item>
                        <v-list-item v-if="false" @click="" :disabled="true">
                            <v-list-item-avatar size="50">
                                <v-btn icon>
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title class="body-2 text--secondary">
                                    New institution
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>


                </v-card>
            </v-col>
        </v-row>


        <v-dialog v-model="dialogs.editUserInfo" max-width="500">
            <v-card :loading="editUserInfoLoading">
                <v-card-title>
                    <v-icon v-if="editUserInfoType==='name'">mdi-account-edit-outline</v-icon>
                    <v-icon v-if="editUserInfoType==='email'">mdi-email-edit-outline</v-icon>
                    <v-icon v-if="editUserInfoType==='password'">mdi-shield-edit-outline</v-icon>
                    <span class="text ml-3">
                        Edit {{ editUserInfoType }}
                    </span>
                </v-card-title>
                <v-card-text class="pt-4">
                    <v-alert
                            :value="editUserErrors.emailIsTaken"
                            type="error"
                            icon="mdi-alert"
                            transition="slide-x-transition"
                    >
                        Sorry, that email is taken.
                    </v-alert>
                    <v-text-field
                            outlined
                            autofocus
                            clearable
                            v-if="editUserInfoType==='name'"
                            label="Your name"
                            v-model="editUserInfoStr"
                            @keydown.enter="editUserInfo"
                    />
                    <v-text-field
                            outlined
                            autofocus
                            clearable
                            v-if="editUserInfoType==='email'"
                            label="Your email"
                            v-model="editUserInfoStr"
                            @keydown.enter="editUserInfo"
                    />
                    <v-text-field
                            outlined
                            autofocus
                            v-if="editUserInfoType==='password'"
                            label="Your password"
                            v-model="editUserInfoStr"
                            :append-icon="editUserShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="editUserShowPassword ? 'text' : 'password'"
                            @click:append="editUserShowPassword = !editUserShowPassword"
                            @keydown.enter="editUserInfo"
                    />


                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            :disabled="editUserInfoLoading"
                            depressed
                            @click="closeEditUserInfo"
                    >
                        <v-icon>mdi-close</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="editUserInfo"
                           color="primary"
                           :loading="editUserInfoLoading"
                    >
                        <v-icon>mdi-check</v-icon>
                        Ok
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbars.editUserSuccess" bottom left>
            {{ snackbars.editUserSuccessMsg }}
            <v-btn dark icon @click="snackbars.editUserSuccess = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


    </v-container>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {roleFromPermissions} from "../shared/userPermissions";

    export default {
        name: "User",
        components: {},
        data() {
            return {
                showSnackbarNoPermissions: false,

                editUserInfoType: null,
                editUserInfoStr: "",
                editUserInfoLoading: false,
                editUserShowPassword: true,
                editUserErrors: {
                    emailIsTaken: false,
                },
                dialogs: {
                    editUserInfo: false,
                },
                snackbars: {
                    editUserSuccess: false,
                    editUserSuccessMsg: ""
                }
            }
        },
        computed: {
            ...mapGetters([
                "userEmail",
                "userUsername",
                "userName",
                "userPasswordIsSet",
                "userInstitutions",
                "institutionId",
                "userIsDemo",
                "gravatarStr",
            ]),
            isLoading(){
                return this.$store.getters.userInstitutions.length === 0
            }
        },
        methods: {
            ...mapMutations([]),
            ...mapActions([]),
            goToInstitution(id) {
                const url = `/i/${id}`
                this.$router.push(url)
            },
            roleFromPermissions,
            async selectInstitution(id) {
                this.$store.commit("clearInstitution")
                await this.$store.dispatch("fetchInstitution", id)
            },
            openDialogToEditUserInfo(infoType) {
                console.log("openDialogToEditUserInfo", infoType)
                this.dialogs.editUserInfo = true
                this.editUserInfoType = infoType
                if (infoType === 'name') this.editUserInfoStr = this.userName
                else if (infoType === 'email') this.editUserInfoStr = this.userEmail
                else this.editUserInfoStr = ""
            },
            closeEditUserInfo() {
                this.editUserInfoType = null
                this.editUserInfoStr = ""
                this.editUserInfoLoading = false
                this.editUserErrors.emailIsTaken = false
                this.dialogs.editUserInfo = false
            },
            async editUserInfo() {
                console.log("edit user info!", this.editUserInfoType, this.editUserInfoStr)
                this.editUserInfoLoading = true
                const methodName = _.camelCase(`change ${this.editUserInfoType}`)
                await this.$store.dispatch(methodName, this.editUserInfoStr)

                this.snackbars.editUserSuccess = true
                this.snackbars.editUserSuccessMsg = `${_.capitalize(this.editUserInfoType)} updated`
                this.closeEditUserInfo()
            }
        },
        mounted() {
        },
    }
</script>

<style scoped>

</style>