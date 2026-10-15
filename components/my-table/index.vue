<template>
  <view class="table-container">
    <table class="table" :class="bordered && 'bordered'">
      <!-- 表格头 -->
      <thead class="table-header">
        <tr class="table-header-row">
          <!-- 选择项 -->
          <th v-if="showCheckbox" class="table-header-cell checkbox">
            <u-checkbox-group
              v-model="selectAll"
              @change="handleSelectAllChange"
            >
              <u-checkbox
                label=""
                :name="true"
                :size="checkboxSize"
              ></u-checkbox>
            </u-checkbox-group>
          </th>

          <th
            class="table-header-cell"
            v-for="(column, index) in columns"
            :key="index"
            :style="[_getCellStyle(column)]"
          >
            <div>{{ column.title }}</div>
          </th>
        </tr>
      </thead>

      <!-- 表格列表 -->
      <tbody class="table-body">
        <tr
          class="table-body-row"
          v-for="(record, index) in dataSource"
          :key="record.id"
          @click="handleRowClick(record)"
        >
          <!-- 选择 -->
          <td v-if="showCheckbox" class="table-body-cell checkbox">
            <u-checkbox-group
              v-model="record.select"
              @change="(v) => handleSelectChange(record, v)"
            >
              <u-checkbox
                label=""
                :name="true"
                :size="checkboxSize"
              ></u-checkbox>
            </u-checkbox-group>
          </td>

          <!-- 表格内容渲染，按 columns 顺序-->
          <td
            class="table-body-cell"
            v-for="(column, idy) in columns"
            :key="`${record.id}+${idy}`"
            :style="[_getCellStyle(column)]"
          >
            <div style="width: 100%">
              <slot></slot>
              <slot
                name="bodyCell"
                :text="record[column.dataIndex]"
                :record="record"
                :index="index"
                :column="column"
              >
                {{ record[column.dataIndex] }}
              </slot>
            </div>
          </td>
        </tr>
        <tr v-if="dataSource.length === 0" class="table-body-row">
          <td class="table-body-cell" :colspan="colSpanTotal">
            <view class="table-body-empty">
              {{ emptyText }}
            </view>
          </td>
        </tr>
      </tbody>
    </table>

    <view class="table-loading" v-if="loading">
      <p class="text-secondary">
        <u-loading-icon></u-loading-icon>
        <span>加载中...</span>
      </p>
    </view>
  </view>
</template>

<script>
import { instanceNextTick } from "../../utils/system";

export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: "暂无数据",
    },
  },
  data() {
    return {
      checkboxSize: 24,
      selectAll: [false],
      printedSelect: [false],
      shelfShowSelect: [false],
    };
  },
  computed: {
    colSpanTotal() {
      const len = this.columns.length;
      return this.showCheckbox ? len + 1 : len;
    },
  },
  watch: {
    dataSource: {
      handler(v) {
        if (this.showCheckbox) {
          this.checkAllItemSelect();
        }
      },
      immediate: true,
    },
  },
  methods: {
    /** 设置全选 */
    setSelectAll() {
      this.handleSelectAllChange([true]);
    },

    /** 表格行点击 */
    async handleRowClick(record) {
      this.$emit("click", record);
    },
    _getCellStyle(column) {
      const { fontSize } = this;

      const { width, ...otherCss } = column;

      let cssWidth = width;
      if (typeof cssWidth === "number") {
        cssWidth = cssWidth + "px";
      }

      const style = {
        // width: cssWidth ? cssWidth : 'auto',
        flex: cssWidth ? `0 0 ${cssWidth}` : "1",
        fontSize: fontSize + "px",
        textAlign: "left",
        ...otherCss,
      };

      return style;
    },
    /**全选项变化 */
    async handleSelectAllChange(v) {
      const value = v[0];
      await instanceNextTick.call(this);

      this.selectAll = v;

      let selectValue = false;

      if (value) {
        selectValue = true;
      }

      // 修改应用下的堆值
      this.dataSource.forEach((i) => {
        i.select = [selectValue];
      });

      this.$emit("onSelectAll", selectValue, this.dataSource);
    },

    // 组件允许通过直接修改 prop.dataSource 便于控制值
    // updateDataSource(l) {
    // 	this.$emit("update:dataSource", l)
    // },

    /** 选择项变化 */
    async handleSelectChange(record, v) {
      const selectValue = v[0];
      // 等待数据变化后
      await instanceNextTick.call(this);

      this.$emit("onSelect", selectValue, record);

      this.checkAllItemSelect();
    },
    /** 是否已选择 */
    _isSelectItem(item) {
      return item.select[0] === true;
    },

    /** 检测所有项是否已选择 */
    checkAllItemSelect() {
      const { dataSource } = this;

      const isSelectAll = dataSource.every((i) => this._isSelectItem(i));

      this.selectAll = isSelectAll ? [true] : [false];
    },
  },
};
</script>

<style lang="scss" scoped>
$table-border-color: #ccc;

.table-container {
  position: relative;
  min-height: 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.table-loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: -20px;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
  @include center;
}

.table {
  width: 100%;
  border-spacing: 0px;
  background-color: #fff;

  &.bordered {
    border-top: 1px solid $table-border-color;
    border-left: 1px solid $table-border-color;

    .table-header-cell,
    .table-body-cell {
      border-right: 1px solid $table-border-color;
      border-bottom: 1px solid $table-border-color;
    }
  }

  &-header {
    text-align: left;
    font-weight: bold;
    white-space: nowrap;

    &-cell {
    }

    &-row {
      display: flex;
      /* align-items: center; */
    }
  }

  &-body {
    width: 100%;

    &-cell {
    }

    &-row {
      display: flex;
      /* align-items: center; */
    }

    &-empty {
      @include center;
      color: #ccc;
      width: 100%;
      height: 32px;
    }
  }
}

.table-header-cell,
.table-body-cell {
  /* display: table-cell; */
  flex: 1;
  box-sizing: border-box;
  padding: 6px 6px;
  border-bottom: 1px solid $table-border-color;
  display: flex;
  align-items: center;
  word-break: break-all;

  &.checkbox {
    width: 24px;
  }
}

::v-deep {
  .checkbox .u-checkbox__icon-wrap {
    margin-right: 0px;
  }
}
</style>
