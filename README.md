# TED Reader Front End

TED Reader Front End is an open-source SPA running on the [Vue 2](https://vuejs.org) framework.

## Installation

    npm install
    npm build
    
If you want to use this together with the backend you can create a symlink from /dist to api/public/dist this allows you insert data directly to the page instead of AJAX 
thus enabling google to index the content of the page. 
Alternatively you can just modify the following in index.html
and use the app as an standard SPA.

    window.api_url = "https://api.tedreader.co.uk/";

## License

The TED Reader is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
