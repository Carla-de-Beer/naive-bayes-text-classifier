define(function() {
	"use strict";

	return {

		addButtonEvent1: function(self, foo, id) {
			var button = document.getElementById(id);
			button.addEventListener("click", function() {
				["choose11", "choose12", "choose13"].forEach(function(btnId) {
					document.getElementById(btnId).classList.remove("selected");
				});
				button.classList.add("selected");
				foo.call(this);
			}, false);
		},

		addButtonEvent2: function(foo, id) {
			var button = document.getElementById(id);
			button.addEventListener("click", function() {
				["choose1","choose2","choose3","choose4","choose5",
				 "choose6","choose7","choose8","choose9","choose10"].forEach(function(btnId) {
					document.getElementById(btnId).classList.remove("selected");
				});
				button.classList.add("selected");
				foo.call(this);
			}, false);
		},

		loadJSON: function (filePath, callback) {
			var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
			xobj.open('GET', filePath, true);
			xobj.onreadystatechange = function () {
				if (xobj.readyState === XMLHttpRequest.DONE) {
					if (xobj.status === 200 || xobj.status == XMLHttpRequest.UNSENT) {
						callback(xobj.responseText);
					}
				}
			};
			xobj.send(null);
		},

		readTextFile: function (filePath, callback) {
			var xobj = new XMLHttpRequest();
			xobj.open("GET", filePath, false);
			xobj.onreadystatechange = function () {
				if (xobj.readyState === XMLHttpRequest.DONE) {
					if (xobj.status === 200 || xobj.status == XMLHttpRequest.UNSENT) {
						var headerText = xobj.responseText.slice(0, xobj.responseText.indexOf("\n"));
						callback(xobj.responseText, headerText);
					}
				}
			};
			xobj.send(null);
		},

		convertToLowerCase: function (array) {
			for (var i = 0; i < array.length; ++i) {
				array[i] = array[i].toLowerCase();
			}
		},

		clearDiv: function () {
			document.getElementById("innerContainer").innerHTML = "";
			document.getElementById("textArea").value = "";
		}

	}

});