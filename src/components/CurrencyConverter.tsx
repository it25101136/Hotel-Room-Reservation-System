import { useState } from "react";
import { useToast } from "./Toast";

const currencies = [
  { code: "LKR", name: "Sri Lankan Rupee", rate: 1, symbol: "Rs." },
  { code: "USD", name: "US Dollar", rate: 0.0032, symbol: "$" },
  { code: "EUR", name: "Euro", rate: 0.003, symbol: "€" },
  { code: "GBP", name: "British Pound", rate: 0.0025, symbol: "£" },
  { code: "AUD", name: "Australian Dollar", rate: 0.0051, symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", rate: 0.0044, symbol: "C$" },
  { code: "SGD", name: "Singapore Dollar", rate: 0.0043, symbol: "S$" },
  { code: "AED", name: "UAE Dirham", rate: 0.0118, symbol: "د.إ" },
  { code: "CNY", name: "Chinese Yuan", rate: 0.023, symbol: "¥" },
  { code: "JPY", name: "Japanese Yen", rate: 0.48, symbol: "¥" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("450000");
  const [fromCurrency, setFromCurrency] = useState("LKR");
  const [toCurrency, setToCurrency] = useState("USD");
  const { addToast } = useToast();

  const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;
  const convertedAmount = (parseFloat(amount) * (toRate / fromRate)).toFixed(2);

  const handleConvert = () => {
    addToast(`Converted: ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`, "info");
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="group bg-dark-400 border border-gold-500/30 rounded-sm p-6 hover:border-gold-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/10">
      <h3 className="font-display text-xl text-white font-bold mb-4 group-hover:text-gold-400 transition-colors duration-300">Currency Converter</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 group-hover:text-gold-400 transition-colors duration-300">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-dark-300 border border-gray-700 px-4 py-3 text-white focus:border-gold-500 outline-none text-sm transition-all duration-300 focus:shadow-lg focus:shadow-gold-500/20"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-dark-300 border border-gray-700 px-4 py-3 text-white focus:border-gold-500 outline-none text-sm cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleSwap}
            className="group w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-black transition-all duration-300 hover:scale-110"
            aria-label="Swap currencies"
          >
            <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4" />
            </svg>
          </button>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full bg-dark-300 border border-gray-700 px-4 py-3 text-white focus:border-gold-500 outline-none text-sm cursor-pointer"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          className="group relative overflow-hidden w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 btn-shine"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Convert
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </span>
        </button>

        <div className="bg-dark-300 border border-gold-500/20 rounded-sm p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Result</div>
          <div className="font-display text-2xl font-bold text-gold-400">
            {convertedAmount} {toCurrency}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            1 {fromCurrency} = {(toRate / fromRate).toFixed(6)} {toCurrency}
          </div>
        </div>
      </div>
    </div>
  );
}
