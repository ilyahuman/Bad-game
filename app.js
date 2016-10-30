(function(w, h) {

	var p1 = document.querySelector("#p1");
	var p2 = document.querySelector("#p2");

	function initGameField () {
		for (var i = 0; i < w; i++) for (var j = 0; j < h; j++) {

			function randomClass() {
				var numberClass = Math.floor(Math.random() * (w * h));
				if (numberClass % 15 == 2) {
					return "unit";
				} else {
					return "empty";
				}
			};

			function initPlayers (canvas) {
				var cell = document.createElement('div');
				cell.id = i+'-'+j;
				cell.className = randomClass();
				if (cell.className == "unit") {
					cell.innerHTML = "x";
				};
				canvas.appendChild(cell);
			}
			initPlayers(p1);
			initPlayers(p2);
		}
	}
	initGameField();

	function byEnemyFire() {
		var targets = p2.querySelectorAll('.unit, .empty');

		Array.prototype.forEach.call(targets, function(item) {
			item.addEventListener('click', function() {
				if (fire(item)) {
					backfire();
				}
			})
		});
	};
	byEnemyFire();

	function fire (cell) {
		if (cell.className === "miss" || cell.className == "death")
		return false;

		if (cell.className == "empty") {
			cell.innerHTML = "j";
		} else {
			cell.innerHTML = "z";
		}

		cell.className = cell.className == "unit" ? "death" : "miss";

		if (p2.querySelectorAll('.unit').length === 0)
			resultBattle('Вы выиграли');

		if (cell.className == "miss")
			return true
	}

	function backfire () {

		for (var i = w; i > 0; i++) {

			var targets = p1.querySelectorAll(".unit, .empty");

			if (targets.length === 0 || fire(targets[Math.floor(Math.random() * targets.length)])) {
				break;
			};

		}

		if (p1.querySelectorAll('.unit').length === 0)
			resultBattle('Вы проиграли');
	}

	function resultBattle(message) {
		alert(message)
		location.href=location.href;
	}

	var btn = document.querySelector("button");
	btn.onclick = function () {
		location.href=location.href;
	}

})(10, 10);
