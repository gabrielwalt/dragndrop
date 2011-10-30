/* Author: Gabriel Walt */

(function ($) {

function dragndrop(container, elementSelector, conf) {
    var placeholder = $(conf.placeholder), // The placeholder that shows where things will be dropped
        selectedElements = null, // Elements that have been selected for drag & dropping
        positions = [], // Lists where elements should be inserted for the different Y positions
        positionTop = 0, // Vertical postition of the dragged element
        lastPosition = null; // Last inserted position (used mainly for optimization)
    
    // Initialization ////////////////////////////////////////////////////////////////
    
    $(elementSelector, container).attr("draggable", "true");
    updatePositions();
    
    $('body').bind("click.dragndrop", function () {
        deselect();
    });
    
    container
        .delegate(elementSelector, "click.dragndrop", function (event) {
            selectToggle($(this));
            return false;
        })
        .delegate(elementSelector, "dragstart.dragndrop", function (event) {
            dragStart($(this));
            event.originalEvent.dataTransfer.setData("text/plain", event.target.textContent); // Ugly Geko hack
        })
        .delegate(elementSelector, "dragover.dragndrop", function (event) {
            if (positionTop != event.clientY) {
                positionTop = event.clientY;
                dragMove();
            }
        })
        .bind("dragover.dragndrop", function (event) {
            event.preventDefault(); // WTF hack required for making drop events work
        })
        .bind("drop.dragndrop", function (event) {
            event.stopPropagation();
            dragEnd($(this));
            return false;
        });
    
    // Functions ////////////////////////////////////////////////////////////////
    
    function selectToggle(element) {
        element.toggleClass(conf.selectedClass);
        selectedElements = container.find(elementSelector).filter("."+conf.selectedClass);
    };

    function deselect() {
        if (selectedElements) {
            selectedElements.removeClass(conf.selectedClass);
            selectedElements = null;
        }
    };

    function dragStart(element) {
        if (!element.hasClass(conf.selectedClass)) {
            element.addClass(conf.selectedClass);
            selectedElements = container.find(elementSelector).filter("."+conf.selectedClass);
        }
    };

    function dragEnd() {
        var selected = selectedElements
            .removeClass(conf.selectedClass)
            .insertAfter(placeholder)
            .addClass(conf.highlightClass);
        placeholder.remove();
        selectedElements = null;
        updatePositions();
    
        setTimeout(function () {
            // Shortly highlight the moved elements
            selected.removeClass(conf.highlightClass);
        }, conf.highlightDuration);
    };

    function dragMove(element) {
        var position = getInsertPosition();
        if (lastPosition != position) {
            lastPosition = position;
            placeholder[position.insert](position.element);
            updatePositions();
        }
    };

    function updatePositions() {
        positions = [{
            "top": 0,
            "insert": "prependTo",
            "element": container
        }];
        container.find(elementSelector).each(function () {
            var element = $(this);
            positions.push({
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
        "selectedClass"     : "dragndrop-selected",
        "highlightClass"    : "dragndrop-highlight",
        "highlightDuration" : 200, // milliseconds
        "placeholder"       : "<div class='dragndrop-placeholder'></div>"
    }, conf);

    return this.each(function () {
        dragndrop($(this), elementSelector, conf);
    });
};

})(jQuery);
