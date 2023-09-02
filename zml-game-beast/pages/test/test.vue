<template>
	<view class="map">
		<view class="row" v-for="item1, index1 in list">
			<view 
				class="col" 
				v-for="item2,index2 in item1"
				:class="{'wall': item2 === 0, 'load': item2 === 1, 'path': getPath(index1, index2) > -1}"
			>
				<text v-if="begin[0] == index1 && begin[1] == index2">起点</text>
				<text v-else-if="end[0] == index1 && end[1] == index2">终点</text>
				<text v-else>{{index1}},{{index2}}</text>
			</view>
		</view>
		<button @click="searchLoad()">搜索路线</button>
		<view class="">
			<view v-for="item in path">{{item.x}},{{item.y}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					[1, 1, 0, 1, 0], 
					[1, 1, 0, 1, 1], 
					[0, 1, 0, 1, 0], 
					[0, 1, 1, 1, 1],
					[1, 1, 0, 1, 1]
				],
				mapList: [],
				begin: [0, 0],
				end: [4, 4],
				path: [],
				current: null,
			};
		},
		onLoad() {
			this.initList()
		},
		methods: {
			// 初始化列表
			initList() {
				for(let x = 0; x < this.list.length; x++) {
					this.mapList[x] = []
					for(let y = 0; y < this.list[0].length; y++) {
						this.mapList[x][y] = null;
					}
				}
				for(let x = 0; x < this.list.length; x++) {
					for(let y = 0; y < this.list[0].length; y++) {
						let node = this.nodeItem(x, y);
						let up = this.nodeItem(x - 1, y)
						let down = this.nodeItem(x + 1, y)
						let left = this.nodeItem(x, y - 1)
						let right = this.nodeItem(x, y + 1)
						node.nearNodes = [up, down, left, right].filter(item => item && item.value == 1)
						this.mapList[x][y] = node
					}
				}
			},
			
			// 搜索路线
			searchLoad() {			
				let begin = this.nodeItem(this.begin[0], this.begin[1])
				let end = this.nodeItem(this.end[0], this.end[1])
				let path = [];
				console.log(this.mapList);
				// 需要搜索的队列，默认第一个是起点
				let queue = [begin];
				while(queue.length) {
					// 拿出来第一个需要搜索的点, 并标记检查过
					let current = queue.shift();
					current.checked = true;
					// 查找相邻元素
					for(let item of current.nearNodes) {
						// 检查没查过的相邻元素，并把元素放在队列后面
						if(!item.checked) {
							item.parent = current;
							queue.push(item);
						}
					}
					// 把当前元素以及父节点都存在路径里
					let patharr = [];
					let pathNode = current;
					while(pathNode) {
						patharr.push(pathNode)
						pathNode = pathNode.parent
					}
					path = patharr;
					// 如果当前元素就是要找的元素，就跳出
					if(current.x == end.x && current.y == end.y) {
						break;
					}
				}
				if(path.length && path[0].x == this.end[0] && path[0].y == this.end[1]) {
					this.path = path
				} else {
					this.path = [];
				}
				console.log(this.path);
			},
			
			// 获取每个节点信息，如果没有则创建
			nodeItem(x, y) {
				if(x >= 0 && x < this.list.length && y >=0 && y < this.list[0].length) {
					let node = this.mapList[x] && this.mapList[x][y];
					if(!node) {
						let val = this.list[x][y]
						if(val != undefined) {
							node = {
								x,
								y,
								value: val,
								checked: false,
								parent: null,
								nearNodes: []
							}
							this.mapList[x][y] = node
						}
					}
					return node;
				}
				return null;
			},
		
			// 把最后的路径映射到图上面
			getPath(x, y) {
				return this.path.findIndex(item => item.x == x && item.y == y)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.map {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 8rpx;
		.row {
			width: 100%;
			display: flex;
		}
		.col {
			flex: 1;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 8rpx;
			box-sizing: border-box;
			&.wall { background-color: #000; border: 4rpx solid #000; }
			&.load { background-color: #fff; border: 4rpx solid #aaa; }
			&.path { border: 4rpx solid red; background-color: red; color: #fff; }
		}
	}
	button {
		margin: 20rpx 0 0;
	}
</style>
