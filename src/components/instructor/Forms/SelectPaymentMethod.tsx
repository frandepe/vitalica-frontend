import { Input } from "@/components/ui/input";
import { Controller, Control } from "react-hook-form";

interface PaymentOption {
  id: string;
  label: string;
  icon: string;
  value: string;
  fields?: { label: string; placeholder: string; name: string }[];
}

interface PaymentRadioProps {
  control: Control<any>;
  name: string;
  options?: PaymentOption[];
  className?: string;
  rules?: any;
}

const defaultPaymentOptions: PaymentOption[] = [
  {
    id: "mercado-pago",
    label: "Mercado Pago",
    value: "MERCADO_PAGO",
    icon: "/Svgs/mercado-pago-svg.svg",
    fields: [
      {
        label: "Alias de Mercado Pago",
        placeholder: "Ingrese su alias",
        name: "mpAlias",
      },
      {
        label: "CVU de Mercado Pago",
        placeholder: "Ingrese su CVU",
        name: "mpCVU",
      },
    ],
  },
  {
    id: "paypal",
    label: "PayPal",
    value: "PAYPAL",
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
    value: "BANK_TRANSFER",
    icon: "/Svgs/credit-cards-svg.svg",
    fields: [
      {
        label: "CBU / CVU",
        placeholder: "Ingrese su CBU/CVU",
        name: "bankCBU",
      },
      {
        label: "Alias de cuenta",
        placeholder: "Ingrese su alias",
        name: "bankAlias",
      },
    ],
  },
];

interface RadioOptionProps {
  option: PaymentOption;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
}

const RadioOption = ({ option, name, checked, onChange }: RadioOptionProps) => (
  <label className="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border p-3 transition-all duration-500 border-border hover:bg-slate-100 dark:hover:bg-slate-800 has-[:checked]:border-secondary has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-secondary-light has-[:checked]:font-semibold has-[:checked]:text-secondary dark:has-[:checked]:text-indigo-100">
    <div className="relative flex items-center gap-3">
      <img src={option.icon} alt={option.label} height={35} width={35} />
      <span className="absolute left-11 whitespace-nowrap font-semibold transition-all duration-500">
        {option.label}
      </span>
    </div>

    <input
      type="radio"
      name={name}
      value={option.value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
      className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-offset-0"
    />
  </label>
);

const PaymentRadio = ({
  control,
  name,
  options = defaultPaymentOptions,
  className,
  rules,
}: PaymentRadioProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue=""
      render={({ field }) => {
        const selectedValue = field.value;
        const selectedOption = options.find((o) => o.value === selectedValue);

        return (
          <div className={`w-full max-w-sm ${className}`}>
            <div className="mb-4">
              <p className="text-md text-gray-500 mt-1">
                Seleccioná el método de pago por el cual querés recibir tu
                dinero
              </p>
            </div>

            <fieldset className="space-y-2">
              <legend className="sr-only">Método de pago</legend>

              {options.map((option) => (
                <RadioOption
                  key={option.id}
                  option={option}
                  name={name}
                  checked={selectedValue === option.value}
                  onChange={(val) => field.onChange(val)}
                />
              ))}
            </fieldset>

            {selectedOption?.fields && (
              <div className="mt-4 space-y-2">
                {selectedOption.fields.map((f) => (
                  <Controller
                    key={f.name}
                    control={control}
                    name={f.name}
                    defaultValue=""
                    render={({ field: fieldInput }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {f.label}
                        </label>
                        <Input
                          type="text"
                          placeholder={f.placeholder}
                          {...fieldInput}
                        />
                      </div>
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default PaymentRadio;
