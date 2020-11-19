<template>
    <div v-if="showMe">
        <v-menu
                offset-y
                :left="unfoldLeft"
                :right="unfoldRight"
                :close-on-content-click="false"
                ref="columnsMenu"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                        class="text-capitalize"
                        v-on="on"
                        :icon="icon"
                        :text="!icon"
                >
                    <span v-if="!icon">Table</span>
                    <v-icon v-if="icon">mdi-table-edit</v-icon>
                </v-btn>
            </template>
            <v-list dense subheader>
                <v-subheader>Add/remove columns</v-subheader>
                <v-menu
                        v-for="group in groupedTableHeaders"
                        :key="'groupMenu'+group.name"
                        offset-x
                        :left="unfoldLeft"
                        :right="unfoldRight"
                        :open-on-hover="true"
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item
                                v-on="on"
                                @click=""
                        >
                            <v-list-item-title class="font-weight-regular">
                                {{group.displayName}}
                            </v-list-item-title>
                            <v-list-item-action>
                                <v-icon>mdi-menu-right</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                    <v-list dense>
                        <v-tooltip
                                right
                                v-for="col in group.cols"
                                :key="group.name+col.value"
                                max-width="400"
                                open-delay="500"
                                :left="unfoldLeft"
                                :right="unfoldRight"
                        >
                            <template v-slot:activator="{ on }">
                                <v-list-item
                                        @click="toggleCol(col.value)"
                                        v-on="on"
                                >
                                    <v-list-item-icon class="mr-2">
                                        <v-icon v-if="isColShowing(col.value)">mdi-check</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title class="font-weight-regular">
                                        {{col.text}}
                                    </v-list-item-title>
                                </v-list-item>
                            </template>
                            <span v-html="col.descr"></span>
                        </v-tooltip>




                    </v-list>

                </v-menu>


            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import appConfigs from "../../appConfigs";

    export default {
        name: "ScenarioMenuColumns",
        props: {
            icon: Boolean,
            direction: String,
        },
        computed: {
            groupedTableHeaders: () => appConfigs.journalColGroups,
            showMe(){
                return this.$store.getters.menuSettingsShowAsTable
            },
            unfoldLeft(){
                return this.direction === "left"
            },
            unfoldRight(){
                return !this.unfoldLeft
            },
        },
        methods: {
            toggleCol(colName) {
                this.$store.commit("toggleTableCol", colName)
                this.$refs.columnsMenu.isActive = false
                console.log("toggle col", this.$refs.columnsMenu)
            },
            isColShowing(colName) {
                return this.$store.getters.tableColsToShow.includes(colName)
            }
        },

    }
</script>

<style scoped>

</style>