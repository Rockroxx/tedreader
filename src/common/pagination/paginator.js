import Vue from 'vue';

var generateLink = function(e, paginator, title, options, offset){
    var domProps = {href:options.url+'?take='+options.take+'&offset='+offset};
    var on = {};
    var cl = {};
    if(options.offset == offset || offset > options.total)
        cl = {disabled: true};
    if(options.virtual)
    {
        on = {
            click(e){
                e.preventDefault();
                if(cl.disabled)
                    return;

                var data = {};
                var sending = Object.assign(options, {take:options.take, offset:offset});

                for(var name in sending){
                    if(sending[name])
                        data[name] = sending[name];
                }

                paginator.$http.post(options.url, data).then((res) => {
                    paginator.$emit('success', [res, offset]);
                });
            }
        };
    }
    return e('a', {domProps:domProps, on:on, class:cl}, title);

}

Vue.component('g-pagination', {
    render(e){
        var self = this;

        var current_page = this.options.offset / this.options.take;
        var i = current_page - 2;
        var il = current_page + 3;
        while(i < 0){i++;il++;}
        var children = [];

        children.push(generateLink(e, self, '<<', self.options, 0));
        if(current_page == 0)
            children.push(generateLink(e, self, '<', self.options, 0));
        else
            children.push(generateLink(e, self, '<', self.options, ((current_page-1)*self.options.take)));

        if(il > Math.ceil( this.options.total/this.options.take))
            il = Math.ceil( this.options.total/this.options.take);
        for(var i; i < il; i++){
            children.push(generateLink(e, self, i+1, self.options, i*self.options.take));
        }
        children.push(generateLink(e, self, '>', self.options, (current_page+1)*self.options.take));
        children.push(generateLink(e, self, '>>', self.options,
            Math.floor(self.options.total/self.options.take)*self.options.take));

        return e('div', {class:'paginator'},
            [e('div', {class:'paginator-container'}, children)]
        );
    },
    props: ['options'],
});