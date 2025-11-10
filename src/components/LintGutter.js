// src/components/LintGutter.js
import { lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";

// 自定义主题，覆盖默认的错误标记样式
const customLintTheme = EditorView.baseTheme({
    
});

// 创建自定义的lint gutter函数
export function CustomLintGutter(config = {}) {
    return [
        lintGutter(config),
        customLintTheme
    ];
}