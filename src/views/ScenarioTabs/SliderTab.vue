<template>
    <v-container fluid class="tab" v-if="data">
        <v-row>
            <v-col cols="8">
                <v-row>
                    <v-col>
                        <v-row style="height:500px;">
                            <v-col cols="1"></v-col>
                            <v-col cols="11">
                                <div class="bar-wrapper">
                                    <div class="bar-fill"></div>
                                    <div class="bar" :style="{height: costPercent+'%'}"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row></v-row>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="4">
                <pre>{{data}}</pre>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "SliderTab",
        data(){
            return {
                cost: 1000000
            }
        },
        computed: {
            costPercent(){
                return 100 * this.cost / this.data._summary.cost_bigdeal_projected
            },
            instantUsage(){
                return 142
            },
            instantUsagePercent(){
                return 55
            },
            numSubr(){
                return 0
            }

        },
        methods: {

        },
    }
</script>

<style lang="scss" scoped>
    .bar-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        .bar-fill {
            background: #ccc;
            flex-grow: 1000;
        }
        .bar {
            background: rebeccapurple;
        }
    }

</style>