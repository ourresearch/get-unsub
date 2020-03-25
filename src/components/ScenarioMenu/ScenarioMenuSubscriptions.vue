<template>
    <div>
        <v-menu offset-y min-width="200">
            <template v-slot:activator="{ on }">
                <v-btn
                        text
                        class="text-capitalize"
                        v-on="on"
                >
                    Subscriptions
                </v-btn>
            </template>
            <v-list dense>
                <v-tooltip
                        right
                        max-width="400"
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item @click="clearAllSubrs">
                            <v-list-item-icon class="mr-2">
                                <v-icon>mdi-cart-remove</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="font-weight-regular">
                                Unsubscribe all
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <span>Unsubscribe to all {{scenarioJournals.length}} journals</span>
                </v-tooltip>

                <v-tooltip
                        right
                        max-width="400"
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item @click="">
                            <v-list-item-icon class="mr-2">
                                <v-icon>mdi-cart</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="font-weight-regular">
                                Subscribe all
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <span>Subscribe to to all {{scenarioJournals.length}} journals</span>
                </v-tooltip>


            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "ScenarioMenuSubscriptions",
        computed: {
            ...mapGetters([
                "publisherName",
                "scenarioJournals"
            ]),
        },
        methods: {
            ...mapActions([
                "clearAllSubrs"
            ])
        }
    }
</script>

<style scoped>

</style>