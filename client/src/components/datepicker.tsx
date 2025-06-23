// components/ui/datepicker.tsx
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

// components/ui/datepicker.tsx
type DatePickerProps = {
  selected: Date | null;
  onChange: React.Dispatch<React.SetStateAction<Date | null>>;
};

export function DatePicker({ selected, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selected ?? undefined} onSelect={onChange} required />
      </PopoverContent>
    </Popover>
  );
}
