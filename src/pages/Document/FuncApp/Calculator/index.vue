<template>
    <div class="app-container">
        <!-- 标签切换 -->
        <div class="tags_box">
            <div v-for="(item, index) in calculatetList" class="tags">
                <div :class="{ isActive: index == active }" @click="handelToogel(index)">
                    {{ item }}
                </div>
            </div>
        </div>
        <!-- 内容部分 -->
        <div class="conbox">
            <div v-show="active == 0" id="standardCal">
                <input v-model="standardOutput" />
                <input v-model="standardInput" />
                <template v-for="value in standardArr">
                    <button>{{ value }}</button>
                </template>
            </div>

            <div v-show="active == 1" id="scienceCal">
                <input v-model="scienceOutput" />
                <input v-model="scienceInput" />
                <template v-for="value in scienceArr">
                    <button @click="calculateEvent(value)">{{ value }}</button>
                </template>
            </div>

            <div v-show="active == 2" id="drawdCal">内容三</div>

            <div v-show="active == 3" id="programmerCal">
                <input v-model="standardInput" />
                <input v-model="standardOutput" />
                <template v-for="value in NiuMaArr">
                    <button>{{ value }}</button>
                </template>
            </div>

            <div v-show="active == 4" id="dateCal">
                <label>
                    请选择：
                    <select @change="changeDate">
                        <option>日期之间的相隔时间</option>
                        <option>添加或减去天数</option>
                    </select>
                </label>

                <label>
                    开始日期:
                    <input type="date" />
                </label>

                <div v-show="showDate == true">
                    <label>
                        结束日期：
                        <input type="date" />
                    </label>
                </div>

                <div v-show="showDate == false">
                    <label class="switch">
                        <input type="checkbox" @change="switchChange()" />
                        <div class="slider">{{ switchBtn }}</div>
                    </label>
                    <br />
                    <label>
                        年：
                        <input type="text" placeholder="请输入要增减的年数" />
                    </label>
                    <br />
                    <label>
                        月：
                        <input type="text" placeholder="请输入要增减的月数" />
                    </label>
                    <br />
                    <label>
                        日：
                        <input type="text" placeholder="请输入要增减的日数" />
                    </label>
                </div>
                <label>差值时间 / 加减后的日期:</label>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";

class Stack {
    constructor() {
        this.arr = [];
    }
    push(item) {
        this.arr.push(item);
    }
    pop() {
        return this.arr.pop();
    }
    peek() {
        return this.arr[this.arr.length - 1];
    }
    isEmpty() {
        return this.arr.length == 0;
    }
    clear() {
        this.arr = [];
    }
    print() {
        console.log(this.arr);
    }
}

const calculatetList = ["标准计算器", "科学", "绘图", "程序员", "日期计算"];
let active = ref(1); //默认选中第一个tab
let switchBtn = ref("减少日期");
let showDate = ref(true);
let standardInput = ref(0);
let standardOutput = ref("");
let standardOp = ref("");
let scienceInput = ref(0);
let scienceOutput = ref("");
let scienceOp = ref("");
let science2ndFlag = ref(true);

const numStack = new Stack();
const opStack = new Stack();
const opPriority = (op) => {
    if (op == "+" || op == "-") return 1;
    if (op == "×" || op == "÷") return 2;
    if (op == "(" || op == ")") return 3;
};
const operation = (A, B, op) => {
    let res = 0;
    switch (op) {
        case "+":
            res = parseInt(A) + parseInt(B);
            break;
        case "-":
            res = parseInt(A) - parseInt(B);
            break;
        case "×":
            res = parseInt(A) * parseInt(B);
            break;
        case "÷":
            res = parseInt(A) / parseInt(B);
            break;
        case "x^y":
            res = Math.pow(parseInt(A), parseInt(B));
            break;
        case "y√x":
            res = Math.pow(parseInt(A), 8);
            break;
    }
    console.log(res);
    return res;
};

const handelToogel = (index) => {
    active.value = index;
};
const standardArr = ["%", "CE", "C", "◀", "1/x", "x²", "√￣x", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "±", "0", ".", "="];
const scienceArr = reactive(["2nd", "π", "e", "C", "◀", "x²", "1/x", "|x|", "exp", "mod", "√x", "(", ")", "n!", "÷", "x^y", "7", "8", "9", "×", "10^x", "4", "5", "6", "-", "lg", "1", "2", "3", "+", "ln", "±", "0", ".", "="]);
const NiuMaArr = ["A", ">>", "<<", "Clear", "◀", "B", "(", ")", "%", "÷", "C", "7", "8", "9", "×", "D", "4", "5", "6", "-", "E", "1", "2", "3", "＋", "F", "±", "0", ".", "="];

const calculateEvent = (val) => {
    switch (true) {
        // 正则判断整数、浮点数、正负数和科学计数法
        case /^[0-9]*$/.test(val) == true:
            if (scienceInput.value + "" == "0") {
                scienceInput.value = val;
            } else {
                scienceInput.value += val;
            }
            break;
        case val == ".":
            if ((scienceInput.value + "").indexOf(".") == -1) {
                scienceInput.value += val;
                //判断小数点是否有多个，避免不合法
            }
            break;

        case val == "π":
            scienceInput.value = Math.PI;
            break;
        case val == "e":
            scienceInput.value = Math.E;
            break;
        case val == "C":
            scienceInput.value = 0;
            scienceOutput.value = "";
            break;
        case val == "◀":
            if (scienceOutput.value == "") {
                if (scienceInput.value < 10) {
                    scienceInput.value = 0;
                } else {
                    scienceInput.value = parseInt(scienceInput.value / 10);
                }
            }
            break;
        case val == "2nd":
            if (science2ndFlag.value == true) {
                science2ndFlag.value = false;
                document.querySelector("#scienceCal button:nth-of-type(1)").style.background = "rgba(75, 170, 248, 0.5)";
                scienceArr[5] = "x³";
                scienceArr[10] = "∛x";
                scienceArr[15] = "y√x";
                scienceArr[20] = "2^x";
                scienceArr[25] = "㏒y X";
                scienceArr[30] = "e^x";
            } else {
                science2ndFlag.value = true;
                scienceArr[5] = " x²";
                scienceArr[10] = "√ X";
                scienceArr[15] = "X ^ y ";
                scienceArr[20] = "10 ^ x";
                scienceArr[25] = "lg ";
                scienceArr[30] = "㏑ ";
                document.querySelector("#scienceCal button:nth-of-type(1)").style.background = "transparent";
            }
            break;
        case val == "x²" || val == "1/x" || val == "|x|" || val == "√x" || val == "n!" || val == "10^x" || val == "ln" || val == "lg" || val == "±" || val == "x³" || val == "∛x" || val == "2^x" || val == "e^x":
            scienceOutput.value = calculateOneNum(scienceInput.value, val)[0];
            scienceInput.value = calculateOneNum(scienceInput.value, val)[1];
            break;
        case val == "+" || val == "-" || val == "×" || val == "÷" || val == "x^y" || val == "y√x":
            numStack.push(scienceInput.value);
            if (scienceOutput.value == "") {
                scienceOutput.value = scienceInput.value + val
            } else {
                scienceOutput.value += scienceInput.value + val
            }
            scienceInput.value = ""
            break;
        case val == "=":
            if (numStack.isEmpty() && opStack.isEmpty()) {
                scienceOutput.value = scienceInput.value + val
            } else if (!numStack.isEmpty()) {
                scienceOutput.value = scienceOutput.value + scienceInput.value + val
                scienceInput.value = operation(numStack.pop(), scienceInput.value, opStack.pop());

            }
            if (!numStack.isEmpty() && !opStack.isEmpty()) {

            }
            break;
    }
};

const calculateOneNum = (num, op) => {
    let res = 0;
    let formula = "";
    switch (op) {
        case "x²":
            res = Math.pow(num, 2);
            formula = `sqr(${num})`;
            break;
        case "1/x":
            res = 1 / num;
            formula = `1/(${num})`;
            break;
        case "|x|":
            res = Math.abs(num);
            formula = `abs(${num})`;
            break;
        case "√x":
            res = Math.sqrt(num);
            formula = `√(${num})`;
            break;
        case "n!":
            function factorial(number) {
                if (number <= 1) {
                    return 1;
                } else {
                    return number * factorial(number - 1);
                }
            }
            res = factorial(num);
            formula = `fact(${num})`;
            break;
        case "10^x":
            res = Math.pow(10, num);
            formula = `10^(${num})`;
            break;
        case "lg":
            res = Math.log10(num);
            formula = `lg(${num})`;
            break;
        case "ln":
            res = Math.log(num);
            formula = `ln(${num})`;
            break;
        case "±":
            res = -num;
            formula = `negate(${num})`;
            break;
        case "x³":
            res = Math.pow(num, 3);
            formula = `cube(${num})`;
            break;
        case "∛x":
            res = Math.cbrt(num);
            formula = `cuberoot(${num})`;
            break;
        case "2^x":
            res = Math.pow(2, num);
            formula = `2^(${num})`;
            break;
        case "e^x":
            res = Math.pow(Math.E, num);
            formula = `e^(${num})`;
            break;
    }
    return [formula, res];
};
const changeDate = () => {
    showDate.value = showDate.value == true ? false : true;
};
const switchChange = () => {
    switchBtn.value = switchBtn.value == "增加日期" ? "减少日期" : "增加日期";
};
onMounted(() => { });
</script>

<style scoped lang="scss" src="./index.scss"/>
