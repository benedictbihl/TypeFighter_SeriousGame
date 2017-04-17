/**
 * Created by Benedict on 08.03.2017.
 */

$(document).ready( function() {
    $(".links").removeClass("active");

    $(".links").each ( 
    	function(i ,obj) {
	        if (window.location.pathname === $(obj).attr("href")) {
	            $(obj).addClass("active");
	        }
	    }
	);

    if (window.location.pathname === "/setupMenu") {
        $('img').addClass("active");
    }
});