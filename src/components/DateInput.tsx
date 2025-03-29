
import { useState, useEffect } from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
  placeholder?: string;
  disableFuture?: boolean;
}

const DateInput = ({
  value,
  onChange,
  label,
  placeholder = "DD/MM/AAAA",
  disableFuture = false,
}: DateInputProps) => {
  const [inputValue, setInputValue] = useState<string>(
    value ? format(value, "dd/MM/yyyy") : ""
  );

  // Update input when value changes externally
  useEffect(() => {
    if (value) {
      setInputValue(format(value, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the date
    if (newValue.length === 10) { // DD/MM/YYYY format length
      const parsedDate = parse(newValue, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        onChange(parsedDate);
      }
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    onChange(date);
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
    }
  };

  return (
    <div className="flex">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="rounded-r-none"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="rounded-l-none border-l-0"
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleCalendarSelect}
            initialFocus
            className="pointer-events-auto"
            disabled={disableFuture ? (date) => date > new Date() : undefined}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateInput;
