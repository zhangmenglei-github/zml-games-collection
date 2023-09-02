<template>
	<view 
		class="mie-brand" 
		:class="{'down': isDown, 'isMask': bMask}"
		:style="{
			'top': bTop, 
			'left': bLeft, 
			'transform': `${bShow ? 'scale(1)' : 'scale(0)'}`
		}"
		@click="$emit('brand-click')" 
		@touchstart="onMouseDown"
		@touchend="onMouseup"
	>
		<view class="brand">
			<view class="brand-box">
				<image :src="'/static/food/food-'+ bType +'.png'" mode="widthFix" :lazy-load="true"></image>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="brand-mask" :style="{'backgroundColor':  bMask ? 'rgba(0,0,0,0.4)':'rgba(0,0,0,0)'}"></view>
	</view>
</template>

<script>
	export default {
		name:"mie-brand",
		props: {
			bType: { type: Number, require: true },
			bMask: { type: Boolean, default: false },
			bShow: { type: Boolean, default: true },
			bClick: { type: Boolean, default: true },
			bTop: { type: Number | String | null, default: null },
			bLeft: { type: Number | String | null, default: null }
		},
		data() {
			return {
				isDown: false
			}
		},
		methods: {
			onMouseDown() {
				if(!this.bMask && this.bClick) {
					this.isDown = true;
				}
			},
			onMouseup() {
				if(!this.bMask && this.bClick) {
					setTimeout(() => {
						this.isDown = false;
					}, 50);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.mie-brand {
	width: 96rpx;height: 110rpx;position: fixed;overflow: hidden;transition: .2s;
	z-index: 1;
	&.down {transform: scale(1.2) !important;}
	&.isMask { z-index: 0; }
}
.brand {
	width: 96rpx;height: 110rpx;border: 1px solid rgb(37,53,8);border-radius: 14rpx;background-color: rgba(114, 163, 19, 1);box-sizing: border-box;overflow: hidden;padding-bottom: 12rpx;position: relative;z-index: 1;
	&-box {
		width: 100%;height: 100%;border-radius: 14rpx;background-color: rgb(245, 255, 205);border-bottom: 2rpx solid rgb(200, 215, 140);box-sizing: border-box;display: flex;align-items: center;justify-content: center;
		image {
			width: 100%;
		}
	}
}
.brand-mask {
	width: 100%;height: 100%;position: absolute;top: 0;left: 0;border-radius: 14rpx;z-index: 1;transition: .3s;
	transform: scale(1);
}
</style>