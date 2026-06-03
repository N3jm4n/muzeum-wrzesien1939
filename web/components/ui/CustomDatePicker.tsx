import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Holidays from 'date-holidays';

interface CustomDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    minDate?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, minDate }) => {
    const today = new Date();
    // Start view on the selected date or today
    const initialDate = value ? new Date(value) : today;
    const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0
    };

    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    const dayNames = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];

    const isDateDisabled = (date: Date) => {
        // 1. Blokowanie dat z przeszłości
        if (minDate) {
            const minDateObj = new Date(minDate);
            minDateObj.setHours(0, 0, 0, 0);
            if (date < minDateObj) return true;
        }

        // 2. Blokowanie poniedziałków (0 = Niedziela, 1 = Poniedziałek)
        if (date.getDay() === 1) return true;

        // 3. Blokowanie polskich świąt publicznych (tylko dni ustawowo wolne od pracy)
        const hd = new Holidays('PL');
        const holidays = hd.isHoliday(date);
        
        // date-holidays zwraca tablicę lub false. Blokujemy tylko jeśli istnieje chociaż jedno święto typu "public".
        // np. 12 czerwca to "observance" (święto zwyczajowe/narodowe, ale nie wolne), a 1 maja to "public" (wolne).
        if (holidays && (holidays as any[]).some(h => h.type === 'public')) {
            return true;
        }

        return false;
    };

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><ChevronLeft size={20} className="text-gray-600" /></button>
                <div className="font-bold text-lg text-gray-900 capitalize">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</div>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><ChevronRight size={20} className="text-gray-600" /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
                {dayNames.map(day => (
                    <div key={day} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} className="h-10 w-full" />;
                    
                    const dateStr = formatDate(date);
                    const isSelected = value === dateStr;
                    const disabled = isDateDisabled(date);
                    const isToday = formatDate(today) === dateStr;

                    return (
                        <button
                            key={i}
                            disabled={disabled}
                            onClick={() => onChange(dateStr)}
                            className={`h-10 w-full rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                                isSelected 
                                    ? 'bg-museum-red text-white shadow-lg shadow-red-200 font-bold scale-[1.05]' 
                                    : disabled 
                                        ? 'text-gray-300 bg-gray-50 cursor-not-allowed opacity-50 decoration-gray-300' 
                                        : 'text-gray-700 hover:bg-red-50 hover:text-museum-red cursor-pointer'
                            } ${isToday && !isSelected && !disabled ? 'border-2 border-museum-red/20 text-museum-red' : ''}`}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
