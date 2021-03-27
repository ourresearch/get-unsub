<template>
    <v-card flat tile color="#eee" class="logos-card">
        <v-container class="py-10">
            <div class="text-center mb-6">
                Used in <strong>300+ libraries</strong> large and small, including:
            </div>
            <v-row class="logo-images">
                <div class="img-container cambridge"><img src="../../assets/logos/cambridge.png"></div>
                <div class="img-container cern"><img src="../../assets/logos/cern.png"></div>
                <div class="img-container cornell"><img src="../../assets/logos/cornell.png"></div>
                <div class="img-container lanl"><img src="../../assets/logos/lanl.png"></div>
                <div class="img-container duke"><img src="../../assets/logos/duke.png"></div>
                <div class="img-container hopkins"><img src="../../assets/logos/hopkins.png"></div>
            </v-row>

        </v-container>
    </v-card>
</template>

<script>
    const logos = [
        {name: "imperial",},
        {name: "michigan",},
        {name: "oregon",},
        {name: "pennstate",},
        {name: "tamu",},
        {name: "vassar",},


        {name: "cern", height: 55},
        {name: "hopkins",},
        {name: "cambridge",},
        {name: "cornell",},
        {name: "lanl",},
        {name: "duke",},


        {name: "uva",},
        {name: "dartmouth",},
        {name: "unc-chapel-hill",},
    ]


    export default {
        name: "UserLogos",
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