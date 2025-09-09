<template>
  <div class="converter">
    <label for="fromAmount">从 {{ currencyFrom }} 转换:</label>
    <input type="number" id="fromAmount" v-model.number="fromAmount" @input="updateToAmount" />
    <label for="toAmount">到 {{ currencyTo }} 结果:</label>
    <input type="number" id="toAmount" v-model.number="toAmount" @input="updateFromAmount" />
    <select id="currencyFrom" v-model="currencyFrom" @change="updateFromAmount">
      <option value="USD">美元 (USD)</option>
      <option value="EUR">欧元 (EUR)</option>
      <option value="CNY">人民币 (CNY)</option>
    </select>
    <label>至</label>
    <select id="currencyTo" v-model="currencyTo" @change="updateFromAmount">
      <option value="USD">美元 (USD)</option>
      <option value="EUR">欧元 (EUR)</option>
      <option value="CNY">人民币 (CNY)</option>
    </select>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue";

  const fromAmount = ref(0);
  const toAmount = ref(0);
  const currencyFrom = ref("USD");
  const currencyTo = ref("EUR");
  const exchangeRates = ref({
    "CNY":1,
    "USD":0.14,
    "EUR":0.13
  });

  // 根据当前汇率计算从货币到货币的转换金额
  const updateToAmount = () => {
    if (!isNaN(fromAmount.value) && exchangeRates.value.hasOwnProperty(currencyFrom.value) && exchangeRates.value.hasOwnProperty(currencyTo.value)) {
      toAmount.value = (fromAmount.value * exchangeRates.value[currencyTo.value] / exchangeRates.value[currencyFrom.value]).toFixed(4);
    } else {
      toAmount.value = '';
    }
  };

  // 根据当前汇率计算从货币到货币的转换金额
  const updateFromAmount = () => {
    if (!isNaN(toAmount.value) && exchangeRates.value.hasOwnProperty(currencyFrom.value) && exchangeRates.value.hasOwnProperty(currencyTo.value)) {
      fromAmount.value = (toAmount.value * exchangeRates.value[currencyFrom.value] / exchangeRates.value[currencyTo.value]).toFixed(4);
    } else {
      fromAmount.value = '';
    }
  };
</script>

<style scoped lang="scss" src="./index.scss" />