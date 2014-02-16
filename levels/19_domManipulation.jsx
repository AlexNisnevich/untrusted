#BEGIN_PROPERTIES#
{

}
#END_PROPERTIES#
/**********************
 * domManipulation.js *
 **********************
 *
 * I can't believe it! I can't believe you made it onto Department of
 * Theoretical Computation's web server!  YOU SHOULD HAVE BEEN DELETED! This
 * shouldn't even be possible! What the hell were the IT folks thinking?
 *
 * No matter. I still have the Algorithm. That's the important part. The rest
 * is just implementation, and how hard could that be? 
 *
 * Anyway you're not going to make it out of this one, my good Doctor. After
 * all, you're a tenured professor with a well-respected history of research -
 * you probably don't know jQuery!
 *
 */

function startLevel(map) {
    map.placePlayer(1, 1);
    
    var img = 'data:image/jpeg;base64,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';

    var html = "<div style='width: 600px; height: 500px; background-color: white; font-size: 10px; font-family: \"Comic Sans MS\", cursive, sans-serif'>" + 
    	"<center><h1>Department of Theoretical Computation</h1></center>" + 
		"<hr />" + 
		"<table border='0'><tr valign='top'>" + 
			"<td><img width='115' height='160' src='" + img + "' /></td>" + 
			"<td>" + 
				"<h2>Cornelius Eval</h2>" + 
				"<h3>Professor</h3>" + 
				"Fields of study:" + 
				"<ul>" + 
					"<li>Human-computer interface</li>" + 
					"<li>NP completeness</li>" + 
				"</ul>" + 
			"</td>" + 
		"</tr></table>" + 
		"<hr />" + 
	"</div>";
    map.createFromDOM(html);
    var $dom = $(html);
#END_OF_START_LEVEL#
}
