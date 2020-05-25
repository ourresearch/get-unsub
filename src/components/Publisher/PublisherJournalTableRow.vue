<template>
    <tr>
        <td
                v-for="col in columns"
                :key="col.id"
        >
            <span class="single-value">
                {{col.value}}
            </span>
        </td>

    </tr>
</template>

<script>
    import {makePublisherJournalRow} from "../../shared/publisher";

    export default {
        name: "PublisherJournalTableRow",
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