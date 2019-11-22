<template>
    <v-card>
        <v-card-title>
            Add column
            <v-spacer></v-spacer>
            <v-btn icon text @click="$emit('close')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text style="height:300px;">
            <v-list v-for="group in groupedTableHeaders" :key="'addcols'+group.name">
                <v-subheader>{{group.displayName}}</v-subheader>
                <v-list-item
                        @click="toggleCol(col.value)"
                        v-for="col in group.cols"
                        :key="group.name+col.value">
                    <v-list-item-icon>
                        <v-icon v-if="isColShowing(col.value)">mdi-checkbox-marked</v-icon>
                        <v-icon v-if="!isColShowing(col.value)">mdi-checkbox-blank-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{col.text}}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

        </v-card-text>
    </v-card>

</template>

<script>
    import configs from "../appConfigs"

    export default {
        name: "AddColsDialog",
        props: [],
        data() {
            return {}
        },
        methods: {
            toggleCol(colName){
                this.$store.commit("toggleTableCol", colName)
            },
            isColShowing(colName){
                return this.$store.getters.tableColsToShow.includes(colName)
            }
        },
        computed: {
            groupedTableHeaders: () => configs.journalColGroups,
        }
    }
</script>

<style scoped>

</style>