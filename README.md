# ToC Playground - 在线C语言教学解释器

ToC Playground (Turtle on C) 是一个专为C语言教学设计的在线解释器和可视化编程环境。它可以让学生通过类似Python Turtle库的方式学习C语言编程，通过图形化的方式直观地理解编程概念。

## 功能特点

### 1. 海龟绘图功能
- 提供类似Python Turtle的绘图功能
- 支持多种绘图命令：前进、后退、转向、绘制图形等
- 可视化编程，帮助学生理解程序执行流程

### 2. 在线C语言解释器
- 支持标准C语言语法
- 实时解释执行，无需编译
- 提供错误提示和调试功能

### 3. 交互式学习环境
- 代码编辑器支持语法高亮
- 实时运行结果展示
- 可视化的海龟绘图区域

## 海龟绘图命令

### 基本移动命令
- `pen.forward(distance)` 或 `pen.fd(distance)` - 向前移动指定距离
- `pen.back(distance)` 或 `pen.bk(distance)` - 向后移动指定距离
- `pen.right(angle)` 或 `pen.rt(angle)` - 向右转指定角度
- `pen.left(angle)` 或 `pen.lt(angle)` - 向左转指定角度
- `pen.turn(angle)` - 转向指定角度

### 位置控制命令
- `pen.goto(x, y)` - 移动到指定坐标
- `pen.setHeading(angle)` - 设置朝向角度
- `pen.setRotationMode(mode)` - 设置旋转模式

### 绘图控制命令
- `pen.setColor(color)` 或 `pen.color(color)` - 设置画笔颜色
- `pen.clear()` - 清除画布
- `pen.hide()` - 隐藏海龟图标
- `pen.show()` - 显示海龟图标

### 图形绘制命令
- `pen.drawLine(x, y)` - 画线到指定点
- `pen.drawRect(width, height)` - 绘制矩形
- `pen.fillRect(width, height)` - 绘制填充矩形
- `pen.drawCircle(radius)` - 绘制圆形
- `pen.fillCircle(radius)` - 绘制填充圆形
- `pen.ellipse(width, height)` - 绘制椭圆
- `pen.fillEllipse(width, height)` - 绘制填充椭圆
- `pen.drawText(text, font)` - 绘制文字
- `pen.fillText(text, font)` - 绘制填充文字

### 其他命令
- `pen.drawImage(path)` - 绘制图片
- `pen.wait(seconds)` - 等待指定秒数

## 使用示例

```c
int main() {
    // 绘制一个正方形
    pen.setColor("#FF0000");  // 设置红色
    for(int i = 0; i < 4; i++) {
        pen.forward(100);     // 前进100像素
        pen.right(90);        // 右转90度
    }
    
    // 绘制一个填充圆形
    pen.goto(200, 200);       // 移动到位置(200, 200)
    pen.setColor("#00FF00");  // 设置绿色
    pen.fillCircle(50);       // 绘制半径为50的填充圆形
    
    // 添加文字
    pen.goto(100, 300);
    pen.setColor("#0000FF");  // 设置蓝色
    pen.fillText("Hello ToC!", "20px Arial");
    
    return 0;
}
```

## 安装和运行

### 本地运行
```bash
# 克隆项目
git clone <repository-url>
cd toc

# 构建WebAssembly模块
cd runtime
./build-wasm.sh

# 启动开发服务器
cd ../ide2
npm install
npm run dev
```

### 在线使用
访问 [ToC Playground](https://your-deployment-url.com) 即可直接使用，无需安装任何软件。

## 教学应用场景

### 1. 编程入门教学
- 通过可视化绘图帮助学生理解基本语法
- 直观展示循环、条件判断等控制结构
- 降低编程学习的门槛

### 2. 算法教学
- 可视化展示算法执行过程
- 帮助学生理解递归、排序等算法概念
- 通过图形化方式演示数据结构

### 3. 数学教学
- 绘制几何图形帮助理解数学概念
- 可视化函数图像
- 展示数学规律和模式

## 技术架构

### 前端
- Vue.js - 现代化的前端框架
- CodeMirror - 代码编辑器组件
- HTML5 Canvas - 海龟绘图渲染

### 后端
- Go语言 - 核心解释器实现
- WebAssembly - 在浏览器中运行Go代码
- AST解析器 - C语言语法分析

## 贡献

欢迎提交Issue和Pull Request来改进ToC Playground。如果你有好的想法或发现了bug，请告诉我们！

## 许可证

本项目采用MIT许可证，详情请查看LICENSE文件。

## 联系方式

如有问题或建议，请联系项目维护者或在GitHub上提交Issue。