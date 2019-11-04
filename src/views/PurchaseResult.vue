<template>
    <v-container class="purchase">
        <v-card v-if="$route.params.result==='success'">
            <v-card-actions>
                <v-alert prominent type="success">
                    <h1 class="display-1">Purchase successful!</h1>
                    <div>

                        Thanks your support! You'll receive an email from us shortly with instructions on how to upload
                        your COUNTER files and set up your new account!
                    </div>

                </v-alert>
            </v-card-actions>

            <v-card-actions>
                <v-btn depressed color="primary" to="/">
                    ok
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card v-if="!$route.params.result !== 'success'">
            <v-card-actions v-if="$route.params.result==='cancelled'">
                <v-alert prominent type="error">
                    <h1 class="display-1">Something went wrong with your purchase!</h1>
                    <div>

                        We're sorry, but there was some kind of problem and your order didn't work. You may want to try again...or feel free to contact us to let us know about the bug. We'll make sure to get it figured out.
                    </div>

                </v-alert>
            </v-card-actions>
            <v-card-actions>
                <v-btn depressed to="/purchase">
                    Try again
                </v-btn>
                <v-btn depressed href="mailto:team@ourresearch.org">
                    report bug
                </v-btn>
            </v-card-actions>

        </v-card>


    </v-container>
</template>

<script>


    export default {
        name: "PurchaseResult",
        data: () => ({
            stripe: null
        }),
        methods: {
            buy() {
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