<template>
    <v-container class="purchase">
        <v-row class="pt-12" align="center" justify="center">

            <v-card width="800" v-if="$route.params.result==='success'">
                <v-card-actions>
                    <v-alert prominent type="success">
                        <h1 class="display-1 pb-6">We're working on your account!</h1>
                        <p>
                            Account creation takes a day or two. We'll start setting up your account ASAP, and  send you an email when it’s ready to use.
                        </p>
                        <p>
                             Thanks for supporting Unsub, and we're looking forward to working with you!
                        </p>

                    </v-alert>
                </v-card-actions>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed color="primary" to="/">
                        ok
                    </v-btn>
                </v-card-actions>
            </v-card>



            <v-card width="800" v-if="$route.params.result !== 'success'">
                <v-card-actions>
                    <v-alert prominent type="error">
                        <h1 class="display-1">Something went wrong with your purchase!</h1>
                        <div>

                            We're sorry, but there was some kind of problem and your order didn't work. You may want to try again...or feel free to contact us to let us know about the bug. We'll make sure to get it figured out.
                        </div>

                    </v-alert>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed to="/purchase">
                        Try again
                    </v-btn>
                    <v-btn depressed href="mailto:team@ourresearch.org">
                        report bug
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-row>


    </v-container>
</template>

<script>


    export default {
        name: "PurchaseResult",

        metaInfo: {
            title: "Thanks for your purchase! | Unsub"
        },
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
