<template>
    <div
            @click="openJournalZoom"
            class="journal-dot-container">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <div class="journal-dot"
                     v-on="on"
                     :style="{background: (journal.subscribed) ? subrColor : illColor}"
                     :class="{subscribed: journal.subscribed}"></div>
            </template>
            <span>
                <span class="journal-title">{{journal.title}}:</span>
                <span v-if="journal.ncppu !== null">
                    ${{journal.ncppu | round(2)}} per use
                </span>
                <span v-if="journal.ncppu == null">
                    Zero usage
                </span>
            </span>
        </v-tooltip>

    </div>


</template>

<script>
    import appConfigs from "../../appConfigs";

    export default {
        name: "OverviewGraphicBarSingleDot",
        props: {
            journal: Object,
        },
        data() {
            return {
                subrColor: appConfigs.costSegments.subr.color,
                illColor: appConfigs.costSegments.ill.color
            }
        },
        computed: {},
        methods: {
            async subscribe() {
                this.journal.subscribed = true
                await this.$store.dispatch("addSubr", this.journal.issn_l)
                this.$store.commit("snackbar", "Journal subscribed!")
                console.log("subscribe!", this.journal)
            },
            async unsubscribe(){
                this.journal.subscribed = false
                await this.$store.dispatch("removeSubr", this.journal.issn_l)
                this.$store.commit("snackbar", "Journal unsubscribed!")
                console.log("unsubscribe!", this.journal)

            },
            async toggleSubscribed(){
                if (this.journal.subscribed) {
                    this.unsubscribe()
                }
                else {
                    this.subscribe()
                }
            },
            openJournalZoom(){
                this.$store.commit('setZoomIssnl', this.journal.issn_l)
            },
        }
    }
</script>

<style scoped lang="scss">
    .journal-dot-container {
        &:hover {

        }

    }


    .journal-dot {
        /*background: #ccc;*/
        opacity: .5;
        border-radius: 5px;
        height: 8px;
        width: 8px;
        padding: 1px;
        border: 1px solid #fff;
        cursor: pointer;

        &:hover {
            border: 1px solid #333;
        }

        /*width: 100%;*/
        /*height: 100%;*/

        &.subscribed {
            /*background: dodgerblue;*/
            opacity: 1;
        }
    }

</style>