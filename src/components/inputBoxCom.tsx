import React, { forwardRef } from "react";

interface InputBoxProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  type: React.HTMLInputTypeAttribute;
}

export const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
  ({ label, placeholder, value, onChange, onKeyDown, type }, ref) => {
    return (
      <div className="mt-8 h-full w-full">
        <div className="font-sans text-xs">{label}</div>
        <input
          ref={ref}
          className="mt-4 w-full border-[1px] border-neutral-700 px-4 py-2 text-sm font-light text-neutral-400 focus:border-[1px] focus:border-blue-300 focus:outline-none"
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
        />
      </div>
    );
  }
);

InputBox.displayName = "InputBox";
