<template>
    <v-dialog
            v-model="modalOpen"
            width="500"
    >
        <template v-slot:activator="{ on }">
            <div
                    class="under-bar mb-8 text-right"
                    v-on="on">
                <div
                        class="main-number headline"
                        :style="{color: color}"
                        style="line-height: 1;"
                >
                    {{mainNumber }}
                </div>
                <div class="title">
                    <span class="title"
                         :style="{color: color}"
                         v-html="title" />
                    <span class="per-year">
                         yearly
                    </span>
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
            <v-toolbar flat dark color="#333333">
                <v-toolbar-title>
                    <v-icon class="mr-3">mdi-information-outline</v-icon>
                    Projected {{title}}
                </v-toolbar-title>
            </v-toolbar>
            <div class="subtitle-1 ma-5">
                <div v-if="type==='cost'">
                    <p>
                        In this scenario, you cancel your Big Deal and then
                        <color-highlighted-phrase color-key="subr" text="purchase subscriptions"/>
                        to <strong>{{ numJournalsSubscribed | round }}</strong> journals (leading to increased
                        <color-highlighted-phrase color-key="ill" text="ILL costs"/>
                        for the remaining {{numJournals - numJournalsSubscribed | round}} journals).
                    </p>
                    <p>
                        We can estimate the costs of both of these, based on our forecasting model and your custom
                        configs. We project this scenario will cost the library <strong>{{mainNumber}}/yr</strong> over
                        the next five years, which is {{secondaryNumber}} of what you were spending on your Big Deal.
                    </p>
                </div>
                <div v-if="type==='usage'">
                    <p>
                        Based on your COUNTER data and our forecasting model, we project that the <strong>{{numJournals}}</strong>
                        journals in this big deal will generate <strong>{{mainNumber}} requests for content</strong>
                        (usage events) over the next five years.
                    </p>
                    <p>
                        <strong>{{secondaryNumber}}</strong> of these requests can be <em>instantly fulfilled,</em> with
                        no inconvenience to users&mdash;either by
                        <color-highlighted-phrase color-key="freeInstant" text="free sources,"/>
                        (Open Access and Post-Termination Access rights) or via your
                        <color-highlighted-phrase color-key="subr" text="title-by-title journal subscriptions"/>

                    </p>
                </div>
            </div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="modalOpen = false">close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import colorHighlightedPhrase from "../colorHighlightedPhrase";

    export default {
        components: {
            colorHighlightedPhrase,
        },
        name: "OverviewGraphicBarHeader",
        props: {
            title: String,
            type: String,
            mainNumber: String,
            secondaryNumber: String,
            secondaryNumberLabel: String,
            color: String,
            numJournals: Number,
            numJournalsSubscribed: Number,
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

        }
    }
</script>

<style scoped lang="scss">
    .under-bar {
        font-size: 18px;
        cursor: help;

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