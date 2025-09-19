import { Input } from "@/components/ui/input";
import React from "react";

interface PaymentOption {
  id: string;
  label: string;
  icon: string;
  value: string;
  // opcional: campos adicionales
  fields?: { label: string; placeholder: string; name: string }[];
}

interface PaymentRadioProps {
  options?: PaymentOption[];
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const defaultPaymentOptions: PaymentOption[] = [
  {
    id: "mercado-pago",
    label: "Mercado Pago",
    value: "mercado-pago",
    icon: "/Svgs/mercado-pago-svg.svg",
    fields: [
      {
        label: "Alias de Mercado Pago",
        placeholder: "Ingrese su alias",
        name: "mercadoPagoUser",
      },
      {
        label: "CVU de Mercado Pago",
        placeholder: "Ingrese su CVU",
        name: "cvu",
      },
    ],
  },
  {
    id: "paypal",
    label: "PayPal",
    value: "paypal",
    icon: "/Svgs/paypal-svg.svg",
    fields: [
      {
        label: "Email de PayPal",
        placeholder: "Ingrese su email",
        name: "paypalEmail",
      },
    ],
  },
  {
    id: "credito-debito",
    label: "Crédito / Débito",
    value: "credito-debito",
    icon: "/Svgs/credit-cards-svg.svg",
    fields: [
      { label: "CBU / CVU", placeholder: "Ingrese su CBU/CVU", name: "cbu" },
      {
        label: "Alias de cuenta",
        placeholder: "Ingrese su alias",
        name: "alias",
      },
    ],
  },
];

interface RadioOptionProps {
  option: PaymentOption;
  name: string;
  isChecked: boolean;
  onChange: (value: string) => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  option,
  name,
  onChange,
}) => (
  <label
    className="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border p-3 transition-all duration-500 border-border hover:bg-slate-100 dark:hover:bg-slate-800 has-[:checked]:border-secondary has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-secondary-light has-[:checked]:font-semibold has-[:checked]:text-secondary dark:has-[:checked]:text-indigo-100"
    aria-label={`Select ${option.label} as payment method`}
  >
    <div className="relative flex items-center gap-3">
      <img src={option.icon} alt={option.label} height={35} width={35} />
      <span className="absolute left-11 whitespace-nowrap font-semibold opacity-0 transition-all duration-500 group-has-[:checked]:translate-x-0 group-has-[:checked]:opacity-100 translate-x-4">
        {option.label}
      </span>
    </div>

    <input
      type="radio"
      name={name}
      value={option.value}
      onChange={(e) => onChange(e.target.value)}
      className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-offset-0"
      aria-describedby={`${option.id}-description`}
    />

    <span id={`${option.id}-description`} className="sr-only">
      Pay with {option.label}
    </span>
  </label>
);

const PaymentRadio: React.FC<PaymentRadioProps> = ({
  options = defaultPaymentOptions,
  name = "payment",
  defaultValue,
  onChange,
  className = "",
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(
    defaultValue || ""
  );

  // Estado para almacenar todos los campos dinámicos
  const [fieldsState, setFieldsState] = React.useState<Record<string, string>>(
    {}
  );

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFieldsState((prev) => ({ ...prev, [name]: value }));
  };

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div className={`w-full max-w-sm ${className}`}>
      <div className="mb-4">
        <p className="text-md text-gray-500 mt-1">
          Seleccioná el método de pago por el cual querés recibir tu dinero
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="sr-only">Choose your payment method</legend>
        {options.map((option) => (
          <RadioOption
            key={option.id}
            option={option}
            name={name}
            isChecked={selectedValue === option.value}
            onChange={handleChange}
          />
        ))}
      </fieldset>

      {/* Campos dinámicos del método seleccionado */}
      {selectedOption?.fields && (
        <div className="mt-4 space-y-2">
          {selectedOption.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              <Input
                type="text"
                value={fieldsState[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentRadio;
