<!-- src/App.vue -->
<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <!-- 顶部导航栏 -->
    <header
      class="bg-gray-800 text-white p-3 flex items-center justify-between h-16 border-b border-gray-700"
    >
      <!-- 左侧Logo -->
      <div class="flex items-center">
        <img
          src="https://picsum.photos/40/40"
          alt="Logo"
          class="h-8 w-8 rounded mr-2"
        />
        <span class="font-bold">ToC Playground</span>
      </div>

      <!-- 中间部分 -->
      <div class="flex items-center flex-1 max-w-md mx-4">
        <!-- <input
          type="text"
          v-model="programName"
          class="bg-gray-700 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button class="ml-2 text-gray-300 hover:text-white">
          <i class="fa fa-pencil"></i>
        </button> -->
        <SampleMenu :samples="sampleFiles" @select="loadSample" class="ml-10" />
        <button
          @click="handleOpen"
          class="ml-10 text-gray-300 hover:text-white text-base whitespace-nowrap"
        >
          打开...
        </button>
        <button
          @click="handleSave"
          class="ml-10 text-gray-300 hover:text-white text-base whitespace-nowrap"
        >
          保存
        </button>
        <input type="file" ref="fileInput" class="hidden" @change="loadFile" />
      </div>

      <!-- 右侧用户信息 -->
      <!-- <div class="flex items-center">
        <span class="mr-3">username</span>
        <img
          src="https://picsum.photos/32/32"
          alt="User"
          class="h-8 w-8 rounded-full"
        />
      </div> -->
    </header>

    <!-- 中间代码和结果区域 -->
    <div class="flex-1 flex overflow-hidden" style="margin-bottom: 48px">
      <!-- 代码编辑区 -->
      <div class="flex flex-col" :style="getCodePanelStyle()">
        <!-- 横向标题栏 -->
        <div
          class="bg-gray-800 text-white px-3 py-2 text-sm flex items-center border-b border-gray-700"
          v-if="showCodeHorizontalTitle"
        >
          <span>程序代码</span>
          <div class="ml-auto flex space-x-2">
            <div class="flex items-center space-x-1 ml-4">
              <button
                @click="decreaseFontSize"
                class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                title="减小字体"
              >
                <i class="fa fa-search-minus">-</i>
              </button>
              <span class="text-xs mx-1">{{ fontSize }}px</span>
              <button
                @click="increaseFontSize"
                class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                title="增大字体"
              >
                <i class="fa fa-search-plus"></i>
              </button>
              <button
                @click="resetFontSize"
                class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                title="重置字体大小"
              >
                <i class="fa fa-refresh"></i>
              </button>
            </div>
            <button
              @click="handleFormatCode"
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
              title="格式化代码"
              :disabled="isFormatting"
            >
              <i class="fa fa-code"></i>
            </button>
            <button
              v-if="!running"
              @click="runWithoutDebug"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
            >
              运行
            </button>
            <button
              v-if="!running"
              @click="runDebug"
              class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs"
            >
              调试
            </button>
            <button
              v-if="running"
              @click="stopExecution"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs mr-2"
            >
              停止
            </button>
          </div>
        </div>

        <!-- 纵向标题栏 -->
        <div
          class="bg-gray-800 text-white p-1 text-sm flex items-center justify-center h-full"
          v-if="!showCodeHorizontalTitle"
        >
          <span class="vertical-text">程序代码</span>
        </div>

        <!-- CodeMirror 编辑器 -->
        <div
          ref="editorContainer"
          class="flex-1 overflow-hidden relative bg-gray"
          v-show="showCodeHorizontalTitle"
        >
          <!-- 编辑器将在这里渲染 -->
        </div>
      </div>

      <!-- 分隔条 -->
      <div class="split-handle" @mousedown="startResizing"></div>

      <!-- 运行结果区 -->
      <div class="flex flex-col overflow-hidden" :style="getResultPanelStyle()">
        <!-- 横向标题栏 -->
        <div
          class="bg-gray-800 text-white px-3 py-2 text-sm flex items-center justify-between border-b border-gray-700"
          v-show="showResultHorizontalTitle"
        >
          <span>运行结果</span>
          <div class="flex space-x-2">
            <button
              @click="toggleGrid"
              class="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs"
              :class="{ 'bg-blue-600 hover:bg-blue-700': showGrid }"
            >
              网格
            </button>
            <button
              @click="clearResult"
              class="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs"
            >
              清除
            </button>
          </div>
        </div>

        <!-- 纵向标题栏 -->
        <div
          class="bg-gray-800 text-white p-1 text-sm flex items-center justify-center h-full"
          v-if="!showResultHorizontalTitle"
        >
          <span class="vertical-text">运行结果</span>
        </div>

        <!-- 结果显示区 -->
        <div
          class="flex-1 overflow-hidden relative"
          v-show="showResultHorizontalTitle"
        >
          <div
            class="absolute inset-0 flex items-center justify-center bg-gray-100"
          >
            <div class="canvas-container">
              <canvas id="gridCanvas"></canvas>
              <canvas id="lineCanvas"></canvas>
              <canvas id="turtleCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 调试窗口 - 悬浮窗口 -->
    <div
      v-if="showDebugWindow"
      class="fixed left-0 right-0 bg-gray-800 border-t border-gray-700 text-white z-50"
      :style="{ bottom: '48px', height: debugWindowHeight + 'px' }"
    >
      <!-- 高度调节手柄 -->
      <div class="h-split-handle" @mousedown="startResizeDebugWindow"></div>
      <!-- 调试窗口标题栏 -->
      <div
        class="flex items-center justify-between bg-gray-700 px-4 py-2 text-sm border-b border-gray-600"
      >
        <span>调试窗口</span>
        <div class="flex items-center space-x-2">
          <button
            @click="toggleDebugWindow"
            class="text-gray-400 hover:text-white"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>

      <!-- 调试控制按钮 -->
      <div class="flex items-center p-2 border-b border-gray-700 bg-gray-800">
        <button
          @click="continueExecution"
          :disabled="!executionPaused"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs mr-2"
        >
          继续
        </button>
        <button
          @click="stepOver"
          :disabled="!executionPaused"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs mr-2"
        >
          步过
        </button>
        <button
          @click="stepInto"
          :disabled="!executionPaused"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs mr-2"
        >
          步入
        </button>
        <button
          @click="stepOut"
          :disabled="!executionPaused"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs mr-2"
        >
          步出
        </button>

        <span v-if="currentDebugLine" class="text-xs ml-2">
          暂停在 {{ currentDebugLine.file }}:{{ currentDebugLine.line }}
        </span>
      </div>

      <!-- 变量显示区域 -->
      <div
        class="h-full overflow-y-auto p-2 text-sm bg-gray-900"
        style="height: calc(100% - 80px)"
      >
        <div
          class="grid grid-cols-3 border-b border-gray-700 text-gray-400 mb-1"
        >
          <div>变量名</div>
          <div>值</div>
          <div>类型</div>
        </div>
        <div
          v-if="Object.keys(debugVariables).length === 0"
          class="text-gray-400 text-center py-4"
        >
          暂无调试数据
        </div>
        <div
          v-for="(variable, name) in debugVariables"
          :key="name"
          class="grid grid-cols-3 border-b border-gray-800 py-1 text-xs"
        >
          <div>{{ name }}</div>
          <div>{{ variable.value }}</div>
          <div>{{ variable.type }}</div>
        </div>
      </div>
    </div>

    <!-- 输出窗口 - 悬浮窗口 -->
    <div
      v-if="showOutputWindow"
      class="fixed left-0 right-0 bg-gray-800 border-t border-gray-700 text-white z-50"
      :style="{ bottom: '48px', height: outputWindowHeight + 'px' }"
    >
      <!-- 高度调节手柄 -->
      <div class="h-split-handle" @mousedown="startResizeOutputWindow"></div>
      <!-- 输出窗口标题栏 -->
      <div
        class="flex items-center justify-between bg-gray-700 px-4 py-2 text-sm border-b border-gray-600"
      >
        <span>输出窗口</span>
        <div class="flex items-center space-x-2">
          <button
            @click="clearOutput"
            class="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs"
          >
            Clear
          </button>
          <button
            @click="toggleOutputWindow"
            class="text-gray-400 hover:text-white"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
      <!-- 输出内容 -->
      <div
        class="h-full overflow-y-auto p-2 text-sm output-window bg-gray-900"
        style="height: calc(100% - 40px)"
      >
        <div v-for="(line, index) in outputLines" :key="index" class="mb-1">
          {{ line }}
        </div>
      </div>
    </div>

    <!-- 底部按钮栏 - 固定在底部 -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white border-t border-gray-700 z-40 h-12"
    >
      <div class="flex items-center h-full px-4">
        <button
          @click="toggleDebugWindow"
          class="px-4 py-2 text-sm border-r border-gray-700 flex items-center hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-700': showDebugWindow }"
        >
          调试
          <i
            class="fa ml-2 text-xs transition-transform duration-200"
            :class="showDebugWindow ? 'fa-chevron-down' : 'fa-chevron-up'"
          ></i>
        </button>
        <button
          @click="toggleOutputWindow"
          class="px-4 py-2 text-sm flex items-center hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-700': showOutputWindow }"
        >
          输出
          <i
            class="fa ml-2 text-xs transition-transform duration-200"
            :class="showOutputWindow ? 'fa-chevron-down' : 'fa-chevron-up'"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>


<style lang="css" >
.editor-container {
  height: 100vh; /* Example: fill the viewport height */
  display: flex; /* If using flexbox */
  flex-direction: column; /* If using flexbox */
}

.cm-editor {
  width: 100%;
  height: 100%;
}

.cm-scroller {
  overflow: auto;
}

.cm-gutterElement button.active {
  color: red;
}

/* 拖拽手柄样式 */
.cursor-ns-resize {
  cursor: ns-resize !important;
}

.cursor-ns-resize:hover {
  background-color: rgba(59, 130, 246, 0.5);
  border-radius: 2px;
}

/* 底部按钮栏样式 */
.fixed.bottom-0 {
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
}

/* 悬浮窗口阴影 */
.z-50 {
  box-shadow: 0 -0px 0px rgba(0, 0, 0, 0.4);
}
</style>

<script setup>
import "./index.css";
import SampleMenu from "./components/SampleMenu.vue";
import { vitesseLight } from "codemirror-theme-vitesse";
import { ref, onMounted, nextTick, watch, onBeforeUnmount } from "vue";
import { EditorView, highlightActiveLine, keymap } from "@codemirror/view";
import { EditorState, StateEffect } from "@codemirror/state";
import { StateField, RangeSet } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import { basicSetup, minimalSetup } from "codemirror";
import { linter, lintGutter } from "@codemirror/lint";
import { CustomLintGutter } from "./components/LintGutter.js";
import { cppAutocomplete } from "./components/AutoCompletion.js";
import { cpp } from "@codemirror/lang-cpp";
import { indentMore, indentLess } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldGutter,
} from "@codemirror/language";
import { lineNumbers, gutter, GutterMarker } from "@codemirror/view";
import { formatCode } from "./components/CodeFormatter.js";

// 状态变量
const sampleFiles = ref([]);
const programName = ref("未命名程序");
const codePanelWidth = ref(50);
const resultPanelWidth = ref(50);
const minPanelWidth = ref(40); // 最小宽度，约等于标题栏高度
const showCodeHorizontalTitle = ref(true);
const showResultHorizontalTitle = ref(true);
const resultEmpty = ref(true);
const showDebugWindow = ref(false);
const showOutputWindow = ref(false);
const outputLines = ref([]);
const debugWindowHeight = ref(250);
const outputWindowHeight = ref(250);
const isResizingDebugWindow = ref(false);
const isResizingOutputWindow = ref(false);
const fileInput = ref(null);
const editor = ref(null);
const editorContainer = ref(null);
const isResizing = ref(false);
const showGrid = ref(false);
const isFormatting = ref(false);

// WASM相关状态
const wasmModule = ref(null);
const isWasmLoaded = ref(false);
const turtleManager = ref(null);

// 调试相关
const running = ref(false);
const debugMode = ref(false);
const executionPaused = ref(false);
const debugVariables = ref({});
const currentDebugLine = ref(null);
const breakpointsMap = ref({});
// const breakpointsMap = ref({ 6: { line: 6, file: "main.cpp", enabled: true } }); // 存储断点信息

// 创建 Tab 键处理的 keymap 扩展
const tabKeyMap = keymap.of([
  {
    key: "Tab",
    run: indentMore, // Tab 键增加缩进
    shift: indentLess, // Shift+Tab 减少缩进
  },
  {
    key: "Alt-F", // VS Code标准格式化快捷键
    run: () => {
      handleFormatCode();
      return true;
    },
    shift: () => {
      handleFormatCode();
      return true;
    },
  },
]);

// 定义缩进单位
const indentSettings = [
  indentUnit.of("  "), // 使用2个空格作为缩进单位
];

// 添加字体大小状态变量
const fontSize = ref(18); // 默认字体大小

// 添加控制字体大小的方法
const increaseFontSize = () => {
  fontSize.value = Math.min(fontSize.value + 1, 28); // 限制最大字体为28px
  updateEditorFontSize();
};

const decreaseFontSize = () => {
  fontSize.value = Math.max(fontSize.value - 1, 12); // 限制最小字体为12px
  updateEditorFontSize();
};

const resetFontSize = () => {
  fontSize.value = 18; // 重置为默认字体大小
  updateEditorFontSize();
};

// 更新编辑器字体大小的方法
const updateEditorFontSize = () => {
  if (editor.value) {
    // 更新编辑器容器的字体大小
    const editorDOM = editorContainer.value.querySelector(".cm-editor");
    if (editorDOM) {
      editorDOM.style.fontSize = `${fontSize.value}px`;
    }

    // 重新计算编辑器大小
    editor.value.requestMeasure();
  }
};

// 创建lint扩展
const c90Linter = linter((view) => {
  if (!isWasmLoaded.value || typeof c90Check === "undefined") {
    return [];
  }

  const code = view.state.doc.toString();
  try {
    const result = c90Check(code);
    const errors = JSON.parse(result);

    return errors.map((error) => {
      // 确保行号有效
      if (error.line > 0 && error.line <= view.state.doc.lines) {
        try {
          const line = view.state.doc.line(error.line);
          let from, to;

          // 如果提供了具体的列信息，精确标记错误位置
          if (error.column && error.column > 0) {
            from = line.from + Math.max(0, error.column - 1);
            // 尝试找到错误词汇的结束位置
            const lineText = line.text;
            let endIdx = Math.max(0, error.column - 1);

            // 查找错误词汇的结束位置
            while (
              endIdx < lineText.length &&
              /[a-zA-Z0-9_]/.test(lineText[endIdx])
            ) {
              endIdx++;
            }

            // 如果没有找到词汇边界，至少标记一个字符
            if (endIdx === Math.max(0, error.column - 1)) {
              endIdx = Math.max(0, error.column - 1) + 1;
            }

            to = Math.min(line.to, line.from + endIdx);
          } else {
            // 没有列信息，标记整行
            from = line.from;
            to = line.to;
          }

          return {
            from,
            to,
            severity: "error",
            message: error.message,
          };
        } catch (e) {
          console.warn("无法标记错误位置:", error);
        }
      }

      // 默认返回整个文档的错误（如果无法定位具体位置）
      return {
        from: 0,
        to: view.state.doc.length,
        severity: "error",
        message: error.message,
      };
    });
  } catch (error) {
    console.error("Lint检查错误:", error);
    return [];
  }
});

const highlightLineDecoration = Decoration.line({
  attributes: { class: "cm-debug-line" },
});

// 创建状态字段来跟踪当前调试行
const debugLineStateField = StateField.define({
  create() {
    return RangeSet.empty;
  },
  update(value, tr) {
    // 处理我们自定义的 effect
    for (let effect of tr.effects) {
      if (effect.is(setDebugLineEffect)) {
        if (effect.value === null) {
          return RangeSet.empty;
        }
        return RangeSet.of([
          highlightLineDecoration.range(effect.value, effect.value),
        ]);
      }
    }
    return value;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// 定义一个 effect 来更新调试行状态
const setDebugLineEffect = StateEffect.define({
  // 可以传入行位置或者 null 来清除高亮
});

const toggleGrid = () => {
  showGrid.value = !showGrid.value;
  if (
    turtleManager.value &&
    typeof turtleManager.value.toggleGrid === "function"
  ) {
    turtleManager.value.toggleGrid();
  }
};

const getCodePanelStyle = () => {
  return {
    width: codePanelWidth.value + "%",
    minWidth: minPanelWidth.value + "px",
  };
};
const getResultPanelStyle = () => {
  return {
    width: resultPanelWidth.value + "%",
    minWidth: minPanelWidth.value + "px",
  };
};

const setDefaultResultPanelWidth = () => {
  nextTick(() => {
    const container =
      document.querySelector(".split-container") || document.body;
    const totalWidth = container.getBoundingClientRect().width;
    // 计算800px对应的百分比
    const resultWidthPercent = (800 / totalWidth) * 100;
    const codeWidthPercent = 100 - resultWidthPercent;

    resultPanelWidth.value = resultWidthPercent;
    codePanelWidth.value = codeWidthPercent;
  });
};

// 断点标记
class BreakpointMarker extends GutterMarker {
  constructor(show) {
    super();
    this.show = show;
  }
  toDOM() {
    var el = document.createElement("button");
    el.setAttribute("class", this.show ? "active" : "");
    el.innerHTML = this.show ? "⬤" : "&nbsp;";
    return el;
  }
}

// 删除断点
const removeBreakpoint = (lineNumber) => {
  // 从 breakpointsMap 中删除断点
  const breakpointId = getBreakpointIdByLine(lineNumber);
  delete breakpointsMap.value[lineNumber];

  // 如果调试器已加载且处于调试模式，通知调试器删除断点
  if (isWasmLoaded.value) {
    // 查找与该行号对应的断点ID
    // 注意：这需要一个从行号到断点ID的映射，或者需要从调试器获取所有断点来查找
    // 为简化实现，我们可以在添加断点时保存这个映射
    if (breakpointId && typeof c90DebugRemoveBreakpointByLine !== "undefined") {
      try {
        c90DebugRemoveBreakpointByLine("main.cpp", lineNumber);
        console.log(`断点已删除: ${breakpointId}`);
      } catch (error) {
        outputLines.value.push(
          `[错误] 删除断点失败 (${lineNumber}): ${error.message}`
        );
      }
    }
  }
};

// 通过行号获取断点ID（需要维护一个映射）
const breakpointIdMap = ref({}); // 行号到断点ID的映射

// 修改添加断点的逻辑来维护映射
const addBreakpoint = (lineNumber) => {
  // 添加断点到本地存储
  breakpointsMap.value[lineNumber] = {
    line: lineNumber,
    file: "main.cpp",
    enabled: true,
  };

  // 如果调试器已加载且处于调试模式，通知调试器添加断点
  if (isWasmLoaded.value && typeof c90DebugAddBreakpoint !== "undefined") {
    try {
      const result = c90DebugAddBreakpoint("main.cpp", lineNumber);
      const bp = JSON.parse(result);
      // 保存行号到断点ID的映射
      breakpointIdMap.value[lineNumber] = bp.id;
      console.log(`断点已添加: ${result}`);
    } catch (error) {
      outputLines.value.push(
        `[错误] 添加断点失败 (${lineNumber}): ${error.message}`
      );
    }
  }
};

// 通过行号获取断点ID
const getBreakpointIdByLine = (lineNumber) => {
  return breakpointIdMap.value[lineNumber];
};

// 断点 gutter
const breakpointGutter = gutter({
  class: "breakpoint-gutter",
  renderEmptyElements: true,
  domEventHandlers: {
    click: (view, line) => {
      const lineNumber = view.state.doc.lineAt(line.from).number;

      // 切换断点状态
      if (breakpointsMap.value[lineNumber]) {
        // 删除断点
        removeBreakpoint(lineNumber);
      } else {
        // 添加断点
        addBreakpoint(lineNumber);
      }

      var changespec = { from: line.from, to: line.to };
      var updated = view.state.update([{ changes: changespec }]);
      view.dispatch(updated);
    },
  },
  lineMarkerChange: (update) => true,
  lineMarker(view, line) {
    const lineNumber = view.state.doc.lineAt(line.from).number;
    return new BreakpointMarker(!!breakpointsMap.value[lineNumber]);
  },
});

// 初始化编辑器
onMounted(async () => {
  // 加载 WASM 模块
  await loadWasmModule();
  await loadWasmModule();
  await loadSampleFiles();
  // 创建CodeMirror编辑器
  const startState = EditorState.create({
    extensions: [
      minimalSetup,
      vitesseLight,
      highlightActiveLine(),
      cpp(),
      syntaxHighlighting(defaultHighlightStyle),
      bracketMatching(),
      breakpointGutter,
      lineNumbers(),
      CustomLintGutter(),
      debugLineStateField,
      c90Linter,
      cppAutocomplete,
      tabKeyMap,
      indentSettings,
    ],
    doc: `int main() {
  pen.color(5);pen.hide();
  for (int i = 0; i <= 400; i=i+40) {
    pen.r(400-i,i);
    pen.wait(0.01);
  }
  return 0;
}`,
  });

  editor.value = new EditorView({
    state: startState,
    parent: editorContainer.value,
  });

  setDefaultResultPanelWidth();

  // 监听窗口大小变化
  window.addEventListener("resize", checkPanelSizes);
  window.addEventListener("resize", handleWindowResize);
  checkPanelSizes();

  // 设置断点回调函数
  setupDebugCallbacks();

  const checkListener = EditorView.updateListener.of(onEditorUpdate);
  editor.value.dispatch({
    effects: StateEffect.appendConfig.of(checkListener),
  });
  nextTick(() => {
    updateEditorFontSize();
  });
});

// 组件卸载前清理
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkPanelSizes);
  window.removeEventListener("resize", handleWindowResize);
});

// 检查面板大小并更新标题显示状态
const checkPanelSizes = () => {
  const containerWidth =
    document.querySelector(".split-container")?.offsetWidth ||
    window.innerWidth;
  const codePanelCurrentWidth = (codePanelWidth.value / 100) * containerWidth;
  const resultPanelCurrentWidth =
    (resultPanelWidth.value / 100) * containerWidth;

  showCodeHorizontalTitle.value = codePanelCurrentWidth > minPanelWidth.value;
  showResultHorizontalTitle.value =
    resultPanelCurrentWidth > minPanelWidth.value;
};

// 编辑器更新监听器
let checkTimeout = null;
const onEditorUpdate = (update) => {
  // 如果文档有变化，延迟检查代码
  if (update.docChanged) {
    // 清除之前的定时器
    if (checkTimeout) clearTimeout(checkTimeout);

    // 设置新的定时器，在用户停止输入500ms后检查
    checkTimeout = setTimeout(() => {
      checkCodeErrors();
    }, 500);
  }
};

// 检查代码错误的函数
const checkCodeErrors = async () => {
  if (!isWasmLoaded.value || typeof c90Check === "undefined") {
    return;
  }

  try {
    const code = editor.value.state.doc.toString();
    const result = c90Check(code);
    const errors = JSON.parse(result);

    clearOutput();

    // 如果没有错误，清除所有错误标记
    if (errors.length === 0) {
      return;
    }

    // 创建新的错误标记
    const doc = editor.value.state.doc;

    errors.forEach((error) => {
      if (error.line > 0 && error.line <= doc.lines) {
        try {
          const line = doc.line(error.line);
          const startPos = line.from + Math.max(0, (error.column || 1) - 1);
          const endPos = Math.min(line.to, startPos + Math.max(1, line.length));

          // 添加错误信息到输出窗口
          const errorMessage = `[错误] 第${error.line}行, 第${
            error.column || 1
          }列: ${error.message}`;
          consoleLog(errorMessage);
        } catch (e) {
          console.warn("无法标记错误位置:", error);
          consoleLog(`[错误] ${error.message}`);
        }
      } else {
        consoleLog(`[错误] ${error.message}`);
      }
    });
  } catch (error) {
    console.error("代码检查错误:", error);
    consoleLog(`[错误] 代码检查失败: ${error.message}`);
  }
};

// 监听面板宽度变化
watch([codePanelWidth, resultPanelWidth], checkPanelSizes, { immediate: true });

// 监听 outputLines 变化，自动滚动到底部
watch(
  outputLines,
  () => {
    nextTick(() => {
      const outputElement = document.querySelector(".output-window");
      if (outputElement) {
        outputElement.scrollTop = outputElement.scrollHeight;
      }
    });
  },
  { deep: true }
);

// 处理分隔条拖动
const startResizing = (e) => {
  isResizing.value = true;
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";

  const container = document.querySelector(".split-container") || document.body;
  const rect = container.getBoundingClientRect();
  const totalWidth = rect.width;

  const handleMouseMove = (e) => {
    if (!isResizing.value) return;

    let newCodeWidth = ((e.clientX - rect.left) / totalWidth) * 100;
    const minPercent = (minPanelWidth.value / totalWidth) * 100; // 确保两边都有最小宽度

    // 限制最小宽度
    if (newCodeWidth < minPercent) newCodeWidth = minPercent;
    if (newCodeWidth > 100 - minPercent) newCodeWidth = 100 - minPercent;

    codePanelWidth.value = newCodeWidth.toFixed(2);
    resultPanelWidth.value = (100 - newCodeWidth).toFixed(2);
  };

  const handleMouseUp = () => {
    isResizing.value = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    handleWindowResize();
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  e.preventDefault();
};

// 清除结果
const clearResult = () => {
  resultEmpty.value = true;
};

// 处理控制台消息
window.addEventListener("message", (event) => {
  if (event.data.type === "console") {
    let prefix = "";
    switch (event.data.logType) {
      case "error":
        prefix = "[错误] ";
        break;
      case "warn":
        prefix = "[警告] ";
        break;
      default:
        prefix = "";
    }
    outputLines.value.push(prefix + event.data.message);

    // 自动滚动到底部
    nextTick(() => {
      const outputElement = document.querySelector(".output-window");
      if (outputElement) {
        outputElement.scrollTop = outputElement.scrollHeight;
      }
    });
  }
});

const consoleLog = (message) => {
  outputLines.value.push(message);
  showOutputWindow.value = true;
  // 自动滚动到底部
  nextTick(() => {
    const outputElement = document.querySelector(".output-window");
    if (outputElement) {
      outputElement.scrollTop = outputElement.scrollHeight;
    }
  });
};
window.consoleLog = consoleLog;
// 清除输出
const clearOutput = () => {
  outputLines.value = [];
};

// 切换调试窗口显示
const toggleDebugWindow = () => {
  if (showDebugWindow.value) {
    // 如果调试窗口已显示，则关闭
    showDebugWindow.value = false;
  } else {
    // 显示调试窗口，关闭输出窗口
    showDebugWindow.value = true;
    showOutputWindow.value = false;
  }
};

// 切换输出窗口显示
const toggleOutputWindow = () => {
  if (showOutputWindow.value) {
    // 如果输出窗口已显示，则关闭
    showOutputWindow.value = false;
  } else {
    // 显示输出窗口，关闭调试窗口
    showOutputWindow.value = true;
    showDebugWindow.value = false;
  }
};

// 打开文件
const handleOpen = () => {
  fileInput.value.click();
};

// 加载文件内容
const loadFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    editor.value.dispatch({
      changes: {
        from: 0,
        to: editor.value.state.doc.length,
        insert: event.target.result,
      },
    });
    programName.value = file.name;
  };
  reader.readAsText(file);

  // 重置input值，允许重复选择同一文件
  e.target.value = "";
};

// 保存文件
const handleSave = () => {
  const code = editor.value.state.doc.toString();
  const blob = new Blob([code], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = programName.value || "untitled.cpp";
  document.body.appendChild(a);
  a.click();

  // 清理
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 开始调节调试窗口高度
const startResizeDebugWindow = (e) => {
  isResizingDebugWindow.value = true;
  document.body.style.cursor = "ns-resize";
  document.body.style.userSelect = "none";

  const startY = e.clientY;
  const startHeight = debugWindowHeight.value;

  const handleMouseMove = (e) => {
    if (!isResizingDebugWindow.value) return;

    const deltaY = startY - e.clientY; // 向上拖拽为正值
    let newHeight = startHeight + deltaY;

    // 限制高度范围
    const minHeight = 150;
    const maxHeight = window.innerHeight - 100; // 留出顶部和底部按钮栏的空间

    if (newHeight < minHeight) newHeight = minHeight;
    if (newHeight > maxHeight) newHeight = maxHeight;

    debugWindowHeight.value = newHeight;
  };

  const handleMouseUp = () => {
    isResizingDebugWindow.value = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  e.preventDefault();
};

// 开始调节输出窗口高度
const startResizeOutputWindow = (e) => {
  isResizingOutputWindow.value = true;
  document.body.style.cursor = "ns-resize";
  document.body.style.userSelect = "none";

  const startY = e.clientY;
  const startHeight = outputWindowHeight.value;

  const handleMouseMove = (e) => {
    if (!isResizingOutputWindow.value) return;

    const deltaY = startY - e.clientY; // 向上拖拽为正值
    let newHeight = startHeight + deltaY;

    // 限制高度范围
    const minHeight = 150;
    const maxHeight = window.innerHeight - 100; // 留出顶部和底部按钮栏的空间

    if (newHeight < minHeight) newHeight = minHeight;
    if (newHeight > maxHeight) newHeight = maxHeight;

    outputWindowHeight.value = newHeight;
  };

  const handleMouseUp = () => {
    isResizingOutputWindow.value = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  e.preventDefault();
};

// 添加加载 WASM 模块的函数
const loadWasmModule = async () => {
  try {
    // 初始化 TurtleCanvasManager
    // 等待 DOM 更新后再初始化
    await nextTick();
    try {
      // 参考 test.html 中的 initTurtleManager 函数
      if (typeof TurtleCanvasManager !== "undefined") {
        turtleManager.value = new TurtleCanvasManager(
          "lineCanvas",
          "turtleCanvas",
          "gridCanvas"
        );
        // 导出供Go WASM使用
        window.turtleManager = turtleManager.value;
        window.TurtleCanvasManager = TurtleCanvasManager;
        console.log("TurtleCanvasManager initialized successfully");
      }
    } catch (error) {
      console.error("Failed to initialize TurtleCanvasManager:", error);
    }

    // 检查 Go 是否定义
    if (typeof Go === "undefined") {
      console.error("Go runtime not found");
      return;
    }

    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
      fetch("/runtime.wasm"),
      go.importObject
    );
    wasmModule.value = result.instance;
    isWasmLoaded.value = true;

    // 运行 Go 程序
    go.run(result.instance);

    console.log("WASM module loaded successfully");
  } catch (error) {
    console.error("Failed to load WASM module:", error);
  }
};

const highlightDebugLine = (lineNumber) => {
  if (!editor.value) return;

  try {
    // 获取文档
    const doc = editor.value.state.doc;

    // 确保行号有效
    if (lineNumber < 1 || lineNumber > doc.lines) return;

    // 获取行对象的起始位置
    const line = doc.line(lineNumber);

    // 发送 effect 来更新状态
    editor.value.dispatch({
      effects: setDebugLineEffect.of(line.from),
    });
  } catch (error) {
    console.error("高亮调试行时出错:", error);
  }
};

// 清除高亮行
const clearDebugLineHighlight = () => {
  if (!editor.value) return;

  try {
    // 发送 effect 来清除高亮
    editor.value.dispatch({
      effects: setDebugLineEffect.of(null),
    });
  } catch (error) {
    console.error("清除调试行高亮时出错:", error);
  }
};
// 设置调试回调函数
const setupDebugCallbacks = () => {
  window.onBreakpointReached = (bpJson, ctxJson) => {
    console.log("断点已触发:", bpJson, ctxJson);
    try {
      const bp = JSON.parse(bpJson);
      const context = JSON.parse(ctxJson);
      // 使用 nextTick 确保状态更新后触发视图更新
      nextTick(() => {
        // 更新调试状态
        executionPaused.value = true;
        currentDebugLine.value = {
          file: context.current_file,
          line: context.current_line,
        };

        // 高亮命中断点的行
        highlightDebugLine(context.current_line);

        // 获取变量信息
        refreshVariables();

        // 添加输出信息
        outputLines.value.push(
          `断点触发: ${context.current_file}:${context.current_line}`
        );
        if (bp) {
          outputLines.value.push(`断点ID: ${bp.id}, 触发次数: ${bp.hit_count}`);
        }
      });
    } catch (error) {
      console.error("断点回调处理错误:", error);
      outputLines.value.push(`[错误] 断点回调处理错误: ${error.message}`);
    }
  };
};

const runWithoutDebug = () => {
  if (!isWasmLoaded.value) {
    outputLines.value.push("[错误] WASM 模块尚未加载完成");
    return;
  }

  debugMode.value = false;

  if (typeof c90DebugEnable !== "undefined") {
    c90DebugEnable(debugMode.value);
  }
  runCode();
};

// 切换调试模式
const runDebug = () => {
  debugMode.value = true;

  if (typeof c90DebugEnable !== "undefined") {
    c90DebugEnable(debugMode.value);

    if (debugMode.value) {
      outputLines.value.push("调试模式已启用");
      runCode();
      showDebugWindow.value = true;
    }
  } else {
    outputLines.value.push("[错误] 未找到调试功能");
    debugMode.value = false;
  }
};

// 发送断点信息到调试器
const sendBreakpointsToDebugger = () => {
  Object.values(breakpointsMap.value).forEach((bp) => {
    addBreakpoint(bp.line);
  });
};

// 继续执行
const continueExecution = () => {
  if (typeof c90DebugContinue !== "undefined") {
    c90DebugContinue();
    executionPaused.value = false;
    currentDebugLine.value = null;
    debugVariables.value = {};
    outputLines.value.push("继续执行...");
    clearDebugLineHighlight();
  } else {
    outputLines.value.push("[错误] 未找到继续执行功能");
  }
};

// 步过
const stepOver = () => {
  if (typeof c90DebugStepOver !== "undefined") {
    c90DebugStepOver();
    executionPaused.value = false;
    currentDebugLine.value = null;
    debugVariables.value = {};
    outputLines.value.push("单步跳过...");
    clearDebugLineHighlight();
  } else {
    outputLines.value.push("[错误] 未找到步过功能");
  }
};

// 步入
const stepInto = () => {
  if (typeof c90DebugStepInto !== "undefined") {
    c90DebugStepInto();
    executionPaused.value = false;
    currentDebugLine.value = null;
    debugVariables.value = {};
    outputLines.value.push("单步进入...");
    clearDebugLineHighlight();
  } else {
    outputLines.value.push("[错误] 未找到步入功能");
  }
};

// 步出
const stepOut = () => {
  if (typeof c90DebugStepOut !== "undefined") {
    c90DebugStepOut();
    executionPaused.value = false;
    currentDebugLine.value = null;
    debugVariables.value = {};
    outputLines.value.push("单步跳出...");
    clearDebugLineHighlight();
  } else {
    outputLines.value.push("[错误] 未找到步出功能");
  }
};

// 刷新变量信息
const refreshVariables = () => {
  if (typeof c90DebugGetVariables !== "undefined") {
    try {
      const result = c90DebugGetVariables();
      const vars = JSON.parse(result);

      debugVariables.value = vars;
    } catch (error) {
      outputLines.value.push(`[错误] 获取变量信息失败: ${error.message}`);
    }
  }
};

// 停止执行
const stopExecution = () => {
  if (typeof c90DebugStop !== "undefined") {
    c90DebugStop();
    debugMode.value = false;
    executionPaused.value = false;
    currentDebugLine.value = null;
    debugVariables.value = {};
    outputLines.value.push("程序执行已停止");
    clearDebugLineHighlight();
  } else {
    outputLines.value.push("[错误] 未找到停止执行功能");
  }
};

// 修改 runCode 函数以支持调试模式
const runCode = () => {
  if (editor.value) {
    // 重新配置编辑器，移除错误装饰器
    editor.value.dispatch({
      effects: StateEffect.reconfigure.of([
        vitesseLight,
        highlightActiveLine(),
        cpp(),
        syntaxHighlighting(defaultHighlightStyle),
        bracketMatching(),
        breakpointGutter,
        lineNumbers(),
        CustomLintGutter(),
        debugLineStateField,
        c90Linter,
        cppAutocomplete,
        tabKeyMap,
        indentSettings,
      ]),
    });
  }
  const code = editor.value.state.doc.toString();
  resultEmpty.value = false;

  if (!isWasmLoaded.value) {
    outputLines.value.push("[错误] WASM 模块尚未加载完成");
    return;
  }

  try {
    // 清除画布
    if (turtleManager.value) {
      turtleManager.value.resetCanvas();
    }

    // 重置调试器的停止请求标志
    if (typeof c90DebugEnable !== "undefined") {
      // 可以通过重新启用调试器来重置状态
      c90DebugEnable(debugMode.value);
    }

    // 检查是否存在 c90Run 函数（来自 WASM）
    if (typeof c90Run !== "undefined") {
      // 显示运行状态
      outputLines.value.push("=== 开始运行 ===");

      // 如果处于调试模式，先发送断点信息
      if (debugMode.value) {
        sendBreakpointsToDebugger();
      }

      // 调用WASM中的函数，异步调用方式
      running.value = true;
      c90Run(code)
        .then((result) => {
          try {
            const response = JSON.parse(result);
            if (response.success) {
              if (response.msg) {
                outputLines.value.push("程序返回结果: " + response.msg);
              } else {
                outputLines.value.push("程序执行成功");
              }
            } else {
              if (response.msg && response.msg.includes("stopped by user")) {
                outputLines.value.push("程序执行已被用户停止");
              } else {
                outputLines.value.push(`[错误] 执行失败: ${response.msg}`);
                if (response.errors) {
                  response.errors.forEach((error) => {
                    outputLines.value.push(
                      `[错误]  ${error.message}, 行号: ${error.line}, 列号: ${error.column}`
                    );
                  });
                }
              }
            }
          } catch (parseError) {
            // 如果不是JSON格式，直接显示结果
            outputLines.value.push(result);
          }

          running.value = false;
          outputLines.value.push("=== 运行结束 ===");

          // 如果在调试模式下，刷新变量
          if (debugMode.value) {
            refreshVariables();
          }
        })
        .catch((error) => {
          running.value = false;
          if (error.message && error.message.includes("stopped by user")) {
            outputLines.value.push("程序执行已被用户停止");
          } else {
            outputLines.value.push(`[错误] 运行时错误: ${error.message}`);
          }
          outputLines.value.push("=== 运行结束 ===");
        });
    } else {
      outputLines.value.push("[错误] 未找到 c90Run 函数");
    }
  } catch (error) {
    outputLines.value.push(`[错误] 代码执行失败: ${error.message}`);
  }
};

const handleWindowResize = () => {
  if (turtleManager.value) {
    // turtleManager.value.handleResize();
  }
};

const handleFormatCode = async () => {
  if (!editor.value) {
    outputLines.value.push("[错误] 编辑器未初始化");
    return;
  }

  try {
    isFormatting.value = true;
    const code = editor.value.state.doc.toString();

    // 调用独立的格式化模块
    const result = await formatCode(code, isWasmLoaded.value);

    if (result.success) {
      // 替换编辑器中的代码为格式化后的代码
      editor.value.dispatch({
        changes: {
          from: 0,
          to: editor.value.state.doc.length,
          insert: result.formattedCode,
        },
      });
      outputLines.value.push(result.message);
    } else {
      outputLines.value.push(`[错误] ${result.error}`);
    }
  } catch (error) {
    outputLines.value.push(`[错误] 代码格式化失败: ${error.message}`);
  } finally {
    isFormatting.value = false;
  }
};

// 加载示例文件列表
const loadSampleFiles = async () => {
  try {
    // 写死示例文件列表
    const files = ["长方形的变化.cpp", "万花筒.cpp"]; 
    sampleFiles.value = files.map((file) => ({
      name: file.replace(".cpp", ""),
      path: `/samples/${file}`,
    }));
  } catch (error) {
    console.error("Failed to load sample files:", error);
    outputLines.value.push("[错误] 加载示例文件失败");
  }
};
// 加载示例文件内容
const loadSample = async (sample) => {
  try {
    const response = await fetch(sample.path);
    const content = await response.text();
    editor.value.dispatch({
      changes: {
        from: 0,
        to: editor.value.state.doc.length,
        insert: content,
      },
    });
    programName.value = sample.name + ".cpp";
  } catch (error) {
    console.error("Failed to load sample:", error);
    outputLines.value.push(`[错误] 加载示例文件失败: ${sample.name}`);
  }
};
</script>
