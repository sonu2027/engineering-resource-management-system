import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={rest.name} className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        ref={ref}
        {...rest}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
);

export default Input;
