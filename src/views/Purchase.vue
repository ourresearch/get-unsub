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
                        <p class="title">
                            Get the data to forecast, explore, and optimize your alternatives to expensive journal bundles--so you can <em>cancel with confidence</em>
                        </p>
                        <p>
                            Your purchase of an Unsub account lets you create an Unsub dashboard
                            customized to your institution. You will be able to upload your own COUNTER stats,
                            subscription history, and price lists. We'll use this information to customize the usage,
                            open access percentages, citations, authorships, and prices for your university.

                        </p>
                    </div>
                    <v-divider />
                    <v-card flat class="py-4 my-4">
                        <div class="d-flex">
                            <v-avatar class="mr-4">
                                <v-img src="https://i.imgur.com/09uGrea.png"></v-img>
                            </v-avatar>
                            <div>
                                <div class="title">
                                    "Unsub is a game changer."  
                                </div>
                                <div class="body-2">
                                    Mark McBride, SUNY library senior strategist; quoted in <a
                                        href="https://www.sciencemag.org/news/2020/07/tool-saving-universities-millions-dollars-journal-subscriptions"><em>Science</em></a>
                                </div>
                            </div>

                        </div>

                    </v-card>
                    <v-divider />

                    <div class="mt-4">
                        <p>
                            Our pricing is tiered, based on your library's current-year materials budget. (If you're not able to determine your library materials budget, use your best estimate).
                        </p>
                        <p>
                            If you'd like to use Unsub in consortium-level decision making, <a
                                href="mailto:team@ourresearch.org">drop us a line</a> and we can help get you set up with a consortium dashboard.
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
            testMode: true,
            headers: [
                {
                    text: "Library materials budget (USD)",
                    value: "descr",
                },
                {
                    text: "Unsub yearly cost (USD)",
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
                if (!this.planSelected.length) return undefined
                if (this.testMode) {
                    return this.planSelected[0].testPlanId
                }
                else {
                    return this.planSelected[0].planId
                }
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
                const items = [{price: this.myPlanId, quantity: 1}]

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
            if (this.test)
            // this.stripe = Stripe('pk_live_Tddf5sFepB22pgOBTUpVKE53');

            // test account
            this.stripe = Stripe('pk_test_S6h1hrajCcR8tskZ0uayuI9m');
        }
    }
</script>

<style scoped>

</style>