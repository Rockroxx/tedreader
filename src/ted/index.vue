<template>
    <div id="list">
        <div id="overlay" v-if="show_more_filters"></div>
        <div id="filters-container" class="container" @mouseleave="bounceLeave()" @mouseenter="cancelDebounce()">
            <g-form url="search" :before="beforeSearch" @after="successSearch">
                <g-container name="search" id="search-box">
                    <g-input name="search" placeholder="Enter Search Here" v-model="query.search" save-change="500"></g-input>
                </g-container>
                <div id="more-filters-container">
                    <button type="button" @click="show_more_filters = !show_more_filters">
                        <i class="fa" :class="{'fa-caret-down' : !show_more_filters, 'fa-caret-up': show_more_filters}"></i> <span v-if="!show_more_filters">Show More</span><span v-if="show_more_filters">Hide</span> Filters
                    </button>
                    <transition name="slide-down">
                        <div v-show="show_more_filters" id="filters">
                            <g-container display="Type">
                                <g-select name="type" :options="typeOptions" v-model="query.type" save-change="500"></g-select>
                            </g-container>

                            <g-container display="Nature">
                                <g-select name="nature" :options="natureOptions" v-model="query.nature" save-change="500"></g-select>
                            </g-container>
                            <g-container display="Language">
                                <g-select name="lang" :options="langOptions" v-model="query.lang" save-change="500"></g-select>
                            </g-container>
                            <g-container display="Results Per Page">
                                <g-select name="take" :options="takeOptions" v-model="query.take" save-change="500"></g-select>
                            </g-container>
                            <g-container display="Order">
                                <g-select name="order" :options="orderOptions" v-model="query.order" save-change="500"></g-select>
                            </g-container>
                            <cpv-browser v-model="query.categories" save-change="500"></cpv-browser>
                            <g-container>
                                <g-checkbox name="show_expired" v-model="query.show_expired" save-change="500">Show Expired</g-checkbox>
                            </g-container>
                            <div style="clear:both"></div>
                        </div>
                    </transition>
                </div>
            </g-form>
        </div>
        <div id="results-container" class="container">
            <h3>Currently showing {{query.offset}} to {{currentMax()}} of {{query.total}} results.</h3>
            <div id="table">
                <table>
                    <thead>
                    <th>Title</th>
                    <th>Published</th>
                    <th>Deadline</th>
                    <th>Value</th>
                    </thead>
                    <tbody>
                    <tr v-for="notice in results">
                        <td>
                            <g-a :href="'/view/'+notice.slug">{{notice.title}}</g-a>
                        </td>
                        <td>
                            <g-a :href="'/view/'+notice.slug">{{notice.published || 'N/A'}}</g-a>
                        </td>
                        <td>
                            <g-a :href="'/view/'+notice.slug">{{notice.deadline || 'N/A'}}</g-a>
                        </td>
                        <td>
                            <g-a :href="'/view/'+notice.slug">{{notice.currency}} {{notice.value || 'N/A'}}</g-a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <g-pagination :options="query" @success="paginationSuccess"></g-pagination>
        </div>
    </div>
</template>

<style lang="scss" type="text/scss">
    @import "../styles/functions";

    #list{
        padding-top:4em;
        position: relative;
        text-align: center;
        padding-bottom: 4em;

        #overlay{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            /*background-color: rgba(0,0,0,0.2);*/
            z-index: 150;
        }
        .slide-down-enter-active {
            transition: all .3s ease;
        }
        .slide-down-leave-active {
            transition: all .8s cubic-bezier(1, 1.5, 1, 1);
        }
        .slide-down-enter, .slide-down-leave-to {
            transform: translateY(-30px);
            opacity: 0;
        }
        #filters-container{
            position: relative;
            margin-bottom: 1em;
            z-index: 160;
            background-color: #ffffff;
            #search-box{
                &:before {
                    content: "\f002";
                    font-family: FontAwesome;
                    font-style: normal;
                    font-weight: normal;
                    text-decoration: inherit;
                    /*--adjust as necessary--*/
                    position: absolute;
                    color: #000;
                    font-size: 1.25em;
                    top: 0.25em;
                    left: 0.5em;
                    pointer-events: none;
                }
                input{
                    padding-left: 3em;
                }
            }
            #more-filters-container{
                background-color: #ffffff;
                padding-bottom: 0.5em;
                #filters{
                    padding: 2em;
                    box-shadow: 0 0 10px 0px;
                    position: absolute;
                    width: 100%;
                    border-bottom: solid get-color($base: 'divider') 0.15em;
                    background-color: #ffffff;
                }
            }
        }

        #table{
            overflow: auto;
            table{
                width: 100%;
                text-align: left;
                th{
                    margin: 0;
                    padding: 0;
                }
                tr{
                    td{
                        padding: 0.25em;
                        white-space: nowrap;
                        &:first-child{
                            white-space: normal;
                        }

                        a{
                            color: get-color($base: 'accent');
                            &:hover{
                                color: get-color();
                            }
                            &:visited{
                                color: get-color($type: 'dark');
                            }
                        }
                    }
                    &:nth-child(odd){
                        background-color: #ccc;
                    }
                }
            }
        }
    }
</style>

<script type="text/javascript">
    import Categories from '../category/browser.vue';
    import debounce from 'lodash.debounce';

    export default {
        name: '',
        components: {"cpv-browser": Categories},
        data(){
            return {
                query: {
                    offset: 0,
                    take: 20,
                    total: 0,
                    search: null,
                    url: window.api_url+'search',
                    virtual: true,
                    categories: ""
                },
                typeOptions: [
                    {value: null, name: "All Types"},
                    {value: "3", name: "Contract Notice"},
                    {value: "7", name: "Contract Award Notice"},
                    {value: "I", name: "Call for expressions of interest"},
                    {value: "J", name: "Concession award notice"},
                    {value: "Y", name: "Dynamic purchasing system"},
                    {value: "D", name: "Design contest"},
                    {value: "M", name: "Periodic indicative notice with call for competition"},
                    {value: "P", name: "Periodic indicative notice without call for competition"},
                    {value: "A", name: "Prior information notice with call for competition"},
                    {value: "0", name: "Prior information notice without call for competition"},
                    {value: "O", name: "Qualification system with call for competition"},
                    {value: "Q", name: "Qualification system without call for competition"},
                    {value: "R", name: "Results of design contests"},
                    {value: "H", name: "Services concession"},
                    {value: "F", name: "Subcontracts in the fields of defence and security"},
                    {value: "V", name: "Voluntary ex ante transparency notice"},
                    {value: "C", name: "Works concession"},
                ],
                natureOptions:[
                    {name: 'All Natures', value: null},
                    {name: 'Combined', value: 'Combined'},
                    {name: 'Services', value: "Services"},
                    {name: 'Supplies', value: "Supplies"},
                    {name: 'Works', value: 'Works'},
                ],
                langOptions:[
                    {name: "All languages", value: null},
                    {name: "Bulgarian (български език)", value: "BG"},
                    {name: "Czech (česky, čeština)", value: "CS"},
                    {name: "Danish (dansk)", value: "DA"},
                    {name: "German (Deutsch)", value: "DE"},
                    {name: "Greek (Ελληνικά)", value: "EL"},
                    {name: "English (English)", value: "EN"},
                    {name: "Spanish (español)", value: "ES"},
                    {name: "Estonian (eesti)", value: "ET"},
                    {name: "Finnish (suomi)", value: "FI"},
                    {name: "French (français)", value: "FR"},
                    {name: "Croatian (hrvatski)", value: "HR"},
                    {name: "Hungarian (Magyar)", value: "HU"},
                    {name: "Italian (Italiano)", value: "IT"},
                    {name: "Lithuanian (lietuvių kalba)", value: "LT"},
                    {name: "Latvian (latviešu valoda)", value: "LV"},
                    {name: "Netherlands (nederlands)", value: "NL"},
                    {name: "Polish (polski)", value: "PL"},
                    {name: "Portuguese (Português)", value: "PT"},
                    {name: "Romanian (română)", value: "RO"},
                    {name: "Slovak (slovenčina)", value: "SK"},
                    {name: "Slovene (slovenščina)", value: "SL"},
                    {name: "Swedish (svenska)", value: "SV"},
                ],
                takeOptions:[
                    {name: "20", value: 20},
                    {name: "50", value: 50},
                    {name: "100", value: 100},
                ],
                orderOptions:[
                    {name: 'Deadline', value: 'deadline'},
                    {name: 'Published', value: null},
                    {name: 'Title', value: 'title'},
                    {name: 'Value High to Low', value: 'valuelh'},
                    {name: 'Value Low to High', value: 'valuehl'},
                ],
                show_more_filters: false,
                results: [],
                bouncer: null
            };
        },
        methods:{
            currentMax(){
                if(parseInt(this.query.take)+parseInt(this.query.offset) > this.query.total)
                    return this.query.total;
                else
                    return parseInt(this.query.take)+parseInt(this.query.offset);
            },
            paginationSuccess(response){
                this.successSearch(response[0]);
                window.scrollTo(0, 0);
                this.query.offset = response[1];
            },
            beforeSearch(vals){
                console.log("Before");
                this.query.offset = 0;
                console.log(window.results);

                var data = {};
                for(var name in vals){
                    if(vals[name] !== null && vals[name] !== false && vals[name] !== "")
                    {
                        data[name] = vals[name];
                    }
                }
                return data;
            },
            successSearch(response){
                this.query.total = response.data.total;
                this.results = response.data.results;

                var params = {};
                for(var name in this.query){
                    if(name == 'url' || name == 'total' || name == 'virtual')
                        continue;
                    if(this.query[name] !== null && this.query[name] !== undefined && this.query[name] !== false && this.query[name] !==""){
                        params[name] = this.query[name];
                    }
                }

                this.$router.replace({path:'/search', query:params});
            },
            bounceLeave(){
                this.bouncer = debounce(() => {
                    this.show_more_filters = false;
                }, 500);
                this.bouncer();
            },
            cancelDebounce(){
                if(this.bouncer)
                    this.bouncer.cancel();
            }
        },
        mounted(){

            var query_params = this.$route.query;

            for(var name in query_params){
                this.query[name] = query_params[name];
            }


            if(window.results !== undefined){
                this.results = window.results;
                this.query.total = window.total;
            }
            else{

                var data = Object.assign({}, this.query);
                data.url = undefined;
                data.total = undefined;

                for(var name in data){
                    if(data[name] === null)
                        data[name] = undefined;
                }

                this.$http.post(window.api_url+'search', data).then((response) => {
                    this.query.total = response.data.total;
                    this.results = response.data.results;
                });
            }
        }
    };
</script>