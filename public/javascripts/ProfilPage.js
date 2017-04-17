/**
 * Created by Lydia Bartels on 27.02.2017.
 */

$(document).ready(function () {
	$.get('/achievement', function (data) {

		var json = JSON.parse(data);
		console.log(json);
		if (json[0] == "false") {
			$("#firstAch").hide();
		}

		if (json[1] == "false") {
			$("#secondAch").hide();
		}

		if (json[2] == "false") {
			$("#thirdAch").hide();
		}

		if (json[3] == "false") {
			$("#fourthAch").hide();
		}

		if (json[4] == "false") {
			$("#fifthAch").hide();
		}

		if (json[5] == "false") {
			$("#sixthAch").hide();
		}

		if (json[6] == "false") {
			$("#seventhAch").hide();
		}

		if (json[7] == "false") {
			$("#eighthAch").hide();
		}

	});
});
