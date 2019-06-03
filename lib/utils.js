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
