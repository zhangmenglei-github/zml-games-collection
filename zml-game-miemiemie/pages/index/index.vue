<template>
	<view class="mie" id="miemie">
		<!-- 背景草坪 -->
		<mie-grass></mie-grass>
		<!-- 渲染所需要的卡牌 -->
		<view class="mie-card">
			<mie-brand
				v-for="(item, index) in firstList"
				:key="index"
				:bType="item.type" 
				:bTop="item.offsettop"
				:bLeft="item.offsetleft"
				:bMask="item.isMask"
				:bClick="item.isClick"
				:bShow="item.isShow"
				@brand-click="onBrandClickAni(item, index)"
			></mie-brand>
		</view>
		<!-- 主要内容 -->
		<view class="mie-main">
			<!-- 头部 -->
			<view class="mie-head">
				<view class="level-title">第{{ level === 1 ? '一' : '二' }}关</view>
				<view class="level-list">
					<view class="level-item" :class="{'active': level === 1}"></view>
					<view class="level-line"></view>
					<view class="level-item" :class="{'active': level === 2}"></view>
				</view>
			</view>
			<!-- 关卡地图 -->
			<view class="mie-play">
				<!-- 第一关 -->
				<view class="level-map first-level" v-if="level === 1">
					<view class="map-block" v-for="(item1, index1) in firstMap" :key="index1">
						<view :class="['map-block-item', `map-block-item-${item2.id}`]" v-for="item2 in item1" :key="item2.id"></view>
					</view>
				</view>
				<!-- 第二关 -->
				<view class="level-map second-level" v-if="level === 2">
					
				</view>
			</view>
			<!-- 底部 -->
			<view class="mie-footer">
				<!-- 额外卡槽 -->
				<view class="footer-extra">
					<view :class="['extra-item', `extra-item-${index}`]" v-for="(item, index) in extraList" :key="index">{{item?'':''}}</view>
				</view>
				<!-- 卡槽 -->
				<view class="footer-fence">
					<view class="fence-box">
						<view class="fence-deposit">
							<view :class="['deposit-item', `deposit-item-${index}`]" v-for="(item, index) in depositList" :key="index">{{item?'':''}}</view>
						</view>
					</view>
				</view>
				<!-- 功能按钮 -->
				<view class="footer-btns">
					<mie-btn :btnNum="item.count" :btnDisabled="item.disabled" @mie-click="onMiePropClick(item)" v-for="item in propList" :key="item.id">
						<image :src="item.icon" mode="widthFix" :lazy-load="true" style="width: 80rpx;"></image>
					</mie-btn>
				</view>
			</view>
		</view>
		
		<!-- 弹框警告 -->
		<u-popup mode="center" :show="popShow" @close="popShow = false" @open="popShow = true">
			<view class="propBox">
				<view class="propBox-box">
					<view class="propBox-border">
						<view class="propBox-close" @click="popShow = false">
							<u-icon name="close" color="#fff" size="24" bold></u-icon>
						</view>
						<view class="propBox-name">{{ prop.name }}</view>
						<view class="propBox-image">
							<image :src="prop.icon" mode="widthFix" :lazy-load="true" style="width: 140rpx;"></image>
						</view>
						<view class="propBox-text">{{ prop.text }}</view>
						<MieBtnPop @mie-pop-click="getPropCount"><u-icon name="thumb-up-fill" color="#000" size="28"></u-icon>获得(1/1)</MieBtnPop>
						<MieBtnPop @mie-pop-click="popShow = false"><u-icon name="thumb-down-fill" color="#000" size="28"></u-icon>不，谢谢</MieBtnPop>
					</view>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import MieBtn from '@/components/mie-btn/mie-btn.vue';
	import MieGrass from '@/components/mie-grass/mie-grass.vue';
	import MieBrand from '@/components/mie-brand/mie-brand.vue';
	import MieBtnPop from '@/components/mie-btn-pop/mie-btn-pop.vue';
	import { createLevelArray } from '@/utils/common.js';
	import { MIE_BTN_CONFIG } from '@/components/mie-btn/mie-btn.config.js';
	export default {
		components: { MieBtn, MieGrass, MieBrand, MieBtnPop },
		data() {
			return {
				popShow: false,
				propList: MIE_BTN_CONFIG,	// 底部功能按钮组
				prop: MIE_BTN_CONFIG[0],	// 默认道具弹框展示第一个
				level: 1,									// 关卡
				isHandle: true,						// 防止用户点击过快
				depositList: [],					// 卡牌槽
				extraList: [],						// 额外的三个槽
				remember: {
					brand: null,
					index: null
				},												// 每次点击卡牌，都要记住它以及它的坐标
				firstMap: [],							// 第一关地图排序，二维数组 长度9
				firstList: [],						// 第一关需要的蔬菜卡片 一位数组 长度18
			}
		},
		onLoad() {
			this.createDeposit();
			this.createFirstMap();
			this.createBrand();
			this.createExtra();
		},
		onReady() {
			this.getDepositInfo();
			this.getMapInfo();
			this.setBrandSeat();
			this.getExtraInfo();
		},
		methods: {
			// 初始化
			init() {
				this.firstList = [];
				this.createBrand();
				this.setBrandSeat();
			},
			
			// 生成卡槽
			createDeposit() {
				for (let i = 0; i < 7; i++) {
					this.depositList.push({ 
						offsettop: 0,
						offsetleft: 0,
						brand: null,
					});
				}
			},
			// 获取卡槽坐标
			getDepositInfo() {
				this.depositList.forEach((item, index) => {
					uni.createSelectorQuery().in(this).select(`.deposit-item-${index}`).boundingClientRect(data => {
						item.offsettop = `${Math.floor(data.top) * 2}rpx`;
						item.offsetleft = `${Math.floor(data.left) * 2}rpx`;
					}).exec();
				});
			},
			
			// 生成额外卡槽
			createExtra() {
				for (let i = 0; i < 3; i++) {
					this.extraList.push({
						offsettop: 0, 
						offsetleft: 0, 
						brand: null,
					});
				}
			},
			// 获取额外卡槽坐标
			getExtraInfo() {
				this.extraList.forEach((item, index) => {
					uni.createSelectorQuery().in(this).select(`.extra-item-${index}`).boundingClientRect(data => {
						item.offsettop = `${Math.floor(data.top) * 2}rpx`;
						item.offsetleft = `${Math.floor(data.left) * 2}rpx`;
					}).exec();
				});
			},
			
			// 生成第一关地图布局
			createFirstMap() {
				let arr = new Array(18).fill(null);
				let blockArr = [];	// 每一块存放的牌 一块存放两个
				for (let i = 1; i <= arr.length; i++) {
					let brand = { 
						id: i, 
						offsettop: 0,
						offsetleft: 0,
						left: 0, 
						top: 0,
						width: 0,
						height: 0
					}
					blockArr.push(brand);
					if(blockArr.length === 2) {
						this.firstMap.push(blockArr);
						blockArr = [];
					}
				}
			},
			// 获取第一关布局位置坐标
			getMapInfo() {
				this.firstMap.forEach(item1 => {
					item1.forEach(item2 => {
						setTimeout(() => {
							uni.createSelectorQuery().in(this).select(`.map-block-item-${item2.id}`).boundingClientRect(data => {
								item2.offsettop = `${Math.floor(data.top) * 2}rpx`;
								item2.offsetleft = `${Math.floor(data.left) * 2}rpx`;
								item2.top = Math.floor(data.top);
								item2.left = Math.floor(data.left);
								item2.width = Math.floor(data.width);
								item2.height = Math.floor(data.height);
							}).exec();
						}, 50)
					});
				});
			},
			
			// 生成卡牌
			createBrand() {
				let arr = uni.$u.randomArray(createLevelArray(3, 18));		// 随机三种蔬菜
				let index = 2;
				for (let i = 0; i < arr.length; i++) {
					let brand = { 
						id: i + 1,
						type: arr[i], 
						width: 0,
						height: 0,
						top: 0,
						left: 0,
						offsettop: '44%',
						offsetleft: '44%',
						isMask: i % 2 === 0 ? false : true,
						isClick: true,
						isShow: true,
						coor: [Math.floor(i / index), i%2 === 0 ? 0 : 1]
					}
					this.firstList.push(brand);
				}
			},
			// 卡牌归位
			setBrandSeat() {
				const arr = [].concat.apply([], this.firstMap);
				arr.forEach(item1 => {
					this.firstList.forEach(item2 => {
						setTimeout(() => {
							if(item1.id === item2.id) {
								item2.top = item1.top;
								item2.left = item1.left;
								item2.offsettop = item1.offsettop;
								item2.offsetleft = item1.offsetleft;
								item2.width = item1.width;
								item2.height = item1.height;
							}
						}, 200)
					});
				});
			},
			
			// 点击牌，动态处理
			onBrandClickAni(brand, index) {
				if(brand.isClick && !brand.isMask && this.isHandle ) {
					this.isHandle = false;
					// 不可点击触摸
					brand.isClick = false;
					// 把点击卡牌后面那个卡牌的遮罩去掉
					if(this.firstList[index + 1]) {
						this.firstList[index + 1].isMask = false
					}
					// 获取卡槽中从左到右相同牌最后一个的下标、或者第一个无牌的下标
					let aIndex = 0;
					for(let i = 0; i < this.depositList.length; i++) {
						if(!this.depositList[i].brand) {
							aIndex = i;
							break;
						} else {
							if(this.depositList[i].brand.type === brand.type && this.depositList[i + 1].brand && this.depositList[i + 1].brand.type !== brand.type) {
								aIndex = i + 1;
								break;
							}
							if(this.depositList[i].brand.type === brand.type && this.depositList[i + 1].brand && this.depositList[i + 1].brand.type === brand.type) {
								aIndex = i + 2;
								break;
							}
						}
					}
					// 如果插入的位置或者后面有牌，则位置后面的牌，都要向后移
					if(this.depositList[aIndex] && this.depositList[aIndex].brand) {
						for(let i = this.depositList.length - 1; i >= aIndex; i--) {
							if(this.depositList[i].brand) {
								this.firstList.forEach(first => {
									if(first.id === this.depositList[i].brand.id) {
										this.depositList[i + 1].brand = first;
										first.offsetleft = this.depositList[i + 1].offsetleft;
									}
								})
							}
						}
					}
					// 记住点击的牌，便于撤回的时候用
					this.remember.brand = uni.$u.deepClone(brand);
					this.remember.index = aIndex;
					// 移动卡牌到卡槽
					brand.offsettop = this.depositList[aIndex].offsettop;
					brand.offsetleft = this.depositList[aIndex].offsetleft;
					this.depositList[aIndex].brand = brand;
					setTimeout(() => {
						this.handleBrand(brand, aIndex);
					}, 200);
				}
			},
			// 处理存放的牌 (每满3个就消除)
			handleBrand(brand, thisIndex) {
				let arr = this.depositList.map(item => item.brand);
				let sameArr = [];
				arr.forEach(item => {
					if(item && item.type === brand.type) sameArr.push(item);
				});
				if(sameArr.length === 3) {
					this.remember.brand.isShow = false;
					// 清除
					sameArr.forEach(sItem => {
						this.firstList.forEach(fItem => {
							if(sItem.id === fItem.id) fItem.isShow = false; 
						});
						this.depositList.forEach(dItem => {
							if(dItem.brand && dItem.brand.id === sItem.id) dItem.brand = null; 
						})
					});
					// 把消除的后面的卡牌都向前移动
					this.handleCardSlot(thisIndex, 3);
				}
				this.isHandle = true;
				setTimeout(() => {
					this.isWin()
				}, 50);
 			},
			// 整理卡槽 thisIndex：从什么位置开始整理, num: 所有卡牌前进几格
			handleCardSlot(thisIndex, num) {
				if(this.depositList[thisIndex + 1] && this.depositList[thisIndex + 1].brand) {
					for (let i = thisIndex + 1; i < this.depositList.length; i++) {
						for(let j = 0; j < this.firstList.length; j++) {
							if(this.depositList[i].brand && this.depositList[i].brand.id === this.firstList[j].id) {
								this.firstList[j].offsetleft = this.depositList[i - num].offsetleft;
								let temp = this.depositList[i].brand;
								this.depositList[i].brand = null;
								this.depositList[i - num].brand = temp;
							} 
						}
					}
				}
			},
			// 判断输赢  (成功: 地图上和卡槽里都没有了)  (失败: 没有可以消除并且满了)
			isWin() {
				let isDepositHave = this.depositList.map(item => item.brand).every(e => e === null);
				let isDepositAll = this.depositList.map(item => item.brand).every(e => e !== null);
				let isMapHave = this.firstList.map(item => item.isShow).every(e => e === false);
				if(isDepositHave && isMapHave) {
					this.$refs.uToast.show({type: 'default', message: '你赢了'});
					this.level = 2;
					this.firstList = [];
				}
				if(isDepositAll) {
					this.$refs.uToast.show({type: 'default', message: '你输了'});
				}
			},
			
			// 点击道具
			onMiePropClick(item) {
				uni.$u.throttle(() => {
					this.prop = item;
					if(item.count === 0) {
						this.popShow = true;
					} else {
						switch (item.id){
							case 1: this.onMieRemove(); break;
							case 2:	this.onMieRevoke();	break;
							case 3:	this.onMieWash();	break;
							default: this.$refs.uToast.show({type: 'default', message: '按钮错误'});	break;
						}
					}
				}, 1000);
			},
			// 获取道具（看视频）
			getPropCount() {
				this.prop.count += 1;
			},
			// 移出
			onMieRemove() {
				let arr = this.depositList.filter((item,index) => item.brand !== null && index < 3);
				if(arr.length > 0) {
					this.prop.disabled = true;
					this.extraList.forEach((item1, index1) => {
						this.depositList.forEach((item2, index2) => {
							if(index1 === index2 && item2.brand) { 
								let temp = item2.brand;
								item1.brand = temp;
								item2.brand = null;
							}
						});
					});
					this.extraList.forEach(item1 => {
						this.firstList.forEach(item2 => {
							if(item1.brand && item1.brand.id === item2.id) {
								item2.offsettop = item1.offsettop;
								item2.offsetleft = item1.offsetleft;
								item2.isClick = true;
							}
						})
					});
					this.handleCardSlot(arr.length - 1, 3);
				} else {
					this.$refs.uToast.show({type: 'default', message: '无卡牌可移出'});
				}
			},
			// 撤回
			onMieRevoke() {
				if(this.remember.brand && this.remember.index !== null && this.remember.brand.isShow) {
					this.prop.disabled = true;
					this.depositList.forEach(item => {
						if(item.brand && item.brand.id === this.remember.brand.id) {
							item.brand = null;
						}
					});
					this.firstList.forEach((item, index) => {
						if(item.id === this.remember.brand.id) {
							item.offsettop = this.remember.brand.offsettop;
							item.offsetleft = this.remember.brand.offsetleft;
							item.isClick = true;
							if((index + 1) % 2 !== 0 && this.firstList[index + 1]) {
								this.firstList[index + 1].isMask = true;
							}
						}
					});
					this.handleCardSlot(this.remember.index, 1);
				} else {
					this.$refs.uToast.show({type: 'default', message: '无卡牌可撤回'});
				}
			},
			// 洗牌
			onMieWash() {
				let arr = this.firstList.filter(item => item.isClick);
				let arrType = uni.$u.randomArray(uni.$u.deepClone(arr)).map(item => item.type);
				arr.forEach((item, index) => {
					item.offsetleft = '44%';
					item.offsettop = '44%';
				});
				setTimeout(() => {
					arr.forEach((item, index) => {
						item.type = arrType[index];
						item.offsettop = `${item.top * 2}rpx`;
						item.offsetleft = `${item.left * 2}rpx`;
					});
				}, 200);
			}
		}
	}
</script>

<style>
	page { background-color: rgb(195, 254, 139); }
</style>
<style lang="scss" scoped>
	.mie-card {
		position: absolute;
		z-index: 11;
	}
	.mie-main {
		width: 100%; height: 100%;position: absolute;display: flex; flex-direction: column; z-index: 10;
		left: 0;top: 0;right: 0;bottom: 0;
		.mie-head {
			display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100rpx;
			.level-title {width: 300rpx;padding: 10rpx 0;background-color: #000;color: #fff;text-align: center;border-radius: 14rpx;font-size: 40rpx;}
			.level-list {padding: 12rpx;background-color: #000;border-radius: 100rpx;margin-top: 4rpx;display: flex;align-items: center;
				.level-item {
					width: 26rpx;height: 26rpx;background-color: #fff;border-radius: 50%;position: relative;
					&.active::before {
						content: ""; position: absolute;width: 60%;height: 60%;background-color: #000;border-radius: 50%;
						left: 50%; top: 50%; transform: translate(-50%, -50%);
					}
				}
				.level-line {width: 36rpx;height: 8rpx;background-color: #fff;}
			}
		}
		.mie-play {flex: 1;display: flex;align-items: center;justify-content: center;}
		.mie-footer {
			display: flex;flex-direction: column;padding: 128rpx 0 20rpx;position: relative;
			.footer-fence {
				padding: 0 18rpx;
				.fence-box {width: 100%;height: 150rpx;background-color: rgb(194, 125, 45);border: 2px solid rgb(83, 48, 9);box-sizing: border-box;border-radius: 14rpx;padding: 16rpx;}
				.fence-deposit {
					width: 100%;height: 100%;background-color: rgb(150, 91, 27);border-radius: 14rpx;box-shadow: 0 12rpx 0 0 rgb(127, 78, 22) inset;display: flex;
					.deposit-item { flex: 1; height: 110rpx; max-width: 96rpx; }
				}
			}
			.footer-btns {display: flex;align-items: center;justify-content: space-around;padding: 20rpx;}
			.footer-extra { 
				width: 100%;height: 110rpx;display: flex;align-items: center;justify-content: center;position: absolute;
				top: 0;left: 0;
				.extra-item { width: 96rpx;height: 110rpx; }
			}
		}
	}
	.level-map {
		width: 430rpx;height: 580rpx;box-sizing: border-box;display: flex;flex-wrap: wrap;
		.map-block {
			width: 33.333%;display: flex;align-items: center;justify-content: center;position: relative;
			.map-block-item {
				width: 96rpx;height: 110rpx;position: absolute;
				&:nth-child(1) { z-index: 2; top: 42%; }
				&:nth-child(2) { z-index: 1; }
			}
			&:nth-child(7) .map-block-item:nth-child(1),
			&:nth-child(8) .map-block-item:nth-child(1),
			&:nth-child(9) .map-block-item:nth-child(1) { top: 28%; }
		}
	}
	.propBox {
		width: 540rpx;height: auto;border-radius: 24rpx;border: 12rpx solid #000;background-color: #000;position: relative;box-sizing: border-box;
		&-box {
			width: 100%;height: 100%;border-radius: 14rpx;background-color: #fff;box-sizing: border-box;padding: 6rpx;
		}
		&-border {
			width: 100%;height: 100%;border-radius: 14rpx;box-sizing: border-box;border: 4rpx solid rgb(127,127,127);padding: 60rpx;display: flex;flex-direction: column;align-items: center;
		}
		&-name {
			width: 300rpx;height: 100rpx;border-radius: 20rpx;background-color: #000;color: rgb(255,228,0);box-sizing: border-box;
			font-weight: 500;font-size: 46rpx;display: flex;align-items: center;justify-content: center;line-height: 1;margin-top: -120rpx;
			box-shadow: 0 10rpx 4rpx 0rpx rgb(178,178,178);
		}
		&-image {
			width: 240rpx;height: 240rpx;border-radius: 50%;box-sizing: border-box;background-color: #000;display: flex;align-items: center;justify-content: center;margin-top: 40rpx;
		}
		&-text {
			text-align: center;font-size: 36rpx;margin: 40rpx 0;
		}
		&-close {
			position: absolute;right: 0;top: 0;width: 70rpx;height: 70rpx;padding: 0 6rpx 4rpx;background-color: #000;line-height: 1;color: #fff;border-radius: 50%;display: flex;align-items: center;justify-content: center;box-sizing: border-box;font-size: 38rpx;font-weight: bold;box-shadow: 0 10rpx 0rpx 0rpx rgba(0,0,0,.3);
			transform: translate(50%, -50%);
		}
	}
	
	::v-deep .u-popup__content { background-color: transparent; }
</style>
