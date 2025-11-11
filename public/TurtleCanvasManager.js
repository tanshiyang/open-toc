class TurtleCanvasManager {
    constructor(lineCanvasId, turtleCanvasId, gridCanvasId = null) {
        this.lineCanvas = document.getElementById(lineCanvasId);
        this.turtleCanvas = document.getElementById(turtleCanvasId);
        this.gridCanvas = gridCanvasId ? document.getElementById(gridCanvasId) : null;

        if (!this.lineCanvas || !this.turtleCanvas) {
            throw new Error(`找不到Canvas元素: ${lineCanvasId} 或 ${turtleCanvasId}`);
        }

        // 初始化时设置 canvas 的实际尺寸
        this.resizeCanvases();

        this.lineCtx = this.lineCanvas.getContext('2d');
        this.turtleCtx = this.turtleCanvas.getContext('2d');
        this.gridCtx = this.gridCanvas ? this.gridCanvas.getContext('2d') : null;

        // 乌龟状态初始化
        this.x = this.lineCanvas.width / 2;
        this.y = this.lineCanvas.height / 2;
        this.angle = 90; // 默认向上（数学坐标系）
        this.isPenDown = true;
        this.rotationMode = 0; // 0: 正常, 1: 跟随画笔
        this.penColor = '#3498db';
        this.penWidth = 2;
        this.turtleSize = 32;
        this.showGrid = true; // 默认不显示网格
        this.gridUnit = 100; // 网格单位大小
        this.turtleVisible = true; // 默认显示乌龟
        this.animationSpeed = 1.0; // 默认动画速度为1.0倍

        // 图片缓存
        this.imageCache = new Map();

        // 创建乌龟图标
        this.createTurtleImage();
        this.initCanvases();
        
        this.toggleGrid();
        this.drawGrid();
    }

    /**
 * 设置动画速度
 * @param {number} speed - 动画速度倍数 (1为默认速度，>1为加速，<1为减速)
 */
    setSpeed(speed) {
        this.animationSpeed = Math.max(0.1, Math.min(20, speed)); // 限制速度在0.1到20倍之间
    }


    resizeCanvases() {
        // 固定尺寸 800x600
        const fixedWidth = 800;
        const fixedHeight = 800;

        // 如果实际尺寸和固定尺寸不匹配，则调整实际尺寸
        if (this.lineCanvas.width !== fixedWidth || this.lineCanvas.height !== fixedHeight) {
            this.lineCanvas.width = fixedWidth;
            this.lineCanvas.height = fixedHeight;
        }

        if (this.turtleCanvas.width !== fixedWidth || this.turtleCanvas.height !== fixedHeight) {
            this.turtleCanvas.width = fixedWidth;
            this.turtleCanvas.height = fixedHeight;
        }
    }

    createTurtleImage() {
        // 创建SVG格式的乌龟图标
        // const svgString = `
        //             <svg t="1759195458851" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4192" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32"><path d="M604.36 295.21c7.53 60.33 11.53 127.82 11.53 197.89q0 29.34-0.93 58C668 579 848.61 672.27 876.63 686.74V561.38c-12.56-12.6-181.18-181.53-272.27-266.17zM445.34 826.79c-8.82-25.78-12.79-45-14.37-54.05L323.15 913l31.58 39.74 116.16-63.31c-0.57-1-1.15-2-1.72-3-8.62-15.32-16.59-35.33-23.83-59.64z" fill="#1296db" p-id="4193"></path><path d="M419.2 290.63c-94.29 87.3-276 269.72-276 269.72v130.5s206.65-106.7 264.91-137.35q-1-29.76-1-60.39c-0.01-71.86 4.19-141 12.09-202.48zM592.22 767q-1 4.82-2 9.54c-0.84 4.4-2.07 10.15-3.82 17.11l-0.19 0.81c-9.34 39.35-20.25 70.3-32.42 92q-1.31 2.34-2.64 4.52l119.19 65L704.46 913zM607.89 553q0-1.39 0.09-2.78c0-0.93 0.06-1.85 0.09-2.78q0.35-11.57 0.55-23.28 0.23-13.7 0.26-27.57v-3.49q0-22.62-0.56-44.83-0.52-20.94-1.52-41.4-1.25-25.71-3.25-50.44-1.29-16.05-2.89-31.6-1.94-18.93-4.32-37l-0.51-3.86c-0.17-1.28-0.36-2.59-0.54-3.88-4.33-31.28-9.64-60.43-15.88-86.71C561.06 116 536.29 71.56 511.49 71.56s-49.56 44.4-67.94 121.8c-6.45 27.16-11.91 57.38-16.32 89.87-2.78 20.5-5.14 41.91-7.05 64-4 46.1-6.09 95.28-6.09 145.84v11.76q0.15 22.73 0.85 45c2.89 91.74 12.78 176.49 28.56 243 18.37 77.41 43.14 121.8 67.94 121.8s49.56-44.39 67.94-121.8C595 727.11 604.87 643.53 607.89 553zM447.47 420.45a12.25 12.25 0 1 1 12.25-12.25 12.25 12.25 0 0 1-12.25 12.25z m32.4-243.92c-6 24-26.91 112.68-25.86 181.49a6.5 6.5 0 0 1-13 0.23c-1.13-71.22 20-160.34 26.24-184.91a6.5 6.5 0 0 1 8-4.68 6.5 6.5 0 0 1 4.62 7.87z" fill="#1296db" p-id="4194"></path><path d="M590.25 776.54q1-4.72 2-9.54l-0.32-0.42s-0.44 3.51-1.68 9.96zM606.81 406.88q1 20.44 1.52 41.4c0.01-13.78-0.5-27.48-1.52-41.4z" fill="#1296db" p-id="4195"></path></svg>
        //         `;
        const svgString = `
            <svg t="1762155729073" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9378" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M464.013496 128.123965a15.995501 15.995501 0 1 0 0 31.991003 15.995501 15.995501 0 0 0 0-31.991003zM559.986504 128.123965a15.995501 15.995501 0 1 0 0 31.991003 15.995501 15.995501 0 0 0 0-31.991003zM512 959.730076c-158.739355 0-287.919023-157.875597-287.919023-351.901028s129.179668-351.901028 287.919023-351.901028 287.919023 157.875597 287.919023 351.901028-129.179668 351.901028-287.919023 351.901028z m0-639.820051c-123.48527 0-223.937018 129.179668-223.937018 287.919023s100.451748 287.919023 223.937018 287.919023 223.937018-129.179668 223.937018-287.919023-100.451748-287.919023-223.937018-287.919023z" fill="#333333" p-id="9379"></path><path d="M441.203911 325.860352a31.831048 31.831048 0 0 1-19.80243-6.910057c-41.748258-32.950733-66.70124-86.407698-66.70124-142.999781 0-97.028711 71.78781-175.950514 159.955012-175.950514s159.955013 78.921803 159.955013 175.950514c0 56.144209-24.633072 109.377238-65.901465 142.391952a31.991003 31.991003 0 0 1-39.988754-49.969946c26.232622-20.986098 41.908213-55.53638 41.908214-92.422006 0-61.742635-43.027898-111.968509-95.973008-111.968509s-95.973008 50.225874-95.973007 111.968509c0 37.173545 15.867537 71.851792 42.356087 92.773907a31.991003 31.991003 0 0 1-19.834422 57.135931zM275.426536 511.85604a31.863039 31.863039 0 0 1-21.018088-7.901777c-11.036896-9.629292-25.048955-17.659033-39.892781-26.136649-12.668437-7.261958-25.752757-14.715861-38.261239-23.92927-51.121622-37.557437-81.800993-98.340342-80.073479-158.643382 0.63982-23.321441 5.854353-42.803961 15.899528-59.503264a89.35087 89.35087 0 0 1 59.503265-42.356088c24.697054-4.702677 51.505514 1.951451 73.291387 18.234872 15.995501 11.900653 28.791902 28.248055 39.25296 49.969946 4.766659 9.917211 8.637571 20.09035 12.476491 30.32747 1.983442 5.214533 3.934893 10.461058 6.07829 15.611609a264.565591 264.565591 0 0 0 41.908214 69.036584 31.991003 31.991003 0 1 1-49.074198 41.076447 328.003749 328.003749 0 0 1-52.01737-85.735887 578.077416 578.077416 0 0 1-6.782093-17.499078c-3.1991-8.477616-6.302227-16.92324-10.237121-25.112937-5.854353-12.156581-12.348527-20.794152-19.834421-26.360586-7.197976-5.374488-16.347402-7.997751-23.225468-6.654129-6.270236 1.151676-12.604455 5.950326-16.507357 12.4445-4.222812 7.038021-6.398201 16.28342-6.782093 28.344028-1.119685 39.636852 19.578494 79.977506 54.000812 105.250399 9.597301 7.038021 20.570215 13.308257 32.150958 19.962385 16.891249 9.661283 34.390328 19.642476 50.225874 33.49458A31.991003 31.991003 0 0 1 275.426536 511.85604zM748.573464 511.85604a31.991003 31.991003 0 0 1-21.05008-56.080227c15.803555-13.852104 33.270643-23.833297 50.193883-33.49458 11.580743-6.654129 22.553657-12.924365 32.150958-19.962385 34.422319-25.272892 55.120497-65.613546 54.000812-105.218407-0.351901-12.092599-2.55928-21.36999-6.750102-28.344029-3.934893-6.526165-10.237121-11.324815-16.539348-12.476491-6.814084-1.311631-16.027492 1.27964-23.225468 6.654129-7.485895 5.566434-13.980068 14.204005-19.834421 26.392577-3.934893 8.157706-7.038021 16.635321-10.237121 25.080946-2.175388 5.854353-4.414758 11.708707-6.782093 17.499078a328.195695 328.195695 0 0 1-52.01737 85.735887 31.991003 31.991003 0 1 1-49.074198-41.044456 264.757537 264.757537 0 0 0 41.908214-69.036584c2.143397-5.182542 4.094848-10.429067 6.07829-15.675591 3.83892-10.20513 7.709832-20.41026 12.476491-30.295479 10.429067-21.753882 23.28945-38.069293 39.25296-49.969946 21.817864-16.251429 48.562342-22.873567 73.259396-18.234872a89.35087 89.35087 0 0 1 59.567247 42.42007c10.013184 16.635321 15.227717 36.117842 15.867537 59.503264 1.727514 60.239058-28.951857 121.021963-80.073479 158.5794-12.508482 9.181418-25.592802 16.667312-38.261239 23.92927-14.843825 8.477616-28.855884 16.507357-39.892781 26.136649a31.831048 31.831048 0 0 1-21.018088 7.901777zM229.615421 1023.712081c-17.371114 0-34.230373-6.07829-46.642882-17.914961-12.476491-11.900653-20.154332-28.791902-22.265738-48.946234-2.719235-26.232622 3.83892-54.448686 19.098629-81.513075 12.316536-21.913837 28.695929-40.628573 43.123871-57.103939l34.582274-39.508888a31.991003 31.991003 0 0 1 48.17845 42.100159L271.107751 860.398013c-13.596176 15.515636-26.424568 30.167515-35.510013 46.290981-6.07829 10.780968-12.924365 27.096379-11.196851 43.507763 0.63982 6.07829 2.335343 8.861508 2.751226 9.277391 0.831766 0.447874 4.734668 0.63982 8.125715-1.215658 6.07829-3.327064 11.932644-11.068887 16.475366-21.753882 3.710956-8.733544 6.270236-17.850979 8.893499-26.968415 1.663532-5.822362 3.359055-11.676716 5.214534-17.435096 5.054578-15.515636 13.852104-38.165266 31.991002-55.664345a32.022994 32.022994 0 0 1 44.467494 45.93908c-5.982317 5.822362-10.940923 15.195726-15.579619 29.527695-1.663532 5.054578-3.135118 10.20513-4.606704 15.32369-3.1991 11.132869-6.494174 22.585648-11.516761 34.326346-10.269112 24.217189-25.720766 42.484051-44.627448 52.849136A75.914649 75.914649 0 0 1 229.615421 1023.712081zM794.384579 1023.712081c-12.316536 0-24.857009-3.039145-36.309788-9.309382-18.938673-10.365085-34.390328-28.631947-44.69143-52.881127-4.990596-11.708707-8.28567-23.161486-11.48477-34.294355-1.471586-5.11856-2.943172-10.237121-4.606704-15.355681-4.638695-14.299978-9.597301-23.673342-15.61161-29.495704a31.991003 31.991003 0 0 1 44.531476-45.93908c18.106907 17.499078 26.904433 40.148708 31.959011 55.664345 1.855478 5.75838 3.551001 11.612734 5.214534 17.435096 2.623262 9.117436 5.182542 18.234871 8.861508 26.904433 4.574713 10.748977 10.429067 18.490799 16.507357 21.817864 3.359055 1.855478 7.261958 1.663532 8.317661 1.055703 0.223937-0.255928 1.91946-3.007154 2.55928-9.149427 1.727514-16.379393-5.11856-32.694805-11.196851-43.475772-9.085445-16.123465-21.913837-30.775344-35.510013-46.290981l-34.614265-39.57287a31.991003 31.991003 0 0 1 48.17845-42.100159l34.582274 39.508888c14.427942 16.507357 30.807335 35.190103 43.123871 57.103939 15.227717 27.064388 21.817864 55.248461 19.098629 81.481084-2.111406 20.154332-9.789247 37.109563-22.233747 48.946234-12.4445 11.836671-29.303758 17.946952-46.706864 17.946952zM575.982005 735.793058h-127.96401a15.995501 15.995501 0 0 1-13.884095-8.061732l-63.982005-111.968509a15.995501 15.995501 0 0 1 0-15.867538l63.982005-111.968508A15.995501 15.995501 0 0 1 448.017995 479.865038h127.96401a15.995501 15.995501 0 0 1 13.884095 8.061733l63.982005 111.968508a15.995501 15.995501 0 0 1 0 15.867538l-63.982005 111.968509A15.995501 15.995501 0 0 1 575.982005 735.793058z m-118.686619-31.991002h109.409228l54.832579-95.973008-54.832579-95.973008h-109.409228l-54.832579 95.973008 54.832579 95.973008z" fill="#333333" p-id="9380"></path><path d="M448.017995 511.85604a15.995501 15.995501 0 0 1-13.72414-7.773813l-83.976382-139.960636a15.995501 15.995501 0 1 1 27.44828-16.443375l83.976382 139.960636A15.995501 15.995501 0 0 1 448.017995 511.85604zM575.662095 511.85604a15.931519 15.931519 0 0 1-13.692149-24.217188l83.976382-139.960636a15.995501 15.995501 0 0 1 27.416289 16.443375l-83.976382 139.960636a15.995501 15.995501 0 0 1-13.72414 7.773813zM369.35212 863.021275a15.995501 15.995501 0 0 1-13.660158-24.313162l78.665875-129.275641a15.995501 15.995501 0 1 1 27.320316 16.635321l-78.633884 129.243651a15.995501 15.995501 0 0 1-13.692149 7.709831zM654.359961 863.021275a15.995501 15.995501 0 0 1-13.692149-7.67784l-78.665875-129.307633a15.995501 15.995501 0 0 1 27.352307-16.635321l78.633884 129.307632a15.995501 15.995501 0 0 1-13.628167 24.313162zM384.03599 623.824549H256.07198a15.995501 15.995501 0 1 1 0-31.991002h127.96401a15.995501 15.995501 0 1 1 0 31.991002zM767.92802 623.824549h-127.96401a15.995501 15.995501 0 1 1 0-31.991002h127.96401a15.995501 15.995501 0 1 1 0 31.991002z" fill="#333333" p-id="9381"></path></svg>
            `;
        this.turtleImg = new Image();
        this.turtleImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        this.turtleImg.onload = () => {
            this.drawTurtleIcon();
        };
    }

    initCanvases() {
        this.resizeCanvases();

        // 设置Canvas样式和线条属性
        [this.lineCanvas, this.turtleCanvas].forEach(canvas => {
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.top = '0';
        });

        // 如果有网格画布，也设置样式
        if (this.gridCanvas) {
            this.gridCanvas.style.position = 'absolute';
            this.gridCanvas.style.left = '0';
            this.gridCanvas.style.top = '0';
            this.gridCanvas.style.zIndex = '10'; 
            this.gridCanvas.style.opacity = '0.3';
        }

        // 设置乌龟画布和线条画布的样式
        this.lineCanvas.style.zIndex = '1';
        this.turtleCanvas.style.zIndex = '2';

        // 初始化线条上下文属性[6,8](@ref)
        this.lineCtx.lineCap = 'round';
        this.lineCtx.lineJoin = 'round';
        this.lineCtx.imageSmoothingEnabled = true;

        this.clearCanvas();
        this.drawTurtleIcon();

        // 如果需要显示网格，则绘制网格
        if (this.showGrid) {
            this.drawGrid();
        }
        this.handleResize();
    }

    /**
    * 切换网格显示/隐藏
    */
    toggleGrid() {
        if (this.gridCanvas) {
        this.showGrid = !this.showGrid;
            this.gridCanvas.style.display = this.showGrid ? 'block' : 'none';
        }
    }

    /**
     * 绘制网格
     */
    drawGrid() {
        if (!this.gridCtx) return;

        this.resizeCanvases();

        // 清除网格画布
        this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);

        // 设置网格线样式
        this.gridCtx.strokeStyle = '#999';
        this.gridCtx.lineWidth = 1;
        this.gridCtx.fillStyle = '#000';
        this.gridCtx.font = '12px Arial';
        this.gridCtx.textAlign = 'center';
        this.gridCtx.textBaseline = 'middle';

        // 绘制垂直线 (每50像素一条线)
        for (let x = 0; x <= this.gridCanvas.width; x += this.gridUnit) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, this.gridCanvas.height);
            this.gridCtx.stroke();

            // 每100单位绘制刻度文字 (即每2个网格单元)
            if (x % (this.gridUnit * 2) === 0) {
                // 计算相对于画布中心的坐标值
                const coordX = x - this.gridCanvas.width / 2;

                // 调整边缘文字位置，避免显示不全
                let textX = x;
                let textY = this.gridCanvas.height / 2 + 15;

                // 如果是左边缘，将文字向右偏移
                if (x === 0) {
                    textX = 20;
                }
                // 如果是右边缘，将文字向左偏移
                else if (x === this.gridCanvas.width) {
                    textX = this.gridCanvas.width - 20;
                }

                this.gridCtx.fillText(coordX.toString(), textX, textY);
            }
        }

        // 绘制水平线 (每50像素一条线)
        for (let y = 0; y <= this.gridCanvas.height; y += this.gridUnit) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, y);
            this.gridCtx.lineTo(this.gridCanvas.width, y);
            this.gridCtx.stroke();

            // 每100单位绘制刻度文字 (即每2个网格单元)
            if (y % (this.gridUnit * 2) === 0) {
                // 计算相对于画布中心的坐标值
                const coordY = this.gridCanvas.height / 2 - y;

                // 调整边缘文字位置，避免显示不全
                let textX = this.gridCanvas.width / 2 - 20;
                let textY = y;

                // 如果是上边缘，将文字向下偏移
                if (y === 0) {
                    textY = 15;
                }
                // 如果是下边缘，将文字向上偏移
                else if (y === this.gridCanvas.height) {
                    textY = this.gridCanvas.height - 15;
                }

                this.gridCtx.fillText(coordY.toString(), textX, textY);
            }
        }

        // 绘制坐标轴
        this.gridCtx.strokeStyle = '#000';
        this.gridCtx.lineWidth = 2;

        // X轴 (水平线) - 位于画布垂直中心
        this.gridCtx.beginPath();
        this.gridCtx.moveTo(0, this.gridCanvas.height / 2);
        this.gridCtx.lineTo(this.gridCanvas.width, this.gridCanvas.height / 2);
        this.gridCtx.stroke();

        // Y轴 (垂直线) - 位于画布水平中心
        this.gridCtx.beginPath();
        this.gridCtx.moveTo(this.gridCanvas.width / 2, 0);
        this.gridCtx.lineTo(this.gridCanvas.width / 2, this.gridCanvas.height);
        this.gridCtx.stroke();

        // 绘制坐标标签
        this.gridCtx.fillStyle = '#000';
        this.gridCtx.font = '12px Arial';
        this.gridCtx.textAlign = 'left';
        this.gridCtx.textBaseline = 'top';

        // 标注X轴正方向
        this.gridCtx.fillText('X', this.gridCanvas.width - 20, this.gridCanvas.height / 2 - 15);

        // 标注Y轴正方向
        this.gridCtx.fillText('Y', this.gridCanvas.width / 2 + 5, 5);
    }

    /**
     * 清除网格
     */
    clearGrid() {
        if (this.gridCtx) {
            this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
        }
    }

    /**
     * 绘制乌龟图标
     */
    drawTurtleIcon() {
        if (!this.turtleCtx) return;

        // 清除乌龟画布上的乌龟图标
        this.turtleCtx.clearRect(0, 0, this.turtleCanvas.width, this.turtleCanvas.height);

        // 只有在乌龟可见时才绘制
        if (this.turtleVisible && this.turtleImg && this.turtleImg.complete) {
            // 保存当前绘图状态
            this.turtleCtx.save();

            // 移动到乌龟当前位置
            this.turtleCtx.translate(this.x, this.y);

            // 根据乌龟角度旋转
            this.turtleCtx.rotate((this.angle - 90) * Math.PI / 180);

            // 绘制乌龟图标 (居中绘制)
            this.turtleCtx.drawImage(
                this.turtleImg,
                -this.turtleSize / 2,
                -this.turtleSize / 2,
                this.turtleSize,
                this.turtleSize
            );

            // 恢复绘图状态
            this.turtleCtx.restore();
        }
    }

    /**
     * 基础乌龟图标绘制（备用方案）
     */
    drawBasicTurtleIcon() {
        this.turtleCtx.beginPath();
        this.turtleCtx.moveTo(this.turtleSize / 2, 0);
        this.turtleCtx.lineTo(-this.turtleSize / 2, -this.turtleSize / 3);
        this.turtleCtx.lineTo(-this.turtleSize / 2, this.turtleSize / 3);
        this.turtleCtx.closePath();

        this.turtleCtx.fillStyle = '#3498db';
        this.turtleCtx.fill();
        this.turtleCtx.strokeStyle = '#2980b9';
        this.turtleCtx.lineWidth = 2;
        this.turtleCtx.stroke();

        // 绘制眼睛
        this.turtleCtx.beginPath();
        this.turtleCtx.arc(this.turtleSize / 4, 0, 3, 0, Math.PI * 2);
        this.turtleCtx.fillStyle = 'white';
        this.turtleCtx.fill();
    }

    /**
     * 前进方法 - 修复版[3,6](@ref)
     * @param {number} distance 前进距离
     * @param {number} steps 步数（默认20）
     * @param {boolean} animate 是否启用动画
     * @returns {Promise} 动画完成Promise
     */
    forward(distance, steps = 20, animate = true) {
        return new Promise((resolve) => {
            // 当animate为false时，强制steps设置为1
            if (!animate) {
                steps = 1;
            } else if (steps <= 0) {
                steps = 1;
            }

            // 根据动画速度调整步数
            if (animate && this.animationSpeed) {
                steps = Math.max(1, Math.round(steps / this.animationSpeed));
            }

            // 保存初始位置和角度
            const startX = this.x;
            const startY = this.y;
            const radians = this.angle * (Math.PI / 180);

            // 计算总位移
            const deltaX = -distance * Math.cos(radians);
            const deltaY = -distance * Math.sin(radians); // Canvas Y轴向下为正

            let currentStep = 0;

            // 设置一次线条样式（性能优化）
            this.lineCtx.save();
            this.lineCtx.strokeStyle = this.penColor;
            this.lineCtx.lineWidth = this.penWidth;
            this.lineCtx.lineCap = 'round';

            const animateStep = () => {
                if (currentStep > steps) {
                    this.lineCtx.restore();
                    resolve();
                    return;
                }

                // 计算当前步的位置（线性插值）
                const t = currentStep / steps;
                const newX = startX + deltaX * t;
                const newY = startY + deltaY * t;

                // 只有当画笔放下且乌龟可见时才绘制线条
                if (this.isPenDown && this.turtleVisible && currentStep > 0) {
                    // 绘制线条段
                    this.lineCtx.beginPath();
                    this.lineCtx.moveTo(
                        startX + deltaX * ((currentStep - 1) / steps),
                        startY + deltaY * ((currentStep - 1) / steps)
                    );
                    this.lineCtx.lineTo(newX, newY);
                    this.lineCtx.stroke();
                }

                // 更新乌龟位置
                this.x = newX;
                this.y = newY;

                // 更新乌龟图标位置（仅在乌龟可见时）
                if (this.turtleVisible) {
                    this.drawTurtleIcon();
                }

                currentStep++;

                // 总是使用requestAnimationFrame，但通过steps控制速度
                if (currentStep <= steps) {
                    requestAnimationFrame(animateStep);
                } else {
                    this.lineCtx.restore();
                    resolve();
                }
            };

            // 启动动画循环
            requestAnimationFrame(animateStep);
        });
    }

    /**
     * 后退方法
     * @param {number} distance 后退距离
     * @param {number} steps 步数（默认20）
     * @param {boolean} animate 是否启用动画
     * @returns {Promise} 动画完成Promise
     */
    back(distance, steps = 20, animate = true) {
        // 调用forward方法，传入负的距离值实现后退效果
        return this.forward(-distance, steps, animate);
    }

    /**
     * 转向方法[3](@ref)
     * @param {number} degrees 转向角度
     */
    turn(degrees) {
        // 角度标准化，确保在0-360度范围内[3](@ref)
        this.angle = (this.angle + degrees) % 360;
        if (this.angle < 0) this.angle += 360;

        // 转向后更新乌龟方向
        this.drawTurtleIcon();
    }

    /**
     * 右转方法
     * @param {number} degrees 右转角度
     */
    right(degrees) {
        // 角度标准化，确保在0-360度范围内
        this.angle = (this.angle + degrees) % 360;
        if (this.angle < 0) this.angle += 360;

        // 转向后更新乌龟方向
        this.drawTurtleIcon();
    }

    /**
     * 左转方法
     * @param {number} degrees 左转角度
     */
    left(degrees) {
        // 角度标准化，确保在0-360度范围内
        this.angle = (this.angle - degrees) % 360;
        if (this.angle < 0) this.angle += 360;

        // 转向后更新乌龟方向
        this.drawTurtleIcon();
    }

    /**
     * 快速前进方法（无动画）
     */
    forwardFast(distance) {
        return this.forward(distance, 1, false);
    }

    /**
     * 动画前进方法
     */
    forwardAnimate(distance, steps = 500) {
        return this.forward(distance, steps, true);
    }

    /**
     * 移动到指定位置（可选带动画）
     * @param {number} x - 目标x坐标（数学坐标系）
     * @param {number} y - 目标y坐标（数学坐标系）
     * @param {number} steps - 动画步数（默认为20）
     * @param {boolean} animate - 是否启用动画（默认为true）
     * @returns {Promise} 动画完成Promise
     */
    goto(x, y, steps = 20, animate = true) {
        // 如果不启用动画，直接移动到目标位置
        if (!animate) {
            this.x = this.lineCanvas.width / 2 + x;
            this.y = this.lineCanvas.height / 2 - y;
            this.drawTurtleIcon();
            return Promise.resolve();
        }

        // 强制steps至少为1
        if (steps <= 0) {
            steps = 1;
        }

        // 根据动画速度调整步数
        if (this.animationSpeed) {
            steps = Math.max(1, Math.round(steps / this.animationSpeed));
        }

        // 保存起始位置
        const startX = this.x;
        const startY = this.y;

        // 计算目标位置（转换为Canvas坐标系）
        const targetX = this.lineCanvas.width / 2 + x;
        const targetY = this.lineCanvas.height / 2 - y;

        // 计算位移差值
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;

        let currentStep = 0;

        return new Promise((resolve) => {
            const animateStep = () => {
                if (currentStep > steps) {
                    resolve();
                    return;
                }

                // 计算当前步的位置（线性插值）
                const t = currentStep / steps;
                this.x = startX + deltaX * t;
                this.y = startY + deltaY * t;

                // 更新乌龟图标位置
                this.drawTurtleIcon();

                currentStep++;

                if (currentStep <= steps) {
                    requestAnimationFrame(animateStep);
                } else {
                    // 确保最终位置精确
                    this.x = targetX;
                    this.y = targetY;
                    this.drawTurtleIcon();
                    resolve();
                }
            };

            // 启动动画循环
            requestAnimationFrame(animateStep);
        });
    }

    /**
     * 设置朝向角度[3](@ref)
     */
    setHeading(angle) {
        this.angle = angle % 360;
        if (this.angle < 0) this.angle += 360;
        this.drawTurtleIcon();
    }

    setRotationMode(mode) {
        this.rotationMode = mode;
    }

    /**
     * 隐藏乌龟图标
     */
    hide() {
        this.turtleVisible = false;
        this.drawTurtleIcon();
    }

    /**
     * 显示乌龟图标
     */
    show() {
        this.turtleVisible = true;
        this.drawTurtleIcon();
    }

    // 其他辅助方法
    clearCanvas() {
        this.lineCtx.clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height);
        this.turtleCtx.clearRect(0, 0, this.turtleCanvas.width, this.turtleCanvas.height);
    }

    resetCanvas() {
        this.resizeCanvases();

        this.lineCtx.clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height);
        this.turtleCtx.clearRect(0, 0, this.turtleCanvas.width, this.turtleCanvas.height);

        this.x = this.lineCanvas.width / 2;
        this.y = this.lineCanvas.height / 2;
        this.angle = 90; // 默认向上（数学坐标系）
        this.isPenDown = true;
        this.rotationMode = 0; // 0: 正常, 1: 跟随画笔
        this.penColor = '#3498db';
        this.penWidth = 2;
        this.turtleSize = 32;
        this.showGrid = false; // 默认不显示网格
        this.gridUnit = 100; // 网格单位大小
        this.turtleVisible = true; // 默认显示乌龟
        this.animationSpeed = 1.0; // 默认动画速度为1.0倍

        // 图片缓存
        this.imageCache = new Map();
        this.angle = 90;
        this.drawTurtleIcon();
    }
    /**
     * 清除指定矩形区域
     * @param {number} x - 矩形左上角x坐标
     * @param {number} y - 矩形左上角y坐标
     * @param {number} width - 矩形宽度
     * @param {number} height - 矩形高度
     */
    clearRect(x, y, width, height) {
        this.lineCtx.clearRect(x, y, width, height);
    }

    /**
     * 绘制填充矩形
     * @param {number} width 矩形宽度
     * @param {number} height 矩形高度
     */
    fillRect(width, height) {
        this.lineCtx.save();
        this.lineCtx.fillStyle = this.penColor;
        if (this.rotationMode) {
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系
            this.lineCtx.fillRect(-width / 2, -height / 2, width, height);
        } else {
            this.lineCtx.fillRect(this.x - width / 2, this.y - height / 2, width, height);
        }

        this.lineCtx.restore();
    }

    /**
     * 绘制矩形
     * @param {number} width 矩形宽度
     * @param {number} height 矩形高度
     */
    drawRect(width, height) {
        this.lineCtx.save();
        this.lineCtx.strokeStyle = this.penColor;
        this.lineCtx.lineWidth = this.penWidth;

        if (this.rotationMode) {
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系
            this.lineCtx.strokeRect(-width / 2, -height / 2, width, height);
        } else {
            this.lineCtx.strokeRect(this.x - width / 2, this.y - height / 2, width, height);
        }
        this.lineCtx.restore();
    }
    /**
     * 绘制空心圆形
     * @param {number} radius 圆形半径
     */
    drawCircle(radius) {
        this.lineCtx.save();
        this.lineCtx.strokeStyle = this.penColor;
        this.lineCtx.lineWidth = this.penWidth;
        if (this.rotationMode) {
            // 移动到当前乌龟位置并根据角度旋转
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系

            // 绘制以当前位置为中心的圆形
            this.lineCtx.beginPath();
            this.lineCtx.arc(0, 0, radius, 0, Math.PI * 2);
            this.lineCtx.stroke();
        } else {
            this.lineCtx.beginPath();
            this.lineCtx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            this.lineCtx.stroke();
        }
        this.lineCtx.restore();
    }

    /**
     * 绘制填充圆形
     * @param {number} radius 圆形半径
     */
    fillCircle(radius) {
        this.lineCtx.save();
        this.lineCtx.fillStyle = this.penColor;
        if (this.rotationMode) {
            // 移动到当前乌龟位置并根据角度旋转
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系

            // 绘制以当前位置为中心的圆形
            this.lineCtx.beginPath();
            this.lineCtx.arc(0, 0, radius, 0, Math.PI * 2);
            this.lineCtx.fill();
        } else {
            this.lineCtx.beginPath();
            this.lineCtx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            this.lineCtx.fill();
        }
        this.lineCtx.restore();
    }

    /**
     * 绘制椭圆
     * @param {number} width 椭圆宽度
     * @param {number} height 椭圆高度
     */
    ellipse(width, height) {
        this.lineCtx.save();
        this.lineCtx.strokeStyle = this.penColor;
        this.lineCtx.lineWidth = this.penWidth;

        if (this.rotationMode) {
            // 移动到当前乌龟位置并根据角度旋转
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系

            // 绘制以当前位置为中心的椭圆
            this.lineCtx.beginPath();
            this.lineCtx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
            this.lineCtx.stroke();
        } else {
            this.lineCtx.beginPath();
            this.lineCtx.ellipse(this.x, this.y, width / 2, height / 2, 0, 0, Math.PI * 2);
            this.lineCtx.stroke();
        }
        this.lineCtx.restore();
    }

    /**
     * 绘制填充椭圆
     * @param {number} width 椭圆宽度
     * @param {number} height 椭圆高度
     */
    fillEllipse(width, height) {
        this.lineCtx.save();
        this.lineCtx.fillStyle = this.penColor;

        if (this.rotationMode) {
            // 移动到当前乌龟位置并根据角度旋转
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系

            // 绘制以当前位置为中心的椭圆
            this.lineCtx.beginPath();
            this.lineCtx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
            this.lineCtx.fill();
        } else {
            this.lineCtx.beginPath();
            this.lineCtx.ellipse(this.x, this.y, width / 2, height / 2, 0, 0, Math.PI * 2);
            this.lineCtx.fill();
        }
        this.lineCtx.restore();
    }

    /**
     * 绘制文字（描边文字）
     * @param {string} text 要绘制的文字
     * @param {string} font 字体样式（可选，默认为"16px Arial"）
     */
    drawText(text, font = "16px Arial") {
        this.lineCtx.save();
        this.lineCtx.strokeStyle = this.penColor;
        this.lineCtx.lineWidth = this.penWidth;
        this.lineCtx.font = font;
        if (this.rotationMode) {
            // 移动到当前乌龟位置并根据角度旋转
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系
            // 绘制文字
            this.lineCtx.strokeText(text, 0, 0);
        }
        else {
            this.lineCtx.strokeText(text, this.x, this.y);
        }
        this.lineCtx.restore();
    }

    /**
     * 填充文字
     * @param {string} text 要绘制的文字
     * @param {string} font 字体样式（可选，默认为"16px Arial"）
     */
    fillText(text, font = "16px Arial") {
        this.lineCtx.save();
        this.lineCtx.fillStyle = this.penColor;
        this.lineCtx.font = font;
        if (this.rotationMode) {
            // 移动到当前乌龟位置并根据角度旋转
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系

            // 绘制文字
            this.lineCtx.fillText(text, 0, 0);
        } else {
            this.lineCtx.fillText(text, this.x, this.y);
        }
        this.lineCtx.restore();
    }

    /**
     * 绘制居中文字（填充）
     * @param {string} text 要绘制的文字
     * @param {string} font 字体样式（可选，默认为"16px Arial"）
     */
    fillTextCentered(text, font = "16px Arial") {
        this.lineCtx.save();
        this.lineCtx.fillStyle = this.penColor;
        this.lineCtx.font = font;
        if (this.rotationMode) {
            // 移动到当前乌龟位置并根据角度旋转
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180); // 调整角度以匹配坐标系

            // 计算文字宽度并居中绘制
            const textWidth = this.lineCtx.measureText(text).width;
            this.lineCtx.fillText(text, -textWidth / 2, 0);
        }
        else {
            const textWidth = this.lineCtx.measureText(text).width;
            this.lineCtx.fillText(text, this.x - textWidth / 2, this.y);
        }

        this.lineCtx.restore();
    }

    /**
     * 绘制图片
     * @param {string} path 图片路径
     */
    drawImage(path) {
        // 从缓存中获取图片对象，如果不存在则创建新的
        let img = this.imageCache.get(path);
        if (!img) {
            img = new Image();
            this.imageCache.set(path, img);

            // 返回一个 Promise，在图片加载完成后绘制
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    this._drawImage(img);
                    resolve();
                };
                img.onerror = () => {
                    alert(`无法加载图片: ${path}`);
                    reject(new Error(`Failed to load image: ${path}`));
                };
                img.src = path;
            });
        }

        // 如果图片已缓存且已加载完成，直接绘制
        if (img.complete && img.naturalWidth !== 0) {
            this._drawImage(img);
            return Promise.resolve();
        }

        // 如果图片已缓存但未加载完成，等待加载
        return new Promise((resolve) => {
            img.onload = () => {
                this._drawImage(img);
                resolve();
            };
        });
    }

    // 提取图片绘制逻辑到单独的方法
    _drawImage(img) {
        this.lineCtx.save();
        if (this.rotationMode) {
            this.lineCtx.translate(this.x, this.y);
            this.lineCtx.rotate((this.angle - 90) * Math.PI / 180);
            this.lineCtx.drawImage(img, -img.width / 2, -img.height / 2);
        } else {
            this.lineCtx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
        }
        this.lineCtx.restore();
    }

    /**
     * 等待指定秒数
     * @param {number} seconds - 等待的秒数
     * @returns {Promise} 等待完成的Promise
     */
    wait(seconds) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
    }

    setPenState(isDown) {
        this.isPenDown = isDown;
    }

    setColor(color) {
        // 数字到颜色的映射
        const colorMap = {
            '0': '#000000',  // 黑色
            '1': '#FF0000',  // 红色
            '2': '#00FF00',  // 绿色
            '3': '#0000FF',  // 蓝色
            '4': '#FFFF00',  // 黄色
            '5': '#FF00FF',  // 紫色
            '6': '#00FFFF',  // 青色
            '7': '#FFA500',  // 橙色
            '8': '#800080',  // 紫罗兰色
            '9': '#FFC0CB', // 粉色
            '10': '#A52A2A', // 棕色
            '11': '#808080', // 灰色
            '12': '#FFD700', // 金色
            '13': '#C0C0C0', // 银色
            '14': '#FF6347', // 番茄色
            '15': '#FFFFFF',  // 白色
            '16': '#4169E1', // 皇家蓝
            '17': '#32CD32', // 酸橙绿
            '18': '#FF69B4', // 热粉红
            '19': '#8B4513'  // 鞍褐色
        };


        // 如果是单个数字，使用映射的颜色
        if (/^(1?[0-9])$/.test(color)) {
            this.penColor = colorMap[color];
            return;
        }
        // 如果不是以#开头，添加#前缀
        else if (!color.startsWith('#')) {
            this.penColor = '#' + color;
        }
        // 其他情况直接使用原值
        else {
            this.penColor = color;
        }
    }


    setSize(width) {
        this.penWidth = width;
    }

    /**
 * 移动到指定位置并绘制线条
 * @param {number} x - 目标位置的x坐标（数学坐标系）
 * @param {number} y - 目标位置的y坐标（数学坐标系）
 * @param {number} steps - 动画步数
 * @param {boolean} animate - 是否启用动画
 * @returns {Promise} 动画完成Promise
 */
    lineTo(x, y, steps = 20, animate = true) {
        return new Promise((resolve) => {
            // 当animate为false时，强制steps设置为1
            if (!animate) {
                steps = 1;
            } else if (steps <= 0) {
                steps = 1;
            }

            // 根据动画速度调整步数
            if (animate && this.animationSpeed) {
                steps = Math.max(1, Math.round(steps / this.animationSpeed));
            }

            // 保存初始位置
            const startX = this.x;
            const startY = this.y;

            // 转换目标坐标到Canvas坐标系
            const targetX = this.lineCanvas.width / 2 + x;
            const targetY = this.lineCanvas.height / 2 - y;

            // 计算总位移
            const deltaX = targetX - startX;
            const deltaY = targetY - startY;

            let currentStep = 0;

            // 设置一次线条样式（性能优化）
            this.lineCtx.save();
            this.lineCtx.strokeStyle = this.penColor;
            this.lineCtx.lineWidth = this.penWidth;
            this.lineCtx.lineCap = 'round';

            const animateStep = () => {
                if (currentStep > steps) {
                    this.lineCtx.restore();
                    resolve();
                    return;
                }

                // 计算当前步的位置（线性插值）
                const t = currentStep / steps;
                const newX = startX + deltaX * t;
                const newY = startY + deltaY * t;

                if (this.isPenDown && currentStep > 0) {
                    // 绘制线条段
                    this.lineCtx.beginPath();
                    this.lineCtx.moveTo(
                        startX + deltaX * ((currentStep - 1) / steps),
                        startY + deltaY * ((currentStep - 1) / steps)
                    );
                    this.lineCtx.lineTo(newX, newY);
                    this.lineCtx.stroke();
                }

                // 更新乌龟位置
                this.x = newX;
                this.y = newY;

                // 更新乌龟图标位置
                this.drawTurtleIcon();

                currentStep++;

                // 总是使用requestAnimationFrame，但通过steps控制速度
                if (currentStep <= steps) {
                    requestAnimationFrame(animateStep);
                } else {
                    this.lineCtx.restore();
                    resolve();
                }
            };

            // 启动动画循环
            requestAnimationFrame(animateStep);
        });
    }
    // 获取当前状态（用于调试或保存）
    getState() {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            isPenDown: this.isPenDown,
            color: this.penColor,
            lineWidth: this.penWidth
        };
    }

    handleResize() {
        // 保存当前乌龟的相对位置
        const relativeX = this.lineCanvas.width > 0 ? this.x / this.lineCanvas.width : 0.5;
        const relativeY = this.lineCanvas.height > 0 ? this.y / this.lineCanvas.height : 0.5;

        // 保存当前画布内容
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.lineCanvas.width;
        tempCanvas.height = this.lineCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.lineCanvas, 0, 0);

        // 调整 canvas 尺寸为固定尺寸
        const fixedWidth = 800;
        const fixedHeight = 800;
        this.lineCanvas.width = fixedWidth;
        this.lineCanvas.height = fixedHeight;
        this.turtleCanvas.width = fixedWidth;
        this.turtleCanvas.height = fixedHeight;

        // 如果有网格画布，也调整尺寸
        if (this.gridCanvas) {
            this.gridCanvas.width = fixedWidth;
            this.gridCanvas.height = fixedHeight;
            if (this.showGrid) {
                this.drawGrid();
            }
        }

        // 恢复画布内容（按比例缩放）
        this.lineCtx.drawImage(tempCanvas, 0, 0, fixedWidth, fixedHeight);

        // 根据相对位置更新乌龟位置
        this.x = this.lineCanvas.width * relativeX;
        this.y = this.lineCanvas.height * relativeY;

        // 重新绘制乌龟图标
        this.drawTurtleIcon();
    }
}


////////////////////////////////CIN
// 全局变量用于处理输入回调
let inputCallback = null;

// 请求用户输入的函数
function requestUserInput(prompt, callback) {
    // 保存回调函数
    inputCallback = callback;

    // 在页面上显示输入提示
    showInputPrompt(prompt);
}

// 显示输入提示的函数
function showInputPrompt(prompt) {
    // 创建或显示输入界面
    let inputContainer = document.getElementById('input-container');

    if (!inputContainer) {
        inputContainer = document.createElement('div');
        inputContainer.id = 'input-container';
        inputContainer.className = 'input-overlay';
        document.body.appendChild(inputContainer);
    }

    inputContainer.innerHTML = `
        <div class="input-dialog">
            <label for="user-input"> ${prompt} </label>
            <input type="text" id="user-input" />
            <div class="input-buttons">
                <button id="submit-input">确定</button>
                <button id="cancel-input">取消</button>
            </div>
        </div>
    `;

    inputContainer.style.display = 'block';

    const inputElement = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-input');
    const cancelButton = document.getElementById('cancel-input');

    // 聚焦到输入框
    inputElement.focus();

    // 处理确定按钮点击
    submitButton.onclick = function () {
        const value = inputElement.value;
        hideInputPrompt();
        if (inputCallback) {
            inputCallback(value);
            ;
        }
    };

    // 处理取消按钮点击
    cancelButton.onclick = function () {
        hideInputPrompt();
        if (inputCallback) {
            inputCallback(null);
        }
    };

    // 处理回车键
    inputElement.onkeypress = function (e) {
        if (e.key === 'Enter') {
            const value = inputElement.value;
            hideInputPrompt();
            if (inputCallback) {
                inputCallback(value);
            }
        }
    };
}
// 隐藏输入提示
function hideInputPrompt() {
    const inputContainer = document.getElementById('input-container');
    if (inputContainer) {
        inputContainer.style.display = 'none';
    }
}

// 将函数添加到全局作用域
window.requestUserInput = requestUserInput;
