<template>
    <v-dialog
            v-model="helpDialogIsOpen"
            width="500"
    >
        <template v-slot:activator="{ on }">
            <div class="bar-segment"
                 v-on="on"
                 :class="{light: isLight}"
                 :style="{height: percentage+'%'}">
                <strong>{{percentage | round}}%</strong>
                {{name}}
            </div>
        </template>
        <v-card>
            <v-card-title>
                <v-icon>mdi-information-outline</v-icon>
                {{name}}
            </v-card-title>
            <v-card-text>
                More help information coming here very soon...
            </v-card-text>
        </v-card>


<!--        <v-card v-if="name=='savings'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Cost: Savings-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                With these a-la-cart subscriptions, you'd save {{percentage | round}}% compared to continuing with your Big Deal.-->
<!--            </v-card-text>-->
<!--        </v-card>-->
<!--        <v-card v-if="name=='subscription'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Cost: Subscription-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->
<!--        <v-card v-if="name=='costIll'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Cost: Interlibrary Loan-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->


<!--        <v-card v-if="name=='usageIll'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Fulfillment: Interlibrary Loan-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->

<!--        <v-card v-if="name=='usageOther'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Fulfillment: Other delayed sources-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->
<!--        <v-card v-if="name=='usageSubr'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Fulfillment: Journal subscription-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->
<!--        <v-card v-if="name=='usageOa'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Fulfillment: Open Access-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->
<!--        <v-card v-if="name=='usageBackfile'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Fulfillment: Perpetual-access backfile-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->
<!--        <v-card v-if="name=='usageAsn'">-->
<!--            <v-card-title>-->
<!--                <v-icon>mdi-information-outline</v-icon>-->
<!--                Fulfillment: ResearchGate and other Academic Social Networks-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--                this is my card content and stuff-->
<!--            </v-card-text>-->
<!--        </v-card>-->





    </v-dialog>
</template>

<script>
    export default {
        name: "OverviewGraphicBarSegment",
        props: {
            percentage: Number,
            name: String,
            isLight: Boolean
        },
        data(){
          return {
            helpDialogIsOpen: false
          }
        },
    }
</script>

<style scoped lang="scss">
    .bar-segment {
        padding-left: 3px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #fff;
        background: #555;
        &.light {
            background: #ccc;
            &:hover {
                background: #bbb;
            }
        }
        cursor: help;
        &:hover {
            background: #444;
            /*background: green;*/
        }
    }
</style>