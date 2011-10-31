/* Author: Gabriel Walt */

jQuery(function ($) {
    "use strict";
    
    var messagerTimeout = null;
    
    // Display message to the visitor with a small popup
    function messager(message) {
        var m = $("#messager").text(message).slideDown();
        if (messagerTimeout) {
            clearTimeout(messagerTimeout);
        }
        messagerTimeout = setTimeout(function () {
            m.slideUp();
        }, 2000);
    }
    
    // Defensive logger
    function log(data) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log(data);
        }
    }
    
    // Send the dropped data to the server and popup a confirmation message to the user
    // The post format is looking like this: { "content": "myid0", "element-1": "myid1", "element-2": "myid2" }
    function ondrop (selectedElements) {
        var elementTitles = "",
            postData = {
                "content": $(this).attr("id")
            };
        
        selectedElements.each(function (i) {
            elementTitles += (i ? ", " : "")+$("h2", this).text();
            postData["element-"+i] = this.id;
        });
        
        log(postData);
        
        $.post("/post.json", postData, function (response) {
            if (response.message) {
                var message = response.message+": "+elementTitles;
                log(message);
                messager(message);
            }
        });
        
    }
    
    // The whole drag'n drop fun
    $(".content").dragndrop(".element", { "ondrop": ondrop });
});
