<template>
    <v-card flat class="py-4">
        <v-row>
            <v-col cols="5">
                <div class="caption text--secondary">{{ journal.issnl }}</div>
                <div class="subtitle-1">{{journal.name}}</div>
                <div class="body-2">
                    <v-chip
                            x-small
                            outlined
                            class="mr-2"
                            v-for="reason in journal.omittedBecause"
                            :key="reason"
                    >
                        {{reason}}
                    </v-chip>
                </div>
            </v-col>
            <v-col cols="2" class="text-right">
                <div class="caption text--secondary">Price ({{journal.priceSource}})</div>
                <div v-if="journal.price" class="subtitle-1">{{ journal.price | currency }}</div>
                <div v-if="!journal.price">-</div>
            </v-col>
            <v-col cols="2" class="text-right">
                <div class="caption text--secondary">Downloads</div>
                <div class="subtitle-1">{{ journal.downloads | round }}</div>
            </v-col>
            <v-col cols="3" class="text-right">
                <div class="caption text--secondary">Perpetual access ({{journal.paSource}})</div>
                <div class="subtitle-1 d-flex justify-end">
                    <span class="date-start">
                        <quick-tooltip
                                v-if="journal.paStart"
                                :anchor="journal.paStart | moment('YYYY')"
                        >
                            You have perpetual access starting {{journal.paStart | moment('MMM Do, YYYY')}} (dates earlier than 2010 are ignored).
                        </quick-tooltip>
                        <quick-tooltip
                                v-if="!journal.paStart"
                                anchor="2010"
                        >
                            You have perpetual access starting Jan 1st, 2010. This is the default (dates earlier than 2010 are ignored).
                        </quick-tooltip>

                    </span>
                    -
                    <span class="date-end">
                        <span v-if="journal.paEnd">
                            {{ journal.paEnd | moment('YYYY') }}
                        </span>
                        <span v-if="!journal.paEnd">now</span>
                    </span>
                </div>
            </v-col>
        </v-row>

    </v-card>
</template>

<script>
    import {makePublisherJournalRow} from "../../shared/publisher";
    import QuickTooltip from "../QuickTooltip";

    export default {
        name: "PublisherJournalTableRow",
        components: {QuickTooltip},
        props: ["journal"],
        computed: {
            columns(){
                return makePublisherJournalRow(this.journal)
            }
        },
    }
</script>

<style scoped>

</style>