<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="hidden-xs-only">
                <v-card class="py-10 px-10">
                    <div class="text-h3 font-weight-bold">
                        Exercising Your Rights Under the California Consumer Privacy Act (“CCPA”)
                    </div>
                    <div class="pa-3">
                        <div class="py-5">
                            <p>
                                Unsub is committed to protecting individual privacy rights. If you are a California resident wishing to exercise your rights under California law, including the CCPA, please complete the following form, select the options that apply to your request(s) and click the “Submit” button. We will promptly respond to your request. For more on our general privacy practices, please review our Privacy Policy.
                            </p>
                            <p>
                                You are not required to provide all of the information listed below, but we may not be able to respond to your request or provide you with information if we cannot verify your identity or authority. We may contact you to request more information. We will only use the information you provide to verify your identity or authority to make a request and to respond to your request.
                            </p>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card class="px-3 pb-10" :loading="formIsLoading">
                    <v-card-title class="pt-12">
                        <span v-if="!formIsSubmitted">
                            Exercise Your CCPA Rights
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
                                        v-model="formData.firstName"
                                        label="Requestor's First Name"
                                        outlined
                                        :rules="stringRules"
                                        required
                                />

                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="formData.lastName"
                                        label="Requestor's Last Name"
                                        outlined
                                        :rules="stringRules"
                                        required
                                />

                            </v-col>
                        </v-row>
                        <v-text-field
                            v-model="formData.company"
                            type="text"
                            label="Company"
                            outlined
                        />
                        <v-text-field
                            v-model="formData.email"
                            type="email"
                            label="Requestor's E-mail"
                            outlined
                            :rules="emailRules"
                            required
                        />
                        <v-text-field
                            v-model="formData.phone"
                            type="text"
                            label="Requestor's Phone Number"
                            outlined
                        />
                        <v-text-field
                            v-model="formData.address"
                            label="Requestor's Mailing Address"
                            outlined
                        />
                        <div>
                            Please indicate if you are exercising a right yourself, exercising a right on behalf of your minor child, or if you are acting as an authorized agent on behalf of another:
                        </div>
                        <v-radio-group v-model="formData.rightFor">
                            <v-radio
                                label="Exercising a right myself"
                                value="right-for-myself"
                            ></v-radio>
                            <v-radio
                                label="Exercising a right for my minor child"
                                value="right-for-minor-child"
                            ></v-radio>
                            <v-text-field
                                v-model="formData.childName"
                                label="Name of child"
                                outlined
                            />
                            <v-radio
                                label="Acting as an authorized agent"
                                value="right-for-acting-as-authorized-agent"
                            ></v-radio>
                            <v-text-field
                                v-model="formData.representedName"
                                label="Name of California resident on whose behalf you are acting"
                                outlined
                            />
                        </v-radio-group>
                        
                        <div>
                            Preferred Method of Contact (check all that apply):
                        </div>
                        <v-checkbox
                            v-model="formData.contactEmail"
                            label="E-mail"
                        />
                        <v-checkbox
                            v-model="formData.contactPhone"
                            label="Telephone"
                        />
                        <v-checkbox
                            v-model="formData.contactMail"
                            label="Mail"
                        />

                        <div class="pt-10">
                            Rights You Are Exercising (check all that apply):
                        </div>
                        <v-checkbox
                            v-model="formData.rightKnow"
                            label="Right to Know"
                        />
                        <v-checkbox
                            v-model="formData.rightDelete"
                            label="Right to Delete"
                        />
                        <v-checkbox
                            v-model="formData.rightShine"
                            label="Shine the Light request"
                        />

                        <div class="pt-10">
                            Additional Comments:
                        </div>
                        <v-textarea
                            v-model="formData.comments"
                            outlined
                        />

                        <div class="pt-10">
                            <p>
                                We may contact you via the information you have provided above and ask for additional information to verify your identity or authority.
                            </p>
                            <p>
                                We will notify you if your request has been granted or declined, or if an exception applies to your request. If you need assistance or have questions regarding your individual rights request, please contact us at 707-889-3263 or email: <a href="mailto:support@unsub.org">support@unsub.org</a>.
                            </p>
                        </div>


                        <v-btn
                            @click="submit"
                            color="primary"
                            class="mb-8 mt-4"
                            x-large
                            :disabled="!formIsValid"
                            :loading="formIsLoading"
                        >
                            Submit
                        </v-btn>
                    </v-form>
                    <div v-if="formIsSubmitted" class="pa-3 ">
                        <v-alert
                                type="success"
                                prominent
                        >
                            <div class="text-h5 mb-4">Form submitted.</div>
                            <p>
                                We'll get back to you within 45 days.
                            </p>
                        </v-alert>
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
        name: "PrivacyForm",

        metaInfo() {
            return {
                title: `CCPA Form`
            }
        },
        data() {
            return {
                formData: {
                    firstName: "",
                    lastName: "",
                    company: "",
                    email: "",
                    phone: "",
                    address: "",
                    rightFor: "",
                    childName: "",
                    representedName: "",
                    contactEmail: "",
                    contactPhone: "",
                    contactMail: "",
                    rightKnow: "",
                    rightDelete: "",
                    rightShine: "",
                    comments: "",
                },
                stringRules: [
                    v => !!v || "This field is required."
                ],
                emailRules: [
                    v => !!v || "This field is required.",
                    v => /.+@.+/.test(v) || 'This email isn\'t valid.'
                ],
                formIsValid: false,
                formIsLoading: false,
                formIsSubmitted: false,
            }
        },
        computed: {},
        methods: {
            // here's how to do validation: https://vuetifyjs.com/en/components/forms/#props
            async submit() {
                this.$refs.form.validate()
                if (!this.formIsValid) {
                    console.log("form is not ready")
                    return
                }

                const baseUrl = "https://hooks.zapier.com/hooks/catch/194181/blcgn81"
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
