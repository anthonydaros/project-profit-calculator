
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  prefix?: string;
  className?: string;
}

const NumberInput = ({ label, value, onChange, readOnly = false, prefix, className }: NumberInputProps) => {
  return (
    <div className="relative w-full group">
      <Label 
        className={cn(
          "absolute left-3 transition-all duration-200 transform",
          value ? "-translate-y-6 scale-75" : "translate-y-2",
          "text-gray-500 pointer-events-none origin-left font-medium"
        )}
      >
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {prefix}
          </span>
        )}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-14 pt-4 w-full bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200",
            prefix && "pl-8",
            readOnly && "bg-gray-50 focus:ring-0",
            className
          )}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default NumberInput;
