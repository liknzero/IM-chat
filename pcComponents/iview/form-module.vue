<template>
  <div>
    <Form
      :model="searchData"
      :rules="searchRule"
      ref="searchForm"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :inline="inLine"
      :label-colon="labelColon"
    >
      <FormItem
        v-for="item in searchForm"
        :prop="item.prop"
        :label="item.label"
        :key="item.label"
      >
        <!--自定义内容-->
        <template v-if="item.slotName">
          <slot :name="item.slotName"></slot>
        </template>
        <!--input普通输入框-->
        <Input
          v-if="item.type === 'Input'"
          v-model="searchData[item.prop]"
          :type="item.inputType"
          :disabled="item.disable"
          :placeholder="item.placeholder"
          :style="item.style"
        />
        <!--input数字输入框-->
        <InputNumber
          v-if="item.type === 'InputNumber'"
          v-model="searchData[item.prop]"
          :disabled="item.disable"
          :precision="item.precision"
          :placeholder="item.placeholder"
          :style="item.style"
        ></InputNumber>
        <!--input数字区间-->
        <template v-if="item.type === 'InputNumberSegment'">
          <div v-for="(val, index) in searchData[item.prop]" :data-index="index" :key="index">
            <!--<InputNumber-->
              <!--v-model="val['start']"-->
              <!--:disabled="item.disable"-->
              <!--:placeholder="item.placeholder"-->
              <!--:style="item.style"-->
            <!--&gt;</InputNumber>-->
            <Input
              v-model="val['start']"
              :disabled="item.disable"
              :placeholder="item.placeholder"
              :style="item.style"
            />
            <span>—</span>
            <!--<InputNumber-->
              <!--v-model="val['end']"-->
              <!--:disabled="item.disable"-->
              <!--:placeholder="item.placeholder"-->
              <!--:style="item.style"-->
            <!--&gt;</InputNumber>-->
            <Input
              v-model="val['end']"
              :disabled="item.disable"
              :placeholder="item.placeholder"
              :style="item.style"
            />
            <Button v-if="index === 0" @click="searchData[item.prop].push({start: '', end: ''})" type="text" size="large" style="font-size: 24px" icon="md-add"></Button>
            <Button v-if="index !== 0" @click="searchData[item.prop].splice(index, 1)" type="text" size="large" style="font-size: 24px" icon="ios-trash-outline"></Button>
          </div>
        </template>
        <!--textarea文本输入框-->
        <Input
          v-if="item.type === 'Textarea'"
          v-model="searchData[item.prop]"
          type="textarea"
          show-word-limit
          :maxlength="item.maxLength"
          :rows="item.rows"
          :placeholder="item.placeholder"
          :style="item.style"
        />
        <!--select下拉选择框-单选-->
        <Select
          v-if="item.type === 'Select'"
          v-model="searchData[item.prop]"
          :style="item.style"
          :disabled="item.disable"
          :placeholder="item.placeholder"
          filterable
          @on-change="val => item.change && item.change(val)"
          @on-open-change="$forceUpdate()"
        >
          <!--:value="`${op.value}`" 是因为iview表单默认只校验string类型，所以先将value全修改成string类型，取值的时候按需转为其他类型-->
          <!--<Option v-for="op in item.options" :value="op.value" :key="op.value">{{ op.label }}</Option>-->
          <Option v-for="op in item.options" :value="`${op.value}`" :key="op.value">{{ op.label }}</Option>
        </Select>
        <!--select下拉选择框-多选-->
        <Select
          v-if="item.type === 'SelectMultiple'"
          v-model="searchData[item.prop]"
          :style="item.style"
          :disabled="item.disable"
          :placeholder="item.placeholder"
          filterable
          multiple
        >
          <Option v-for="op in item.options" :value="op.value" :key="op.value">{{ op.label }}</Option>
        </Select>
        <!--radio 单选框-->
        <RadioGroup
          v-if="item.type === 'Radio'"
          v-model="searchData[item.prop]"
          :style="item.style"
        >
          <Radio v-for="op in item.options" :key="op.value" :label="`${op.value}`">{{ op.label }}</Radio>
        </RadioGroup>
        <!--radio button 单选-->
        <RadioGroup
          v-if="item.type === 'RadioButton'"
          v-model="searchData[item.prop]"
          type="button"
          :style="item.style"
        >
          <Radio v-for="op in item.options" :key="op.value" :label="op.value">{{ op.label }}</Radio>
        </RadioGroup>
        <!--时间选择-->
        <DatePicker
          v-if="item.type === 'Datetime'"
          v-model="searchData[item.prop]"
          type="datetime"
          :placeholder="item.placeholder"
          :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
          :style="item.style"
        ></DatePicker>
        <!--时间区间筛选-->
        <DatePicker
          v-if="item.type === 'Datetimerange'"
          v-model="searchData[item.prop]"
          type="datetimerange"
          :format="item.format"
          :placeholder="item.placeholder"
          :style="item.style"
        ></DatePicker>
      </FormItem>
      <FormItem
        v-if="isHandle"
      >
        <Button
          v-for="item in searchHandle"
          :key="item.label"
          :type="item.type"
          :style="item.style"
          :loading="item.loading || false"
          @click="item.handle($refs['searchForm'])"
        >{{ item.label }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'form-module',
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
      type: Number,
      default: 80
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    inLine: {
      type: Boolean,
      default: true
    },
    labelColon: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  computed: {
    searchRule () {
      return this.searchForm.reduce((map, i) => {
        if (i.rules) {
          map[i.prop] = i.rules
        }
        return map
      }, {})
    }
  },
  mounted () {
    this.refForm.handle = this.$refs['searchForm']
  },
  methods: {
    test () {
      console.log(123123)
    }
  }
}
</script>

<style scoped>

</style>
