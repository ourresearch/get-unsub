<template>
    <v-dialog width="400px" v-model="$store.state.showColInfo">
        <v-card v-if="$store.state.showColInfo">
          <v-card-title>
                    <v-icon left>mdi-information-outline</v-icon>
                    {{$store.getters.colInfo.text}}
          </v-card-title>

            <v-card-text>
                <div class="pa-3" v-html="$store.getters.colInfo.descr"></div>

            </v-card-text>
          <v-card-actions>
                <v-btn text @click="close()">
                    Close
                </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>


</template>

<script>
    import configs from "../../appConfigs"

    export default {
        name: "ColInfoDialog",
        props: [],
        data() {
            return {
            }
        },
        methods: {
            close(){
                this.$store.commit("clearColInfo")
            },
        },
        computed: {
        }
    }
</script>

<style scoped>

</style>