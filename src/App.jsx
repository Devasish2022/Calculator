import { useEffect, useState, useCallback } from "react";
import calculateExpression from "./Math.jsx";
import HistoryModal from "./HistoryModal.jsx";
import { History, Delete, X, Trash2, RotateCcw } from "lucide-react";

const OPERATORS = new Set(["+", "-", "*", "/", "%"]);

const App = () => {
  const [input, setInput] = useState("");
  const [previous, setPrevious] = useState("");
  const [justCalculated, setJustCalculated] = useState(false);

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const lastChar = useCallback((str) => (str.length ? str[str.length - 1] : ""), []);

  // ✅ find current number segment (for dot validation)
  const getCurrentNumberSegment = useCallback((expr) => {
    let i = expr.length - 1;
    while (i >= 0 && !OPERATORS.has(expr[i]) && expr[i] !== "(" && expr[i] !== ")") {
      i--;
    }
    return expr.slice(i + 1);
  }, []);

  // ✅ Load history only once
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("calcHistory")) || [];
    setHistory(saved);
  }, []);

  // ✅ Save history whenever changed (limit to last 50)
  useEffect(() => {
    const limited = history.slice(0, 50);
    localStorage.setItem("calcHistory", JSON.stringify(limited));
    if (limited.length !== history.length) setHistory(limited);
  }, [history]);

  const handleClear = useCallback(() => {
    setInput("");
    setPrevious("");
    setJustCalculated(false);
  }, []);

  const handleDelete = useCallback(() => {
    setInput((prev) => {
      if (prev === "Error") return "";
      return prev.slice(0, -1);
    });
    setJustCalculated(false);
  }, []);

  const handleClick = useCallback(
    (value) => {
      setInput((prevInput) => {
        // if error, reset
        if (prevInput === "Error") {
          setPrevious("");
          setJustCalculated(false);
          return value;
        }

        // after calc: typing number/dot should start new
        if (
          justCalculated &&
          ((value >= "0" && value <= "9") || value === ".")
        ) {
          setPrevious("");
          setJustCalculated(false);
          return value === "." ? "0." : value;
        }

        // prevent multiple dots per number segment
        if (value === ".") {
          const segment = getCurrentNumberSegment(prevInput);

          if (segment.includes(".")) return prevInput;

          const last = lastChar(prevInput);
          if (prevInput === "" || OPERATORS.has(last) || last === "(") {
            setJustCalculated(false);
            return prevInput + "0.";
          }
        }

        // operator replace
        if (OPERATORS.has(value)) {
          if (prevInput === "") {
            if (value === "-") return "-";
            return "";
          }

          const last = lastChar(prevInput);
          if (OPERATORS.has(last)) {
            setJustCalculated(false);
            return prevInput.slice(0, -1) + value;
          }
        }

        setJustCalculated(false);
        return prevInput + value;
      });
    },
    [getCurrentNumberSegment, justCalculated, lastChar]
  );

  const handleBracket = useCallback(() => {
    setInput((prevInput) => {
      if (prevInput === "Error") {
        setPrevious("");
        setJustCalculated(false);
        return "(";
      }

      const open = (prevInput.match(/\(/g) || []).length;
      const close = (prevInput.match(/\)/g) || []).length;
      const last = lastChar(prevInput);

      setJustCalculated(false);

      if (prevInput === "" || OPERATORS.has(last) || last === "(") return prevInput + "(";
      if (open > close) return prevInput + ")";
      return prevInput + "(";
    });
  }, [lastChar]);

  const handleCalculate = useCallback(() => {
    try {
      if (!input) return;

      const result = calculateExpression(input);

      setPrevious(input + " =");
      setInput(result);
      setJustCalculated(true);

      setHistory((prev) => [
        { expression: input, result, time: Date.now() },
        ...prev,
      ]);
    } catch {
      setPrevious(input + " =");
      setInput("Error");
      setJustCalculated(true);
    }
  }, [input]);

  const useHistoryExpression = useCallback((expr) => {
    setInput(expr);
    setPrevious("");
    setJustCalculated(false);
    setShowHistory(false);
  }, []);

  const useHistoryResult = useCallback((res) => {
    setInput(res);
    setPrevious("");
    setJustCalculated(true);
    setShowHistory(false);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("calcHistory");
  }, []);

  // ✅ Keyboard listener only once
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (key >= "0" && key <= "9") return handleClick(key);
      if (key === ".") return handleClick(".");
      if (OPERATORS.has(key)) return handleClick(key);

      if (key === "(" || key === ")") return handleClick(key);

      if (key === "Enter" || key === "=") {
        e.preventDefault();
        return handleCalculate();
      }

      if (key === "Backspace") return handleDelete();
      if (key === "Escape") return handleClear();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClick, handleCalculate, handleDelete, handleClear]);

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <button
            className="history-btn"
            onClick={() => setShowHistory(true)}
            title="History"
          >
            <History size={24} />
          </button>

          <div className="prev-display">{previous}</div>
          <div className="main-display">{input || "0"}</div>
        </div>

        <div className="buttons">
          <button className="btn control ac" onClick={handleClear} title="Clear">
            <RotateCcw size={22} />
          </button>

          <button className="btn operator" onClick={handleBracket}>
            ( )
          </button>

          <button className="btn operator" onClick={() => handleClick("%")}>
            %
          </button>

          <button className="btn operator" onClick={() => handleClick("/")}>
            ÷
          </button>

          <button className="btn" onClick={() => handleClick("7")}>7</button>
          <button className="btn" onClick={() => handleClick("8")}>8</button>
          <button className="btn" onClick={() => handleClick("9")}>9</button>
          <button className="btn operator" onClick={() => handleClick("*")}>×</button>

          <button className="btn" onClick={() => handleClick("4")}>4</button>
          <button className="btn" onClick={() => handleClick("5")}>5</button>
          <button className="btn" onClick={() => handleClick("6")}>6</button>
          <button className="btn operator" onClick={() => handleClick("-")}>−</button>

          <button className="btn" onClick={() => handleClick("1")}>1</button>
          <button className="btn" onClick={() => handleClick("2")}>2</button>
          <button className="btn" onClick={() => handleClick("3")}>3</button>
          <button className="btn operator" onClick={() => handleClick("+")}>+</button>

          <button className="btn" onClick={() => handleClick("0")}>0</button>
          <button className="btn" onClick={() => handleClick(".")}>.</button>

          <button className="btn control del" onClick={handleDelete} title="Delete">
            <Delete size={22} />
          </button>

          <button className="btn equals" onClick={handleCalculate}>=</button>
        </div>
      </div>

      <HistoryModal
        show={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClearHistory={clearHistory}
        onUseExpression={useHistoryExpression}
        onUseResult={useHistoryResult}
      />

    </div>
  );
};

export default App;
