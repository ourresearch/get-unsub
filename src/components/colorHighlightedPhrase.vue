<template>
    <span
            class="color-highlighted-phrase"
            :style="{backgroundColor: myColor}"
    >
        {{text}}
    </span>
</template>

<script>
    import appConfigs from "../appConfigs";
    export default {
        name: "colorHighlightedPhrase",
        props: {
            text: String,
            colorKey: String,
        },
        computed:{
            myColor(){
                return {
                    freeInstant: appConfigs.barSegments.usage.oa.lightColor,
                    ill: appConfigs.barSegments.usage.delayed.lightColor,
                    subr: appConfigs.barSegments.usage.subr.lightColor,
                    savings: appConfigs.barSegments.cost.savings.lightColor,
                }[this.colorKey]
            }
        },
    }
</script>

<style scoped lang="scss">
    .color-highlighted-phrase {
        white-space: nowrap;
        padding: 0 .2em;
        margin: 0 .2em;
        border-radius: 3px;
        opacity: .7;
        color: #000;
    }

</style>