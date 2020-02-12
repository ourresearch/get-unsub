<template>
    <v-dialog
            v-model="modalOpen"
            width="500"
    >
        <template v-slot:activator="{ on }">
            <div
                    :style="{color: myColor}"
                    class="under-bar text-right"
                    v-on="on">
                <div class="title">
                    <div class="body-2" v-html="title"></div>
                </div>
                <div class="main-number headline">
                    {{mainNumber }}
                </div>
                <div class="secondary-number body-2"
                     :class="{overage: parseInt(secondaryNumber) > 100}"
                     v-if="secondaryNumber">
                    <span class="val">
                        {{secondaryNumber}}
                    </span>
                    <span class="label">{{secondaryNumberLabel}}</span>
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
            secondaryNumberLabel: String,
            color: String,
        },
        data() {
            return {
                modalOpen: false,
            }
        },
        computed: {
            titleWithBreak() {
                return this.title.replace(" ", "<br>")
            },
            myColor() {
                return (this.color) ? this.color : "#333333"
            }

        }
    }
</script>

<style scoped lang="scss">
    .under-bar {
        padding: 10px 0;
        font-size: 18px;

        .secondary-number {
            &.overage {
                font-weight: bold;
                color: red;
            }
        }

        .first-row {
            line-height: 1;

            cursor: help;


        }

        i {
            display: none;
        }

    }

</style>