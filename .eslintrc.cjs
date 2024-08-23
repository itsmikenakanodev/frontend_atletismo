/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Añade reglas personalizadas aquí
    'vue/no-reserved-component-names': 'off', // Desactiva la regla que requiere nombres de componentes multi palabras
    'vue/multi-word-component-names': 'off', // Desactiva la regla que requiere nombres de componentes multi palabras
    'no-console': 'off', // Permite el uso de console.log()
    'no-debugger': 'off', // Permite el uso de debugger
    'vue/no-unused-vars': 'warn', // Cambia la regla de errores por variables no utilizadas en Vue a advertencias
    'vue/require-default-prop': 'off', // Desactiva la regla que requiere prop default en Vue
    'vue/require-prop-types': 'off' // Desactiva la regla que requiere prop types en Vue
  }
}
