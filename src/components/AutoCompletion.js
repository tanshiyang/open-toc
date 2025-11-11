import { autocompletion, completeFromList } from "@codemirror/autocomplete"

// 定义内置函数详细信息
const builtinFunctions = [
  {
    label: "len()",
    type: "function",
    info: "获取数组或字符串的长度"
  },
  {
    label: "puts()",
    type: "function",
    info: "打印一个或多个值到控制台"
  },
  {
    label: "first()",
    type: "function",
    info: "获取数组的第一个元素"
  },
  {
    label: "last()",
    type: "function",
    info: "获取数组的最后一个元素"
  },
  {
    label: "rest()",
    type: "function",
    info: "获取除第一个元素外的数组其余部分"
  },
  {
    label: "push()",
    type: "function",
    info: "向数组末尾添加一个元素"
  },
  {
    label: "rnd()",
    type: "function",
    info: "生成一个随机整数"
  },
  {
    label: "rand()",
    type: "function",
    info: "生成指定范围内的随机整数，参数：最小值、最大值"
  },
  {
    label: "abs()",
    type: "function",
    info: "获取数值的绝对值"
  }
];

// 定义pen对象的方法详细信息
const penMethods = [
  {
    label: "fd()",
    type: "function",
    info: "向前移动指定距离"
  },
  {
    label: "forward()",
    type: "function",
    info: "向前移动指定距离"
  },
  {
    label: "bk()",
    type: "function",
    info: "向后移动指定距离"
  },
  {
    label: "back()",
    type: "function",
    info: "向后移动指定距离"
  },
  {
    label: "rt()",
    type: "function",
    info: "向右转指定角度"
  },
  {
    label: "right()",
    type: "function",
    info: "向右转指定角度"
  },
  {
    label: "lt()",
    type: "function",
    info: "向左转指定角度"
  },
  {
    label: "left()",
    type: "function",
    info: "向左转指定角度"
  },
  {
    label: "turn()",
    type: "function",
    info: "旋转指定角度"
  },
  {
    label: "clear()",
    type: "function",
    info: "清除画布"
  },
  {
    label: "setColor()",
    type: "function",
    info: "设置画笔颜色"
  },
  {
    label: "color()",
    type: "function",
    info: "设置画笔颜色"
  },
  {
    label: "setHeading()",
    type: "function",
    info: "设置方向"
  },
  {
    label: "setRotationMode()",
    type: "function",
    info: "设置旋转模式, 参数为1表示开启旋转模式，0表示关闭旋转模式"
  },
  {
    label: "setRM()",
    type: "function",
    info: "设置旋转模式, 参数为1表示开启旋转模式，0表示关闭旋转模式"
  },
  {
    label: "goto(,)",
    type: "function",
    info: "移动到指定坐标"
  },
  {
    label: "penup()",
    type: "function",
    info: "抬起画笔"
  },
  {
    label: "pendown()",
    type: "function",
    info: "放下画笔"
  },
  {
    label: "fillCircle()",
    type: "function",
    info: "绘制填充圆形"
  },
  {
    label: "oo()",
    type: "function",
    info: "绘制填充圆形"
  },
  {
    label: "drawCircle()",
    type: "function",
    info: "绘制空心圆形"
  },
  {
    label: "o()",
    type: "function",
    info: "绘制空心圆形"
  },
  {
    label: "fillRect(, )",
    type: "function",
    info: "绘制填充矩形"
  },
  {
    label: "rr()",
    type: "function",
    info: "绘制填充矩形"
  },
  {
    label: "drawRect(, )",
    type: "function",
    info: "绘制空心矩形"
  },
  {
    label: "r()",
    type: "function",
    info: "绘制空心圆形"
  },
  {
    label: "fillText(, )",
    type: "function",
    info: "绘制填充文本"
  },
  {
    label: "tt(, )",
    type: "function",
    info: "绘制填充文本"
  },
  {
    label: "drawText(, )",
    type: "function",
    info: "绘制空心文本"
  },
  {
    label: "t(, )",
    type: "function",
    info: "绘制空心文本"
  },
  {
    label: "wait()",
    type: "function",
    info: "等待指定秒数"
  },
  {
    label: "hide()",
    type: "function",
    info: "隐藏乌龟图标"
  },
  {
    label: "show()",
    type: "function",
    info: "显示乌龟图标"
  },
  {
    label: "ellipse(, )",
    type: "function",
    info: "绘制椭圆"
  },
  {
    label: "e(, )",
    type: "function",
    info: "绘制椭圆"
  },
  {
    label: "fillEllipse(, )",
    type: "function",
    info: "绘制填充椭圆"
  },
  {
    label: "ee(, )",
    type: "function",
    info: "绘制填充椭圆"
  },
  {
    label: "drawImage()",
    type: "function",
    info: "绘制图片"
  },
  {
    label: "img()",
    type: "function",
    info: "绘制图片"
  },
   { 
    label: "speed()", 
    type: "function", 
    info: "设置动画速度，1为默认速度，>1为加速，<1为减速"
  },
  { 
    label: "size()", 
    type: "function", 
    info: "设置画笔宽度"
  },
  {
    label: "lineTo(, )",
    type: "function",
    info: "移动到指定坐标并绘制线条"
  }
];

// 创建pen对象的补全源
const penCompletionSource = (context) => {
  let word = context.matchBefore(/\w*$/);
  if (!word) return null;

  // 检查是否在 "pen."、"turtle." 或 "t." 后面
  let before = context.matchBefore(/(?:pen|turtle|t)\.\w*$/);
  if (before) {
    // 获取输入的方法名部分
    let methodName = before.text.includes("turtle.")
      ? before.text.slice(7)  // 去掉 "turtle." 前缀
      : before.text.includes("t.")
        ? before.text.slice(2)  // 去掉 "t." 前缀
        : before.text.slice(4); // 去掉 "pen." 前缀

    // 过滤匹配的方法
    let options = penMethods.filter(method =>
      method.label.startsWith(methodName)
    );

    // 确定开始位置
    let fromPos = before.from;
    if (before.text.includes("turtle.")) {
      fromPos += 7;  // "turtle." 的长度
    } else if (before.text.includes("t.")) {
      fromPos += 2;  // "t." 的长度
    } else {
      fromPos += 4;  // "pen." 的长度
    }

    return {
      from: fromPos,
      options: options
    };
  }

  return null;
};

// 定义关键字
const keywords = [
  "int", "float", "bool", "string", "void",
  "if", "else", "for",
  "break", "continue", "return",
  "true", "false",
  "cout", "cin", "endl",
  "pen", "turtle", "t", // 添加新关键字
  "len", "puts", "first", "last", "rest", "push", "rnd", "rand", "abs"  // 内置函数

];

// 定义类型
const types = ["int", "float", "bool", "string", "void"];

// 创建自动补全扩展
export const cppAutocomplete = autocompletion({
  override: [penCompletionSource],
  icons: true
});

// 导出pen方法信息供其他组件使用
export { penMethods, keywords, types };