<template>
    <tr>
        <td v-for="header in headers">
            {{ formatValue(cellsDict[header.value]) }}
        </td>
    </tr>
</template>

<script>

    import {mapActions, mapGetters, mapMutations} from "vuex";
    import _ from "lodash";
    import {api, toBase64} from "../../api";

    export default {
        name: "PublisherFileJournalRow",
        props: {
            cellsDict: Object,
            headers: Array,
            label: String,
        },
        data() {
            return {
                dialogIsShowing: false,
                search: "",
            }
        },
        computed: {
            ...mapGetters([
                "publisherId",
            ]),
        },
        methods: {
            ...mapActions([]),
            ...mapMutations([]),
            formatValue(val){
                if (!val) return "-"

                if (/^\d\d\d\d-\d\d-\d\dT/.test(val)) {
                    return this.$moment(val).format("MMM Do, YYYY")
                }


                return val
            },

        }
    }
</script>

<style scoped>

</style>