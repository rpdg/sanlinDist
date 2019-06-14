/// <reference path="../../@types/jquery/index.d.ts" />
/// <reference path="../../@types/onsenui.d.ts" />

let storage = window.localStorage;

var deserialize = (value) => {
	if (typeof value != 'string') {
		return undefined;
	}
	try {
		return JSON.parse(value);
	}
	catch (e) {
		return value || undefined;
	}
};

var Store = {
	use: (storageType) => {
		storage = window[storageType];
		return Store;
	},
	get: (key, defaultVal) => {
		let val = deserialize(storage.getItem(key));
		return (val === undefined ? defaultVal : val);
	},
	set: (key, val) => {
		if (val === undefined) {
			return Store.remove(key);
		}
		storage.setItem(key, JSON.stringify(val));
		return val;
	},
	remove: (key) => {
		storage.removeItem(key);
	},
	clear: () => {
		storage.clear();
	}
};


$.fn.syncCheckBoxGroup = function (expr, context) {
	var $t = this, $cxt = $(context || document);
	$cxt.on('change', expr, function () {
		var $chks = $(expr, $cxt);
		//console.log($chks, $chks.length, $chks.filter(':checked').length);
		$t.prop("checked", $chks.filter(':checked').length === $chks.length);
	});
	$t.on('change', function () {
		$(expr, $cxt).prop("checked", this.checked);
	});
	return this;
};



(function($){

	$.fn.singlePicker = function(cfg){
		var $el = this ;
	
		var data = cfg.data || [];
	
		var $textPlaceElem = cfg.place? $(cfg.place) : this.find('.right:first');
	
		var opt = {
			data: [ data ],
			selectedIndex : [ cfg.selectedIndex || 0],
			title: cfg.title || '请选择' ,
		} ;
	
		var picker = new Picker(opt);
		
		picker.on('picker.select', function(selectedVal, selectedIndex) {
			$textPlaceElem.text(data[selectedIndex[0]].text)  ;
			$textPlaceElem.data('value' ,  data[selectedIndex[0]].value);
		});
	
		$el.on('click' , function(){
			picker.show();
		})
	};

	
	function range(n , m , surfix  = '') {
		let arr = [];
		for (let i = n; i <= m; i++) {
			let value = (i < 10 ? '0' + i : i) + surfix;
			arr.push({
				text: value,
				value: i
			});
		}
		return arr;
	}

	function getDaysOfMonth(year , month )  {
		let days  = 30;

		if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1) {
			days = 31;
		} else {
			if (month === 2) {
				days = !(year % 400) || (!(year % 4) && year % 100) ? 29 : 28;
			}
		}
		return days;
	}

	$.fn.datePicker = function(cfg){
		var $el = this ;

		var toDate = new Date();
		var toYear = toDate.getFullYear();
		var toMonth = toDate.getMonth() + 1;
		var toDay = toDate.getDate();

		
		var years = range(toYear - 3, toYear + 5);
		var months = range(1, 12);
		var days = range(1, getDaysOfMonth(toYear, toMonth));

		
		var $textPlaceElem = this.find('.right:first');

		var opt = {
			data: [years, months, days],
			selectedIndex: [3, toMonth - 1, toDay - 1],
			title: cfg.title || '请选择日期' ,
		} ;

		var picker = new Picker(opt);

		picker.on('picker.select', function(selectedVal, selectedIndex) {
			let dateVal = years[selectedIndex[0]].text + '/' + months[selectedIndex[1]].text + '/' + days[selectedIndex[2]].text;
			$textPlaceElem.text(dateVal) ;
			$textPlaceElem.data('value' ,  dateVal) ;
		});

		picker.on('picker.change', function(index, selectedIndex) {
			//console.log(index, selectedIndex, picker.selectedIndex);
			//console.log(years[picker.selectedIndex[0]].value, months[picker.selectedIndex[1]].value);
			if (index < 2) {
				days = range(
					1,
					getDaysOfMonth(years[picker.selectedIndex[0]].value, months[picker.selectedIndex[1]].value)
				);
				picker.refillColumn(2, days);
				picker.scrollColumn(2, 0);
			}
		});

		$el.on('click', function() {
			picker.show();
		});
	}
})(jQuery);

