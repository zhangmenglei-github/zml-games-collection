<template>
	<view class="beast">
		<!-- 玩家1 -->
		<view class="player player-1" :class="[player1.camp]">
			<view class="photo">
				<image src="../../static/player-ai.png"></image>
			</view>
			<view class="HP">
				<progress :percent="player1.score" stroke-width="44" :activeColor="player1.camp == 'red' ? '#f56c6c': player1.camp == 'blue' ? '#94bcff' : ''"/>
				<text class="hp-num">{{ player1.score }}/100</text>
			</view>
		</view>
		
		<!-- 游戏区 -->
		<view class="map">
			<view class="map-box">
				<view class="chess-player chess-player1">
					<template v-for="item in player1.list">
						<uni-badge class="uni-badge-left-margin" :text="isPlay != 0 ? item.count: ''" absolute="leftTop" size="small">
							<view class="chess-item" :class="[item.count == 0 ? 'die': '', player1.camp]">
								<image :src="`../../static/${item.name}.png`" mode=""></image>
							</view>
						</uni-badge>
					</template>
				</view>
				
				<view class="chess-play">
					<view class="chess-play-row" v-for="item1,index1 in mapList" :key="index1">
						<view class="chess-block" v-for="item2,index2 in item1" :key="index2" @click="onPlayer(item2, index1, index2)">
							<view 
								class="chess-item" 
								:class="[!item2.isFilp ? 'no' : item2.camp, item2.isSelected ? 'selected' : '']" 
								v-if="item2 && item2.isShow"
							>
								<image :src="`../../static/${item2.name}.png`" mode="" v-show="item2.isFilp"></image>
							</view>
						</view>
					</view>
				</view>
				
				<view class="chess-player chess-player2">
					<template v-for="item in player2.list">
						<uni-badge class="uni-badge-left-margin" :text="isPlay != 0 ? item.count: ''" absolute="rightTop" size="small">
							<view class="chess-item" :class="[item.count == 0 ? 'die': '', player2.camp]">
								<image :src="`../../static/${item.name}.png`" mode=""></image>
							</view>
						</uni-badge>
					</template>
				</view>
			</view>
		</view>
		
		<!-- 玩家2 -->
		<view class="player player-2" :class="[player2.camp]">
			<view class="HP">
				<progress :percent="player2.score" stroke-width="44" :activeColor="player2.camp == 'red' ? '#f56c6c': player2.camp == 'blue' ? '#94bcff' : ''"/>
				<text class="hp-num">{{ player2.score }}/100</text>
			</view>
			<view class="photo">
				<image src="../../static/player-1.png"></image>
			</view>
		</view>
		
		<!-- 规则提示框 -->
		<uni-popup ref="popupRule" :isMaskClick="false" :maskBackgroundColor="'rgba(0,0,0,.6)'">
			<view class="win">
				<view class="win-box">
					<view class="win-title">
						<text>游戏规则</text>
					</view>
					<view class="win-content">
						<view class="rule">
							<view class="rule-item">1、龙 > 虎 > 象 > 熊 > 狐 > 鹰 > 猫</view>
							<view class="rule-item">2、猫可以吃龙</view>
							<view class="rule-item">3、鹰可以吃全部，前提是需要隔一颗棋子才能吃，不分距离。</view>
							<view class="rule-item">4、所有动物只能上下左右移动，每次最多可移动一格（鹰狩猎的时候除外）。</view>
							<view class="rule-item">5、任意一方血量为0时，游戏结束。</view>
						</view>
					</view>
				</view>
			</view>
			<view class="win-btns">
				<button class="win-btn" @click="onKnow()">我知道了</button>
			</view>
		</uni-popup>
		<!-- 输赢提示框 -->
		<uni-popup ref="popupWin" :isMaskClick="false" :maskBackgroundColor="'rgba(0,0,0,.6)'">
			<view class="win">
				<view class="win-box">
					<view class="win-title">
						<text v-if="isWin == 1">恭&nbsp;&nbsp;&nbsp;喜</text>
						<text v-if="isWin == 2">很&nbsp;遗&nbsp;憾</text>
					</view>
					<view class="win-content">
						<text v-if="isWin == 1">{{ aiLose ? '电脑认输了' : '你 赢 了' }}</text>
						<text v-if="isWin == 2">你 输 了</text>
					</view>
				</view>
			</view>
			<view class="win-btns">
				<button class="win-btn" @click="onExitGame()">退出游戏</button>
				<button class="win-btn" @click="onAgainGame()">再来一局</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { deepcopyArray } from '../../common/common.js'
	export default {
		data() {
			return {
				player1: {							// 玩家1 - 电脑
					score: 100, 
					camp: '', 
					list: []
				},
				player2: {							// 玩家2 - 真人
					score: 100, 
					camp: '', 
					list: []
				},
				chessList: [
					{name: '龙', weight: 7, count: 1, score: 19, camp: null, isFilp: false, isShow: true, isSelected: false, location: []},
					{name: '虎', weight: 6, count: 2, score: 12, camp: null, isFilp: false, isShow: true, isSelected: false, location: []},
					{name: '象', weight: 5, count: 2, score: 10, camp: null, isFilp: false, isShow: true, isSelected: false, location: []},
					{name: '熊', weight: 4, count: 2, score: 8, camp: null, isFilp: false, isShow: true, isSelected: false, location: []},
					{name: '狐', weight: 3, count: 2, score: 5, camp: null, isFilp: false, isShow: true, isSelected: false, location: []},
					{name: '鹰', weight: 2, count: 2, score: 3, camp: null, isFilp: false, isShow: true, isSelected: false, location: []},
					{name: '猫', weight: 1, count: 5, score: 1, camp: null, isFilp: false, isShow: true, isSelected: false, location: []},
				],
				mapList: [],						// 地图二维数组
				selectChess: null,			// 选中的棋子
				isStart: false,					// 是否开始了，分配阵营
				isWho: 0,								// 0=无  1=玩家  2=电脑
				isPlay: 0,			 				// 0=未开始  1=进行中  2=已结束
				isWin: 0, 							// 0=无  1=玩家  2=电脑
				bfsList: [],						// 副本数组，用来进行广度优先算法
				bfsLoadList: [],				// 每次计算前，都把当前地图绘制一遍，0不能走 1可以走
				aiLose: false,					// AI投降
			}
		},
		onLoad() {
			this.createPlayChess()
		},
		onReady() {
			this.$refs.popupRule.open()
		},
		methods: {
			// 生成双方所需棋子、棋盘总棋子
			createPlayChess() {
				let arr1 = [];
				let arr2 = [];
				let list1 = JSON.parse(JSON.stringify(this.chessList));
				let list2 = JSON.parse(JSON.stringify(this.chessList));
				let list3 = JSON.parse(JSON.stringify(this.chessList));
				let list4 = JSON.parse(JSON.stringify(this.chessList));
				for (let i = 0; i < list1.length; i++) {
					this.player1.list.push(list1[i]);
				}
				for (let i = 0; i < list2.length; i++) {
					this.player2.list.push(list2[i]);
				}
				for (let i = 0; i < list3.length; i++) {
					for(let j = 0; j < list3[i].count; j++) {
						list3[i].camp = 'red'
						arr1.push(list3[i]);
					}
				}
				for (let i = 0; i < list4.length; i++) {
					for(let j = 0; j < list4[i].count; j++) {
						list4[i].camp = 'blue'
						arr2.push(list4[i]);
					}
				}
				this.player2.list.reverse();
				let maplist = JSON.parse(JSON.stringify(this.arrayChange(this.arrayRandom([...arr1, ...arr2]), 4)))
				maplist.forEach((item1, index1) => {
					item1.forEach((item2, index2) => {
						item2.location = [index1, index2];
					})
				})
				this.mapList = JSON.parse(JSON.stringify(maplist))
			},
			
			// 用户操作
			// 选择棋子 - 吃子 - 追杀 - 逃跑
			onPlayer(item, x, y) {
				// 没轮到你
				if(this.isWho != 1 || this.isPlay != 1) return;
				let list = [].concat.apply([], this.mapList);
				let list_some = list.some(i => i && i.isSelected);
				let selectChess = list.filter(i => i && i.isSelected)[0];
				
				// 没选棋子之前点击空地，是没用的
				if(!list_some && item == null) return;
				
				// 选择棋子，再点击空地
				if(list_some && item == null) {
					let bool = false;
					let x1 = selectChess.location[0];
					let y1 = selectChess.location[1];
					if(
						(y1 == y && x1 - 1 == x) || 
						(y1 == y && x1 + 1 == x) ||
						(x1 == x && y1 - 1 == y) || 
						(x1 == x && y1 + 1 == y)
					) {
						bool = true;
					}
					if(bool) {
						this.handlePosition(selectChess.location, [x, y])
					} else {
						uni.showToast({title: '不能走！', icon: 'none', duration: 500})
						this.mapList.forEach(item1 => {
							item1.forEach(item2 => item2 ? item2.isSelected = false : '')
						})
						this.$forceUpdate()
						return;
					}
					this.mapList.forEach(item1 => {
						item1.forEach(item2 => item2 ? item2.isSelected = false : '')
					})
					this.onAi()
					return;
				}
				
				// 如果在没选中牌的时候，点击了对方的牌，则会提醒
				if(item.isFilp && !list_some && item.camp != this.player2.camp) {
					uni.showToast({title: '这不是你的棋子', icon: 'none', duration: 500})
					return;
				}
				
				// 每次点击牌之前 清除一下选中状态
				this.mapList.forEach(item1 => {
					item1.forEach(item2 => item2 ? item2.isSelected = false : '')
				})
				
				// 如果棋子处于没翻转的状态
				if(!item.isFilp) {
					item.isFilp = true
					if(!this.isStart) {
						this.isStart = true;
						this.player2.camp = item.camp
						this.player1.camp = item.camp == 'red' ? 'blue' : 'red'
					}
					this.onAi()
					return;
				}
				
				// 如果点击的是自己的牌 则选中当前牌
				if(item.camp == this.player2.camp) {
					item.isSelected = !item.isSelected;
					this.$forceUpdate()
					return;
				}
				
				// 判断选中自己的牌之后，再去选择别人的牌, 说明有吃的意向了
				if(selectChess) {
					if(!this.onIsEat(selectChess, item)) {
						uni.showToast({title: '吃不了！', icon: 'none', duration: 500})
						this.selectChess = null;
						return;
					} else {
						// 吃
						this.handlePosition(selectChess.location, item.location, item);
					}
					this.onAi()
					return;
				}
			},
			
			// 电脑操作
			// 首先是吃子，判断场上自己的子能不能吃对方的子
			// 其次是逃跑，判断自己的子是否处于危险状态
			// 再次是追杀，判断自己的子向对方的子靠近，来进行捕杀
			// 最后是翻牌
			onAi() {
				if(this.isPlay != 1) return;
				this.isWho = 2;
				setTimeout(() => {
					console.log("电脑开始：");
					this.isWho = 1;
					let list = [].concat.apply([], this.mapList);						// 变成一维数组
					let playerFilpList = list.filter(item => item && item.isFilp && item.camp != this.player1.camp); // 对手翻开的棋子
					let aiFilpList = list.filter(item => item && item.isFilp && item.camp == this.player1.camp);	// 所有ai翻开的棋子
					let aiEatOwn = [];		// 我自己有哪些能吃别人的子
					let aiEatList = [];		// 我能吃哪些子
					
					// 1、吃子
					// 判断ai的每个子的周围有没有能吃的棋子
					for(let i = 0; i < aiFilpList.length; i++) {
						let [x, y] = aiFilpList[i].location;
						if(x - 1 >= 0 && this.onIsEat(aiFilpList[i], this.mapList[x - 1][y])) {
							aiEatOwn.push(aiFilpList[i])
							aiEatList.push(this.mapList[x - 1][y])
						}
						if(x + 1 < 8 && this.onIsEat(aiFilpList[i], this.mapList[x + 1][y])) {
							aiEatOwn.push(aiFilpList[i])
							aiEatList.push(this.mapList[x + 1][y])
						}
						if(y - 1 >= 0 && this.onIsEat(aiFilpList[i], this.mapList[x][y - 1])) {
							aiEatOwn.push(aiFilpList[i])
							aiEatList.push(this.mapList[x][y - 1])
						}
						if(y + 1 < 4 && this.onIsEat(aiFilpList[i], this.mapList[x][y + 1])) {
							aiEatOwn.push(aiFilpList[i])
							aiEatList.push(this.mapList[x][y + 1])
						}
						// 如果是鹰
						for(let a = x - 2; a >= 0; a--) {
							if(this.onIsEat(aiFilpList[i], this.mapList[a][y])) {
								aiEatOwn.push(aiFilpList[i])
								aiEatList.push(this.mapList[a][y])
							}
						}
						for(let a = x + 2; a < 8; a++) {
							if(this.onIsEat(aiFilpList[i], this.mapList[a][y])) {
								aiEatOwn.push(aiFilpList[i])
								aiEatList.push(this.mapList[a][y])
							}
						}
						for(let a = y - 2; a >= 0; a--) {
							if(this.onIsEat(aiFilpList[i], this.mapList[x][a])) {
								aiEatOwn.push(aiFilpList[i])
								aiEatList.push(this.mapList[x][a])
							}
						}
						for(let a = y + 2; a < 4; a++) {
							if(this.onIsEat(aiFilpList[i], this.mapList[x][a])) {
								aiEatOwn.push(aiFilpList[i])
								aiEatList.push(this.mapList[x][a])
							}
						}
					}
					// 如果有，则吃最大权重的子，
					// 判断一下，吃完以后，自己会不会被吃，为了防止玩家用小动物换大动物.
					// 跟自己等级一样的除外，一样的子，可以一换一不亏
					// 如果是猫吃龙，则不用想，一定稳赚
					// 以此类推
					// console.log(aiEatOwn, aiEatList);
					if(aiEatList.length > 0) {
						let scoreList = aiEatList.map(item => item.score); 										// 提取分数数组
						// 冒泡排序，根据分数从大到小排列，再把分数对应的敌方子和对应的我方子进行排列
						for (let i = 0; i < scoreList.length; i++) {
							for (let j = 0; j < scoreList.length - i - 1; j++) {
								if (scoreList[j] < scoreList[j + 1]) {
									// 交换两个项
									let temp1 = scoreList[j];
									scoreList[j] = scoreList[j + 1];
									scoreList[j + 1] = temp1;
									let temp2 = aiEatList[j];
									aiEatList[j] = aiEatList[j + 1];
									aiEatList[j + 1] = temp2;
									let temp3 = aiEatOwn[j];
									aiEatOwn[j] = aiEatOwn[j + 1];
									aiEatOwn[j + 1] = temp3;
								}
							}
						}
						// console.log(scoreList);
						// console.log(aiEatOwn, aiEatList);
						let bool = false;
						for (let i = 0; i < aiEatOwn.length; i++) {
							const afterChess = JSON.parse(JSON.stringify(aiEatOwn[i]));
							afterChess.location = aiEatList[i].location
							// console.log((!this.isDotEat(afterChess)) || (aiEatOwn[i].weight <= aiEatList[i].weight));
							if((!this.isDotEat(afterChess)) || (aiEatOwn[i].weight <= aiEatList[i].weight)) {
								bool = true;
								this.handlePosition(aiEatOwn[i].location, aiEatList[i].location, aiEatList[i]);
								break;
							}
						}
						if(bool) {
							return;
						}
					}
					
					// 2、判断每个子被追杀的情况下，周围有没有空地，有则逃跑
					// 逃跑的时候，判断空地的周围有没有能吃我的，如果有，则不用跑，如果没有则跑
					// 如果自身旁边有比狩猎者等级的我方子，则不用跑，达到一换一的效果
					let ownPassList = []; 	// 哪些子能被对方吃
					let nullList = []; 			// 每个被吃的子及其周围空地的数组
					for(let i = 0; i < aiFilpList.length; i++) {
						let a = JSON.parse(JSON.stringify(aiFilpList[i]))
						if(this.isDotEat(a)) {
							ownPassList.push(aiFilpList[i])
						}
					}
					for(let i = 0; i < ownPassList.length; i++) {
						let [x, y] = ownPassList[i].location;
						let arr = []
						if(x - 1 >= 0 && this.mapList[x - 1][y] == null) {
							arr.push([x - 1, y]);
						}
						if(x + 1 < 8 && this.mapList[x + 1][y] == null) {
							arr.push([x + 1, y])
						}
						if(y - 1 >= 0 && this.mapList[x][y - 1] == null){
							arr.push([x, y - 1])
						}
						if(y + 1 < 4 && this.mapList[x][y + 1] == null) {
							arr.push([x, y + 1])
						}
						nullList.push({ parent: [x, y], child: [...arr] })
					}
					// 最大权重的棋子先跑，获取最大的棋子
					let maxWeightChess = [], maxWeight = 0, maxChild = [];
					for (let i = 0; i < nullList.length; i++) {
						let [x, y] = nullList[i].parent
						if(this.mapList[x][y].weight > maxWeight && nullList[i].child.length > 0) {
							maxWeight = this.mapList[x][y].weight
							maxWeightChess = [x, y]
							maxChild = [...nullList[i].child]
						}
					}
					// 逃跑的时候，判断空地周围有没有能吃我的，如果有，则不用跑，如果没有则跑
					if(maxWeightChess.length > 0 && maxChild.length > 0) { 
						let [x, y] = maxWeightChess;
						let goodspace = [];
						for(let i = 0; i < maxChild.length; i++) {
							let [x1, y1] = maxChild[i];
							let a = JSON.parse(JSON.stringify(this.mapList[x][y]));
							a.location = [x1, y1];
							if(!this.isDotEat(a)) {
								goodspace = [...maxChild[i]]
								break;
							}
						}
						if(goodspace.length > 0) {
							this.handlePosition(maxWeightChess, goodspace);
							return;
						}
					}
					
					// 3、追杀 - 路线搜索算法
					// 查找场上自己的子和对方子，每两个子之间是否能连成一条路线，从大到小
					// console.log("当前场上电脑的子：", aiFilpList);
					// console.log("当前场上玩家的子：", playerFilpList);
					let allChessLoad = [];
					if(aiFilpList.length > 0 && playerFilpList.length > 0) {
						for(let i = 0; i < aiFilpList.length; i++) {
							let aiChess = aiFilpList[i];
							for(let j = 0; j < playerFilpList.length; j++) {
								let playerChess = playerFilpList[j];
								if(this.getAiIsEatPlayer(aiChess, playerChess)) {
									// 此时要注意，如果ai的子能吃玩家的子，此时的以0、1为代表二维数组是需要重新绘制的
									// 因为此时除了捕食子、被捕食子、空地以外所以节点都为0
									this.bfsLoadList = [];
									for(let a = 0; a < this.mapList.length; a++) {
										this.bfsLoadList[a] = []
										for(let b = 0; b < this.mapList[0].length; b++) {
											let [x1, y1] = aiChess.location;
											let [x2, y2] = playerChess.location;
											if(this.mapList[a][b] === null || (x1 == a && y1 == b) || (x2 == a && y2 == b)) {
												this.bfsLoadList[a][b] = 1;
											} else {
												this.bfsLoadList[a][b] = 0;
											}
										}
									}
									// 处理一下克隆数组,给每个节点加上我们需要的属性值nearNodes、parent、value等
									this.bfsList = [];
									for(let c = 0; c < this.bfsLoadList.length; c++) {
										this.bfsList[c] = []
										for(let d = 0; d < this.bfsLoadList[0].length; d++) {
											this.bfsList[c][d] = null;
										}
									}
									for(let e = 0; e < this.bfsLoadList.length; e++) {
										for(let f = 0; f < this.bfsLoadList[0].length; f++) {
											let node = this.getPointNode(e, f);
											let up = this.getPointNode(e - 1, f)
											let down = this.getPointNode(e + 1, f)
											let left = this.getPointNode(e, f - 1)
											let right = this.getPointNode(e, f + 1)
											node.nearNodes = [up, down, left, right].filter(item => item && item.value == 1)
											this.bfsList[e][f] = node
										}
									}
									// 再去计算捕食的最短路径
									let arr = this.searchLoad(aiChess.location, playerChess.location);
									if(arr.length > 1) {
										allChessLoad.push(arr);
									}
								}
							}
						}
					}
					// console.log("有没有路：", allChessLoad);
					if(allChessLoad.length > 0) {
						let lastPoint = [];
						let roadFirst = null
						let handleAllRoad = []		 		// 根据线路对比出，哪些路能要，哪些不能要
						let arrCopy = deepcopyArray(allChessLoad)		// 用来处理路线
						// 首先需要判断能吃玩家子的多条路线中，哪些路线半路上就会被玩家吃掉，这样的路线剔除
						for(let a = 0; a < arrCopy.length; a++) {
							if(arrCopy[a].length > 2) {
								let item = arrCopy[a];
								let {x, y} = arrCopy[a][item.length - 1];
								roadFirst = JSON.parse(JSON.stringify(this.mapList[x][y]))
								// 这里需要跳过每条路线的头尾，也就是捕食者与被捕食者，只计算路程中
								for (let b = item.length - 2; b >= 0; b--) {
									roadFirst.location = [arrCopy[a][b].x, arrCopy[a][b].y];
									if(this.isDotEat(roadFirst)) {
										arrCopy[a] = null;
										roadFirst.location = [];
										break;
									}
								}
							} else {
								arrCopy[a] = null;
							}
						}
						handleAllRoad = arrCopy.filter(item => item != null);
						// console.log("处理过后的路：", handleAllRoad);
						if(handleAllRoad.length > 0) {
							handleAllRoad.sort((a, b) => a.length - b.length)
							lastPoint = handleAllRoad[0];
							console.log(lastPoint);
							this.handlePosition(
								[lastPoint[lastPoint.length - 1].x, lastPoint[lastPoint.length - 1].y], 
								[lastPoint[lastPoint.length - 2].x, lastPoint[lastPoint.length - 2].y],
							)
							return;
						}
					}
					
					// 4、翻牌
					let noFlipList = list.filter(item => item && !item.isFilp);		// 过滤还没翻的牌
					if(noFlipList.length > 0) {
						let randomChess = noFlipList[Math.floor(Math.random() * noFlipList.length)];
						let [x, y] = randomChess.location;
						this.mapList[x][y].isFilp = true;
						return;
					}
					
					// 5、此时没有子可以吃，又没有牌可以翻，说明AI苟延残喘已经没救了，AI会自动认输
					// 此处可以优化，让AI最后多少再吃点子
					this.aiLose = true;
					this.isPlay = 2;
					this.isWin = 1;
					this.$refs.popupWin.open()
				}, 500)
			},
			
			// 路径搜索算法
			// mapList地图二维数组   aiChess起点  playerChess终点
			searchLoad(aiChess, playerChess) {
				let begin = this.getPointNode(aiChess[0], aiChess[1]);	// 当前点
				let end =  this.getPointNode(playerChess[0], playerChess[1]); // 目标点
				let path = [];
				let quere = [begin];
				while(quere.length > 0) {
					let current = quere.shift()
					current.checked = true
					for(let item of current.nearNodes) {
						if(!item.checked) {
							item.parent = current;
							quere.push(item)
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
				// 如果路径数组的第一个元素不是终点坐标，则返回空
				if(path.length && path[0].x == playerChess[0] && path[0].y == playerChess[1]) {
					return path;
				}
				return [];
			},
			// 设置点信息
			getPointNode(x, y) {
			  if (x >= 0 && y >= 0 && x < this.bfsList.length && y < this.bfsList[0].length) {
			    let node = this.bfsList[x] && this.bfsList[x][y];
					if(!node) {
						let val = this.bfsLoadList[x][y];
						if(val !== undefined) {
							node = {
								x,
								y,
								value: val,
								checked: false,
								parent: null,
								nearNodes: []
							}
							this.bfsList[x][y] = node;
						}
					}
					return node;
			  } 
				return null;
			},
			
			// 判断电脑的子够不够格能吃玩家的
			getAiIsEatPlayer(animal_ai, animal_player) {
				if(!animal_ai || !animal_player || animal_ai.camp == animal_player.camp || !animal_ai.isFilp || !animal_player.isFilp) {
					return false;
				}
				let aniWeight_1 = animal_ai.weight
				let aniWeight_2 = animal_player.weight
				if(
					(aniWeight_1 == 7 && [6,5,4,3,2].includes(aniWeight_2)) ||
					(aniWeight_1 == 6 && [5,4,3,2,1].includes(aniWeight_2)) ||
					(aniWeight_1 == 5 && [4,3,2,1].includes(aniWeight_2)) ||
					(aniWeight_1 == 4 && [3,2,1].includes(aniWeight_2)) ||
					(aniWeight_1 == 3 && [2,1].includes(aniWeight_2)) ||
					// (aniWeight_1 == 2 && [1].includes(aniWeight_2)) ||
					(aniWeight_1 == 1 && [7].includes(aniWeight_2))
				) {
					return true;
				}
				return false;
			},
			
			// 电脑判断某个点是否有被吃的可能  true=会被吃  false=不会被吃
			isDotEat(animal) {
				let list = JSON.parse(JSON.stringify(this.mapList));
				if(!animal) { return true; }
				let [x, y] = animal.location;
				// 判断当前点四周相邻有没有能吃自己的
				if(
					(x - 1 >= 0 && this.onIsEat(list[x - 1][y], animal)) ||
					(x + 1 <= 7 && this.onIsEat(list[x + 1][y], animal)) || 
					(y - 1 >= 0 && this.onIsEat(list[x][y - 1], animal)) || 
					(y + 1 <= 3 && this.onIsEat(list[x][y + 1], animal))
				) {
					return true;
				}
				// 判断每个子上下左右有没有鹰要吃自己，（有鹰并且之间有一颗子） num=之间存在的子
				if(x - 2 >= 0) {
					let num = 0, isHawk = false;
					for(let a = x - 1; a >= 0; a--) {
						if(list[a][y] && list[a][y].isFilp && list[a][y].name == '鹰' && list[a][y].camp == this.player2.camp) { isHawk = true; break; }
						if(list[a][y] != null) { num++; }
					}
					if(num == 1 && isHawk) {
						return  true;
					}
				}
				if(x + 2 <= 7) {
					let num = 0, isHawk = false;
					for(let a = x + 1; a <= 7; a++) {
						if(list[a][y] && list[a][y].isFilp && list[a][y].name == '鹰' && list[a][y].camp == this.player2.camp) { isHawk = true; break; }
						if(list[a][y] != null) { num++; }
					}
					if(num == 1 && isHawk) {
						return  true;
					}
				}
				if(y - 2 >= 0) {
					let num = 0, isHawk = false;
					for(let a = y - 1; a >= 0; a--) {
						if(list[x][a] && list[x][a].isFilp && list[x][a].name == '鹰' && list[x][a].camp == this.player2.camp) { isHawk = true; break; }
						if(list[x][a] != null) { num++; }
					}
					if(num == 1 && isHawk) {
						return  true;
					}
				}
				if(y + 2 <= 3) {
					let num = 0, isHawk = false;
					for(let a = y + 1; a <= 3; a++) {
						if(list[x][a] && list[x][a].isFilp && list[x][a].name == '鹰' && list[x][a].camp == this.player2.camp) { isHawk = true; break; }
						if(list[x][a] != null) { num++; }
					}
					if(num == 1 && isHawk) {
						return  true;
					}
				}
				return false;
			},
			
			// 交换位置 - 移动或者吃子 position1:需要移动的棋子的位置  position2：目标位置
			// 如果是吃子操作，则需要传入第三个参数用来判断是否输赢
			handlePosition(position1, position2, whoChess) {
				let [x1, y1] = position1;
				let [x2, y2] = position2;
				let chess = JSON.parse(JSON.stringify(this.mapList[x1][y1]));
				this.mapList[x2][y2] = chess;
				this.mapList[x2][y2].location = [x2, y2]
				this.mapList[x1][y1] = null;
				this.$forceUpdate()
				this.handlePlayer(whoChess);
			},
			
			// 处理hp和剩余棋子
			handlePlayer(chess) {
				if(!chess) return;
				if(chess.camp == this.player1.camp) {
					this.player1.list.forEach(item => {
						if(item.name == chess.name) {
							item.count -= 1;
							this.player1.score -= chess.score;
						}
					})
				}
				if(chess.camp == this.player2.camp) {
					this.player2.list.forEach(item => {
						if(item.name == chess.name) {
							item.count -= 1;
							this.player2.score -= chess.score;
						}
					})
				}
				// 判断输赢
				if(this.player1.score <= 0) {
					this.isPlay = 2;
					this.isWin = 1;
					this.$refs.popupWin.open()
				}
				if(this.player2.score <= 0) {
					this.isPlay = 2;
					this.isWin = 2;
					this.$refs.popupWin.open()
				}
			},
			
			// 判断animal_1能不能吃animal_2  true=能吃  false=不能吃
			onIsEat(animal_1, animal_2) {
				// 如果传入的两个牌一样或者没翻开，则不能吃
				if(!animal_1 || !animal_2 || animal_1.camp == animal_2.camp || !animal_1.isFilp || !animal_2.isFilp) {
					return false;
				}
				let aniWeight_1 = animal_1.weight
				let aniWeight_2 = animal_2.weight
				let x1 = animal_1.location[0];
				let y1 = animal_1.location[1];
				let x2 = animal_2.location[0];
				let y2 = animal_2.location[1];
				// 老鹰
				if(aniWeight_1 == 2) {
					let bool = false;
					if((y1 == y2 && x1 - 2 >= x2)) {
						let num = 0;
						for (let i = x1 - 1; i > x2; i--) {
							if(this.mapList[i][y1] != null) num++;
						}
						bool = num == 1 ? true : false;
					}
					if((y1 == y2 && x1 + 2 <= x2)) {
						let num = 0;
						for (let i = x1 + 1; i < x2; i++) {
							if(this.mapList[i][y1] != null) num++;
						}
						bool = num == 1 ? true : false;
					}
					if((x1 == x2 && y1 - 2 >= y2)) {
						let num = 0;
						for (let i = y1 - 1; i > y2; i--) {
							if(this.mapList[x1][i] != null) num++;
						}
						bool = num == 1 ? true : false;
					}
					if((x1 == x2 && y1 + 2 <= y2)) {
						let num = 0;
						for (let i = y1 + 1; i < y2; i++) {
							if(this.mapList[x1][i] != null) num++;
						}
						bool = num == 1 ? true : false;
					}
					return bool;
				}
				// 其他动物
				if(
					((aniWeight_1 == 7 && [7,6,5,4,3,2].includes(aniWeight_2)) ||
					(aniWeight_1 == 6 && [6,5,4,3,2,1].includes(aniWeight_2)) ||
					(aniWeight_1 == 5 && [5,4,3,2,1].includes(aniWeight_2)) ||
					(aniWeight_1 == 4 && [4,3,2,1].includes(aniWeight_2)) ||
					(aniWeight_1 == 3 && [3,2,1].includes(aniWeight_2)) ||
					(aniWeight_1 == 1 && [1,7].includes(aniWeight_2))) &&
					((y1 == y2 && x1 - 1 == x2) || (y1 == y2 && x1 + 1 == x2) ||(x1 == x2 && y1 - 1 == y2) || (x1 == x2 && y1 + 1 == y2))
				) {
					return true;
				}
				return false;
			},
			
			// 我知道了
			onKnow() {
				this.isPlay = 1;
				this.isWho = 1;
				this.$refs.popupRule.close()
				uni.showToast({title: '玩家先手', icon: 'none'})
			},
			// 退出游戏
			onExitGame() {
				window.location.reload()
			},
			// 再来一局
			onAgainGame() {
				this.player1.camp = '';
				this.player1.score = 100;
				this.player1.list = [];
				this.player2.camp = '';
				this.player2.score = 100;
				this.player2.list = [];
				this.mapList = [];
				this.selectChess = null;
				this.isStart = false;
				this.isWho = 1;
				this.isPlay = 1;
				this.isWin = 0;
				this.aiLose = false;
				this.createPlayChess();
				this.$refs.popupWin.close();
			},
			
			// 一维数组转二维数组
			arrayChange(arr, num) {
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
			},
			// 打乱数组
			arrayRandom(arr) {
				return arr.sort(() => Math.random() - 0.5);
			},
		}
	}
</script>

<style>
	page { background-color: #1f2022; }
</style>
<style lang="scss" scoped>
	image { width: 100%; height: 100%; }
	/deep/.uni-badge { z-index: 9; }
	.beast {
		width: 100%; height: 100vh; display: flex; flex-direction: column;justify-content: space-between;
	}
	.player {
		padding: 40rpx 20rpx;	display: flex;align-items: center;
		.photo {
			width: 88rpx; height: 88rpx; border-radius: 10rpx; overflow: hidden;display: flex;align-items: center;justify-content: center;
			background-color: #ebebeb;
			image { width: 80%; height: 80%; }
		}
		.HP {
			flex: 1; position: relative;
			.uni-progress { border-radius: 10rpx; overflow: hidden; }
			.hp-num { position: absolute; left: 50%; top: 44rpx; transform: translate(-50%, -50%); font-weight: bold; }
		}
		&.player-1 .photo { margin-right: 20rpx; }
		&.player-2 .photo { margin-left: 20rpx; }
		&.player-1
		&.player-2 .HP .uni-progress { transform: rotateY(180deg); }
		&.red .photo { background-color: #f56c6c; }
		&.blue .photo { background-color: #94bcff; }
		/deep/.uni-progress-inner-bar { transition: all .2s; }
	}
	.chess-item {
		width: 88rpx; height: 88rpx;border-radius: 10rpx;overflow: hidden;display: flex;align-items: center;justify-content: center;
		background-color: #ebebeb;
		image { width: 80%; height: 80%; }
	}
	.map {
		padding: 0 20rpx;
		.map-box { display: flex; justify-content: center; }
		.chess-player {
			width: 108rpx;
			&.chess-player1 { 
				padding-right: 20rpx; 
			}
			&.chess-player2 { 
				padding-left: 20rpx; display: flex; flex-direction: column; justify-content: flex-end; 
			}
			.red { background-color: #f56c6c; }
			.blue { background-color: #94bcff; }
			.die { filter: grayscale(1); }
			.uni-badge--x { display: block; }
			.uni-badge--x + .uni-badge--x { margin-top: 20rpx; }
		}
		.chess-play {
			flex: 1; height: 1020rpx; overflow: hidden;background-color: #ab865a;border-radius: 10rpx;
			display: flex;flex-direction: column;justify-content: space-evenly;padding: 6rpx;
			.chess-play-row {
				display: flex;
				align-items: center;
				justify-content: space-evenly;
			}
			.chess-block {
				padding: 10rpx 10rpx 18rpx;border-radius: 10rpx;overflow: hidden;display: flex;align-items: center;justify-content: center;
				background-color: #f0cc92; width: 108rpx; height: 116rpx;
			}
			.chess-item {
				user-select: none; transition: all .1s;
				&.no { background-color: #1aaf5d; box-shadow: 0 4px 0 #0a7237; }
				&.red { background-color: #f56c6c; box-shadow: 0 4px 0 #b34e4e; }
				&.blue { background-color: #94bcff; box-shadow: 0 4px 0 #6c8aba; }
				&.selected { transform: translateY(-8rpx); }
			}
		}
	}
	.win {
		width: 540rpx;border-radius: 20rpx;background-color: rgb(119,212,168);margin: 0 auto;padding: 20rpx;
		.win-box {
			width: 100%; background-color: rgb(254,255,241);border-radius: 10px;padding: 70rpx 30rpx 30rpx;
		}
		.win-title {
			width: 60%;padding: 20rpx;text-align: center;background-color: rgb(255,107,103);clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%);
			position: absolute;color: #fff;font-weight: bold;font-size: 40rpx;left: 50%;transform: translateX(-50%);top: -30rpx;
		}
		.win-content {
			width: 100%;min-height: 200rpx; border-radius: 20rpx;border: 1px solid rgb(251,206,87); background-color: rgb(255,243,205); box-shadow: inset 0 0 20rpx 0rpx rgba(251,206,87, .8);
			display: flex;align-items: center;justify-content: center;color: rgb(183,92,77); font-weight: bold; font-size: 40rpx;
		}
		.rule {
			width: 100%;padding: 30rpx;text-align: justify;
			.rule-item { font-size: 28rpx; }
			.rule-item + .rule-item { margin-top: 20rpx; }
		}
	}
	.win-btns {
		display: flex;align-items: center;justify-content: space-between;padding: 40rpx 20rpx;
		.win-btn {
			flex: 1;font-size: 34rpx;color: white;background: linear-gradient(to bottom, rgb(244,200,77), rgb(248,234,111));font-weight: bold;
			box-shadow: 0 6rpx 0 0 rgb(168,134,45); -webkit-text-stroke: 1rpx rgb(168,134,45);
		}
		.win-btn + .win-btn { margin-left: 40rpx; }
	}
</style>
