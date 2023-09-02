<template>
	<view
		class="mie-btn"
		:class="{'down': isDown, 'disabled': btnDisabled}"
		@click="mieClick"
		@touchstart="onMouseDown()"
		@touchend="onMouseup()"
	>
		<slot></slot>
		<view class="mie-btn-badge" :style="{'fontSize': btnNum === 0 ? '38rpx':'34rpx'}" v-show="!btnDisabled">
			{{ btnNum === 0 ? '+' : btnNum }}
		</view>
		<view class="mie-btn-mask" v-show="btnDisabled"></view>
	</view>
</template>

<script>
	export default {
		name: "mie-btn",
		props: {
			btnNum: {
				type: Number,
				default: 0
			},
			btnDisabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isDown: false
			}
		},
		methods: {
			onMouseDown() {
				if(!this.btnDisabled) {
					this.isDown = true;
				}
			},
			onMouseup() {
				if(!this.btnDisabled) {
					setTimeout(() => {
						this.isDown = false;
					}, 50);
				}
			},
			mieClick() {
				if(!this.btnDisabled) {
					this.$emit('mie-click');
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.mie-btn {
	width: 170rpx;height: 140rpx;border: 4rpx solid #000;border-radius: 16rpx;background-color: rgb(34, 164, 255);box-shadow: 0 8rpx 0rpx 0rpx rgb(107,208,255) inset;position: relative;display: flex;align-items: center;justify-content: center;transition: .1s;
	&::before {
		content: "";position: absolute;left: 0;bottom: 10rpx;width: 100%;height: 100%;border-radius: 16rpx;border-bottom: 4rpx solid #000;box-shadow: 0 22rpx 0rpx 0rpx rgba(0,0,0,.3);
	}
	&.down {
		transform: scale(.9);
	}
	.mie-btn-badge {
		position: absolute;right: -20rpx;top: -20rpx;width: 46rpx;height: 46rpx;padding: 0 6rpx 4rpx;background-color: #000;line-height: 1;color: #fff;border-radius: 50%;display: flex;align-items: center;justify-content: center;box-sizing: border-box;font-size: 38rpx;font-weight: bold;box-shadow: 0 6rpx 0rpx 0rpx rgba(0,0,0,.3);
	}
	.mie-btn-mask {
		position: absolute;width: 100%;height: 100%;background-color: rgba(0,0,0,.5);top: 0;left: 0;z-index: 10;
	}
}
</style>