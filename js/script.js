var used_cities = [];
var last_city;
var cities_bot_list = [];
var is_game = true;

function title(word) {
	//И это тоже работает!!!
	var new_word = word[0].toUpperCase();
	for (var i = 1; i <= word.length - 1; i++) {
		if (word[i - 1] == " " || word[i - 1] == "-") {
			new_word += word[i].toUpperCase();
		}else{
			new_word += word[i].toLowerCase();
		}
	}
	return new_word;
}
function first_letter(word) {
	return word[0];
}
function last_letter(word, end) {
	end = end === undefined ? 1 : end;
	return word[word.length - end];
}
function last_city_letter(word) {
	var letter;
	for(var i = 1; i <= word.length; i++) {
		letter = last_letter(word, i);
		if ("ьъйЬЪйЙфФ".indexOf(letter) == -1) {
			return letter;
		}
	}
}
function slowScroll(id, time) {
	time = time === undefined ? 700 : time
	var offset = 0;
	$('html, body').animate({
		scrollTop: $(id).offset().top - offset
	}, time);
	return false;
}
function send_message(who, text, scrolling) {
	scrolling = scrolling === undefined ? true : scrolling;
	$('#input-city').val('');
	if (who == 'bot') {
		$('#message-block').append('<div class="message"><div class="message-by-bot-block"><div class="message-by-bot"><span>' + text + '</span></div></div></div>')
	}else if (who == 'user') {
		$('#message-block').append('<div class="message"><div class="message-by-user-block"><div class="message-by-user"><span>' + text + '</span></div></div></div>')
	}
	if (scrolling) {
		slowScroll("#footer-panel", 1);
	}	
}
function starting_animation() {
	$(document).scrollTop(0)
	$("#block-for-text").css("margin-top", ($("#top-logo").height() - $("#block-for-text").height()) / 2 + "px")
	setInterval(function () {
		$("#block-for-text").css("margin-top", ($("#top-logo").height() - $("#block-for-text").height()) / 2 + "px")
	}, 1000)
	setTimeout(function () {
		$("#title-line-2").css("margin-left", $("#top-logo").width() - $("#title-line-2").width() - 1 + "px");
		$(".title-text").animate({
			opacity: 1
		}, 500);
		setTimeout(function () {
			var indent1 = ($("#top-logo").width() - $("#title-line-1").width()) / 2 ;
			var indent2 = ($("#top-logo").width() - $("#title-line-2").width()) / 2 ;
			$("#title-line-1").animate({
				marginLeft: indent1
			}, 500);
			$("#title-line-2").animate({
				marginLeft: indent2
			}, 500);
			setTimeout(function () {
				$("#block-for-text br").remove();
				$(".title-text").css({"text-align": "center", "display": "block", "margin": "0px"});
				setTimeout(function () {
					slowScroll("#end-scroll", 1150);
				}, 800);
			}, 550);
		}, 500);
	}, 570);

	starting_animation = undefined
}
function generate_list_for_bot(list) {
	for(var i = 0; i < 300; i++) {
		cities_bot_list.push(cities[randomNum(0, cities.length - 1)]);
	}
	
	generate_list_for_bot = undefined
}
function first_start_game() {
	last_city = cities_bot_list[randomNum(0, cities_bot_list.length - 1)].toLowerCase();
	
	used_cities.splice(used_cities.length, 0, last_city);
	cities.splice(cities.indexOf(last_city), 1);
	cities_bot_list.indexOf(last_city) != -1 ? cities_bot_list.splice(cities_bot_list.indexOf(last_city), 1) : console.log();

	send_message("bot", title(last_city), false);
	send_message("bot", "Тебе на " + last_city_letter(last_city), false);

	first_start_game = undefined
}
function game_step() {
	var word = $("#input-city").val().toLowerCase();
	if (word) {
		send_message("user", title(word));
		if (cities.indexOf(word) >= 0) {
			if (last_city_letter(last_city) == first_letter(word)) {
				//удаление пользовательского города
				used_cities.splice(used_cities.length, 0, word);
				cities.splice(cities.indexOf(word), 1);
				cities_bot_list.indexOf(word) != -1 ? cities_bot_list.splice(cities_bot_list.indexOf(word), 1) : console.log();

				var possible_cities = [];
				for (var i = 0; i < cities_bot_list.length; i++) {
					if (first_letter(cities_bot_list[i]) == last_city_letter(word)) {
						possible_cities.splice(possible_cities.length, 0, cities_bot_list[i]);
					}
				}
				if (possible_cities.length == 1) {
					last_city = possible_cities[0].toLowerCase();
					send_message("bot", title(last_city));
				} else if (possible_cities.length > 1) {
					last_city = possible_cities[randomNum(0, possible_cities.length - 1)].toLowerCase();
					send_message("bot", title(last_city));
				}else {
					//console.log(last_city);
					is_game = false;
					send_message("bot", "Упс. Я не знаю города на букву - " + last_city_letter(word) + ". Похоже, что я проиграл.\nПоздравляю с победой!");
					send_message("bot", "Если хочешь, то можешь поиграть ещё раз. Ну, а если нет, то поздравляю с победой!");
					$("#footer-panel a").css("display", "block");
					$("#footer-panel .input-group").css("display", "none");
				}

				//удаление ботовского города
				used_cities.splice(used_cities.length, 0, last_city);
				cities.splice(cities.indexOf(last_city), 1);
				cities_bot_list.indexOf(last_city) != -1 ? cities_bot_list.splice(cities_bot_list.indexOf(last_city), 1) : console.log();
			} else {
				send_message("bot", "Мой город оканчивается на - " + last_city_letter(last_city) + ", а твой город начинается на " + first_letter(word) + ". Буквы не совпадают!")
			}
		} else {
			if (used_cities.indexOf(word) >= 0) {
				send_message("bot", "Такой город уже был!");
			} else if (word.indexOf("сдаюсь") >= 0 || word.indexOf("не знаю") >= 0 || word.indexOf("незнаю") >= 0 || word.indexOf("все") >= 0 || word.indexOf("конец") >= 0 || word.indexOf("хватит") >= 0) {
				is_game = false;
				send_message("bot", "И все-таки я выиграл!");
				send_message("bot", "Если хочешь, то можешь поиграть ещё раз. Ну, а если нет, то поздравляю с поражением!");
				$("#footer-panel a").css("display", "block");
				$("#footer-panel .input-group").css("display", "none");
			} else {
				send_message("bot", "Я такой город не знаю! Посмотри может ты его неправильно написал.");		
			}
		}
	} else {
		send_message("bot", "Пустое поле это не город!");
	}
}





$(document).ready(function () {
	generate_list_for_bot();
	starting_animation();
	first_start_game();
	$("#send-city").click(function () {
		if (is_game) {
			game_step();
		}
	})
	$(document).on('keypress', function (ev) {
		if (ev.which == 13) {
			if (is_game) {
				game_step();
			}
		}
	})	

	$(".up-arrow").click(function () {
		slowScroll("#top-point");
	})
})

$(document).scroll(function () {
	var scrollDistance = $(document).scrollTop();
	var stickyMenu = $("#top-navbar");

	if (scrollDistance >= parseInt($("#top-header").css("height"))) {
		if (stickyMenu.css("position") != "fixed") {
			stickyMenu.css({
				position: 'fixed',
				'top': '0',
				'left': '0',
				'z-index': '103'
			});
			$("#nav-br").css("height", stickyMenu.css("height"));

			/*setTimeout(function () {
				$(document).scrollTop(parseInt($("#top-header").css("height")))
			}, 50)*/
		}
	} else {
		stickyMenu.css("position", "static");
		$("#nav-br").css("height", "0");
	}
})