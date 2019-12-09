<template>
    <v-dialog width="400px" v-model="$store.state.showInfo">
        <v-card v-if="$store.state.showInfo">
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    <v-icon>mdi-information-outline</v-icon>
                    {{$store.getters.infoKey}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon text @click="close()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>


            <v-card-text>
                <div v-if="key=='test1'">
                    This is the text for 'test1'
                </div>
                <div v-if="key=='backfile'">
                    Content for which you already have purchased perpetual access. We model this using your COUNTER data
                    and the readership decay curve over time for each title.
                </div>
                <div v-if="key=='Ill estimate'">
                    We estimate ILL behavior based on published literature and private communications with libraries
                    that have tracked ILL statistics after cancellations. These natural experiments let model the
                    (modest) increase in ILL requests after loss of subscription access.
                </div>
                <div v-if="key=='Big Deal journals'">
                    Info about your Big Deal journals goes here.
                </div>
                <div v-if="key=='Subscribed journals'">
                    Info about your subscribed journals goes here.
                </div>
                <div v-if="key=='Journal prices'">
                    <p>
                        This scenario is currently using the Elsevier North American a-la-carte journal price list, as
                        published on their website.
                    </p>
                    <p>
                        If you’d like to enter custom prices of your own, you can do that on the package page (click “My Elsevier Freedom Package” at the top of your screen)
                    </p>
                </div>


            </v-card-text>
        </v-card>
    </v-dialog>


</template>

<script>
    import configs from "../appConfigs"

    export default {
        name: "InfoDialog",
        props: [],
        data() {
            return {}
        },
        methods: {
            close() {
                this.$store.commit("clearInfo")
            },
        },
        computed: {
            key() {
                return this.$store.getters.infoKey
            }
        }
    }
</script>

<style scoped>

</style>