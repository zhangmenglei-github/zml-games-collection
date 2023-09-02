<template>
	<view 
		class="mie-btn-pop"
		:class="{'down': isDown}"
		@touchstart="onMouseDown()"
		@touchend="onMouseup()"
		@click="$emit('mie-pop-click')"
	>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"mie-btn-pop",
		data() {
			return {
				isDown: false
			};
		},
		methods: {
			onMouseDown() {
				this.isDown = true;
			},
			onMouseup() {
				setTimeout(() => {
					this.isDown = false;
				}, 50);
			},
		}
	}
</script>

<style lang="scss" scoped>
.mie-btn-pop {
	width: 100%;height: 110rpx;box-sizing: border-box;text-align: center;border-radius: 16rpx;border: 6rpx solid #000;
	font-size: 46rpx;font-weight: bold;display: flex;align-items: center;justify-content: center;
	box-shadow: 0 10rpx 4rpx 0rpx rgb(178,178,178);line-height: 1;transition: .1s;
}
.mie-btn-pop + .mie-btn-pop { margin-top: 40rpx; }
.down {
	transform: scale(.9);
}
</style>