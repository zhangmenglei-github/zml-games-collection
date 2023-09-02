<template>
	<view class="mie-grass">
		<view 
			class="grass" 
			v-for="(item,index) in grass" 
			:key="index" 
			:style="{'left': item.offsetX, 'top': item.offsetY}"
		>
			<view class="leaf leaf-1"></view>
			<view class="leaf leaf-2"></view>
			<view class="leaf leaf-3"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "mie-grass",
		data() {
			return {
				grass: []
			};
		},
		mounted() {
			this.grass_init();
		},
		methods: {
			// 随机生成草
			grass_init() {
				for (let i = 0; i < 15; i++) {
					const x = Math.floor(Math.random()*100);
					const y = Math.floor(Math.random()*100);
					this.grass.push({ offsetX: `${x}%`, offsetY: `${y}%` });
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.mie-grass {
	position: absolute;width: 100%;height: 100%;overflow: hidden;
	left: 0;top: 0;right: 0;bottom: 0;
}
.grass {
	position: absolute;
	.leaf { width: 10rpx;height: 24rpx; position: absolute; border: 4rpx solid rgb(97, 161, 23);border-radius: 100%;border-bottom: 0;}
	.leaf-1 { transform: rotate(-30deg); }
	.leaf-2 { transform: translateX(8px); }
	.leaf-3 { transform: rotate(30deg); left: 32rpx; }
}
</style>