<template>
    <v-container style="margin-top: 10vh;" class="login">
        <v-row style="height: 100%;" class="pt-10" align="center" justify="center">


            <v-card width="400" :loading="isLoading" v-show="requestState === 'ready'">
                <v-card-title>
                    <div>
                        Change Password
                    </div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-text-field
                                autofocus
                                outlined
                                label="New password"
                                v-model="password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"
                                @keydown.enter="loginWithPassword"
                                :error-messages="errorMsg"
                                id="input-password"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            :loading="isLoading"
                            @click="savePassword"
                            large
                            depressed
                            color="primary"
                            id="button-go-to-next-login-step"
                    >
                        Change password
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="400" v-show="requestState === 'success'">
                <v-card-title>
                    <div>
                        Password Changed!
                    </div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-actions>
                    <div class="mb-10 pa-4">
                        Your password has been successfully updated, and now you can log in! Nice job 👍
                    </div>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            to="/login"
                            large
                            depressed
                            color="primary"
                    >
                        Log in
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="400" v-show="requestState === 'error'">
                <v-card-title>
                    <div>
                        Password Update Error
                    </div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-actions>
                    <div class="mb-10 pa-4">
                        Sorry, we couldn't update your password.
                    </div>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            to="/recover-password"
                            large
                            depressed
                            color="primary"
                    >
                        Request another reset email
                    </v-btn>
                </v-card-actions>
            </v-card>


        </v-row>


    </v-container>
</template>

<script>
    import {api} from "../api";

    export default {
        name: "Login",

        metaInfo() {
            return {
                title: `RecoverPassword`
            }
        },
        data() {
            return {
                creds: {
                    password: "",
                    email: "",
                    username: ""
                },
                requestState: "ready",
                email: "",
                password: "",
                showError: false,
                showPassword: false,
                errorMsg: "",
                loginStep: 0,
                isLoading: false
            }
        },
        computed: {},
        methods: {
            async savePassword() {
                console.log("try to set this new password")
                const token = this.$route.query.token
                const postData = {
                    password: this.password,
                    token,
                }
                this.isLoading = true
                try {
                    await api.post("password/reset", postData)
                }
                catch (e){
                    this.requestState = "error"
                    return
                }
                finally {
                    this.isLoading = false
                }
                this.requestState = "success"
            },
        },
        created(){
            if (!this.$route.query.token){
                this.$router.push("/recover-password")
            }
        }
    }
</script>

<style scoped>

</style>