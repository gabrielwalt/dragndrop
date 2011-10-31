Drag'n Drop
===========

Exercise for the Adobe/Day engineering team
- by Gabriel Walt

### Browsers (more may work):
* Internet Explorer 8
* Firefox 7
* Chrome 15
* Safari 5

### Using a customized HTML5 Boilerplate for a start. Customizations include:
* Using a stripped-down version of Modernizr with only the hasEvent and drag & drop features
* Inlining a custom verions of the HTML5 shiv in the HTML head element
* Insted of setting a no-js class when JS is not present, I'm adding a js class if it is present
* Removing favicons

### Implemented a sweet drag & drop jQuery library from scratch that features:
* Uses the HTML5 events
* Vertically reorderable elements
* Multiple selections are possible
* Selection and dragging over different frames as well as different areas within the same document supported
* Elements and classes used are fully configurable
* It creates one global variable, but this can be disabled if not needing the multi-frame feature

### Created a minimalistic node.js HTTP server for fun:

* I know, this is not part of the drag & drop exercise, but I wanted to try out node.js
* Added mustache templating library to try it out as well and to have a templating abstraction
* Basically, if a file doesn't exist, it will check if there is a JSON version to use with the template
* The JSON files contain a "template" property that tells what template to use to render it out
* 404 and 500 error codes supported that will redirect to the configurred files

### Ideas for improvement:
* Support mobile browser for the drag & drop
