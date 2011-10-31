Drag'n Drop
===========

Exercise for the Adobe/Day engineering team – by Gabriel Walt
See: https://github.com/gabrielwalt/dragndrop

Simply open frames.html or noframes.html

### Known Supported Browsers:
* Chrome 15 (perfectly supported)
* Firefox 7 (perfectly supported)
* Desktop Safari 5 (perfectly supported)
* iPad Safari 5 [0]
* Internet Explorer 8 [1]

### Known Not Supported Browsers:
* Firefox 3.6 [2]
* Opera 10 [3]
* Internet Explorer 7 [4]

### Implemented an HTML5 drag & drop jQuery library from scratch that features:
* Uses the HTML5 events
* Uses Modernizr for feature detecting the support of HTML5 drag & drop events
* Vertically reorderable elements
* Multiple selections are possible by simply clicking on them
* Contrary to what was asked, I didn't make the multi-select with CTRL/CMD+click, because that would make it less useable and breaking support of touch devices
* Supports touch devices with the limitation that it doesn't allow dropping to another frame
* Selection and dragging over different frames as well as different areas within the same document supported
* Elements and classes used are fully configurable
* It creates one global variable, but this can be disabled if not needing the multi-frame feature
* Even if I've assigned an ID to every draggable element, they are not needed for the script to work

### Using a customized HTML5 Boilerplate for a start:
* Using a custom verion of the HTML5 shiv, inlined in the HTML head element for optimization
* Insted of setting a no-js class when JS is not present, I'm adding a js class if it is present
* Added an optimized version of Modernizr that only contains the drag & drop detection functions
* Removing favicons and all the build and test scripts

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

### Notes:

[0] Because of iOS limitation, it only supports drag & drop within the same frame, not to another frame.

[1] It kind of works, but a very annoying bug makes that most of the time some text gets selected, rather than starting the drag & drop. There must be a way to fix that, but I didn't find it yet.

[2] Actually the script works, but Firefox 3.6 has an HTML5 parsing bug that splits inline elements that contain block-level elements (but HTML5-wise it is legal to have `<a><h1>foo</h1><p>bar</p></a>`). And IE requires the dragable elements to be links or images (when using the HTML5 drag&drop events). I wanted to use the HTML5 drag&drop (because I wanted to test them), wanted to use block-level elements inside the draggable element, and wanted to have a chance to support IE, so as far as I know, this inevitabely breaks FF 3.6 support.

[3] Opera doesn't support the HTML5 drag&drop events, feature detection simply nicely prevents the script from being executed. With the mess the HTML5 drag&drop events are, I can't blame them.

[4] IE7 (as well as IE6 as far as I have read online) support the HTML5 drag&drop events, so theoretically there should be a way to support them. But as long as I couldn't fix 100% of the IE8 bugs I didn't even dive into testing IE7.
