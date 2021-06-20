<template>
    <v-card flat tile color="#eee" class="logos-card">
        <v-container class="py-10">
            <div class="text-center mb-6">
                Used in <strong>500+ libraries</strong> large and small, including:
            </div>
            <v-row class="logo-images">
                <div :class="`img-container ${logo.name}`" v-for="logo in logos">
                    <img :src="require(`../../assets/logos/${logo.name}.png`)">
                </div>
            </v-row>

        </v-container>
    </v-card>
</template>

<script>
    const logos = [
        {name: "cambridge",},
        {name: "cern", height: 55},
        {name: "cornell",},
        {name: "lanl",},
        {name: "duke",},
        {name: "hopkins",},
    ]


    export default {
        name: "HomepageUserLogos",
        data() {
            return {
                logos,
            }
        }
    }
</script>

<style  lang="scss">

    .logo-images {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        .img-container {
            width: 100%;
            margin: 20px 0;
            height: 35px;
            display: flex;
            justify-content: center;

            &.cern {
                height: 50px;
            }

            &.lanl {
                height: 30px;
                img {opacity: .7;}
            }
            img {
                height: 100%;
            }
        }
    }

    @media only screen and (min-width: 600px) {
        .logo-images .img-container {
            width: 33.3333333%;
        }
    }
    @media only screen and (min-width: 1264px) {
        .logo-images .img-container {
            width: 16.6666666667%;
        }
    }


</style>