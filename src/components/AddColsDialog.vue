<template>
    <v-card>
        <v-toolbar dark flat color="primary">
            <v-app-bar-nav-icon class="">
                <v-icon>mdi-table-edit</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>
                Show/hide columns
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon text @click="$emit('close')">
                <v-icon>mdi-close</v-icon>
            </v-btn>

            <template v-slot:extension>
                <v-tabs
                        v-model="tab"
                        background-color="transparent"
                >
                    <v-tabs-slider color="white"></v-tabs-slider>

<!--                    <v-tab v-for="item in items" :key="item">-->
<!--                        {{ item }}-->
<!--                    </v-tab>-->
                    <v-tab
                            v-for="group in groupedTableHeaders"
                            :key="'tab'+group.name"
                    >
                        {{group.displayName}}
                    </v-tab>


                </v-tabs>
            </template>
        </v-toolbar>


        <v-card-text style="height:500px;">
            <v-tabs-items v-model="tab">
                <v-tab-item
                        v-for="group in groupedTableHeaders"
                        :key="'tab-content'+group.name"
                >
                    <v-row v-for="col in group.cols"
                           @click="toggleCol(col.value)"
                           style="cursor:pointer;"
                           :key="group.name+col.value">
                        <v-col class="flex-grow-0 pt-4">
                            <v-icon v-if="isColShowing(col.value)">mdi-checkbox-marked</v-icon>
                                    <v-icon v-if="!isColShowing(col.value)">mdi-checkbox-blank-outline</v-icon>
                        </v-col>
                        <v-col class="flex-grow-1">
                            <div class="title">{{col.text}}</div>
                            <div v-html="col.descr"></div>
                        </v-col>
                    </v-row>
                </v-tab-item>
            </v-tabs-items>


<!--                        <v-list v-for="group in groupedTableHeaders" :key="'addcols'+group.name">-->
<!--                            <v-subheader>{{group.displayName}}</v-subheader>-->
<!--                            <v-list-item-->
<!--                                    @click="toggleCol(col.value)"-->
<!--                                    v-for="col in group.cols"-->
<!--                                    :key="group.name+col.value">-->
<!--                                <v-list-item-icon>-->
<!--                                    <v-icon v-if="isColShowing(col.value)">mdi-checkbox-marked</v-icon>-->
<!--                                    <v-icon v-if="!isColShowing(col.value)">mdi-checkbox-blank-outline</v-icon>-->
<!--                                </v-list-item-icon>-->
<!--                                <v-list-item-content>-->
<!--                                    <v-list-item-title>-->
<!--                                        {{col.text}}-->
<!--                                    </v-list-item-title>-->
<!--                                </v-list-item-content>-->
<!--                            </v-list-item>-->
<!--                        </v-list>-->

        </v-card-text>
    </v-card>

</template>

<script>
    import configs from "../appConfigs"

    export default {
        name: "AddColsDialog",
        props: [],
        data() {
            return {
                tab: 0,
            }
        },
        methods: {
            toggleCol(colName) {
                this.$store.commit("toggleTableCol", colName)
            },
            isColShowing(colName) {
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