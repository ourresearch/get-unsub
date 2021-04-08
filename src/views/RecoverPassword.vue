<template>
    <v-container style="margin-top: 10vh;" class="login">
        <v-row style="height: 100%;" class="pt-10" align="center" justify="center">


            <v-card width="400" :loading="isLoading" v-show="requestState === 'ready'">
                <v-card-title>
                    <div>
                        Recover Password
                    </div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <div class="mb-10 body-1">
                        Don't worry, happens to the best of us. We can send you an email with a link allowing you to reset your password.
                    </div>
                    <div>
                        <v-text-field
                                v-model="email"
                                outlined
                                autofocus
                                label="Account email"
                                :error-messages="errorMsg"
                                id="input-email-or-username"

                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            :loading="isLoading"
                            @click="sendResetEmail"
                            large
                            depressed
                            color="primary"
                            id="button-go-to-next-login-step"
                    >
                        Email me a recovery link
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="400" v-show="requestState === 'success'">
                <v-card-title>
                    <div>
                        <v-icon>mdi-email-check-outline</v-icon>
                        Recovery email sent
                    </div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-actions>
                    <div class="mb-10 pa-4">
                        We've sent an email to <strong>{{email}}</strong> with a link that can be used to reset your password. It should arrive in a minute or two (don't forget to check your spam folder).
                    </div>
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
            async sendResetEmail() {
                console.log("send the reset email")
                const postData = {email: this.email}
                this.isLoading = true
                try {
                    await api.post("password/request-reset", postData)
                }
                catch(e) {
                    if (e.response.status === 404) {
                        this.errorMsg = "Sorry, we couldn't find that account."
                        return
                    }
                    else {
                        this.errorMsg = "Sorry, something went wrong"
                    }
                }
                finally {
                    this.isLoading = false
                }
                this.requestState = "success"
            },
        },
        mounted(){
            if (this.$route.query.email){
                this.email = this.$route.query.email
            }
        }
    }
</script>

<style scoped>

</style>