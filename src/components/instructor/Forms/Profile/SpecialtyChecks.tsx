import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { specialties } from "@/constants";
import { Controller, Control } from "react-hook-form";

interface Props {
  control: Control<any>;
  name: string;
  rules?: any;
}

export default function SpecialtyChecks({ control, name, rules }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={[]}
      render={({ field }) => {
        const selected: string[] = field.value || [];

        const toggle = (value: string) => {
          const exists = selected.includes(value);
          const updated = exists
            ? selected.filter((v) => v !== value)
            : [...selected, value];

          field.onChange(updated);
        };

        return (
          <div className="w-full">
            <div className="max-w-[600px]">
              <motion.div
                className="flex flex-wrap gap-3 overflow-visible"
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                }}
              >
                {specialties.map((sp) => {
                  const active = selected.includes(sp.value);

                  return (
                    <motion.button
                      type="button"
                      key={sp.id}
                      onClick={() => toggle(sp.value)}
                      layout
                      initial={false}
                      animate={{
                        backgroundColor: active ? "#72d0ba" : "rgba(0,0,0,0.5)",
                      }}
                      whileHover={{
                        backgroundColor: active
                          ? "#5fb39f"
                          : "rgba(39,39,42,0.8)",
                      }}
                      whileTap={{
                        backgroundColor: active
                          ? "#002525"
                          : "rgba(39,39,42,0.9)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                        backgroundColor: { duration: 0.1 },
                      }}
                      className={`
                        inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                        whitespace-nowrap overflow-hidden ring-1 ring-inset cursor-pointer
                        ${
                          active
                            ? "text-gray-800 ring-[hsla(0,0%,100%,0.12)]"
                            : "text-white ring-[hsla(0,0%,100%,0.06)]"
                        }
                      `}
                    >
                      <motion.div
                        className="relative flex items-center"
                        animate={{
                          width: active ? "auto" : "100%",
                          paddingRight: active ? "1.5rem" : "0",
                        }}
                        transition={{
                          ease: [0.175, 0.885, 0.32, 1.275],
                          duration: 0.3,
                        }}
                      >
                        <span>{sp.label}</span>

                        <AnimatePresence>
                          {active && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                mass: 0.5,
                              }}
                              className="absolute right-0"
                            >
                              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                <Check
                                  className="w-3 h-3 text-[#001105]"
                                  strokeWidth={1.5}
                                />
                              </div>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        );
      }}
    />
  );
}
