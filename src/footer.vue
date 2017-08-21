<template>
    <footer>
        <div class="container">
            <ul>
                <li>
                    <g-a href="/">Home</g-a>
                </li>
                <li>
                    <g-a href="/search">Search</g-a>
                </li>
                <li>
                    <g-a href="/about">About</g-a>
                </li>
                <li>
                    <g-a href="/sitemap">Sitemap</g-a>
                </li>
                <li>
                    <g-a href="/disclaimer">Disclaimer</g-a>
                </li>
            </ul>
            <div style="clear:both"></div>
        </div>
    </footer>
</template>

<style lang="scss" type="text/scss">
    @import "styles/functions";

    footer{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-top:double get-color($base: 'divider', $type: 'light') 0.2em;
        text-align: center;
        ul{
            position: relative;
            margin: 0 auto;
            padding: 0;
            list-style: none;
            height: 24px;
            display: inline-block;
            li{
                float:left;
                padding: 0.25em;
            }
        }
    }
</style>

<script type="text/javascript">
    export default {
        name: '',
    };
</script>