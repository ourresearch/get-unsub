<template>
    <span class="setting-value">
        <span
                class="percent"
                v-if="displayFormat==='percent'"
        >
            {{myValue}}%
        </span>
        <span
                class="number"
                v-if="displayFormat==='number'"
        >
            {{myValue}}
        </span>
        <span
                class="dollars"
                v-if="displayFormat==='dollars'"
        >
            {{myValue | currency(publisherCurrencySymbol)}}
        </span>
        <span
                class="boolean"
                v-if="displayFormat==='boolean'"
        >
            {{ myValue }}
        </span>
    </span>
</template>

<script>
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "SettingsItemValue",
        props: {
            "configName": String,
        },
        computed: {
            ...mapGetters([
                "publisherFilesDict",
                "publisherCurrencySymbol",
            ]),
            displayFormat(){
                const myParam = appConfigs.scenarioConfigs[this.configName]
                return appConfigs.scenarioConfigs[this.configName].display
            },
            myValue(){
                if (!this.$store.getters.selectedScenario) return
                return this.$store.getters.config(this.configName)
            }
        }
    }
</script>

<style scoped>

</style>