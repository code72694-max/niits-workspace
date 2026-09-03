import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';
import { USERS_MAP } from '../data/mockData';

interface CalendarViewProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onOpenNewTask: () => void;
}

const DAYS_HEADER = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// Calendar matrix for September 2026 (starts on Tuesday 1st, ending Wednesday 30th)
const CALENDAR_WEEKS = [
  [31, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 1, 2, 3, 4]
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onOpenTask,
  onOpenNewTask
}) => {
  const MONTHS = ['Agustus 2026', 'September 2026', 'Oktober 2026'];
  const [monthIndex, setMonthIndex] = useState(1);
  const selectedMonth = MONTHS[monthIndex];

  // Helper to fetch tasks due on date
  const getTasksByDay = (day: number, isPrevMonth: boolean, isNextMonth: boolean) => {
    if (isPrevMonth || isNextMonth) return [];
    const monthNum = monthIndex === 0 ? '08' : monthIndex === 1 ? '09' : '10';
    const dateStr = `2026-${monthNum}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.due === dateStr);
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMonthIndex(prev => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg bg-white border border-[#E2EAF3] text-[#5B7288] hover:bg-[#F4F8FD] disabled:opacity-40 cursor-pointer"
            disabled={monthIndex === 0}
            title="Bulan sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-base font-bold text-[#0A2540] px-2 min-w-[140px] text-center">
            {selectedMonth}
          </h3>
          <button 
            onClick={() => setMonthIndex(prev => Math.min(MONTHS.length - 1, prev + 1))}
            className="p-1.5 rounded-lg bg-white border border-[#E2EAF3] text-[#5B7288] hover:bg-[#F4F8FD] disabled:opacity-40 cursor-pointer"
            disabled={monthIndex === MONTHS.length - 1}
            title="Bulan selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMonthIndex(1)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E2EAF3] text-[#1E6FD9] hover:bg-[#F4F8FD] cursor-pointer"
          >
            Hari Ini
          </button>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Jadwalkan Tugas</span>
        </button>
      </div>

      {/* Calendar Table Container */}
      <div className="bg-white border border-[#E2EAF3] rounded-2xl shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-[#E2EAF3] bg-[#F4F8FD]">
          {DAYS_HEADER.map((d, i) => (
            <div
              key={d}
              className={`py-2.5 text-center text-xs font-semibold tracking-wider ${
                i >= 5 ? 'text-[#C4562B]' : 'text-[#5B7288]'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="divide-y divide-[#EFF4F9]">
          {CALENDAR_WEEKS.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 divide-x divide-[#EFF4F9]">
              {week.map((dayNum, dayIdx) => {
                const isPrevMonth = weekIdx === 0 && dayIdx === 0;
                const isNextMonth = weekIdx === 4 && dayIdx > 2;
                const isToday = !isPrevMonth && !isNextMonth && dayNum === 1;
                const dayTasks = getTasksByDay(dayNum, isPrevMonth, isNextMonth);

                return (
                  <div
                    key={dayIdx}
                    className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between ${
                      isPrevMonth || isNextMonth ? 'bg-[#F4F8FD]/40 text-[#D7E6F5]' : 'hover:bg-[#F4F8FD]/30'
                    } ${isToday ? 'bg-[#E7F0FA]/30' : ''}`}
                  >
                    {/* Date Number */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isToday 
                          ? 'bg-[#1E6FD9] text-white font-bold shadow-xs' 
                          : isPrevMonth || isNextMonth ? 'text-[#5B7288]/40' : 'text-[#0A2540]'
                      }`}>
                        {dayNum}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-[10px] font-mono text-[#5B7288]">
                          {dayTasks.length} tugas
                        </span>
                      )}
                    </div>

                    {/* Task Chips in Date Cell */}
                    <div className="space-y-1 flex-1">
                      {dayTasks.slice(0, 3).map((t) => {
                        const user = USERS_MAP[t.assignee[0]];
                        return (
                          <div
                            key={t.id}
                            onClick={() => onOpenTask(t)}
                            className="p-1 rounded-md text-[10.5px] bg-[#E7F0FA] border border-[#D7E6F5] text-[#0A2540] truncate cursor-pointer hover:bg-[#D7E6F5] flex items-center justify-between gap-1 shadow-2xs group"
                          >
                            <span className="truncate font-medium group-hover:text-[#1E6FD9]">
                              {t.nama}
                            </span>
                            {user && (
                              <span
                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white font-bold shrink-0"
                                style={{ backgroundColor: user.warna }}
                              >
                                {user.inisial.slice(0, 1)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <div className="text-[10px] text-[#1E6FD9] font-medium text-center">
                          +{dayTasks.length - 3} lainnya
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
