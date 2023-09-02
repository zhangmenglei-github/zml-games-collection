let timer;
let flag;
function throttle(func, wait = 500, immediate = true) {
	if (immediate) {
		if (!flag) {
			flag = true;
			typeof func === 'function' && func();
			timer = setTimeout(() => {
				flag = false;
			}, wait);
		}
	} else {
		if (!flag) {
			flag = true
			timer = setTimeout(() => {
				flag = false
				typeof func === 'function' && func();
			}, wait);
		}
		
	}
};