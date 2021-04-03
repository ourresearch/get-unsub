<template>
    <v-container>
        <v-row>
            <v-col cols="6" class="hidden-xs-only">
                <v-card class="py-10 px-10">
                    <div class="text-h3 font-weight-bold mb-6">
                        Get Unsub for your library
                    </div>
                    <div class="">
                        <p class="my-3">
                            The Unsub dashboard is a subscription service. Although our code is <a href="https://github.com/ourresearch/get-unsub">open source</a>, it costs money for us to maintain and operate the service; the subscription fee helps <a href="https://ourresearch.org">our nonprofit</a> offset that cost, and keeps us sustainable.
                        </p>
                        <ul>
                            <li>
                                <strong>Questions about pricing?</strong> <a
                                    href="http://help.unsub.org/en/articles/5104889-how-is-pricing-for-unsub-set">Check
                                out this article in our Knowledge Base</a>.
                            </li>
                            <li>
                                <strong>Want to see a live demo?</strong> You can
                                <router-link to="./request-demo">schedule one here</router-link>
                                .
                            </li>
                            <li>
                                <strong>Want to get in touch?</strong> Drop us a line at
                                <a href="team@ourresearch.org">team@ourresearch.org</a> or use the blue message button
                                on
                                the lower-right of your screen.
                            </li>
                        </ul>

                        <p class="mt-8">
                            Thanks a lot for supporting our work!
                        </p>
                        <p>
                            Best,
                        </p>


                        <v-card
                                flat
                                class="my-2 py-2"
                        >
                            <div class="d-flex">
                                <v-avatar class="mr-4">
                                    <v-img src="https://i.imgur.com/i1JCjuf.jpg"></v-img>
                                </v-avatar>
                                <div>
                                    <div>Heather Piwowar and Jason Priem</div>
                                    <div class="body-2">
                                        Unsub Co-founders
                                    </div>
                                </div>

                            </div>

                        </v-card>


                        <!--                        <v-divider class="my-10"/>-->
                        <!--                        <div class="text-h6 primary&#45;&#45;text mb-6">-->
                        <!--                            Join 300+ forward-thinking libraries worldwide:-->
                        <!--                        </div>-->
                        <!--                        <v-row align="center">-->
                        <!--                            <v-col cols="3">-->
                        <!--                                <v-img src="../assets/logos/cambridge.png" contain/>-->
                        <!--                            </v-col>-->
                        <!--                            <v-col cols="3">-->
                        <!--                                <v-img src="../assets/logos/cern.png" height="55px" contain/>-->
                        <!--                            </v-col>-->
                        <!--                            <v-col cols="3">-->
                        <!--                                <v-img src="../assets/logos/cornell.png" contain/>-->
                        <!--                            </v-col>-->
                        <!--                            <v-col cols="3">-->
                        <!--                                <v-img src="../assets/logos/hopkins.png" contain/>-->
                        <!--                            </v-col>-->
                        <!--                        </v-row>-->

                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6">
                <v-card class="px-3 pb-10" :loading="formIsLoading">
                    <v-form
                            v-model="formIsValid"
                            ref="form"
                            class="pa-3 pt-12"
                            :disabled="formIsLoading"
                            v-if="!formIsSubmitted"
                    >

                        <div class="text-h5 mb-8">1. Required info</div>

                        <v-text-field
                                v-model="formData.institution"
                                label="Institution"
                                placeholder="University of Gondor"
                                outlined
                                :rules="stringRules"
                                required
                        />
                        <v-text-field
                                v-model="formData.accountOwnerEmail"
                                type="email"
                                label="Account owner email"
                                placeholder="awesome-librarian@gondor.edu"
                                outlined
                                :rules="emailRules"
                                required
                        />
                        <v-text-field
                                v-model="formData.billingEmail"
                                type="email"
                                label="Billing email"
                                placeholder="accounts@gondor.edu"
                                outlined
                                :rules="emailRules"
                                required
                        />
                        <v-text-field
                                v-model="formData.mailingAddress"
                                type="address"
                                label="Billing mailing address"
                                placeholder="42 South Rd, Minas Tirith, Gondor, 424242"
                                outlined
                                :rules="stringRules"
                                required
                        />

                        <v-row>
                            <v-col cols="12" sm="7" class="">
                                <v-select
                                        v-model="formData.cost"
                                        :items="plans"
                                        item-text="descr"
                                        item-value="costStr"
                                        label="Library materials budget (USD)"
                                        outlined
                                />
                            </v-col>
                            <v-col cols="12" sm="4" class="pb-0">
                                <v-text-field
                                        v-model="formData.cost"
                                        label="Your annual cost"
                                        readonly
                                        outlined
                                />

                            </v-col>
                            <v-col cols="1" class="pl-0">
                                <v-btn icon href="http://help.unsub.org/en/articles/5104889-how-is-pricing-for-unsub-set" target="_blank" class="mt-3 ml-0 pl-0">
                                    <v-icon>mdi-help-circle-outline</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-checkbox
                                class="pt-0 mt-0"
                                v-model="formData.userAgreesToTerms"
                                :rules="checkboxRules"
                        >
                            <template v-slot:label>
                                <div>
                                    I agree to the
                                    <a
                                            href="./unsub-toc.pdf"
                                            target="_blank"
                                            @click.stop
                                    >
                                        terms and conditions
                                    </a>
                                </div>
                            </template>

                        </v-checkbox>


                        <div class="text-h5 mb-8 mt-12">2. Optional info</div>

                        <v-text-field
                                v-model="formData.ccEmails"
                                type="email"
                                label="Billing CC emails"
                                placeholder="éowyn@gondor.edu, aragorn@gondor.edu"
                                outlined
                        />

                        <v-textarea
                                v-model="formData.notes"
                                label="Additional notes"
                                placeholder="The purchase number for this order is #4242; please include that on all correspondence."
                                outlined
                        />

                        <div v-if="formIsValid" class="lets-do-this mb-3">
                            <div class="text-h5 mb-4 mt-12">3. We're ready to roll</div>

                            <div class="">
                                <p>
                                    When you click the button, within a few days we'll:

                                </p>
                                <ul>
                                    <li>
                                        send an invoice for <strong>{{formData.cost}}</strong>
                                        to <strong>{{formData.billingEmail}}</strong>
                                        <span v-if="formData.ccEmails"> (we'll also CC {{formData.ccEmails}})</span>.
                                    </li>
                                    <li>
                                        start creating your custom Unsub dashboard, which generally takes a day or
                                        two
                                        to finish; we'll send updates and requests related to that process to
                                        <strong>{{formData.accountOwnerEmail}}</strong>.
                                    </li>
                                </ul>


                            </div>
                        </div>

                        <v-btn
                                @click="submit"
                                color="primary"
                                class="mb-8 mt-4"
                                x-large
                                :loading="formIsLoading"
                        >
                            Get Unsub
                        </v-btn>
                    </v-form>
                    <div v-if="formIsSubmitted" class="pa-3 ">
                        <v-alert
                                type="success"
                                prominent
                        >
                            <div class="text-h5 mb-4">Account created!</div>
                            <div>You'll be hearing from us soon!</div>
                        </v-alert>

                        <p class="mt-5">
                            Within a few days we'll:
                        </p>
                        <ul class="pb-4">
                            <li>
                                send an invoice for <strong>{{formData.cost}}</strong>
                                to <strong>{{formData.billingEmail}}</strong>
                                <span v-if="formData.ccEmails"> (we'll also CC {{formData.ccEmails}})</span>.
                            </li>
                            <li>
                                start creating your custom Unsub dashboard, which generally takes a day or
                                two
                                to finish; we'll send updates and requests related to that process to
                                <strong>{{formData.accountOwnerEmail}}</strong>.
                            </li>
                        </ul>
                        <p>
                            If you want to learn more about Unsub in the meantime, you can check out our <a
                                href="https://vimeo.com/420183913" target="_blank">Getting Started video,</a> or read the
                            documentation in our
                            <a href="http://help.unsub.org" target="_blank">help center</a>.
                        </p>
                        <p>
                            Thanks for supporting Unsub, and we're looking forward to working with you!

                        </p>
                        <div v-if="1" class="mt-12">
                            <v-btn class="mr-4" href="https://vimeo.com/433448412" target="_blank">
                                video
                                <v-icon small class="ml-2">mdi-open-in-new</v-icon>
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
    import {tiers} from "../shared/myStripe";

    import axios from 'axios'
    import appConfigs from "../appConfigs";

    const queryString = require('query-string');


    export default {
        name: "RequestDemo",

        metaInfo() {
            return {
                title: `Subscribe`
            }
        },
        data() {
            return {
                formData: {
                    institution: "",
                    billingEmail: "",
                    accountOwnerEmail: "",
                    mailingAddress: "",
                    ccEmails: "",
                    notes: "",
                    cost: "",
                    userAgreesToTerms: false,
                },
                stringRules: [
                    v => !!v || "This field is required."
                ],
                emailRules: [
                    v => !!v || "This field is required.",
                    v => /.+@.+/.test(v) || 'This email isn\'t valid.',
                    v => {
                        if (/gmail|hotmail|yahoo/.test(v)) {
                            return 'This looks like a personal address.'
                        } else return true
                    }
                ],
                checkboxRules: [
                    v => !!v || "This is required."
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
            plans() {
                return tiers
            }

        },
        methods: {
            // here's how to do validation: https://vuetifyjs.com/en/components/forms/#props
            async submit() {
                this.$refs.form.validate()
                if (!this.formIsValid) {
                    console.log("form is not ready")
                    return
                }

                const baseUrl = "https://hooks.zapier.com/hooks/catch/194181/ojr5vp3"
                const stringified = queryString.stringify(this.formData)
                const url = baseUrl + "?" + stringified

                console.log("user sending this email:", this.formData, url)
                this.formIsLoading = true
                const resp = await axios.get(url)
                this.formIsLoading = false
                this.formIsSubmitted = true
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
        },
    }
</script>

<style scoped>

</style>