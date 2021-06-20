<template>
    <v-container>
        <v-row>
            <v-col cols="7" class="hidden-xs-only">
                <v-card class="py-10 px-10">
                    <div class="text-h3 font-weight-bold">
                        Get an in-depth <br> product tour
                    </div>
                    <div class="pa-3">
                        <div class="py-5">
                            Want to see how Unsub can help your library analyze your Big Deal more comprehensively, with
                            less work? Schedule a live demo to see Unsub in action!
                        </div>

                        <template
                                v-for="testimonial in testimonialsToShow"
                        >
                            <v-card
                                    flat
                                    :key="testimonial.img"
                                    class="my-2 py-2"
                            >
                                <div class="d-flex">
                                    <v-avatar class="mr-4">
                                        <v-img :src="testimonial.img"></v-img>
                                    </v-avatar>
                                    <div>
                                        <div class="" v-html='`<q>${testimonial.quote}</q>`'>
                                        </div>
                                        <div class="body-2 mt-1">
                                            <em>

                                                &ndash;{{testimonial.name}}, {{testimonial.job}} at
                                                {{testimonial.institution}}
                                            </em>
                                        </div>
                                    </div>

                                </div>

                            </v-card>
                            <v-divider/>
                        </template>


                        <div class="text-h6 primary--text mb-6 mt-10 pt-4">
                            Join 500+ forward-thinking libraries worldwide:
                        </div>
                        <v-row align="center">
                            <v-col cols="3">
                                <v-img src="../assets/logos/cambridge.png" contain/>
                            </v-col>
                            <v-col cols="3">
                                <v-img src="../assets/logos/cern.png" height="55px" contain/>
                            </v-col>
                            <v-col cols="3">
                                <v-img src="../assets/logos/cornell.png" contain/>
                            </v-col>
                            <v-col cols="3">
                                <v-img src="../assets/logos/hopkins.png" contain/>
                            </v-col>
                        </v-row>

                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="5">
                <v-card class="px-3 pb-10" :loading="formIsLoading">
                    <v-card-title class="pt-12">
                        <span v-if="!formIsSubmitted">
                            Schedule your live demo
                        </span>
                        <span v-if="formIsSubmitted">
                            Success!
                        </span>
                    </v-card-title>
                    <v-form
                            v-model="formIsValid"
                            ref="form"
                            class="pa-3"
                            :disabled="formIsLoading"
                            v-if="!formIsSubmitted"
                    >
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="formData.givenName"
                                        label="Given name"
                                        outlined
                                        :rules="stringRules"
                                        required
                                />

                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="formData.familyName"
                                        label="Family name"
                                        outlined
                                        :rules="stringRules"
                                        required
                                />

                            </v-col>
                        </v-row>
                        <v-text-field
                                v-model="formData.email"
                                type="email"
                                label="Work email"
                                outlined
                                :rules="emailRules"
                                required
                        />
                        <v-text-field
                                v-model="formData.institution"
                                label="Your institution"
                                outlined
                                :rules="stringRules"
                                required
                        />
                        <v-text-field
                                v-model="formData.job"
                                label="Your job"
                                outlined
                                :rules="stringRules"
                                required
                        />
                        <v-btn
                                @click="submit"
                                color="primary"
                                class="mb-8 mt-4"
                                x-large
                                :loading="formIsLoading"
                        >
                            Request your demo
                        </v-btn>
                    </v-form>
                    <div v-if="formIsSubmitted" class="pa-3 ">
                        <v-alert
                                type="success"
                                prominent
                        >
                            <div class="text-h5 mb-4">Demo request submitted.</div>
                            <p>
                                We'll get in touch with you soon to schedule your free demo!
                            </p>
                        </v-alert>

                            <p class="my-8">
                                If you want to learn more about Unsub, you can check out our <a
                                    href="https://vimeo.com/420183913" target="_blank">demo video,</a> or read the documentation in our
                                <a  href="http://help.unsub.org" target="_blank">help center</a>.
                            </p>
                        <div v-if="1">
                            <v-btn class="mr-4"  href="https://vimeo.com/420183913" target="_blank">
                                Demo video
                                <v-icon small  class="ml-2">mdi-open-in-new</v-icon>
                            </v-btn>
                            <v-btn href="http://help.unsub.org" target="_blank">
                                Help center
                                <v-icon small class="ml-2">mdi-open-in-new</v-icon>
                            </v-btn>
                        </div>

                    </div>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
    import {api} from "../api";
    import {sleep} from "../shared/util";
    import axios from 'axios'
    import appConfigs from "../appConfigs";

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
                },
                stringRules: [
                    v => !!v || "This field is required."
                ],
                emailRules: [
                    v => !!v || "This field is required.",
                    v => /.+@.+/.test(v) || 'This email isn\'t valid.',
                    v => {
                        if (/gmail|hotmail|yahoo|inbox\.ru|qq\.com/.test(v)) {
                            return 'This looks like a personal email address.'
                        }
                        else return true
                    }
                ],
                formIsValid: false,
                formIsLoading: false,
                formIsSubmitted: false,

            }
        },
        computed: {
            testimonialsToShow() {
                return appConfigs.testimonials.filter(t => {
                    return t.displayOnPage.includes("demo")
                })
            },

        },
        methods: {
            // here's how to do validation: https://vuetifyjs.com/en/components/forms/#props
            async submit() {
                this.$refs.form.validate()
                if (!this.formIsValid) {
                    console.log("form is not ready")
                    return
                }

                const baseUrl = "https://hooks.zapier.com/hooks/catch/194181/o7zdbid"
                const stringified = queryString.stringify(this.formData)
                const url = baseUrl + "?" + stringified

                console.log("user sending this email:", this.formData, url)
                this.formIsLoading = true
                const resp = await axios.get(url)
                this.formIsLoading = false
                this.formIsSubmitted = true
                console.log("got response back", resp)
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