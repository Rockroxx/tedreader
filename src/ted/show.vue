<template>
    <div id="notice-container" class="container">
        <h2>{{readableNoticeType(notice.type)}}</h2>
        <h3>{{notice.title}}</h3>

        <pre>
            {{notice.description}}
        </pre>

        <h4 class="section-button" @click="show_details = !show_details"><i class="fa" :class="{'fa-caret-right': !show_details, 'fa-caret-down': show_details}"></i> Details</h4>
        <div id="details-container" v-show="show_details">
            <table>
                <tr>
                    <th>Document</th>
                    <td><a :href="notice.document_url" target="_blank">{{notice.reference}}</a></td>
                </tr>
                <tr v-if="notice.referenced">
                    <th>Previous Publication</th>
                    <td>
                        <a :href="'http://ted.europa.eu/udl?uri=TED:NOTICE:'+notice.referenced+':TEXT:'+notice.lang+':HTML'" target="_blank">{{notice.referenced}}</a>
                    </td>
                </tr>
                <tr>
                    <th>Body</th>
                    <td><a :href="notice.body_url" target="_blank">{{notice.body}}</a></td>
                </tr>
                <tr>
                    <th>Language</th>
                    <td>{{notice.lang}}</td>
                </tr>
                <tr>
                    <th>Nature</th>
                    <td>{{notice.nature}}</td>
                </tr>
                <tr>
                    <th>Published</th>
                    <td>{{notice.published}}</td>
                </tr>
                <tr v-if="notice.deadline">
                    <th>Deadline</th>
                    <td>{{notice.deadline || 'N/A'}}</td>
                </tr>
                <tr v-if="notice.value">
                    <th>Value</th>
                    <td>{{notice.value || 'N/A'}} {{notice.currency}}</td>
                </tr>
                <tr v-if="notice.tendering_url">
                    <th>Tender Url</th>
                    <td>
                         <a :href="notice.tendering_url" target="_blank">{{notice.tendering_url}}</a>
                    </td>
                </tr>
            </table>
        </div>

        <h4 class="section-button" @click="show_contacts = !show_contacts"><i class="fa" :class="{'fa-caret-right': !show_contacts, 'fa-caret-down': show_contacts}"></i> Contacts</h4>
        <div id="contacts-container" v-show="show_contacts">
            <div class="contact" v-for="contact in contacts">
                <table>
                    <tr>
                        <th>Type</th>
                        <td>{{readableType(contact.type)}}</td>
                    </tr>
                    <tr>
                        <th>Official Name</th>
                        <td>{{contact.official_name}}</td>
                    </tr>
                    <tr v-if="contact.name">
                        <th>Name</th>
                        <td>{{contact.name}}</td>
                    </tr>
                    <tr v-if="contact.email">
                        <th>Email</th>
                        <td>{{contact.email}}</td>
                    </tr>
                    <tr v-if="contact.phone">
                        <th>Phone</th>
                        <td>{{contact.phone}}</td>
                    </tr>
                    <tr v-if="contact.fax">
                        <th>Fax</th>
                        <td>{{contact.fax}}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{{contact.country}}, {{contact.city}}, {{contact.street}}, {{contact.postal}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div v-if="lots.length">
            <h4 class="section-button" @click="show_lots = !show_lots"><i class="fa" :class="{'fa-caret-right': !show_lots, 'fa-caret-down': show_lots}"></i> Lots</h4>
            <div id="lots-container" v-show="show_lots">
                <div class="lot" v-for="lot in lots">
                    <h4>{{lot.title}}</h4>
                    <pre>
                    {{lot.description}}
                </pre>
                    <table>
                        <tr>
                            <th>Duration</th>
                            <td>{{lot.duration || 'N/A'}} {{lot.duration_type}}</td>
                        </tr>
                        <tr>
                            <th>Value</th>
                            <td>{{lot.currency || 'N/A'}} {{lot.value}} </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <div v-if="awards.length">
            <h4 class="section-button" @click="show_awards = !show_awards"><i class="fa" :class="{'fa-caret-right': !show_awards, 'fa-caret-down': show_awards}"></i> Awards</h4>
            <div id="awards-container" v-show="show_awards">
                <div class="award" v-for="award in awards">
                    <table>
                        <tr>
                            <th>Lot</th>
                            <td>{{award.lot || 'N/A'}}</td>
                        </tr>
                        <tr>
                            <th>Awarded At</th>
                            <td>{{award.awarded_at || 'N/A'}}</td>
                        </tr>
                        <tr>
                            <th>Value</th>
                            <td>{{award.currency || 'N/A'}} {{award.value}} </td>
                        </tr>
                    </table>
                    <br>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" type="text/scss">
    @import "../styles/functions";
    @import "../styles/mixins";

    #notice-container{
        position: relative;
        padding: 4em 0.5em 2em 0.5em;

        h2{
            font-size: 150%;
        }

        a{
            color: get-color();
        }

        table{
            text-align: left;
            width: 100%;
            border-spacing: 0;
            th{
                width: 7em;
                @include desktop{
                    width: 14em;
                }
            }
            td{
                word-break: break-all;
            }
            tr:nth-child(odd){
                background-color: #ccc;
            }
        }

        pre{
            padding: 0;
            margin: 0;
            white-space: normal;
        }
        .section-button{
            color: get-color();
            &:hover{
                color: get-color($type: 'dark');
                cursor: pointer;
            }
            padding: 0.25em 0 0;
            border-bottom: solid get-color($type: 'dark') 0.1em;
            margin-bottom: 0.25em;
        }
        .lot, .award, .contact{
            border-bottom: dotted get-color($base: 'divider') 0.1em;
            margin-bottom: 0.75em;
            padding-bottom: 0.75em;
            &:last-child{
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: 0;
            }
        }
    }
</style>

<script type="text/javascript">
    export default {
        name: '',
        data(){
            return {
                notice: {},
                lots: [],
                contacts: [],
                awards: [],

                show_details: true,
                show_contacts: true,
                show_lots: true,
                show_awards: true,
            };
        },

        mounted(){
            if(window.notice){
                this.notice = window.notice;
            }
            else{
                this.$http.get(window.api_url+'view/'+this.$route.params.slug).then((res) => {
                    this.notice = res.data.notice;
                    this.lots = res.data.lots;
                    this.contacts = res.data.contacts;
                    this.awards = res.data.awards;
                })
            }
        },
        methods: {
            readableType(type){
                switch(type){
                    case 'c':
                        return "Contracting Authority";
                    case 'f':
                        return "Further Information Contact";
                    case 't':
                        return "Contractor";
                    case 'p':
                        return "Participation Contact";
                    case 'w':
                        return "Design Contest Winner";
                }
            },
            readableNoticeType(type){
                return [
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
                ].filter((item) => {
                    return item.value == type;
                })[0].name;
            }
        }
    };
</script>