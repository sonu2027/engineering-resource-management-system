import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={rest.name} className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <select
        ref={ref}
        {...rest}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt[0].toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
);

export default Select;