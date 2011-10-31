/* Author: Gabriel Walt */

(function ($) {

function dragndrop(container, elementSelector, conf) {
    var g = { // Set of variables that will might be made global, depending on settings
            "instances": [], // Will contain the list of all dragndrop instances
            "selectedElements": $([]) // Elements that have been selected for drag & dropping
        },
        placeholder = $(conf.placeholder), // The placeholder that shows where things will be dropped
        positions = [], // Tells where elements should be inserted based on their Y positions, see updatePositions()
        positionTop = 0, // Vertical postition of the dragged element (used mainly for optimization)
        lastPosition = null; // Last inserted position (used mainly for optimization)
    
    // Initialization ////////////////////////////////////////////////////////////////
    
    // Set global variables for multi-frame features
    if (conf.multiple) {
        if (frames.top.dragndrop) {
            // If it has already been set, we copy the global var locally
            g = frames.top.dragndrop;
        } else {
            // Else we copy the local var globally
            frames.top.dragndrop = g;
        }
    }
    
    g.instances.push(this);
    updatePositions();
    
    // Events ////////////////////////////////////////////////////////////////
    
    $(elementSelector, container)
        .attr("draggable", "true")
        .bind("click.dragndrop", function () {
            selectToggle($(this));
            return false;
        })
        .bind("dragstart.dragndrop", function (event) {
            if (typeof event.target.textContent == "string") { // Geko hack
                event.originalEvent.dataTransfer.setData("text/plain", event.target.textContent);
            }
            dragStart($(this));
        });
    
    container
        .bind("dragover.dragndrop", function (event) {
            event.preventDefault(); // Required by spec for making drop events work
            event.stopPropagation(); // Prevent window dragover event to be fired
            if (!$.browser.msie) { // Be gentle with IE or everything falls apart
                event.originalEvent.dataTransfer.dropEffect = 'copy';
            }
            if (positionTop != event.clientY) {
                positionTop = event.clientY;
                dragMove();
            }
        })
        .bind("drop.dragndrop", function () {
            drop();
            return false;
        });
    
    $(window)
        .bind("click.dragndrop", function () {
            deselect();
        })
        .bind("dragover.dragndrop", function () {
            removePlaceholders();
        });
    
    // Functions ////////////////////////////////////////////////////////////////
    
    this.removePlaceholder = function () {
        lastPosition = null;
        placeholder.remove();
    }
    
    function removePlaceholders() {
        for (var i in g.instances) {
            g.instances[i].removePlaceholder();
        }
    }
    
    function selectToggle(element) {
        if (element.hasClass(conf.selectedClass)) {
            element.removeClass(conf.selectedClass);
            g.selectedElements = g.selectedElements.not(element);
        } else {
            element.addClass(conf.selectedClass);
            g.selectedElements = g.selectedElements.add(element);
        }
    };

    function deselect() {
        g.selectedElements.removeClass(conf.selectedClass);
        g.selectedElements = $([]);
    };

    function dragStart(element) {
        if (!element.hasClass(conf.selectedClass)) {
            element.addClass(conf.selectedClass);
            g.selectedElements = g.selectedElements.add(element);
        }
    };

    function drop() {
        if (g.selectedElements.length) {
            var selected = g.selectedElements
                .removeClass(conf.selectedClass)
                .insertAfter(placeholder);
            
            g.selectedElements = $([]);
            
            if (conf.highlightDuration) {
                // Shortly highlight the moved elements
                selected.addClass(conf.droppedClass);
                setTimeout(function () {
                    selected.removeClass(conf.droppedClass);
                }, conf.highlightDuration);
            }
            
            if (typeof conf.ondrop == "function") {
                conf.ondrop.apply(container, [selected]);
            }
        }
        removePlaceholders();
    };

    function dragMove(element) {
        var position = getInsertPosition();
        if (!lastPosition || lastPosition.i != position.i) {
            lastPosition = position;
            removePlaceholders();
            placeholder[position.insert](position.element);
            updatePositions();
        }
    };

    function updatePositions() {
        var count = 0;
        positions = [{
            "i": count, // A simple counter to easily distinguish the items
            "top": 0,   // Number of pixels from the top from when elements should be inserted here
            "insert": "prependTo", // Function to use for insertion
            "element": container   // Element to use for insertion
        }];
        container.find(elementSelector).each(function (i) {
            var element = $(this);
            positions.push({
                "i": ++count,
                "top": element.offset().top + element.outerHeight()/2,
                "insert": "insertAfter",
                "element": element
            });
        });
    };

    function getInsertPosition() {
        for (var i = 1, l = positions.length; i < l && positionTop > positions[i].top; ++i);
        return positions[i-1];
    };
}

// jQuery plugin ////////////////////////////////////////////////////////////////

$.fn.dragndrop = function (elementSelector, conf) {
    conf = $.extend({
        "ondrop"            : null, // Callback for triggering things when dropping items
        "placeholder"       : "<div class='dragndrop-placeholder'></div>", // Used to show where elements are inserted when dropping
        "selectedClass"     : "dragndrop-selected", // Used to highlight selected elements
        "droppedClass"      : "dragndrop-dropped", // Used to highlight dropped elements
        "highlightDuration" : 1, // Time in milliseconds how long the dropped class will be displayed
        "multiple"          : true // activates support of mutiple dragndrop instances, but also declares a global variable
    }, conf);

    return this.each(function () {
        new dragndrop($(this), elementSelector, conf);
    });
};

})(jQuery);
