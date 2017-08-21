<template>
    <div id="about" class="container">
        <h3>About TED Reader</h3>
        <p>
            TED Reader is an free and open-source website to view the public tenders that are provided by Tenders Electronic Daily.
            Every day hundreds of new tender notices are made available to the public ranging from smaller once off contracts to multi-billion euro tenders.
            TED Reader unlike competitors does not include local council tenders due to copyright.
            TED Reader accesses the Tenders Electronic Daily FTP server to get the new notices every tuesday to saturday as they come available,
            followed by extracting the information necessary to make the notices more palatable and clear then the ones displayed by Tenders Electronic Daily though some information will be lost in the process.
        </p>

        <h3>Open-source</h3>
        <p>
            The full backend API is available <a href="" target="_blank">here</a> and the front-end is available <a href="" target="_blank">here</a>. Both are licenced under the <a href="http://opensource.org/licenses/MIT" target="_blank">MIT licence</a>.
        </p>
        <h3>Developer</h3>
        <p>
            This website was created by self-taught developer Gert Spoelstra to show prospective employers that he capable of the following;
        </p>
        <ul>
            <li>Developing an single-page application capable of being indexed by google.</li>
            <li>Developing an API backend written in Lumen without using eloquent or facades.</li>
            <li>Developing re-usable components for both the front-end SPA as well as the backend API.</li>
            <li>Comfortably manipulating/extracting data from third party sources.</li>
            <li>Setting up web servers and general system administration.</li>
            <li>Writing SQL, PHP, HTML, Javascript, CSS as well as SCSS.</li>
            <li>Though not used in this website he is also capable of writing/using C#, Typescript, Angular 2 and Unityscript/Unity3D.</li>
        </ul>
    </div>
</template>

<style lang="scss" type="text/scss">
    @import "../styles/functions";
    @import "../styles/mixins";
    #about{
        padding: 4em 0;
        @include desktop{
            padding: 4em 1em;
        }
        h3, p{
            padding: 0.5em 0;
            a{
                color: get-color();
            }
            @include phone{
                padding: 0.5em;
            }
            @include phone-wide{
                padding: 0.5em;
            }
        }
        ul{
            margin-left: 2em;
        }
    }
</style>