<template>
    <div>
        <v-tooltip
                bottom
                max-width="300px"
                content-class="single-journal-key-number-row-tooltip"
                color="#333"
        >
            <template v-slot:activator="{ on }">
                <div
                        class="my-row"
                        :class="{'line-over': overline, large: large}"
                        v-on="on"
                >

                    <div class="main-value">
                        <template v-if="valueIsString">
                            <span>{{value}}</span>
                        </template>

                        <template v-if="!valueIsString">
                            <div class="operation" v-html="myOperation"></div>
                            <v-spacer />

                            <span v-if="isNaN(value)" class="nan">—</span>
                            <template v-if="!isNaN(value)">
                                <span v-if="isCurrency && !roundToPlaces">{{value | currency(publisherCurrencySymbol)}}</span>
                                <span v-if="isCurrency && roundToPlaces">{{publisherCurrencySymbol}}{{value | round(roundToPlaces)}}</span>
                                <span v-if="!isCurrency">{{value | round}}</span>
                            </template>

                        </template>
                    </div>

                    <div class="label" v-html="label"></div>
                </div>
            </template>
            <div>
                <span v-html="tooltipText"></span>
            </div>
        </v-tooltip>

    </div>
</template>

<script>
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "SingleJournalKeyNumberRow",
        props: {
            value: [Number, String],
            valueIsString: Boolean,
            operation: String,
            isCurrency: Boolean,
            label: String,
            tooltipText: String,
            large: Boolean,
            overline: Boolean,
            roundToPlaces: Number,
        },
        data() {
            return {
                foo: ""
            }
        },
        computed: {
            ...mapGetters([
                'publisherCurrencySymbol',
            ]),
            myOperation(){
                return (this.operation) ? this.operation : "&nbsp;"
            },
            myValue(){
                if (isNaN(this.value)) return ""

            }
        },
        methods: {}
    }
</script>


<style scoped lang="scss">
    .my-row {
        cursor: default;
        padding: 5px 5px 5px 10px;
        color: #333;
        display: flex;
        align-items: center;
        line-height: 1;
        width: 300px;
        border-top: 1px solid #eee;
        &:hover {
            background: rgba(0,0,0,.1);
        }


        &.line-over {
            border-top: 3px solid #777;
        }
        &.large {
            font-weight: bold;
            margin-bottom: 40px;
            .main-value {
                font-size: 28px;
            }
        }

        .label {
            flex: 1 1 100px;
        }
    }
    .operation {
        font-family: Monaco, monospace;
    }
    .main-value {
        padding-right: 15px;
        display:inline-flex;
        align-items: center;
        font-size: 16px;
        flex: 1 1 150px;
        .operation {
            font-size: 18px;
            font-weigth: bold;
            opacity: .5
        }

    }

</style>