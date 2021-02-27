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
                    freeInstant: appConfigs.barSegments.usage.oa.color.light,
                    ill: appConfigs.barSegments.usage.delayed.color.light,
                    subr: appConfigs.barSegments.usage.subr.color.light,
                    savings: appConfigs.barSegments.cost.savings.color.light,
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