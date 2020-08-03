<template>
    <v-container class="purchase">
        <v-card class="pa-6">
            <v-card-title>
                <h1 class="display-1">
                    {{ (isLoggedIn) ? 'Upgrade to paid account': 'Purchase'}}
                </h1>
            </v-card-title>
            <v-row>
                <v-col cols="6">
                    <div class="">
                        Combine journal-level citations, downloads, Open Access statistics and more, to confidently
                        manage your serials collections.
                    </div>

                    <div>
                        <p>
                            Unsub is a project from <a href="https://ourresearch.org">Our Research</a>, a
                            501(c)3 nonprofit. Like everything we build, Unsub is built using <a
                                href="https://github.com/ourresearch/get-unsub">Open Source code</a>, an open
                            data API, and an accessible, sustainable pricing model.

                        </p>
                        <p>

                            We want all institutions to be able to afford this tool. To achieve this, we are setting the
                            introductory price at $1000/year (US dollars) -- less than the price of a single article APC
                            or single journal subscription. In return for this, your institution becomes a supporter of
                            Open Infrastructure, a partner in Unsub, gets an Unsub dashboard
                            customized to your institution. You will be able to upload your own COUNTER stats,
                            subscription history, and price lists. We'll use this information to customize the usage,
                            open access percentages, citations, authorships, and prices for your university.
                        </p>
                        <p>
                            If your
                            institution would like to contribute more, we will gladly accept donations and will use that
                            money to continue making tools and data as openly available as possible.
                        </p>

                    </div>
                </v-col>
                <v-col cols="6">
                    <v-card outlined>
                        <v-card-text class="headline">
                            Select your price tier:
                        </v-card-text>
                        <v-data-table
                                v-model="planSelected"
                                :headers="headers"
                                :items="plans"
                                :single-select="true"
                                item-key="tier"
                                show-select
                                :hide-default-footer="true"

                        />
                        <v-divider></v-divider>

                        <v-card-text
                                class="d-flex align-center justify-end pb-0 pt-6"
                        >
                            <v-checkbox v-model="agreedToTerms" :disabled="!myPlanId"></v-checkbox>
                            <span>
                                I agree to the <a
                                    href="./unsub-toc.pdf"
                                    target="_blank"
                                    class="ml-1"> Terms and Conditions.</a>
                            </span>
                        </v-card-text>
                        <v-card-actions class="pt-0">
                            <v-spacer />
                            <v-btn
                                    class="ml-2"
                                    :disabled="!(agreedToTerms && myPlanId)"
                                    x-large
                                    text
                                    target="_blank"
                                    :href="'mailto:team@ourresearch.org?cc=accounting@ourresearch.org&subject=Invoice%20request&body=' + invoiceRequestBodyText"
                            >
                                Request invoice
                            </v-btn>
                            <v-btn :disabled="!(agreedToTerms && myPlanId)" x-large color="primary" depressed
                                   @click="buy">
                                purchase now
                            </v-btn>

                        </v-card-actions>

                    </v-card>
                </v-col>
            </v-row>
        </v-card>


    </v-container>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';
    import {tiers} from "../shared/myStripe";

    export default {
        name: "Purchase",
        data: () => ({
            stripe: null,
            agreedToTerms: false,
            planSelected: [],
            headers: [
                {
                    text: "Library materials budget (USD)",
                    value: "descr",
                },
                {
                    text: "Unsub cost",
                    value: "costStr",
                },
            ]
        }),
        computed: {
            ...mapGetters([
                'isLoggedIn',
            ]),
            plans(){
                return tiers
            },
            myPlanCost(){
                return (this.planSelected.length) ? this.planSelected[0].costStr : undefined
            },
            myPlanId(){
                return (this.planSelected.length) ? this.planSelected[0].testPlanId : undefined
            },
            invoiceRequestBodyText() {
                const ret = `Please send me an invoice for: Unsub Dashboard subscription
Institution: [YOUR INSTITUTION NAME]
Billing Email: [YOUR BILLING EMAIL]
Billing Mailing Address: [YOUR BILLING MAILING ADDRESS]
CC Emails: [CC EMAILS (optional)]
Term: 1 year
Fee: ${this.myPlanCost} USD
Start date: today
Other notes: [OTHER NOTES (optional)  ]`
                return encodeURIComponent(ret)
            }

        },
        methods: {
            buy() {
                // real plan
                // const items = [{plan: 'plan_G7NhsHeygR4RyZ', quantity: 1}]

                // test plan
                const items = [{price: this.myPlanId, quantity: 1}]
                // const items = [{price: 'price_1H8zabBHnOim7SiPC6te592L', quantity: 1}]

                console.log("buy!")
                try {
                    this.stripe.redirectToCheckout({
                        lineItems: items,
                        mode: "subscription",
                        successUrl: 'https://journals.unpaywall.org/purchase/success',
                        cancelUrl: 'https://journals.unpaywall.org/purchase/cancelled',
                        billingAddressCollection: 'auto',
                    })
                        .then(function (result) {
                            if (result.error) {
                                alert("We're sorry, but something went wrong! Please let us know at team@ourresearch.org")
                            }
                        })

                } catch {
                    alert("We're sorry, but something went wrong! Please let us know at team@ourresearch.org. Thanks!")

                }


            }
        },
        mounted() {
            console.log("purchase page mounted")
            // this.stripe = Stripe('pk_live_Tddf5sFepB22pgOBTUpVKE53');

            // test account
            this.stripe = Stripe('pk_test_S6h1hrajCcR8tskZ0uayuI9m');
        }
    }
</script>

<style scoped>

</style>