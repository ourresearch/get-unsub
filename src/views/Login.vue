<template>
    <v-container class="login">
        <v-row class="pt-12" align="center" justify="center">
            <v-card width="400">
                <v-card-title>
                    Log in to your account
                </v-card-title>
                <v-card-text>
                    <v-alert text type="error" v-if="showError">
                        <div>
                            Sorry, we don't recognize that username/password combination. Would you like to log in to
                            the demo account instead?

                        </div>
                        <div class="pt-4">
                            <v-btn @click="loginDemo" depressed outlined color="error">Log in to Demo account</v-btn>
                        </div>
                    </v-alert>
                </v-card-text>
                <v-card-text>
                    <div>
                        <v-text-field
                                v-model="creds.username"
                                label="Username"
                                placeholder="Username"
                                outlined
                        ></v-text-field>
                        <v-text-field
                                label="Password"
                                v-model="creds.password"
                                placeholder="Password"
                                outlined
                                type="password"
                        ></v-text-field>

                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="login" large depressed color="primary">
                        Log in
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <a href="https://journals.unpaywall.org/change-password">Change your password</a>
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
                    username: "",
                },
                showError: false,
            }
        },
        methods: {
            login() {
                this.$store.dispatch("login", this.creds)
                    .then(resp => {
                        this.$router.push(`/a`)
                        // https://www.npmjs.com/package/vue-intercom
                        this.$intercom.boot({
                            user_id: this.$store.getters.selectedAccount.id,
                            name: this.$store.getters.selectedAccount.name
                        })
                    })
                    .catch(err => {
                        console.log("there was a login error", err)
                        this.showError = true
                    })
            },
            loginDemo() {
                this.$store.dispatch("loginDemo")
                    .then(() => this.$router.push("/a"))
            }
        }
    }
</script>

<style scoped>

</style>