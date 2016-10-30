(function(w, h) {

	var p1 = document.querySelector("#p1");
	var p2 = document.querySelector("#p2");

	for (var i = 0; i < w; i++) for (var j = 0; j < h; j++) {

		var colUnit = {

			rand: function() {
				return Math.floor(Math.random()  * (w * h));
			},

			result: function(div) {
				if (div.className % 15 == 2) {
					return div.className = "s";
				} else {
					return div.className = "w";
				}
			}
		}

		function onePlayer () {
			var div1 = document.createElement("div");
			div1.id = i + "-" + j, div1.className = colUnit.rand();
			colUnit.result(div1);
			if (div1.className == "s") {
				div1.innerHTML = "x";
			};
			p1.appendChild(div1);
		}

		onePlayer();

		function twoPlayer () {
			var div2 = document.createElement("div");
			div2.className = colUnit.rand();
			colUnit.result(div2);
			if (div2.className == "s") {
				div2.innerHTML = "о";
			};
			p2.appendChild(div2)
			div2.onclick = function() {
				if ( fire(this) ) {
					backfire();
				};
			}
		}

		twoPlayer();
	}

	function fire (el) {
		if (el.className == "d" || el.className == "m") {
			return false;
		};

		if (el.className == "w") {
			el.innerHTML = "j";
		} else {
			el.innerHTML = "z";
		}

		el.className = el.className == "s" ? "d" : "m";

		var resultGame = document.querySelectorAll("#p2 .s");

		if (resultGame.length === 0) {
			alert("Вы выиграли");
			location.href=location.href;
		};

		if (el.className == "m") { return true };
	}

	function backfire () {
		for (var i = w; i > 0; i++) {

			var targets = document.querySelectorAll("#p1 .s, #p1 .w");

			if (targets.length === 0 || fire(targets[Math.floor(Math.random() * targets.length)])) {
				break;
			};

		}

		if (document.querySelectorAll("#p1 .s").length === 0) {
			alert("Вы проиграли!");
		};
	}

	var btn = document.querySelector("button");

	btn.onclick = function () {
		location.href=location.href;
	}


	// setInterval(function() {
	// 	var unit = document.querySelectorAll("#p1 .s, #p2 .s");
	// 	for (var i = 0; i < unit.length; i++) {
	// 		unit[i].nextSibling.className = "s";
	// 		unit[i].className = "w";
	// 		unit[i].previousSibling.className = "s";
	// 	}
	// }, 1000)


})(10, 10);
