<template>
    <v-container class="login">
        <div class="display-2 d-flex justify-center pt-8">
            Log in to your account
        </div>



        <v-row class="pt-10" align="center" justify="center">

            <v-card width="400" flat style="transform: scale(1.25); transform-origin: top;">
                <v-card-text>
                    <v-alert class="body-2" text type="error" v-if="showError">
                        <div>
                            Sorry, we don't recognize that username/password combination.
                        </div>
                        <div class="d-flex">
                            <v-btn light color="error" small outlined class="mt-4" @click="showError = false">Try again</v-btn>
                        </div>


                        <div v-if="0">
                            <div>
                                Would you like to log in to the demo account instead?

                            </div>
                            <div class="pt-4">
                                <v-btn @click="loginDemo" depressed outlined color="error">Log in to Demo account</v-btn>
                            </div>
                        </div>

                    </v-alert>
                </v-card-text>
                <v-card-text v-show="!showError">
                    <div>
                        <v-text-field
                                v-model="creds.email"
                                label="Email or username"
                                @keydown.enter="login"

                        />
                        <v-text-field
                                label="Password"
                                v-model="creds.password"
                                type="password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"
                                @keydown.enter="login"
                        />

                    </div>
                </v-card-text>
                <v-card-actions v-show="!showError">
                    <v-spacer></v-spacer>
                    <v-btn @click="login" large depressed color="primary">
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
            }
        },
        methods: {
            login() {
                this.$store.dispatch("login", this.creds)
                    .then(resp => {
                        this.$router.push(`/u`)
                        // https://www.npmjs.com/package/vue-intercom
                        this.$intercom.boot({
                            user_id: this.$store.getters.userId,
                            name: this.$store.getters.userName,
                            email: this.$store.getters.userEmail,
                        })
                    })
                    .catch(err => {
                        console.log("there was a login error", err)
                        this.showError = true
                    })
            },
            loginDemo() {
                this.$store.dispatch("loginDemo")
                    .then(resp => {
                        this.$router.push(`/u`)
                        // https://www.npmjs.com/package/vue-intercom
                        this.$intercom.boot({
                            user_id: this.$store.getters.userId,
                            name: this.$store.getters.userName,
                            email: this.$store.getters.userEmail,
                        })
                    })
                    .catch(err => {
                        console.log("there was a login error", err)
                        this.showError = true
                    })
            }
        }
    }
</script>

<style scoped>

</style>