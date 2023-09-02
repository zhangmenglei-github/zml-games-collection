/**
 * 打乱数组
 * @param arr 	需要打乱的数组
 * 
 */ 
export const randomArray = function(arr = []) {
	return arr.sort(() => Math.random() - 0.5);
}


/**
 * 随机用三个0-9的数，生成一个长度为18的数组
 * @param number 	多少个不重复的随机数
 * @param leng 	数组长度
 * 
 */ 
export const createLevelArray = function(number, leng) {
	let arr = [];					// 长度为leng的数组
	let randomArr = [];		// 存放number个不重复的随机数
	let num = 0;
	while(num >= 0) {
		let random = Math.floor(Math.random() * 10);
		if(!randomArr.includes(random)) {
			randomArr.push(random);
			let temp = [];
			for (let i = 0; i < Math.floor(leng / number); i++) {
				temp.push(random);
			}
			arr = arr.concat(temp);
		}
		if(randomArr.length === number) break;
	}
	return arr;
}