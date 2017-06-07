define(function() {
	"use strict";

	return {

		JSONPaths: {
			path1: "JSON/training2.json",
			path2: "JSON/training10.json",
			path3: "JSON/training20.json"
		},

		textPaths: {
			path1: "text/CategoryX/X-01.txt",
			path2: "text/CategoryX/X-02.txt",
			path3: "text/CategoryX/X-03.txt",
			path4: "text/CategoryX/X-04.txt",
			path5: "text/CategoryX/X-05.txt",
			path6: "text/CategoryX/X-06.txt",
			path7: "text/CategoryX/X-07.txt",
			path8: "text/CategoryX/X-08.txt",
			path9: "text/CategoryX/X-09.txt",
			path10: "text/CategoryX/X-10.txt"
		},

		category: {
			catA: "BUSINESS",
			catB: "SPORT"
		},

		warning: {
			trainFirst: "You need to train the classifier before classification",
			textEmpty: "Input text is empty"
		},

		result: {
			definitive: "Input text classification result: ",
			either: "RESULT: There is an equal probability of the Input Text being of either category",
			classification: "Classification Result: "
		}

	}

});