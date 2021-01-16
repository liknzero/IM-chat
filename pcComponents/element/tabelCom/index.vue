<template>
	<el-table style="width: 100%" v-bind="$attrs" v-on="$listeners">
		 <template v-for="(item, index) in columns">
			<el-table-column v-if="item.slot" :key="index" v-bind="item.attrs">
				<template slot-scope="scope">
					<slot :scope="scope" :name="item.slot"></slot>
				</template>
			</el-table-column>
			<el-table-column v-else :key="item.id" v-bind="item.attrs"></el-table-column>
		</template>
	</el-table>
</template>

<script>
	export default {
		name: 'table-com',
		props: {
			columns: {
				type: Array,
				default: () => []
			}
		}
	}
</script>