<template>
    <div id="home">
        <div class="hero">
            <div class="container">
                Welcome to TED Reader an free and open source website to view public EU tenders.
            </div>
        </div>
        <div class="container">
            <h3>
                What is Tenders Electronic Daily?
            </h3>
            <p>
                <a href="http://ted.europa.eu/" target="_blank">Tenders Electronic Daily</a> is an online journal of all the public
                tenders in the eu. Any government tender that is above a certain threshold must be
                posted on Tenders Electronic Daily if it surpasses a certain monetary threshold.
                The full EU directive for the public tenders and the thresholds can be read <a href="http://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2014.094.01.0065.01.ENG" target="_blank">here</a>.
            </p>

            <h3>
                Where do we get our tenders from?
            </h3>
            <p>
                Every day hundreds of new tender notices are made available through their FTP server.
                TED Reader extracts the relevant data from the package and is then made available to the users of TED Reader.
                These tenders ranging from smaller once off contracts to multi-billion euro tenders.
                From street sweeping to defence, manufacturing, cleaning material supplying, market research and many more in searchable format all available here for free.
            </p>


            <div id="search-box">
                <h3><span v-if="total == 0"><i class="fa fa-spinner fa-pulse"></i></span><span v-if="total > 0">{{total}}</span> Notices and Counting</h3>
                <g-form uri="" :before="intercept">
                    <g-container name="search">
                        <g-input name="search" placeholder="Search Tenders"></g-input>
                    </g-container>
                    <g-submit><i class="fa fa-search"></i> Search</g-submit>
                </g-form>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../styles/functions";
    @import "../styles/mixins";

    #home{
        padding-top:3em;
        padding-bottom: 3em;


        .hero{
            display:block;
            margin: 0;
            padding: 1em;
            border-bottom: solid get-color($base: "accent", $type: 'light') 0.14em;
            font-size: 110%;
            line-height: 0.8;
            background-color: get-color($base: 'accent', $opacity: 0.25, $type: 'light');
            @include desktop{
                padding: 2em;
                font-size: 150%;
            }
        }
        #search-box{
            padding:0;
            border-top:solid get-color() 0.15em;
            h3{
                text-align: center;
            }
            input{
                display: block;
                width: 100%;
            }
        }
        h3{
            font-size: 150%;
            padding: 0.5em 0.3em;
        }
        p{
            padding: 0.5em 0.5em;
        }

    }

</style>

<script type="text/javascript">
    export default {
        name: '',
        data(){
            return {
                total: 0
            };
        },
        mounted(){
            if(window.total == undefined){
                this.$http.get(window.api_url+'total').then((response) => {
                    this.total = response.data.total;
                })
            }
            else{
                this.total = window.total;
            }
        },
        methods: {
            intercept(vals){
                if(vals.search)
                    this.$router.push({path: '/search', query: vals});
                else
                    this.$router.push({path: '/search'});
                return false;
            }
        }
    };
</script>