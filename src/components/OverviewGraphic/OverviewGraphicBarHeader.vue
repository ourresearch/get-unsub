<template>
    <v-dialog
            v-model="modalOpen"
            width="500"
    >
        <template v-slot:activator="{ on }">
            <div class="under-bar" v-on="on">
                <div class="first-row">
                    <div class="numbers">
                        <div class="main-number">
                            {{mainNumber }}
                        </div>
                        <div class="small-number currency">
                            {{secondaryNumber}}
                        </div>
                    </div>
                    <div class="label">
                        <div v-html="titleWithBreak"></div>
                    </div>
                    <div>
                        <v-icon>mdi-information-outline</v-icon>
                    </div>
                </div>

            </div>
        </template>
        <v-card>
            <v-card-title>
                <v-icon class="mr-3">mdi-information-outline</v-icon>
                {{title}}
            </v-card-title>
            <v-card-text>
                More help information coming here very soon...
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "OverviewGraphicBarHeader",
        props: {
            title: String,
            mainNumber: String,
            secondaryNumber: String,
        },
        data() {
            return {
                modalOpen: false,
            }
        },
        computed: {
            titleWithBreak() {
                return this.title.replace(" ", "<br>")
            }
        }
    }
</script>

<style scoped lang="scss">
    .under-bar {
        padding: 10px 0;
        font-size: 18px;

        .first-row {
            line-height: 1;
            display: flex;
            text-align: left;
            align-items: center;

            &:hover {
                color: green;
            }

            cursor: help;

            div.numbers {
                padding-right: 10px;

                .main-number {
                    font-size: 30px;
                }

                .small-number {
                    font-size: 14px;
                    text-align: left;
                }
            }

            .label {
                width: 100%;
                font-weight: bold;
                line-height: 1.4;
            }

            i {
                display: none;
            }

        }

    }

</style>