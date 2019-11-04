<template>
    <v-container class="purchase">
        <h1 class="display-3">Purchase</h1>

        <v-btn @click="buy">buy stuffs</v-btn>

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
                console.log("buy!")
                this.stripe.redirectToCheckout({
                    items: [{plan: 'plan_G7NhsHeygR4RyZ', quantity: 1}],
                    successUrl: 'https://journals.upnpaywall.org/purchase-success',
                    cancelUrl: 'https://journals.upnpaywall.org/purchase-cancelled',
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
            this.stripe = Stripe('pk_live_Tddf5sFepB22pgOBTUpVKE53');
        }
    }
</script>

<style scoped>

</style>