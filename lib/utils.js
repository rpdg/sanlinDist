/// <reference path="../../@types/jquery/index.d.ts" />
/// <reference path="../../@types/onsenui.d.ts" />

let storage = window.localStorage;

const deserialize = (value) => {
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

const Store = {
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

(function($){


	$.fn.syncCheckBoxGroup = function (expr, context) {
		let $t = this, $cxt = $(context || document);
		$cxt.on('change', expr, function () {
			let $chks = $(expr, $cxt);
			//console.log($chks, $chks.length, $chks.filter(':checked').length);
			$t.prop("checked", $chks.filter(':checked').length === $chks.length);
		});
		$t.on('change', function () {
			$(expr, $cxt).prop("checked", this.checked);
		});
		return this;
	};
	
	
	
	$.fn.singlePicker = function(cfg){
		let $el = this ;
	
		let data = cfg.data || [];
	
		let $textPlaceElem = cfg.place? $(cfg.place) : this.find('.right:first');
	
		let opt = {
			data: [ data ],
			selectedIndex : [ cfg.selectedIndex || 0],
			title: cfg.title || '请选择' ,
		} ;
	
		let picker = new Picker(opt);
		
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
		let $el = this ;

		let toDate = new Date();
		let toYear = toDate.getFullYear();
		let toMonth = toDate.getMonth() + 1;
		let toDay = toDate.getDate();

		
		let years = range(toYear - 3, toYear + 5);
		let months = range(1, 12);
		let days = range(1, getDaysOfMonth(toYear, toMonth));

		
		let $textPlaceElem = this.find('.right:first');

		let opt = {
			data: [years, months, days],
			selectedIndex: [3, toMonth - 1, toDay - 1],
			title: (cfg && cfg.title) ? cfg.title : '请选择日期' ,
		} ;

		let picker = new Picker(opt);

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

