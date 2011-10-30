/* Author: Gabriel Walt */

(function ($) {

$.fn.dragndrop = function (elementSelector, conf) {
    conf = $.extend({
        "selectedClass"     : "dragndrop-selected",
        "highlightClass"    : "dragndrop-highlight",
        "placeholder"       : "<div class='dragndrop-placeholder'></div>"
    }, conf);

    function selectToggle(element) {
        element.toggleClass(conf.selectedClass);
        this.selectedElements = this.container.find(elementSelector).filter("."+conf.selectedClass);
    }

    function deselect() {
        if (this.selectedElements) {
            this.selectedElements.removeClass(conf.selectedClass);
            this.selectedElements = null;
        }
    }
    
    function dragStart(element) {
        if (!element.hasClass(conf.selectedClass)) {
            element.addClass(conf.selectedClass);
            this.selectedElements = this.container.find(elementSelector).filter("."+conf.selectedClass);
        }
    }

    function dragDrop() {
        var selected = this.selectedElements
            .removeClass(conf.selectedClass)
            .insertAfter(this.placeholder)
            .addClass(conf.highlightClass);
        this.placeholder.remove();
        this.selectedElements = null;
        setTimeout(function () {
            selected.removeClass(conf.highlightClass);
        }, 200);
    }

    function dragOverElement(element, positionTop) {
        this.overElement = element;
        var insertBefore = positionTop < (element.offset().top + element.innerHeight()/2);
        this.placeholder[insertBefore ? "insertBefore" : "insertAfter"](element);
    }

    function dragOutElement(element) {
        this.overElement = null;
        this.placeholder.remove();
    }

    return this.each(function () {
        var context = {
            "container":        $(this),
            "placeholder":      $(conf.placeholder),
            "selectedElements": null,
            "overElement":      null
        };
        
        $(elementSelector, this).attr("draggable", "true");
          
        $('body').bind("click.dragndrop", function () {
            deselect.apply(context);
        });
        
        context.container
            .delegate(elementSelector, "click.dragndrop", function (event) {
                selectToggle.apply(context, [$(this)]);
                return false;
            })
            .delegate(elementSelector, "dragstart.dragndrop", function (event) {
                dragStart.apply(context, [$(this)]);
                event.originalEvent.dataTransfer.setData("text/plain", event.target.textContent); // OMG Geko hack
            })
            .delegate(elementSelector, "dragover.dragndrop", function (event) {
                var element = $(this);
                event.preventDefault(); // WTF hack for making drop events to fire (yes, this spec has been designed by morons)
                if (!context.overElement || !context.overElement.is(element)) { // Prevents most of the useless events (unfortunately not all)
                    dragOverElement.apply(context, [element, event.clientY]);
                }
            })
            .bind("dragleave.dragndrop", function (event) {
                var target = $(event.target),
                    element = target.is(elementSelector) ? target : target.closest(elementSelector);
                if (context.overElement && context.overElement.is(element)) { // Prevents most of the useless events (unfortunately not all)
                    dragOutElement.apply(context, [element]);
                }
            })
            .delegate(elementSelector, "drop.dragndrop", function (event) {
                event.stopPropagation();
                dragDrop.apply(context, [$(this)]);
                return false;
            });
    });
};

})(jQuery);
