// src/components/CodeFormatter.js
/**
 * C++ 代码格式化模块
 */

/**
 * 格式化 C++ 代码
 * @param {string} code - 需要格式化的代码
 * @param {boolean} isWasmLoaded - WASM 是否已加载
 * @returns {Promise<Object>} 格式化结果对象
 */
export async function formatCode(code, isWasmLoaded) {
    try {
        const formattedCode = simpleCppFormatter(code);
        return {
            success: true,
            formattedCode: formattedCode,
            message: "完成代码格式化"
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 简单的 C++ 代码格式化函数（备选方案）
 * @param {string} code - 需要格式化的代码
 * @returns {string} 格式化后的代码
 */
function simpleCppFormatter(code) {
    // 这是一个基础的格式化实现，实际应用中可以使用更复杂的算法
    let formatted = code;

    // 标准化空白字符
    formatted = formatted.replace(/\t/g, "  "); // 将制表符替换为两个空格

    // 在关键字周围添加适当的空格
    //formatted = formatted.replace(/\b(if|for|while|switch|return)\b/g, " $1 ");

    // 格式化大括号
    formatted = formatted.replace(/\s*{\s*/g, " {\n  ");
    formatted = formatted.replace(/\s*}\s*/g, "\n}\n");

    // 格式化分号
    //formatted = formatted.replace(/;/g, ";\n");

    // 移除多余的空行
    formatted = formatted.replace(/\n\s*\n/g, "\n");

    // 修复一些格式问题
    formatted = formatted.replace(/(\w)\s*\n\s*(\w)/g, "$1 $2");

    // 处理函数定义和控制结构的缩进
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentStr = "  "; // 2个空格缩进

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 减少缩进级别（在处理当前行之前）
        if (line.startsWith('}') || line.startsWith(') {')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // 应用当前缩进级别
        if (line.length > 0) {
            lines[i] = indentStr.repeat(indentLevel) + line;
        }

        // 增加缩进级别
        if (line.endsWith('{') || line.endsWith(') {') ||
            line.startsWith('if') || line.startsWith('for') ||
            line.startsWith('while')) {
            indentLevel++;
        }
    }

    return lines.join('\n').trim();
}

// 为了在格式化模块中能够访问全局的 c90Format 函数，我们需要确保它在全局作用域中可用
// 这个函数将在 WASM 加载后自动可用