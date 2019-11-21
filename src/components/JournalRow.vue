<template>
    <tr @click="openSingleJournal()">
        <td class="title-column">
            <v-row class="" style="width:400px;">
                <v-col style="flex-grow:1;">
                    <v-btn icon text
                           @click.stop="subscribe(journal.meta.issn_l)"
                           v-if="!journal.meta.subscribed">
                        <v-icon>mdi-cart-outline</v-icon>
                    </v-btn>
                    <v-btn icon text
                           @click.stop="unsubscribe(journal.meta.issn_l)"
                           v-if="journal.meta.subscribed">
                        <v-icon>mdi-cart</v-icon>
                    </v-btn>
                </v-col>

                <v-col style="flex-grow:222;">
                    <div :style="{'font-weight': journal.meta.subscribed ? 'normal' : 'normal'}"
                         style="font-size:18px;">{{journal.meta.title}}
                    </div>
                    <div class="caption">{{journal.meta.subject}}</div>

                </v-col>
            </v-row>
        </td>
        <td v-for="header in headers" :key="journal.meta.issn_l + header.value">
            <span v-if="header.display==='number'">
                {{ journal.table_row[header.value].toLocaleString()}}
            </span>
            <span v-if="header.display==='percent'">
                {{ journal.table_row[header.value] | round }}%
            </span>
            <span v-if="header.display==='currency'">
                {{ journal.table_row[header.value] | currency({fractionCount:2}) }}
            </span>
            <span v-if="header.display==='currency_int'">
                {{ journal.table_row[header.value] | currency }}
            </span>
            <span v-if="header.display==='text'">
                {{ journal.table_row[header.value] }}
            </span>
            <span v-if="header.display==='float1'">
                {{ journal.table_row[header.value].toFixed(1) }}
            </span>
        </td>
        <td class="spacer">&nbsp;</td>


    </tr>
</template>

<script>
    export default {
        props: ["journal", "headers"],
        name: "JournalRow",
        methods: {
            subscribe() {
                console.log("subscribe!")
            },
            unsubscribe() {
                console.log("unsubscribe!")
            },
            openSingleJournal() {
                console.log("@click on openSingleJournal()")
                this.$store.commit('setZoomIssnl', this.journal.meta.issn_l)
            },
        }
    }
</script>

<style scoped lang="scss">
    td {
        padding: 0 10px;
        text-align: right;
        &.title-column {
            text-align: left;
        }
    }

</style>