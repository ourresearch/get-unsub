<template>
    <v-container class="purchase">
        <v-card>
            <v-card-title>
                <h1 class="display-1">Purchase</h1>
            </v-card-title>
            <v-card-actions>
                <div>
                    <div class="display-2" v-if="false">
                        Combine journal-level citations, downloads, Open Access statistics and more, to confidently
                        manage your serials collections.

                    </div>

                    <div>
                        <p>
                            Unpaywall Journals is a project from <a href="https://ourresearch.org">Our Research</a>, a
                            501(c)3 nonprofit. Like everything we build, Unpaywall Journals is built using <a
                                href="https://github.com/ourresearch/unpaywall-journals">Open Source code</a>, an open
                            data API, and an accessible, sustainable pricing model.

                        </p>
                        <p>

                            We want all institutions to be able to afford this tool. To achieve this, we are setting the
                            introductory price at $1000/year (US dollars) -- less than the price of a single article APC
                            or single journal subscription. In return for this, your institution becomes a supporter of
                            Open Infrastructure, a partner in Unpaywall Journals, gets an Unpaywall Journals dashboard
                            customized to your institution. You will be able to upload your own COUNTER stats,
                            subscription history, and price lists. We'll use this information to customize the usage,
                            open access percentages, citations, authorships, and prices for your university. If your
                            institution would like to contribute more, we will gladly accept donations and will use that
                            money to continue making tools and data as openly available as possible.
                        </p>

                    </div>


                    <v-row justify="center">

                        <v-card flat width="800">

                            <v-list>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon>mdi-checkbox-marked-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Customize usage stats
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            Calculate usage based on your own uploaded COUNTER files.
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>


                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon>mdi-checkbox-marked-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Customize authorship and citation stats
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            Include automatically-gathered authorship and citation data for your institution.
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon>mdi-checkbox-marked-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Customize authorship and citation stats
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            Include automatically-gathered authorship and citation data for your institution.
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>




                            </v-list>
                        </v-card>
                    </v-row>


                </div>
            </v-card-actions>


            <v-card-actions>
                <v-btn depressed @click="buy">buy stuffs</v-btn>

            </v-card-actions>
        </v-card>


    </v-container>
</template>

<script>


    export default {
        name: "Purchase",
        data: () => ({
            stripe: null
        }),
        methods: {
            buy() {
                // const items = [{plan: 'plan_G7NhsHeygR4RyZ', quantity: 1}]
                const items = [{plan: 'plan_G7bKcaYos2it45', quantity: 1}]

                console.log("buy!")
                this.stripe.redirectToCheckout({
                    items: items,
                    successUrl: 'https://journals.unpaywall.org/purchase/success',
                    cancelUrl: 'https://journals.unpaywall.org/purchase/cancelled',
                    billingAddressCollection: 'auto',
                })
                    .then(function (result) {
                        if (result.error) {
                            alert("Sorry, there was an error! Please let us know at team@ourresearch.org")
                        }
                    })
            }
        },
        mounted() {
            console.log("purchase page mounted")
            // this.stripe = Stripe('pk_live_Tddf5sFepB22pgOBTUpVKE53');
            this.stripe = Stripe('pk_test_S6h1hrajCcR8tskZ0uayuI9m');
        }
    }
</script>

<style scoped>

</style>