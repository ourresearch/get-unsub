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
                                v-model="creds.email"
                                outlined
                                autofocus
                                label="Email"
                                @keydown.enter="setEmail"
                                :error-messages="errorMsg"

                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :loading="isLoading" @click="setEmail" large depressed color="primary">
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
                                v-model="creds.email"
                                label="Email"
                                readonly
                                outlined

                        />
                        <v-text-field
                                autofocus
                                outlined
                                label="Password"
                                v-model="creds.password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"
                                @keydown.enter="loginWithPassword"
                                :error-messages="errorMsg"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="0" text :loading="isLoading" @click="createDemo">Create demo account</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :loading="isLoading" @click="loginWithPassword" large depressed color="primary">
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
                },
                showError: false,
                showPassword: false,
                errorMsg: "",
                loginStep: 0,
                isLoading: false
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
            async setEmail() {
                this.isLoading = true
                this.errorMsg = ""

                try {
                    await this.$store.dispatch("loginFromCreds", this.creds)
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
                try {
                    await this.$store.dispatch("loginFromCreds", this.creds)
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