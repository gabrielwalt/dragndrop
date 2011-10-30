/* Author: Gabriel Walt */

jQuery(function ($) {
    var dragging = null;
    
    $('.container').each (function () {
        var main = $(this)
            .delegate('[draggable=true]', 'dragstart', function (event) {
                event.originalEvent.dataTransfer.setData ("text/plain", event.target.textContent);
                dragging = this;
            })
            .bind('dragover', function (event) {
                main.addClass('over');
                //event.originalEvent.dataTransfer.dropEffect = 'copy';
                event.preventDefault();
                return false;
            })
//            .bind('dragenter', function (event) { // for IE
//                main.addClass('over');
//                return false;
//            })
            .bind('dragleave', function (event) {
                main.removeClass('over');
            })
            .bind('drop', function (event) {
                main.append(dragging).removeClass('over');
                event.stopPropagation();
                return false;
            });
    });
    
    window.hello = function () {
        console.log(window.location.href);
    }
    $(document).click(function () {
        console.log('click');
        top.left.hello();
        top.right.hello();
    });
});
