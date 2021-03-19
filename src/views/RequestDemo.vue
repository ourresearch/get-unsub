<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                foo
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        Schedule a live demo
                    </v-card-title>
                    <div class="pa-3">
                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="formData.givenName"
                                        label="Given name"
                                />

                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="formData.familyName"
                                        label="Family name"
                                />

                            </v-col>
                        </v-row>
                        <v-text-field
                                v-model="formData.email"
                                type="email"
                                label="Work email"
                        />
                        <v-text-field
                                v-model="formData.institution"
                                label="Your institution"
                        />
                        <v-text-field
                                v-model="formData.job"
                                label="Your job"
                        />
                        <v-btn
                                @click="submit"
                        >
                            Submit
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
    import {api} from "../api";
    import axios from 'axios'
    const queryString = require('query-string');



    export default {
        name: "RequestDemo",

        metaInfo() {
            return {
                title: `Request Demo`
            }
        },
        data() {
            return {
                formData: {
                    email: "",
                    givenName: "",
                    familyName: "",
                    institution: "",
                    job: "",
                }
            }
        },
        computed: {},
        methods: {
            async submit() {
                const baseUrl = "https://hooks.zapier.com/hooks/catch/194181/o7zdbid"
                const stringified = queryString.stringify(this.formData)
                const url = baseUrl + "?" + stringified


                console.log("user sending this email:", this.formData, url)
                const resp = await axios.get(url)
                console.log("got response back", resp)
            },
            async sendResetEmail() {
                console.log("send the reset email")
                const postData = {email: this.email}
                this.isLoading = true
                try {
                    await api.post("password/request-reset", postData)
                } catch (e) {
                    if (e.response.status === 404) {
                        this.errorMsg = "Sorry, we couldn't find that account."
                        return
                    } else {
                        this.errorMsg = "Sorry, something went wrong"
                    }
                } finally {
                    this.isLoading = false
                }
                this.requestState = "success"
            },
        },
        mounted() {
            if (this.$route.query.email) {
                this.email = this.$route.query.email
            }
        }
    }
</script>

<style scoped>

</style>