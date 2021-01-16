<template>
	<el-form
		:model="searchData"
		:rules="searchRule"
		ref="searchForm"
		:label-width="labelWidth"
		:label-position="labelPosition"
		:inline="inLine"
		:label-suffix="labelSuffix"
	>
		<el-form-item
			v-for="item in searchForm"
			:prop="item.prop"
			:label="item.label"
			:label-width="item.labelWidth"
			:key="item.label"
		>
			<!--input普通输入框-->
			<el-input
				v-if="item.type === 'Input'"
				v-model="searchData[item.prop]"
				:type="item.inputType"
				:disabled="item.disable"
				:show-word-limit="item.showWordLimit"
				:placeholder="item.placeholder"
				:maxlength="item.maxlength"
				:style="item.style"
			/>
			<!--input数字输入框-->
			<el-input-number
				v-else-if="item.type === 'InputNumber'"
				v-model="searchData[item.prop]"
				:disabled="item.disable"
				:controls="item.controls"
				:show-word-limit="item.showWordLimit"
				:precision="item.precision"
				:placeholder="item.placeholder"
				:style="item.style"
			></el-input-number>
			<!--input数字区间-->
			<template v-else-if="item.type === 'InputNumberSegment'">
				<div v-for="(val, index) in searchData[item.prop]" :data-index="index" :key="index">
					<el-input
						v-model="val['start']"
						:disabled="item.disable"
						:placeholder="item.placeholder"
						:style="item.style"
					/>
					<span>—</span>
					<el-input
						v-model="val['end']"
						:disabled="item.disable"
						:placeholder="item.placeholder"
						:style="item.style"
					/>
					<Button v-if="index === 0" @click="searchData[item.prop].push({start: '', end: ''})" type="text"
					        size="large" style="font-size: 24px" icon="md-add"></Button>
					<Button v-if="index !== 0" @click="searchData[item.prop].splice(index, 1)" type="text" size="large"
					        style="font-size: 24px" icon="ios-trash-outline"></Button>
				</div>
			</template>
			<!--textarea文本输入框-->
			<el-input
				v-else-if="item.type === 'Textarea'"
				v-model="searchData[item.prop]"
				type="textarea"
				:show-word-limit="item.showWordLimit"
				:maxlength="item.maxLength"
				:rows="item.rows"
				:placeholder="item.placeholder"
				:style="item.style"
			/>
			<!--select下拉选择框-单选-->
			<el-select
				v-else-if="item.type === 'Select'"
				v-model="searchData[item.prop]"
				:style="item.style"
				:disabled="item.disable"
				:placeholder="item.placeholder"
				filterable
				:clearable="item.clearable"
				:multiple="item.multiple"
				:multiple-limit="item.multipleLimit || 0"
				@change="val => item.change && item.change(val)"
				@visible-change="$forceUpdate()"
			>
				<!--:value="`${op.value}`" 是因为iview表单默认只校验string类型，所以先将value全修改成string类型，取值的时候按需转为其他类型-->
				<el-option v-for="op in item.options" :value="`${op.value}`" :label="op.label" :key="op.value"></el-option>
			</el-select>
			<!--radio 单选框-->
			<el-radio-group
				v-else-if="item.type === 'Radio'"
				v-model="searchData[item.prop]"
				:border="item.border"
				:style="item.style"
			>
				<el-radio v-for="op in item.options" :key="op.value" :label="`${op.value}`">{{ op.label }}</el-radio>
			</el-radio-group>
			<!--radio button 单选-->
			<el-radio-group
				v-else-if="item.type === 'RadioButton'"
				v-model="searchData[item.prop]"
				:border="item.border"
				:style="item.style"
			>
				<el-radio-button v-for="op in item.options" :key="op.value" :label="op.value">{{ op.label }}</el-radio-button>
			</el-radio-group>
			<!--时间选择-->
			<el-date-picker
				v-else-if="item.type === 'Datetime'"
				v-model="searchData[item.prop]"
				type="datetime"
				:placeholder="item.placeholder"
				:picker-options="pickerOptions"
				:format="item.format || 'yyyy-MM-dd HH:mm:ss'"
				:style="item.style"
			>
			</el-date-picker>
			<!--时间区间筛选-->
			<el-date-picker
				v-else-if="item.type === 'Datetimerange'"
				v-model="searchData[item.prop]"
				type="datetimerange"
				:picker-options="pickerMerangeOptions"
				:range-separator="item.separator || '至'"
				:start-placeholder="item.startPlaceholder || '开始日期'"
				:end-placeholder="item.endPlaceholder || '结束日期'"
				:format="item.format || 'yyyy-MM-dd HH:mm:ss'"
				:style="item.style"
			>
			</el-date-picker>
			<!--图片上传操作-->
			<beeUpload
				v-else-if="item.type === 'UploadImg'"
				:disabled="item.disabled"
				:files="searchData[item.prop]"
				:limit="item.limit"
				:multiple="item.multiple"
			></beeUpload>
			<!--自定义内容-->
			<template v-else-if="item.slotName">
				<slot :name="item.slotName"></slot>
			</template>
		</el-form-item>
		<el-form-item
			v-if="isHandle"
		>
			<el-button
				v-for="item in searchHandle"
				:key="item.label"
				:type="item.type"
				:style="item.style"
				:loading="item.loading || false"
				@click="item.handle($refs['searchForm'])"
			>{{ item.label }}
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import beeUpload from '_c/upload/beeUpload'

	export default {
		name: 'form-data',
		components: {
			beeUpload
		},
		props: {
			// 在mounted内返回给父组件$refs实例
			// 在button内也会返回给父组件$refs实例
			// 这里主动给父组件传回实例，是某些场景需要在父组件主动控制校验结果和重置校验
			refForm: {
				type: Object,
				default: () => {
					return {}
				}
			},
			// 是否显示按钮
			isHandle: {
				type: Boolean,
				default: true
			},
			/* button列表
			*{
			*   type: 'default',
			*   label: '取消',
			*   handle: ($refs) => {
			*     // $refs是当前form表单实例，可在父组件调用以查看校验及其他操作
			*     $refs.validate()
			*     $refs.resetFields()
			*   }
			* }
			* */
			searchHandle: {
				type: Array,
				default: () => []
			},
			/* 表单列表
			* type: "Input", // 表单类型
			* label: "人员姓名",
			* prop: "name", // 表单字段名
			* style: { width: "180px" },
			* placeholder: "请输入",
			* disable: true, // 默认不填，当需要禁用该列表时给true
			* rules:  // 表单验证 封装方法在 libs/form-rules
			* */
			searchForm: {
				type: Array,
				default: () => []
			},
			// 需要绑定的数据，可通过父组件传值设置默认值
			// 此数据可返回给父组件
			searchData: {
				type: Object,
				default: () => {
					return {}
				}
			},
			labelWidth: {
				type: String,
				default: '80'
			},
			labelPosition: {
				type: String,
				default: 'right'
			},
			inLine: {
				type: Boolean,
				default: true
			},
			labelSuffix: {
				type: String,
				default: ':'
			}
		},
		data () {
			return {
				pickerOptions: {
					shortcuts: [
						{
							text: '今天',
							onClick ( picker ) {
								picker.$emit ( 'pick', new Date () );
							}
						},
						{
							text: '昨天',
							onClick ( picker ) {
								const date = new Date ();
								date.setTime ( date.getTime () - 3600 * 1000 * 24 );
								picker.$emit ( 'pick', date );
							}
						},
						{
							text: '一周前',
							onClick ( picker ) {
								const date = new Date ();
								date.setTime ( date.getTime () - 3600 * 1000 * 24 * 7 );
								picker.$emit ( 'pick', date );
							}
						}
					]
				},
				pickerMerangeOptions: {
					shortcuts: [
						{
							text: '最近一周',
							onClick ( picker ) {
								const end = new Date ();
								const start = new Date ();
								start.setTime ( start.getTime () - 3600 * 1000 * 24 * 7 );
								picker.$emit ( 'pick', [ start, end ] );
							}
						},
						{
							text: '最近一个月',
							onClick ( picker ) {
								const end = new Date ();
								const start = new Date ();
								start.setTime ( start.getTime () - 3600 * 1000 * 24 * 30 );
								picker.$emit ( 'pick', [ start, end ] );
							}
						},
						{
							text: '最近三个月',
							onClick ( picker ) {
								const end = new Date ();
								const start = new Date ();
								start.setTime ( start.getTime () - 3600 * 1000 * 24 * 90 );
								picker.$emit ( 'pick', [ start, end ] );
							}
						}
					]
				}
			}
		},
		computed: {
			searchRule () {
				return this.searchForm.reduce ( ( map, i ) => {
					if ( i.rules ) {
						map[ i.prop ] = i.rules
					}
					return map
				}, {} )
			}
		},
		mounted () {
			this.refForm.handle = this.$refs[ 'searchForm' ]
		},
		methods: {
			test () {
				console.log ( 123123 )
			}
		}
	}
</script>

<style scoped>

</style>
