<template>
    <v-container class="purchase">
        <v-card>
            <v-card-title>
                <h1 class="display-1">Purchase</h1>
            </v-card-title>
            <v-card-text>
                some actions
            </v-card-text>
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
                    successUrl: 'https://journals.upnpaywall.org/purchase/success',
                    cancelUrl: 'https://journals.upnpaywall.org/purchase/cancelled',
                    billingAddressCollection: 'auto',
                    submitType: 'Purchase',
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