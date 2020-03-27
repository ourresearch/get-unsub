<template>
    <v-container class="user">
        <div class="display-2 my-8">
            <v-icon x-large>mdi-account</v-icon>
            Your account
        </div>
        <v-row>
            <v-col cols="5">
                <v-card>
                    <v-toolbar dark color="#555">
                        <v-icon class="mr-2">mdi-account-details</v-icon>
                        <v-toolbar-title>
                            <div class="">
                                Your details
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
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
                                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-email-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-html="userEmail" class=""/>
                                <v-list-item-subtitle>
                                    Your email
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="openDialogToEditUserInfo('email')">
                                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon v-if="!userPasswordIsSet">mdi-shield-alert-outline</v-icon>
                                <v-icon v-if="userPasswordIsSet">mdi-shield-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="">
                                    <span v-if="!userPasswordIsSet">No password set</span>
                                    <span v-if="userPasswordIsSet">••••••••</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Your password
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="openDialogToEditUserInfo('password')">
                                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="7">
                <v-card>
                    <v-toolbar dark color="#555">
                        <v-icon class="mr-2">mdi-bank</v-icon>
                        <v-toolbar-title>
                            <div class="">
                                Your Institutions
                                <span class="body-2">({{userInstitutions.length}})</span>
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-list>
                        <v-list-item
                                v-for="insti in userInstitutions"
                                :v-key="insti.institution_id"
                                @click="goToInstitution(insti.institution_id)"
                        >
                            <v-list-item-avatar>
                                <v-icon large>mdi-bank</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="headline">
                                    {{ insti.institution_name}}
                                </div>

                                <v-list-item-subtitle>
                                    <span v-if="/\bdemo\b|\bDemo\b/.test(insti.institution_name)">
                                        Demo institution, some functionality restricted
                                    </span>

                                    <span v-if="0">
                                        Permissions:
                                        {{ insti.permissions.join(", ")}}
                                    </span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn text>view</v-btn>
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
                            autofocus
                            clearable
                            v-if="editUserInfoType==='name'"
                            label="Your name"
                            v-model="editUserInfoStr"
                            @keydown.enter="editUserInfo"
                    />
                    <v-text-field
                            autofocus
                            clearable
                            v-if="editUserInfoType==='email'"
                            label="Your email"
                            v-model="editUserInfoStr"
                            @keydown.enter="editUserInfo"
                    />
                    <v-text-field
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
            <v-btn dark icon @click="snackbars.editUserSuccess = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>


    </v-container>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "User",
        components: {},
        data() {
            return {
                showSnackbarNoPermissions: false,

                editUserInfoType: null,
                editUserInfoStr: "",
                editUserInfoLoading: false,
                editUserShowPassword: false,
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
                "userName",
                "userPasswordIsSet",
                "userInstitutions",
            ]),
        },
        methods: {
            ...mapMutations([]),
            ...mapActions([]),
            goToInstitution(id) {
                console.log("go to institution", id)
                const url = `/i/${id}`
                this.$router.push(url)
            },
            openDialogToEditUserInfo(infoType) {
                console.log("openDialogToEditUserInfo", infoType)
                this.dialogs.editUserInfo = true
                this.editUserInfoType = infoType
                if (infoType === 'name') this.editUserInfoStr = this.userName
                else if (infoType === 'email') this.editUserInfoStr = this.userEmail
                else this.editUserInfoStr = ""
            },
            closeEditUserInfo(){
                this.editUserInfoType = null
                this.editUserInfoStr = ""
                this.editUserInfoLoading = false
                this.editUserErrors.emailIsTaken = false
                this.dialogs.editUserInfo = false
            },
            async editUserInfo(){
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