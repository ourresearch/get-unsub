<template>
    <v-container style="height: 100vh; margin-top: -100px;" class="login">

        <v-row style="height: 100%;" class="pt-10" align="center" justify="center">


            <v-card width="400" :loading="isLoading"  v-show="loginStep === 0">
                <v-card-title>
                    <div>
                        <v-icon>mdi-account-outline</v-icon>
                        Sign in
                    </div>
                    <v-spacer></v-spacer>
                    <div class="body-2 text--secondary">Step 1</div>
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-text-field
                                v-model="usernameOrEmail"
                                outlined
                                autofocus
                                label="Email"
                                @keydown.enter="setUsernameOrEmail"
                                :error-messages="errorMsg"
                                id="input-email-or-username"

                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            :loading="isLoading"
                            @click="setUsernameOrEmail"
                            large
                            depressed
                            color="primary"
                            id="button-go-to-next-login-step"
                    >
                        Next
                    </v-btn>
                </v-card-actions>
            </v-card>


            <v-card width="400" :loading="isLoading"  v-show="loginStep === 1">
                <v-card-title class="d-flex">
                    <div>
                        Sign in
                    </div>
                    <v-spacer></v-spacer>
                    <div class="body-2 text--secondary">Step 2 of 2</div>
                </v-card-title>
                <v-card-text>
                    <div>

                        <v-text-field
                                append-icon="mdi-check"
                                v-model="usernameOrEmail"
                                label="Email"
                                readonly
                                outlined
                                id="input-email-or-username"
                        />
                        <v-text-field
                                autofocus
                                outlined
                                label="Password"
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
                    <a
                            :href="`mailto:team+passwordreset@ourresearch.org?subject=${passwordResetEmailSubject}&body=${passwordResetEmailBody}`"
                            class="ml-2"
                            style="text-decoration: none;"
                            target="_blank"
                    >
                        Forgot password?
                    </a>
                    <span v-if="0">this is a test of git.</span>
                    <v-spacer></v-spacer>
                    <v-btn
                            :loading="isLoading"
                            @click="loginWithPassword"
                            large
                            depressed
                            color="primary"
                            id="button-login-go"
                    >
                        Log in
                    </v-btn>
                </v-card-actions>
            </v-card>


        </v-row>


    </v-container>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                creds: {
                    password: "",
                    email: "",
                    username: ""
                },
                usernameOrEmail: "",
                password: "",
                showError: false,
                showPassword: false,
                errorMsg: "",
                loginStep: 0,
                isLoading: false
            }
        },
        computed: {
            passwordResetEmailSubject(){
                let ret = "Password reset request"
                return encodeURIComponent(ret)
            },
            passwordResetEmailBody(){
                let ret = `Please reset my password.

(Note: Password reset may take up to two days; sorry for the wait! We're still working on the automated reset. --Mgmt.)
                `
                return encodeURIComponent(ret)
            }
        },
        methods: {
            bootIntercom() {
                const data = {
                    user_id: this.$store.getters.userId,
                    name: this.$store.getters.userName,
                }
                if (this.$store.getters.userEmail) data.email = this.$store.getters.userEmail
                this.$intercom.boot(data)
            },
            async setUsernameOrEmail() {
                this.isLoading = true
                this.errorMsg = ""
                const creds = {
                    password: "",
                }
                if (/@/.test(this.usernameOrEmail)) creds.email = this.usernameOrEmail
                else creds.username = this.usernameOrEmail

                try {
                    await this.$store.dispatch("loginFromCreds", creds)
                } catch (e) {
                    console.log("login fail", e.response.status)
                    if (e.response.status === 404) {
                        this.errorMsg = "Sorry, we couldn't find that account."
                        return
                    }
                    if (e.response.status === 403) {
                        this.loginStep = 1
                        return
                    }
                    else {
                        this.errorMsg = "Sorry, something went wrong"
                    }
                }
                finally {
                    this.isLoading = false
                }
                this.bootIntercom()
            },
            async loginWithPassword(){
                this.isLoading = true
                this.errorMsg = ""
                const creds = {
                    password: this.password,
                }
                if (/@/.test(this.usernameOrEmail)) creds.email = this.usernameOrEmail
                else creds.username = this.usernameOrEmail
                try {
                    await this.$store.dispatch("loginFromCreds", creds)
                } catch (e) {
                    console.log("login fail", e.response.status)
                    if (e.response.status === 403) {
                        this.errorMsg = "Password incorrect"
                        return
                    }
                    else {
                        this.errorMsg = "Sorry, something went wrong"
                    }
                }
                finally {
                    this.isLoading = false
                }
                this.bootIntercom()
            },
        }
    }
</script>

<style scoped>

</style>