// Naive Bayesian Text Classifier
// Carla de Beer
// November 2016
// Inspired by Daniel Shiffman's Coding Rainbow series:
// http://shiffman.net/a2z/intro/
// NOTE: Numbers are excluded from the training set dictionary

define(["util", "enums"],
	function(util, enums) {
	"use strict";

	return {

		dictionary: {},
		docCountA: 0,
		docCountB: 0,
		resA: 0,
		resB: 0,
		newWords: [],
		result: [],


		init: function() {

			var self = this;
			util.addButtonEvent1(self, this.train2(self), "choose11");
			util.addButtonEvent1(self, this.train10(self), "choose12");
			util.addButtonEvent1(self, this.train20(self), "choose13");
			util.addButtonEvent1(self, this.calculateWithText(self), "choose14");
			util.addButtonEvent1(self, util.clearDiv, "choose15");

			var id = "choose1";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose2";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose3";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose4";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose5";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose6";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose7";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose8";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose9";
			util.addButtonEvent2(this.chooseText(self, id), id);
			id = "choose10";
			util.addButtonEvent2(this.chooseText(self, id), id);
		},

		train2: function (self) {
			return function() {
				util.loadJSON(enums.JSONPaths.path1, function (response) {
					var trainingSet = JSON.parse(response);
					self.resetGlobals();
					self.train(trainingSet);
				});
			}
		},

		train10: function (self) {
			return function() {
				util.loadJSON(enums.JSONPaths.path2, function (response) {
					var trainingSet = JSON.parse(response);
					self.resetGlobals();
					self.train(trainingSet);
				});
			}
		},

		train20: function (self) {
			return function() {
				util.loadJSON(enums.JSONPaths.path3, function (response) {
					var trainingSet = JSON.parse(response);
					self.resetGlobals();
					self.train(trainingSet);
				});
			}
		},

		train: function (trainingSet) {
			// Train the classifier
			var self = this;
			for (var i = 0, l = trainingSet.length; i < l; ++i) {
				util.readTextFile("text/" + trainingSet[i].path, function (response) {
					var object = {
						text: response,
						category: trainingSet[i].category
					};
					self.countWords(object);
				});
			}

			this.calculateProbabilities();
		},

		resetGlobals: function () {
			this.dictionary = {};
			this.docCountA = 0;
			this.docCountB = 0;
			this.result = [];
		},

		chooseText: function (self, id) {

			return function() {
				var filePath;
				this.resA = 0;
				this.resB = 0;
				this.newWords = "";

				if (id === "choose1") {
					filePath = enums.textPaths.path1;
				} else if (id === "choose2") {
					filePath = enums.textPaths.path2;
				} else if (id === "choose3") {
					filePath = enums.textPaths.path3;
				} else if (id === "choose4") {
					filePath = enums.textPaths.path4;
				} else if (id === "choose5") {
					filePath = enums.textPaths.path5;
				} else if (id === "choose6") {
					filePath = enums.textPaths.path6;
				} else if (id === "choose7") {
					filePath = enums.textPaths.path7;
				} else if (id === "choose8") {
					filePath = enums.textPaths.path8;
				} else if (id === "choose9") {
					filePath = enums.textPaths.path9;
				} else if (id === "choose10") {
					filePath = enums.textPaths.path10;
				}

				util.readTextFile(filePath, function (response, header) {
					var unknown = response;
					if (unknown !== "") {
						self.calculateResult(unknown);
						self.renderOutputFiles(filePath, header);
					} else {
						self.renderError();
					}
				});
			}
		},

		calculateWithText: function(self) {
			return function() {
				this.resA = 0;
				this.resB = 0;
				this.newWords = "";

				var unknown = document.getElementById("textArea").value;
				if (unknown !== "") {
					self.calculateResult(unknown);
					self.renderOutputText();
				} else {
					self.renderError();
				}
			}
		},

		calculateResult: function (unknown) {
			this.newWords = unknown.split(/[\W+\d+]/);
			this.newWords = this.newWords.filter(Boolean);
			util.convertToLowerCase(this.newWords);
			this.combineProbablities();
		},

		countWords: function (object) {
			var tokens = object.text.split(/[\W+\d+]/);
			tokens = tokens.filter(Boolean);

			// Count total number of words per document category
			if (object.category === "A") {
				this.docCountA += tokens.length;
			} else if (object.category === "B") {
				this.docCountB += tokens.length;
			}

			// Count number of occurrences per document
			for (var i = 0, l = tokens.length; i < l; ++i) {
				var token = tokens[i].toLowerCase();
				if (this.dictionary[token] === undefined) {
					this.dictionary[token] = {};
					if (object.category === "A") {
						this.dictionary[token].countA = 1;
						this.dictionary[token].countB = 0;
					} else if (object.category === "B") {
						this.dictionary[token].countA = 0;
						this.dictionary[token].countB = 1;
					}
				} else {
					if (object.category === "A") {
						this.dictionary[token].countA++;
					} else if (object.category === "B") {
						this.dictionary[token].countB++;
					}
				}
			}
		},

		calculateProbabilities: function () {
			for (var key in this.dictionary) {
				if (this.dictionary.hasOwnProperty(key)) {
					var object = {};
					var word = this.dictionary[key];

					var freqA = word.countA / this.docCountA;
					var freqB = word.countB / this.docCountB;

					// Probability via Bayes rule
					object.word = key;
					object.probA = freqA / (freqA + freqB);
					object.probB = 1 - object.probA;

					this.result.push(object);
				}
			}
		},

		combineProbablities: function () {
			// Combined probabilities
			// http://www.paulgraham.com/naivebayes.html
			var productA = 1.0;
			var productB = 1.0;

			// Multiply probabilities together
			if (this.newWords.length === 1) {
				for (var j = 0, m = this.result.length; j < m; ++j) {
					if (this.result[j].word === this.newWords[0]) {
						if (this.result[j].probA === 1 && this.result[j].probB === 0) {
							productA = 1.0;
							productB = 0.0;
						} else if (this.result[j].probB === 1 && this.result[j].probA === 0) {
							productA = 0.0;
							productB = 1.0;
						} else {
							if (this.result[j].probA > 0) {
								productA *= this.result[j].probA;
							}
							if (this.result[j].probB > 0) {
								productB *= this.result[j].probB;
							}
						}
					}
				}
			} else if (this.newWords.length > 1) {

				var A = false;
				var B = false;

				var totalA = 0;
				var totalB = 0;
				for (var i = 0, l = this.newWords.length; i < l; ++i) {
					var newWord = this.newWords[i];
					for (var j = 0, m = this.result.length; j < m; ++j) {
						if (this.result[j].word === newWord) {
							totalA += this.result[j].probA;
							totalB += this.result[j].probB;
						}
					}
				}

				// Make provision for all words being of the same category,
				// or most of the words being of one, and fewer of the other,
				// otherwise we are multiplying both sides by zero.
				if (totalA > 0 && totalB == 0) {
					A = true;
				} else if (totalB > 0 && totalA == 0) {
					B = true;
				} else if (totalA > 0 && totalB > 0 && totalA > totalB) {
					A = true;
				} else if (totalA > 0 && totalB > 0 && totalB > totalA) {
					B = true;
				}

				for (var i = 0, l = this.newWords.length; i < l; ++i) {
					newWord = this.newWords[i];
					for (var j = 0, m = this.result.length; j < m; ++j) {
						if (this.result[j].word === newWord) {

							if (A && !B) {
								if (this.result[j].probA > 0) {
									productA *= this.result[j].probA;
								}
								productB = 0;
							} else if (!A && B) {
								if (this.result[j].probB > 0) {
									productB *= this.result[j].probB;
								}
								productA = 0;
							} else if ((!A && !B) || (A && B)) {
								if (this.result[j].probA > 0) {
									productA *= this.result[j].probA;
								}
								if (this.result[j].probB > 0) {
									productB *= this.result[j].probB;
								}
							}

						}
					}
				}
			}

			// Apply formula
			this.resA = productA / (productA + productB);
			this.resB = productB / (productB + productA);
		},

		renderOutputFiles: function (filePath, headerText) {
			var container = document.getElementById("innerContainer");
			var newParagraph = document.createElement("p");
			newParagraph.id = "dynamicParagraph";

			if (Object.keys(this.dictionary).length === 0) {
				newParagraph.textContent = enums.warning.trainFirst;
			} else {
				var business = enums.category.catA;
				var sport = enums.category.catB;
				if (this.resA > this.resB) {
					newParagraph.innerHTML = filePath.substring(filePath.length - 8, filePath.length) + ". '" +
						headerText + "' | " + enums.result.classification + business.bold();
					newParagraph.classList.add("paraPinkText");
				} else if (this.resA < this.resB) {
					newParagraph.innerHTML = filePath.substring(filePath.length - 8, filePath.length) + ". '" +
						headerText + "' | " + enums.result.classification + sport.bold();
					newParagraph.classList.add("paraGreenText");
				} else if (this.resA === this.resB) {
					newParagraph.innerHTML = enums.result.either;
					newParagraph.classList.add("paraPinkText");
				}
			}

			newParagraph.classList.add("result");
			container.appendChild(newParagraph);
		},

		renderOutputText: function () {
			var container = document.getElementById("innerContainer");
			var newParagraph = document.createElement("p");
			newParagraph.id = "dynamicParagraph";

			if (Object.keys(this.dictionary).length === 0) {
				newParagraph.textContent = enums.warning.trainFirst;
			} else {
				var business = enums.category.catA;
				var sport = enums.category.catB;
				if (this.resA > this.resB) {
					newParagraph.innerHTML = enums.result.definitive + business.bold();
					newParagraph.classList.add("paraPinkText");
				} else if (this.resA < this.resB) {
					newParagraph.innerHTML = enums.result.definitive + sport.bold();
					newParagraph.classList.add("paraGreenText");
				} else if (this.resA === this.resB) {
					newParagraph.innerHTML = enums.result.either;
				}
			}

			newParagraph.classList.add("result");
			container.appendChild(newParagraph);
		},

		renderError: function () {
			var container = document.getElementById("innerContainer");
			var newParagraph = document.createElement("p");
			newParagraph.id = "dynamicParagraph";
			if (Object.keys(this.dictionary).length === 0) {
				newParagraph.innerHTML = enums.warning.trainFirst;
			} else {
				newParagraph.innerHTML = enums.warning.textEmpty;
			}
			newParagraph.classList.add("result");
			container.appendChild(newParagraph);
		}

	}

});
