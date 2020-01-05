<template>
    <v-container class="login">
        <v-row class="pt-12" align="center" justify="center">
            <v-card width="400">
                <v-card-title>
                    Change password
                </v-card-title>
                <v-card-text>
                    <v-alert text type="error" v-if="showError==='wrong-creds'">
                        <div>
                            Sorry, it looks like either your old password or username is incorrect.
                        </div>
                    </v-alert>
                    <v-alert text type="error" v-if="showError==='new-password-typo'">
                        <div>
                            Sorry, looks like you have a typo in your new password...you didn't enter it the same way twice.
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
                                label="Old password"
                                v-model="creds.oldPassword"
                                placeholder="Old password"
                                outlined
                                type="password"
                        ></v-text-field>

                        <v-text-field
                                class="pt-6"
                                label="New password"
                                v-model="creds.newPassword"
                                placeholder="New password"
                                outlined
                                type="password"
                        ></v-text-field>
                        <v-text-field
                                label="New password (again)"
                                v-model="newPasswordAgain"
                                placeholder="New password (again)"
                                outlined
                                type="password"
                        ></v-text-field>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="onSubmit" large depressed color="primary">
                        Change password
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <a href="mailto:team@ourresearch.org?subject=Forgot password">Forgot your password?</a>
                </v-card-actions>
            </v-card>
        </v-row>


    </v-container>
</template>

<script>
    export default {
        name: "ChangePassword",
        data() {
            return {
                creds: {
                    username: "",
                    oldPassword: "",
                    newPassword: "",
                },
                showError: false,
                newPasswordAgain: "",
            }
        },
        methods: {
            onSubmit() {
                if (this.creds.newPassword !== this.newPasswordAgain) {
                    this.showError = "new-password-typo"
                    this.creds.newPassword = ""
                    this.newPasswordAgain = ""
                    return
                }


                console.log("trying to change the password", this.creds)
                this.$store.dispatch("changePassword", this.creds)
                    .then(resp => {
                        this.$store.commit("snackbar", "Password changed!")
                        this.$router.push(`/login`)
                    })
                    .catch(err => {
                        console.log("there was a login error", err)
                        this.showError = "wrong-creds"
                    })
            },
        }
    }
</script>

<style scoped>

</style>