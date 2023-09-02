/**
 * @description 打乱数组
 * @param arr
 * 
 */ 
export const randomArray = function(arr = []) {
	return arr.sort(() => Math.random() - 0.5);
}


/**
 * @description 一维数组转二维数组
 * @param arr
 * @param num
 */
export const arrOneToTwo = function(arr, num) {
	if(!Array.isArray(arr)) {
		return [];
	}
	if(Array.isArray(arr) && arr.length <= 1) {
		return arr;
	}
	let a = [];
	while(arr.length > 0) {
		a.push(arr.splice(0, num))
	}
	return a;
}


/**
 * @description 二维数组转一维数组
 * @param 
 * @param 
 */
export const arrTwoToOne = function(arr) {
	if(!Array.isArray(arr)) { 
		return [];
	}
	return [].concat.apply([], arr)
}


/**
 * @description 取一个区间数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
export const random = function(min, max) {
	if (min >= 0 && max > 0 && max >= min) {
		const gab = max - min + 1
		return Math.floor(Math.random() * gab + min)
	}
	return 0
}


/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export const deepClone = function(obj) {
	// 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj
	if (typeof obj !== 'object' && typeof obj !== 'function') {
		// 原始类型直接返回
		return obj
	}
	const o = test.array(obj) ? [] : {}
	for (const i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
		}
	}
	return o
}

/**
 * @description 深度克隆多维数组
 * @param {Array} arr 需要深度克隆的数组
 * @returns {*} 克隆后的数组
 */
export const deepcopyArray = function(arr) {
	var out = [],
			i = 0,
			len = arr.length;
	for (; i < len; i++) {
		if (arr[i] instanceof Array){
			out[i] = deepcopyArray(arr[i]);
		}
		else out[i] = arr[i];
	}
	return out;
}
