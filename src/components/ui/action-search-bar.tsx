import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Send } from "lucide-react";
import { Input } from "./input";
import { useNavigate } from "react-router-dom";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
  redirect?: string;
}

interface SearchResult {
  actions: Action[];
}

function ActionSearchBar({ actions: allActions }: { actions: Action[] }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 200);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFocused) {
      setResult(null);
      return;
    }

    if (!debouncedQuery) {
      setResult({ actions: allActions });
      return;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const filteredActions = allActions.filter((action) => {
      const searchableText = action.label.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    setResult({ actions: filteredActions });
  }, [debouncedQuery, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: {
          duration: 0.4,
        },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/buscar?search=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-background z-10">
      <div className="relative">
        {/* Input */}
        <Input
          type="text"
          placeholder="¿Qué buscas?"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
          <AnimatePresence mode="popLayout">
            {query.length > 0 ? (
              <motion.div
                key="send"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isFocused && result && (
            <motion.div
              className="absolute top-full left-0 mt-1 w-[380px]
                     border rounded-md shadow-sm overflow-hidden
                     border-border bg-white dark:bg-black z-50"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.ul>
                {result.actions.map((action) => (
                  <motion.li
                    key={action.id}
                    className="px-3 py-2 flex items-center justify-between
                           hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md"
                    variants={item}
                    layout
                    onClick={() => {
                      if (action.redirect) {
                        navigate(action.redirect);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{action.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {action.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {action.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {action.short}
                      </span>
                      <span className="text-xs text-gray-400">
                        {action.end}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                <div className="text-xs text-gray-500">
                  <span>Preciona enter para comenzar tu búsqueda</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { ActionSearchBar };
