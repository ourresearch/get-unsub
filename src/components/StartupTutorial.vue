<template>
    <v-dialog  width="600" persistent
            v-model="$store.state.startupTutorialOpen">
        <v-card>
            <v-stepper v-model="step">
                <v-stepper-header>
                    <v-stepper-step :complete="step > 1" step="1"></v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="step > 2" step="2"></v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3"></v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">

                        <v-card class="pa-4">
                            <div class="headline">
                                Welcome to Unsub!
                            </div>
                            <v-divider class="my-3"></v-divider>
                            <div>
                                In this demo account, we'll look at a large US university’s Elsevier big deal package (this is all real data). You can try cancelling and subscribing to different journals, and see the effect it has on your overall cost, and overall access.
                            </div>
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-btn
                                        color="primary"
                                        @click="step = 2"
                                >
                                    next
                                    <v-icon right>mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-row>
                        </v-card>


                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card class="pa-4">
                            <div class="headline">
                                Here are a few things to try!
                            </div>
                            <v-divider class="my-3"></v-divider>
                            <div>
                                <ol>
                                    <li class="my-4">
                                        Edit journal subscriptions in bulk from the Overview page (that's the page you're on right now), and see how you can fulfill most usage instantly, without spending nearly as much money as you were on the Big Deal.
                                    </li>
                                    <li class="my-4">
                                        Subscribe to individual journals on the Journals page (click the small <v-btn small icon><v-icon>mdi-cart</v-icon></v-btn> icon next to each one).
                                    </li>
                                    <li class="my-4">
                                        Edit configs (the <v-icon>mdi-settings</v-icon> icon at top right) and see how it changes your access and cost projections.
                                    </li>
                                </ol>

                            </div>
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-btn
                                        color="primary"
                                        @click="step = 3"
                                >
                                    next
                                    <v-icon right>mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-row>
                        </v-card>

                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card class="pa-4">
                            <div class="headline">
                                Have fun!
                            </div>
                            <v-divider class="my-3"></v-divider>
                            <div>
                                This is a beta launch, and we're keen to hear any feedback you may have. And if you like what you see in the demo, consider
                                <a @click="$store.commit('clearStartupTutorial')" href="/purchase">purchasing a custom account</a> for your own university!
                            </div>

                            <v-row>
                                <v-spacer></v-spacer>
                                <v-btn
                                        color="primary"
                                        @click="$store.commit('clearStartupTutorial')"
                                >
                                    Let's do this
                                    <v-icon right>mdi-check</v-icon>
                                </v-btn>
                            </v-row>
                        </v-card>

                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-card>


    </v-dialog>
</template>

<script>
    export default {
        name: "StartupTutorial",
        props: ["data"],
        data: () => ({
            step: 1
        }),
    }
</script>

<style scoped>

</style>