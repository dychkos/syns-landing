module.exports = {
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true,
	},
  globals: {
    '$': true,
    'Odometer': true,
    'TweenMax': true,
    'Elastic': true
  },
  "parserOptions": {
    "ecmaVersion": 8
  },
  "rules": {
    "no-debugger":"off"
  },
	extends: [
		"eslint:recommended",
	]}
