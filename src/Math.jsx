// Tokenize string into numbers/operators
const tokenize = (expr) => {
    const tokens = [];
    let num = "";

    for (let i = 0; i < expr.length; i++) {
        const ch = expr[i];

        if (ch === " ") continue;

        // number or decimal part
        if (!isNaN(ch) || ch === ".") {
            num += ch;
            continue;
        }

        // unary minus handling (ex: -5 or 3*-2)
        if (
            ch === "-" &&
            (i === 0 || "+-*/%(".includes(expr[i - 1]))
        ) {
            num += ch;
            continue;
        }

        // if operator or parenthesis
        if ("+-*/%()".includes(ch)) {
            if (num !== "") {
                tokens.push(num);
                num = "";
            }
            tokens.push(ch);
        }
    }

    if (num !== "") tokens.push(num);

    return tokens;
};

// Convert infix to postfix using Shunting Yard Algorithm
const toPostfix = (tokens) => {
    const output = [];
    const stack = [];

    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "%": 2,
    };

    for (const token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            stack.pop(); // remove "("
        } else if ("+-*/%".includes(token)) {
            while (
                stack.length &&
                "+-*/%".includes(stack[stack.length - 1]) &&
                precedence[stack[stack.length - 1]] >= precedence[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length) output.push(stack.pop());

    return output;
};

// Evaluate postfix expression
const evalPostfix = (postfix) => {
    const stack = [];

    for (const token of postfix) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            const b = stack.pop();
            const a = stack.pop();

            if (a === undefined || b === undefined) throw new Error("Invalid Expression");

            let res = 0;

            switch (token) {
                case "+":
                    res = a + b;
                    break;
                case "-":
                    res = a - b;
                    break;
                case "*":
                    res = a * b;
                    break;
                case "/":
                    if (b === 0) throw new Error("Divide by 0");
                    res = a / b;
                    break;
                case "%":
                    if (b === 0) throw new Error("Divide by 0");
                    res = a % b;
                    break;
                default:
                    throw new Error("Unknown Operator");
            }

            stack.push(res);
        }
    }

    if (stack.length !== 1) throw new Error("Invalid Expression");

    return stack[0];
};


const Calculate = (expression) => {
    const tokens = tokenize(expression);
    const postfix = toPostfix(tokens);
    const result = evalPostfix(postfix);

    // remove floating errors like 0.30000000004
    return parseFloat(result.toFixed(10)).toString();
}

export default Calculate