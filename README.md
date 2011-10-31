Drag'n Drop
===========

Exercise for the Adobe/Day engineering team – by Gabriel Walt

### Browsers (more may work):
* Internet Explorer 8
* Firefox 7
* Chrome 15
* Safari 5

### Implemented a sweet drag & drop jQuery library from scratch that features:
* Uses the HTML5 events
* Vertically reorderable elements
* Multiple selections are possible by simply clicking on them (so I didn't make it with CTRL/CMD click, because I think it is more useable as it is now)
* Selection and dragging over different frames as well as different areas within the same document supported
* Elements and classes used are fully configurable
* It creates one global variable, but this can be disabled if not needing the multi-frame feature

### Using a customized HTML5 Boilerplate for a start:
* Using a custom verion of the HTML5 shiv, inlined in the HTML head element for optimization
* Insted of setting a no-js class when JS is not present, I'm adding a js class if it is present
* Removing modernizr, favicons and all the build and test scripts

### Created a minimalistic node.js HTTP server for fun:
* I know, this is not part of the drag & drop exercise, but I wanted to try out node.js
* Added mustache templating library to try it out as well and to have a templating abstraction
* Basically, if a file doesn't exist, it will check if there is a JSON version to use with the template
* The JSON files contain a "template" property that tells what template to use to render it out
* 404 and 500 error codes supported that will redirect to the configurred files

### Test Script:
Start the node.js server:
    cd server
    node server.js 127.0.0.1 8080

Then take your browser and go to url:
    http://127.0.0.1:8080

This will display a test page with tree frames and some dummy content to drag around.

To test another use-case with several drag&drop areas on the same page (without frames), you can also checkout the following page:
    http://127.0.0.1:8080/pages/multi.html

### Ideas for improvement:
* Support mobile browser for the drag & drop
