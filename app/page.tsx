"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import * as chrono from "chrono-node";
import styles from "./page.module.css";
import { IMPORTANT_DATES, ImportantDateEvent } from "../constants/important-dates";

// SVG Icons
const Icons = {
  Account: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Stats: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  LightMode: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  DarkMode: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Todolist: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Tag: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Gift: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v14m0-14L4 7m8 4L4 7m0 0v10l8 4" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  GripVertical: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="9" cy="6" r="1.2" fill="currentColor" />
      <circle cx="15" cy="6" r="1.2" fill="currentColor" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" />
      <circle cx="9" cy="18" r="1.2" fill="currentColor" />
      <circle cx="15" cy="18" r="1.2" fill="currentColor" />
    </svg>
  ),
  Book: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Trash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
};

// Task type
interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string | null; // ISO date string "YYYY-MM-DD" or null
  dueTime: string | null; // "HH:MM" or null
  createdAt: number;
}

interface Shift {
  id: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  participants: string[];
  description?: string;
  status: 'active' | 'suspended';
  dayIndex: number;
  pointIndex: number;
}

const PUBLIC_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const PUBLIC_POINTS = ["Lopez", "Pari", "Velez", "Gutierres"];

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function CalendarPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthAnimKey, setMonthAnimKey] = useState(0);
  const [monthAnimDir, setMonthAnimDir] = useState<"up" | "down">("up");
  const [yearAnimKey, setYearAnimKey] = useState(0);
  const [yearAnimDir, setYearAnimDir] = useState<"next" | "prev">("next");
  const [pointAnimKey, setPointAnimKey] = useState(0);
  const [pointAnimDir, setPointAnimDir] = useState<"next" | "prev">("next");
  const [searchedDate, setSearchedDate] = useState<{ day: number, month: number, year: number } | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"calendar" | "users">("users");
  const [isMobile, setIsMobile] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'anniversaries' | 'tasks' | 'public'>('anniversaries');
  const [taskMatchIds, setTaskMatchIds] = useState<string[]>([]);

  // Public mode state
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [newShiftStartTime, setNewShiftStartTime] = useState("08:00");
  const [newShiftEndTime, setNewShiftEndTime] = useState("09:00");
  const [newShiftParticipants, setNewShiftParticipants] = useState<string[]>([]);
  const [newShiftDescription, setNewShiftDescription] = useState("");
  const [participantInput, setParticipantInput] = useState("");
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [confirmDeleteShiftId, setConfirmDeleteShiftId] = useState<string | null>(null);
  const scrollAccumulator = useRef(0);
  const updatingFromScrollRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tasks state
  const [isTasksPanelOpen, setIsTasksPanelOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null); // "month-day"
  // Edit task state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskDate, setEditTaskDate] = useState("");
  const [editTaskTime, setEditTaskTime] = useState("");
  // Day filter: when non-null, panel shows only tasks for this ISO date
  const [filteredDay, setFilteredDay] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksRes, shiftsRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/shifts')
        ]);
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (shiftsRes.ok) setShifts(await shiftsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);
  // Handle mobile scroll snapping / selection
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    const onMonthScroll = () => {
      // Skip if this is a programmatic scroll (e.g. triggered by clicking an item)
      if (isProgrammaticScrollRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = monthScrollRef.current;
          if (!container) {
            ticking = false;
            return;
          }
          // Double check after rAF since programmatic scroll may have just started
          if (isProgrammaticScrollRef.current) {
            ticking = false;
            return;
          }
          const items = container.querySelectorAll(`.${styles.monthItem}`);
          const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

          let closestIndex = 0;
          let minDistance = Infinity;

          items.forEach((item, idx) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const distance = Math.abs(containerCenter - itemCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = idx;
            }
          });

          if (calendarMode === 'public') {
            if (selectedDayIndex !== closestIndex) {
              updatingFromScrollRef.current = true;
              setSelectedDayIndex(closestIndex);
            }
          } else {
            if (selectedMonth !== closestIndex) {
              updatingFromScrollRef.current = true;
              setSelectedMonth(closestIndex);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const monthEl = monthScrollRef.current;
    monthEl?.addEventListener('scroll', onMonthScroll, { passive: true });
    return () => monthEl?.removeEventListener('scroll', onMonthScroll);
  }, [isMobile, calendarMode, selectedMonth, selectedDayIndex]);

  // Sync scroll position when selection changes via other means (e.g. clicking)
  useEffect(() => {
    if (!isMobile || !monthScrollRef.current) return;

    if (updatingFromScrollRef.current) {
      updatingFromScrollRef.current = false;
      return;
    }

    const container = monthScrollRef.current;

    // Use a small timeout to avoid layout thrashing during mount or view changes
    const timer = setTimeout(() => {
      const activeItem = container.querySelector(`.${styles.active}`) as HTMLElement;
      if (activeItem) {
        // Mark as programmatic so the scroll listener ignores events during this animation
        isProgrammaticScrollRef.current = true;
        if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current);

        const scrollLeft = activeItem.offsetLeft - container.offsetWidth / 2 + activeItem.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });

        // Clear the flag after the smooth scroll animation completes (~400ms)
        programmaticScrollTimer.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 450);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedMonth, selectedDayIndex, isMobile, calendarMode]);



  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  // Theme configurations for each month
  const monthThemes = [
    { hue: 0, sat: 0, lit: 45 },    // Jan (Soft Gray)
    { hue: 185, sat: 40, lit: 50 }, // Feb (Soft Light Cyan)
    { hue: 45, sat: 45, lit: 45 },  // Mar (Soft Mustard)
    { hue: 215, sat: 40, lit: 50 }, // Apr (Soft Blue)
    { hue: 50, sat: 60, lit: 55 },  // May (Soft Yellow)
    { hue: 230, sat: 35, lit: 40 }, // Jun (Soft Dark Blue)
    { hue: 200, sat: 45, lit: 55 }, // Jul (Soft Light Blue)
    { hue: 25, sat: 30, lit: 45 },  // Aug (Soft Brown)
    { hue: 90, sat: 35, lit: 50 },  // Sep (Soft Lime)
    { hue: 30, sat: 50, lit: 45 },  // Oct (Soft Dark Orange)
    { hue: 275, sat: 35, lit: 55 }, // Nov (Is fine as it is now - Violet)
    { hue: 195, sat: 20, lit: 60 }  // Dec (Soft Ice-ish color)
  ];

  const { hue, sat, lit } = monthThemes[selectedMonth];
  const isDark = mounted && theme === 'dark';

  const themeStyles = useMemo(() => ({
    '--accent': isDark
      ? `hsl(${hue}, ${sat + 10}%, ${lit + 20}%)`
      : `hsl(${hue}, ${sat}%, ${lit}%)`,
    '--accent-light': isDark
      ? `hsla(${hue}, ${sat + 10}%, ${lit + 20}%, 0.15)`
      : `hsla(${hue}, ${sat}%, ${lit}%, 0.1)`,
    '--accent-dark': isDark
      ? `hsl(${hue}, ${sat + 10}%, 25%)`
      : `hsl(${hue}, ${sat}%, 40%)`,
    '--accent-pill': isDark
      ? `hsla(${hue}, ${sat + 10}%, ${lit + 20}%, 0.2)`
      : `hsla(${hue}, ${sat}%, ${lit}%, 0.15)`,
  }), [hue, sat, lit, isDark]) as React.CSSProperties;

  // Windowed months/days offsets: current ± 2
  const windowOffsets = [-2, -1, 0, 1, 2];

  // Refs for mobile scroll tracking
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);

  function getMonthLabel(offset: number) {
    let m = selectedMonth + offset;
    if (m < 0) m += 12;
    if (m > 11) m -= 12;
    return months[m];
  }

  function navigateMonth(offset: number) {
    if (offset === 0) return;
    setMonthAnimDir(offset > 0 ? "up" : "down");
    setMonthAnimKey(k => k + 1);

    let newMonth = selectedMonth + offset;
    let newYear = selectedYear;

    while (newMonth < 0) {
      newMonth += 12;
      newYear -= 1;
    }
    while (newMonth > 11) {
      newMonth -= 12;
      newYear += 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  }

  function getDayLabel(offset: number) {
    let d = selectedDayIndex + offset;
    while (d < 0) d += 7;
    while (d > 6) d -= 7;
    return PUBLIC_DAYS[d];
  }

  function navigateDay(offset: number) {
    if (offset === 0) return;
    setMonthAnimDir(offset > 0 ? "up" : "down");
    setMonthAnimKey(k => k + 1);

    let newDay = selectedDayIndex + offset;
    while (newDay < 0) newDay += 7;
    while (newDay > 6) newDay -= 7;
    setSelectedDayIndex(newDay);
  }

  function navigateYear(offset: number) {
    if (offset === 0) return;
    setYearAnimDir(offset > 0 ? "next" : "prev");
    setYearAnimKey(k => k + 1);
    setMonthAnimDir(offset > 0 ? "up" : "down");
    setMonthAnimKey(k => k + 1);
    setSelectedYear(y => y + offset);
  }

  function handleSearch() {
    const query = inputValue.trim().toLowerCase();
    if (!query) return;

    // 1. Try name-based lookup in IMPORTANT_DATES
    let foundDateKey = null;
    let foundDay = null;

    for (const [dateKey, events] of Object.entries(IMPORTANT_DATES)) {
      const hasMatch = events.some(event =>
        event.names.some(name => name.toLowerCase().includes(query))
      );
      if (hasMatch) {
        foundDateKey = dateKey;
        foundDay = parseInt(dateKey.split('-')[1]);
        break;
      }
    }

    if (foundDateKey) {
      const [mStr, dStr] = foundDateKey.split('-');
      const targetMonth = parseInt(mStr);
      const targetDay = parseInt(dStr);
      const targetYear = selectedYear;

      // Navigate to month if different
      const currentAbsolute = selectedYear * 12 + selectedMonth;
      const targetAbsolute = targetYear * 12 + targetMonth;

      if (targetAbsolute !== currentAbsolute) {
        setMonthAnimDir(targetAbsolute > currentAbsolute ? "up" : "down");
        setMonthAnimKey(k => k + 1);
        setSelectedMonth(targetMonth);
      }

      setSearchedDate({ day: targetDay, month: targetMonth, year: targetYear });
      setSelectedEventDate(foundDateKey);
      setIsTasksPanelOpen(false); // Mutual exclusion: close tasks panel
      setLastSearchQuery(query);
      setInputValue("");
      return;
    }

    // ---- TASKS MODE: search within task text ----
    if (calendarMode === 'tasks') {
      const matches = tasks.filter(t => t.text.toLowerCase().includes(query));
      setTaskMatchIds(matches.map(t => t.id));
      setIsTasksPanelOpen(true);
      setInputValue('');
      // Navigate to the earliest matching task's due date if any
      const withDate = matches.find(t => t.dueDate);
      if (withDate && withDate.dueDate) {
        const [y, m, d] = withDate.dueDate.split('-').map(Number);
        const targetMonth = m - 1;
        const targetYear = y;
        const currentAbsolute = selectedYear * 12 + selectedMonth;
        const targetAbsolute = targetYear * 12 + targetMonth;
        if (targetAbsolute !== currentAbsolute) {
          setMonthAnimDir(targetAbsolute > currentAbsolute ? 'up' : 'down');
          setMonthAnimKey(k => k + 1);
          setSelectedMonth(targetMonth);
          setSelectedYear(targetYear);
        }
        setSearchedDate({ day: d, month: targetMonth, year: targetYear });
      }
      return;
    }

    // 2. Fallback to chrono-node for date parsing
    const parsedParts = chrono.parse(inputValue);
    if (parsedParts.length > 0) {
      const parsedDate = parsedParts[0].start.date();
      const targetYear = parsedDate.getFullYear();
      const targetMonth = parsedDate.getMonth();

      let yearChanged = false;
      if (targetYear !== selectedYear) {
        setYearAnimDir(targetYear > selectedYear ? "next" : "prev");
        setYearAnimKey(k => k + 1);
        setSelectedYear(targetYear);
        yearChanged = true;
      }

      if (targetMonth !== selectedMonth || yearChanged) {
        const currentAbsolute = selectedYear * 12 + selectedMonth;
        const targetAbsolute = targetYear * 12 + targetMonth;
        if (targetAbsolute !== currentAbsolute) {
          setMonthAnimDir(targetAbsolute > currentAbsolute ? "up" : "down");
          setMonthAnimKey(k => k + 1);
          setSelectedMonth(targetMonth);
        }
      }

      setInputValue("");
      setSearchedDate({ day: parsedDate.getDate(), month: targetMonth, year: targetYear });
      setLastSearchQuery(""); // Clear highlight for standard date searches
    } else {
      // Could add a shake animation or visual error here, but for now just clear or do nothing
    }
  }

  function toggleSidebar() {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }

  function handleDayClick(day: number, month: number, year: number, isCurrentMonth: boolean) {
    if (!isCurrentMonth) {
      const currentAbsolute = selectedYear * 12 + selectedMonth;
      const targetAbsolute = year * 12 + month;
      navigateMonth(targetAbsolute - currentAbsolute);
      return;
    }

    // Tasks mode: clicking a day with tasks opens the task panel filtered to that day
    if (calendarMode === 'tasks') {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasTasks = tasks.some(t => t.dueDate === iso);
      if (hasTasks) {
        openTasksPanel(iso);
      }
      return;
    }

    // Anniversaries mode: existing behaviour
    const dateKey = `${month}-${day}`;
    if (IMPORTANT_DATES[dateKey]) {
      setSelectedEventDate(dateKey);
      setIsTasksPanelOpen(false); // Mutual exclusion: close tasks panel
    } else {
      setSelectedEventDate(null);
    }
    setLastSearchQuery("");
  }

  const selectedEvents = selectedEventDate ? IMPORTANT_DATES[selectedEventDate] : null;
  const eventDateParsed = useMemo(() => {
    if (!selectedEventDate) return null;
    const [mStr, dStr] = selectedEventDate.split('-');
    return { month: parseInt(mStr), day: parseInt(dStr) };
  }, [selectedEventDate]);

  // Memoized calendar grid items
  const calendarGridItems = useMemo(() => {
    const gridDays = [];
    const prevMonthLastDay = new Date(selectedYear, selectedMonth, 0).getDate();

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      gridDays.push({
        day: prevMonthLastDay - i,
        month: selectedMonth === 0 ? 11 : selectedMonth - 1,
        year: selectedMonth === 0 ? selectedYear - 1 : selectedYear,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      gridDays.push({
        day: i,
        month: selectedMonth,
        year: selectedYear,
        isCurrentMonth: true
      });
    }

    // Next month padding
    const remaining = 42 - gridDays.length;
    for (let i = 1; i <= remaining; i++) {
      gridDays.push({
        day: i,
        month: selectedMonth === 11 ? 0 : selectedMonth + 1,
        year: selectedMonth === 11 ? selectedYear + 1 : selectedYear,
        isCurrentMonth: false
      });
    }

    return gridDays;
  }, [selectedYear, selectedMonth, daysInMonth, firstDayOfMonth]);
  const monthOpacity: Record<number, number> = { [-2]: 0.2, [-1]: 0.5, [0]: 1, [1]: 0.5, [2]: 0.2 };

  // Prevent hydration mismatch for theme buttons
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- Task helpers ----
  function openTasksPanel(dayIso?: string) {
    // Close event sidebar if open
    setSelectedEventDate(null);
    setFilteredDay(dayIso ?? null);
    setEditingTaskId(null);
    setIsTasksPanelOpen(true);
  }

  function closeTasksPanel() {
    setIsTasksPanelOpen(false);
    setIsAddingTask(false);
    setNewTaskText("");
    setNewTaskDate("");
    setNewTaskTime("");
    setTaskMatchIds([]); // Clear search highlights
    setFilteredDay(null);
    setEditingTaskId(null);
  }

  function startEditTask(task: Task) {
    setEditingTaskId(task.id);
    setEditTaskDate(task.dueDate ?? "");
    setEditTaskTime(task.dueTime ?? "");
  }

  function saveTaskEdit(id: string) {
    const newDate = editTaskDate || null;
    const newTime = editTaskTime || null;
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, dueDate: newDate, dueTime: newTime }
          : t
      )
    );
    setEditingTaskId(null);
    fetch('/api/tasks', { method: 'PUT', body: JSON.stringify({ id, dueDate: newDate, dueTime: newTime }) }).catch(console.error);
  }

  function cancelTaskEdit() {
    setEditingTaskId(null);
  }

  function addTask() {
    if (!newTaskText.trim()) return;
    // eslint-disable-next-line
    const task: Task = {
      // eslint-disable-next-line
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      dueDate: newTaskDate || null,
      dueTime: newTaskTime || null,
      // eslint-disable-next-line
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
    setNewTaskText("");
    setNewTaskDate("");
    setNewTaskTime("");
    setIsAddingTask(false);
    fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) }).catch(console.error);
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const task = tasks.find(t => t.id === id);
    if (task) {
      fetch('/api/tasks', { method: 'PUT', body: JSON.stringify({ id, completed: !task.completed }) }).catch(console.error);
    }
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
    fetch(`/api/tasks?id=${id}`, { method: 'DELETE' }).catch(console.error);
  }

  // Drag-and-drop: assign due date from calendar
  function handleDragStart(taskId: string, e: React.DragEvent) {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedTaskId(null);
    setDragOverDay(null);
  }

  function handleDayDragOver(dayKey: string, e: React.DragEvent) {
    if (!draggedTaskId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDay(dayKey);
  }

  function handleDayDragLeave() {
    setDragOverDay(null);
  }

  function handleDayDrop(day: number, month: number, year: number, e: React.DragEvent) {
    e.preventDefault();
    if (!draggedTaskId) return;
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, dueDate: iso } : t));
    fetch('/api/tasks', { method: 'PUT', body: JSON.stringify({ id: draggedTaskId, dueDate: iso }) }).catch(console.error);
    setDraggedTaskId(null);
    setDragOverDay(null);
  }

  function formatDueDate(dueDate: string | null, dueTime: string | null): string {
    if (!dueDate) return dueTime ? dueTime : "Sin fecha";
    const [y, m, d] = dueDate.split('-').map(Number);
    const monthName = months[m - 1];
    return dueTime ? `${d} ${monthName} ${y} • ${dueTime}` : `${d} ${monthName} ${y}`;
  }

  // Sort tasks: incomplete first (by creation), completed at the end
  const sortedTasks = useMemo(() => {
    const incomplete = tasks.filter(t => !t.completed).sort((a, b) => a.createdAt - b.createdAt);
    const complete = tasks.filter(t => t.completed).sort((a, b) => a.createdAt - b.createdAt);
    return [...incomplete, ...complete];
  }, [tasks]);

  // Tasks displayed in panel (optionally filtered to a single day)
  const displayedTasks = useMemo(() => {
    if (!filteredDay) return sortedTasks;
    return sortedTasks.filter(t => t.dueDate === filteredDay);
  }, [sortedTasks, filteredDay]);

  // Human-readable label for the filtered day
  const filteredDayLabel = useMemo(() => {
    if (!filteredDay) return null;
    const [y, m, d] = filteredDay.split('-').map(Number);
    return `${d} ${months[m - 1]} ${y}`;
  }, [filteredDay, months]);

  // ---- Public (Turnos) helpers ----
  function addShift() {
    // eslint-disable-next-line
    const shift: Shift = {
      // eslint-disable-next-line
      id: `shift-${Date.now()}`,
      startTime: newShiftStartTime,
      endTime: newShiftEndTime,
      participants: newShiftParticipants,
      description: newShiftDescription.trim() || undefined,
      status: 'active',
      dayIndex: selectedDayIndex,
      pointIndex: selectedPointIndex
    };
    setShifts(prev => [...prev, shift]);
    setIsAddingShift(false);
    resetShiftForm();
    fetch('/api/shifts', { method: 'POST', body: JSON.stringify(shift) }).catch(console.error);
  }

  function deleteShift(id: string) {
    setShifts(prev => prev.filter(s => s.id !== id));
    fetch(`/api/shifts?id=${id}`, { method: 'DELETE' }).catch(console.error);
  }

  function toggleShiftStatus(id: string) {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s));
    const shift = shifts.find(s => s.id === id);
    if (shift) {
      fetch('/api/shifts', { method: 'PUT', body: JSON.stringify({ id, status: shift.status === 'active' ? 'suspended' : 'active' }) }).catch(console.error);
    }
  }

  function startEditShift(shift: Shift) {
    setEditingShiftId(shift.id);
    setNewShiftStartTime(shift.startTime);
    setNewShiftEndTime(shift.endTime);
    setNewShiftParticipants(shift.participants);
    setNewShiftDescription(shift.description || "");
    setIsAddingShift(true);
  }

  function updateShift() {
    if (!editingShiftId) return;
    setShifts(prev => prev.map(s => s.id === editingShiftId ? {
      ...s,
      startTime: newShiftStartTime,
      endTime: newShiftEndTime,
      participants: newShiftParticipants,
      description: newShiftDescription.trim() || undefined
    } : s));
    fetch('/api/shifts', { 
      method: 'PUT', 
      body: JSON.stringify({ 
        id: editingShiftId, 
        startTime: newShiftStartTime, 
        endTime: newShiftEndTime, 
        participants: newShiftParticipants,
        description: newShiftDescription.trim() || undefined
      }) 
    }).catch(console.error);
    setEditingShiftId(null);
    setIsAddingShift(false);
    resetShiftForm();
  }

  function resetShiftForm() {
    setNewShiftStartTime("08:00");
    setNewShiftEndTime("09:00");
    setNewShiftParticipants([]);
    setNewShiftDescription("");
    setParticipantInput("");
  }

  function addParticipant() {
    if (!participantInput.trim() || newShiftParticipants.length >= 5) return;
    setNewShiftParticipants([...newShiftParticipants, participantInput.trim()]);
    setParticipantInput("");
  }

  function removeParticipant(index: number) {
    setNewShiftParticipants(prev => prev.filter((_, i) => i !== index));
  }

  function getTimePosition(time: string) {
    const [h, m] = time.split(':').map(Number);
    // 80px per hour, 40px per 30 mins
    return Math.max(0, (h - 7) * 80 + (m / 60) * 80);
  }

  return (
    <div className={styles.container} style={themeStyles}>
      {isSidebarCollapsed && (
        <button
          className={`${styles.deployArrow} ${selectedEventDate ? styles.deployArrowHidden : ''}`}
          onClick={() => {
            setIsSidebarCollapsed(false);
          }}
          aria-label="Desplegar barra lateral"
          style={{ left: '80px' }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* 10% Main Sidebar - Always Visible */}
      <aside className={styles.mainSidebar}>
        <div className={styles.logo}>
          <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.5rem', boxShadow: '0 8px 16px var(--accent-light)' }}>
            C
          </div>
        </div>

        <button
          className={`${styles.iconButton} ${activeView === 'users' ? styles.iconButtonActive : ''}`}
          onClick={() => setActiveView('users')}
          aria-label="Cuenta"
        >
          <Icons.Account />
        </button>
        <button
          className={`${styles.iconButton} ${activeView === 'calendar' ? styles.iconButtonActive : ''}`}
          onClick={() => setActiveView('calendar')}
          aria-label="Calendario"
        >
          <Icons.Calendar />
        </button>
        <button className={styles.iconButton} aria-label="Estadísticas">
          <Icons.Stats />
        </button>

        <div className={styles.spacer} />

        {mounted && (
          <button
            className={styles.iconButton}
            aria-label="Cambiar tema"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Icons.LightMode /> : <Icons.DarkMode />}
          </button>
        )}

        <button className={styles.iconButton} aria-label="Configuración">
          <Icons.Settings />
        </button>
      </aside>

      {/* 15% Date Selector Sidebar - Hidden in Users View */}
      {activeView === 'calendar' && (
        <aside className={`${styles.dateSidebar} ${isSidebarCollapsed ? styles.dateSidebarCollapsed : ''}`}>
          {/* Year/Point navigator */}
          <div className={styles.yearNav}>
            <button className={styles.yearArrow} aria-label="Anterior" onClick={() => {
              if (calendarMode === 'public') {
                setPointAnimDir('prev');
                setPointAnimKey(k => k + 1);
                setSelectedPointIndex(prev => (prev === 0 ? PUBLIC_POINTS.length - 1 : prev - 1));
              } else {
                navigateYear(-1);
              }
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={styles.yearLabelWrapper}>
              {calendarMode === 'public' ? (
                <span
                  key={`point-${pointAnimKey}`}
                  className={`${styles.yearLabel} ${pointAnimDir === 'next' ? styles.slideLeft : styles.slideRight}`}
                >
                  {PUBLIC_POINTS[selectedPointIndex]}
                </span>
              ) : (
                <span
                  key={`year-${yearAnimKey}`}
                  className={`${styles.yearLabel} ${yearAnimDir === 'next' ? styles.slideLeft : styles.slideRight}`}
                >
                  {selectedYear}
                </span>
              )}
            </div>
            <button className={styles.yearArrow} aria-label="Siguiente" onClick={() => {
              if (calendarMode === 'public') {
                setPointAnimDir('next');
                setPointAnimKey(k => k + 1);
                setSelectedPointIndex(prev => (prev === PUBLIC_POINTS.length - 1 ? 0 : prev + 1));
              } else {
                navigateYear(1);
              }
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Month/Day scroll: Ribbon on Mobile, sliding window on Desktop */}
          <div
            ref={monthScrollRef}
            className={styles.monthScroll}
            onWheel={e => {
              if (isMobile) return;
              if (calendarMode === 'public') return;
              e.preventDefault();
              scrollAccumulator.current += e.deltaY;
              if (Math.abs(scrollAccumulator.current) >= 60) {
                navigateMonth(scrollAccumulator.current > 0 ? 1 : -1);
                scrollAccumulator.current = 0;
              }
            }}
          >
            <div
              key={isMobile ? 'mobile-ribbon' : `month-${monthAnimKey}`}
              className={isMobile ? styles.monthRibbon : `${styles.monthScrollInner} ${monthAnimDir === 'up' ? styles.slideUp : styles.slideDown}`}
            >
              {calendarMode === 'public' ? (
                isMobile ? (
                  PUBLIC_DAYS.map((name, index) => (
                    <div
                      key={index}
                      className={`${styles.monthItem} ${selectedDayIndex === index ? styles.active : ''}`}
                      onClick={() => {
                        if (selectedDayIndex !== index) {
                          setMonthAnimDir(index > selectedDayIndex ? "up" : "down");
                          setMonthAnimKey(k => k + 1);
                          setSelectedDayIndex(index);
                        }
                      }}
                    >
                      {name}
                    </div>
                  ))
                ) : (
                  windowOffsets.map(offset => {
                    const label = getDayLabel(offset);
                    const opacity = monthOpacity[offset];
                    const isActive = offset === 0;
                    return (
                      <div
                        key={offset}
                        className={`${styles.monthItem} ${isActive ? styles.active : ''}`}
                        style={{ opacity }}
                        onClick={() => navigateDay(offset)}
                      >
                        {label}
                      </div>
                    );
                  })
                )
              ) : (
                isMobile ? (
                  months.map((name, index) => (
                    <div
                      key={index}
                      className={`${styles.monthItem} ${selectedMonth === index ? styles.active : ''}`}
                      onClick={() => {
                        if (selectedMonth !== index) {
                          setMonthAnimDir(index > selectedMonth ? "up" : "down");
                          setMonthAnimKey(k => k + 1);
                          setSelectedMonth(index);
                        }
                      }}
                    >
                      {name}
                    </div>
                  ))
                ) : (
                  windowOffsets.map(offset => {
                    const label = getMonthLabel(offset);
                    const opacity = monthOpacity[offset];
                    const isActive = offset === 0;
                    return (
                      <div
                        key={offset}
                        className={`${styles.monthItem} ${isActive ? styles.active : ''}`}
                        style={{ opacity }}
                        onClick={() => navigateMonth(offset)}
                      >
                        {label}
                      </div>
                    );
                  })
                )
              )}
            </div>
          </div>
        </aside>
      )}

      {/* 75% Content Area - Hidden in Users View and Public View */}
      {activeView === 'calendar' && calendarMode !== 'public' && (
        <main className={`${styles.contentArea} ${isSidebarCollapsed ? styles.contentAreaShifted : ''}`}>
          <div className={styles.calendarInner}>
            <header className={styles.header}>
              <div className={styles.headerLeft}>
                <h1>{months[selectedMonth]} {selectedYear}</h1>
                {calendarMode === 'tasks' && (
                  <span className={styles.modePill}>
                    <Icons.Todolist />
                    Tareas
                  </span>
                )}
              </div>
              <div className={styles.headerActions}>
                <button
                  className={`${styles.actionBtn} ${isTasksPanelOpen && !filteredDay ? styles.actionBtnActive : ''}`}
                  aria-label="Lista de tareas"
                  onClick={() => openTasksPanel()}
                >
                  <Icons.Todolist />
                </button>
                {calendarMode === 'anniversaries' && (
                  <button className={styles.actionBtn} aria-label="Etiquetas">
                    <Icons.Tag />
                  </button>
                )}
              </div>
            </header>

            <div
              key={`${selectedMonth}-${selectedYear}-${monthAnimKey}`}
              className={`${styles.calendarContainer} ${monthAnimDir === 'up' ? styles.calendarSlideUp : styles.calendarSlideDown}`}
            >
              <div className={styles.calendarGrid}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className={styles.dayName}>{day}</div>
                ))}

                {calendarGridItems.map((dateObj: { day: number, month: number, year: number, isCurrentMonth: boolean }, idx: number) => {
                  const { day, month, year, isCurrentMonth } = dateObj;
                  const isToday =
                    day === new Date().getDate() &&
                    month === new Date().getMonth() &&
                    year === new Date().getFullYear();

                  const dayKey = `${month}-${day}`;
                  const isDragOver = dragOverDay === dayKey;
                  const isSearched =
                    searchedDate &&
                    day === searchedDate.day &&
                    month === searchedDate.month &&
                    year === searchedDate.year;

                  // Highlight logic differs by mode
                  let isHighlighted = false;
                  if (calendarMode === 'anniversaries') {
                    isHighlighted = !!IMPORTANT_DATES[`${month}-${day}`];
                  } else {
                    // Tasks mode: highlight days that have at least one task due
                    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    isHighlighted = tasks.some(t => t.dueDate === iso);
                  }

                  return (
                    <div
                      key={`${year}-${month}-${day}-${idx}`}
                      className={`${styles.dayCell} ${!isCurrentMonth ? styles.otherMonth : ''} ${isToday ? styles.today : ''} ${isSearched ? styles.searched : ''} ${isHighlighted ? styles.highlighted : ''} ${isDragOver ? styles.dragOver : ''}`}
                      onClick={() => handleDayClick(day, month, year, isCurrentMonth)}
                      onDragOver={(e) => handleDayDragOver(dayKey, e)}
                      onDragLeave={handleDayDragLeave}
                      onDrop={(e) => handleDayDrop(day, month, year, e)}
                    >
                      <span>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputPill}>
                <input
                  className={styles.textInput}
                  type="text"
                  placeholder="Buscar..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                />
                <button
                  className={styles.inputSend}
                  aria-label="Enviar"
                  onClick={handleSearch}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Users Section Content */}
      {activeView === 'users' && (
        <main className={styles.usersContent}>
          <h1 className={styles.usersTitle}>Hola ¡Nicolas!</h1>
          <div className={styles.profileGrid}>
            <div className={styles.profileCard} onClick={() => { setActiveView('calendar'); setCalendarMode('anniversaries'); }}>
              <div className={styles.profileAvatar}>
                <Icons.Tag />
              </div>
              <span className={styles.profileName}>Aniversarios</span>
            </div>
            <div className={styles.profileCard} onClick={() => { setActiveView('calendar'); setCalendarMode('tasks'); setIsTasksPanelOpen(false); }}>
              <div className={styles.profileAvatar} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)' }}>
                <Icons.Todolist />
              </div>
              <span className={styles.profileName}>Tareas</span>
            </div>
            <div className={styles.profileCard} onClick={() => { setActiveView('calendar'); setCalendarMode('public'); setIsTasksPanelOpen(false); }}>
              <div className={styles.profileAvatar} style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)' }}>
                <Icons.Book />
              </div>
              <span className={styles.profileName}>Pública</span>
            </div>
            <div className={`${styles.profileCard} ${styles.addProfileCard}`}>
              <div className={styles.profileAvatar}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className={styles.profileName}>Añadir perfil</span>
            </div>
          </div>
        </main>
      )}

      {/* Pública View Content */}
      {activeView === 'calendar' && calendarMode === 'public' && (
        <main className={styles.contentArea}>
          <div className={styles.publicContent}>
            <div className={styles.publicScrollContainer}>
              <div className={styles.publicTimelineGrid}>
                {/* 14 hours = 28 half-hours + 1 end label */}
                {Array.from({ length: 29 }).map((_, i) => {
                  const top = i * 40; // 40px per 30 mins
                  const isHour = i % 2 === 0;
                  const hour = Math.floor(i / 2) + 7;
                  const displayHour = hour > 12 ? hour - 12 : hour;
                  const ampm = hour >= 12 ? 'pm' : 'am';
                  const timeStr = `${displayHour}:${isHour ? '00' : '30'} ${ampm}`;

                  return (
                    <React.Fragment key={i}>
                      <div className={styles.timelineLabel} style={{ top: `${top}px` }}>
                        {timeStr}
                      </div>
                      <div
                        className={`${styles.timelineLine} ${!isHour ? styles.timelineLineHalf : ''}`}
                        style={{ top: `${top}px` }}
                      />
                    </React.Fragment>
                  );
                })}

                {/* Shifts */}
                {shifts
                  .filter(s => s.dayIndex === selectedDayIndex && s.pointIndex === selectedPointIndex)
                  .map(shift => {
                    const top = getTimePosition(shift.startTime);
                    const end = getTimePosition(shift.endTime);
                    const height = Math.max(30, end - top);

                    const colorIndex = shift.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 8;
                    const hue = [10, 30, 45, 120, 180, 210, 275, 330][colorIndex];

                    return (
                      <div
                        key={shift.id}
                        className={`${styles.shiftCard} ${shift.status === 'suspended' ? styles.shiftSuspended : ''}`}
                        style={{ top: `${top}px`, height: `${height}px`, '--shift-hue': hue } as React.CSSProperties}
                        onClick={() => { setConfirmDeleteShiftId(null); startEditShift(shift); }}
                      >
                        <div className={styles.shiftActions} onClick={e => e.stopPropagation()}>
                          <button className={styles.shiftActionBtn} onClick={() => toggleShiftStatus(shift.id)} title="Suspender/Activar">
                            <Icons.Clock />
                          </button>
                          {confirmDeleteShiftId === shift.id ? (
                            <button
                              className={`${styles.shiftActionBtn} ${styles.deleteConfirm}`}
                              onClick={() => { deleteShift(shift.id); setConfirmDeleteShiftId(null); }}
                              title="Confirmar eliminación"
                            >
                              <Icons.Trash />
                            </button>
                          ) : (
                            <button
                              className={`${styles.shiftActionBtn} ${styles.delete}`}
                              onClick={() => setConfirmDeleteShiftId(shift.id)}
                              title="Eliminar"
                            >
                              <Icons.Close />
                            </button>
                          )}
                        </div>
                        <div className={styles.shiftDragHandle}>
                          <Icons.GripVertical />
                        </div>
                        <div className={styles.shiftMeta}>
                          <div className={styles.shiftInfoRow}>
                            <span className={styles.shiftPointTag}>{PUBLIC_POINTS[shift.pointIndex]}</span>
                            <Icons.Clock />
                            {shift.startTime} - {shift.endTime}
                          </div>
                          {shift.participants.length > 0 && (
                            <div className={styles.shiftParticipants}>
                              {shift.participants.map((p, idx) => (
                                <span key={idx} className={styles.participantPill}>{p}</span>
                              ))}
                            </div>
                          )}
                          {shift.description && (
                            <div className={styles.shiftDescription}>{shift.description}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Add Button */}
            <button className={styles.publicAddBtn} onClick={() => { resetShiftForm(); setIsAddingShift(true); }}>
              <Icons.Plus />
            </button>
          </div>

          {/* New/Edit Shift Modal */}
          {isAddingShift && (
            <div className={styles.publicOverlay} onClick={() => { setIsAddingShift(false); setEditingShiftId(null); }}>
              <div className={styles.publicModal} onClick={e => e.stopPropagation()}>
                <h2>{editingShiftId ? 'Editar Turno' : 'Nuevo Turno'}</h2>
                <div className={styles.modalForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label className={styles.formLabel}>Desde</label>
                      <input
                        type="time"
                        className={styles.formInput}
                        value={newShiftStartTime}
                        min="07:00"
                        max="21:00"
                        onChange={e => setNewShiftStartTime(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label className={styles.formLabel}>Hasta</label>
                      <input
                        type="time"
                        className={styles.formInput}
                        value={newShiftEndTime}
                        min="07:00"
                        max="21:00"
                        onChange={e => setNewShiftEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Participantes (Máx 5)</label>
                    <div className={styles.participantInputWrapper}>
                      <input
                        type="text"
                        className={styles.formInput}
                        style={{ flex: 1 }}
                        placeholder="Nombre..."
                        value={participantInput}
                        onChange={e => setParticipantInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') addParticipant(); }}
                        disabled={newShiftParticipants.length >= 5}
                      />
                      <button className={styles.shiftActionBtn} style={{ width: 45, height: 45 }} onClick={addParticipant} disabled={newShiftParticipants.length >= 5}>
                        <Icons.Plus />
                      </button>
                    </div>
                    <div className={styles.participantList}>
                      {newShiftParticipants.map((p, idx) => (
                        <span key={idx} className={styles.participantPill} onClick={() => removeParticipant(idx)} style={{ cursor: 'pointer' }}>
                          {p} ×
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Descripción (Opcional)</label>
                    <textarea
                      className={styles.formTextarea}
                      placeholder="Añade una descripción..."
                      value={newShiftDescription}
                      onChange={e => setNewShiftDescription(e.target.value)}
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.btnCancel} onClick={() => { setIsAddingShift(false); setEditingShiftId(null); }}>Cancelar</button>
                    <button className={styles.btnConfirm} onClick={editingShiftId ? updateShift : addShift}>
                      {editingShiftId ? 'Guardar Cambios' : 'Crear Turno'}
                    </button>
                  </div>
                  {editingShiftId && (
                    <div className={styles.modalSecondaryActions}>
                      <button className={styles.btnSuspend} onClick={() => toggleShiftStatus(editingShiftId)}>
                        {shifts.find(s => s.id === editingShiftId)?.status === 'active' ? 'Suspender Turno' : 'Activar Turno'}
                      </button>
                      <button className={styles.btnDelete} onClick={() => { deleteShift(editingShiftId); setIsAddingShift(false); setEditingShiftId(null); }}>
                        Eliminar Turno
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Right Event Sidebar - Hidden in Users View and in Tasks Mode */}
      {activeView === 'calendar' && calendarMode === 'anniversaries' && (
        <aside className={`${styles.rightSidebar} ${selectedEventDate ? styles.rightSidebarOpen : ''}`}>
          <button
            className={styles.sidebarCloseBtn}
            onClick={() => {
              setSelectedEventDate(null);
              setIsSidebarCollapsed(false);
            }}
            aria-label="Cerrar"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className={styles.rightSidebarHeader}>
            <p>{eventDateParsed ? `${months[eventDateParsed.month]} ${eventDateParsed.day}` : ''}</p>
            <h2>Aniversarios</h2>
          </div>
          <div className={styles.eventList}>
            {selectedEvents?.flatMap((event, eventIdx) =>
              event.names.map((name, nameIdx) => {
                const isMatch = lastSearchQuery ? name.toLowerCase().includes(lastSearchQuery.toLowerCase()) : true;
                return (
                  <div key={`${eventIdx}-${nameIdx}`} className={`${styles.eventItem} ${!isMatch ? styles.dimmed : ''}`}>
                    <div className={styles.eventIcon}>
                      <Icons.Gift />
                    </div>
                    <div className={styles.eventInfo}>
                      <div className={styles.eventName}>{name}</div>
                      <div className={styles.eventYear}>
                        <Icons.Calendar />
                        {event.year > 0 ? (
                          <span>{event.year} • {2026 - event.year} años</span>
                        ) : (
                          <span>Anual</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      )}

      {/* ---- Tasks Panel ---- */}
      {activeView === 'calendar' && calendarMode !== 'public' && (
        <aside className={`${styles.tasksSidebar} ${isTasksPanelOpen ? styles.tasksSidebarOpen : ''}`}>
          {/* Mobile drag handle */}
          <div className={styles.tasksMobileHandleWrapper} onClick={closeTasksPanel}>
            <div className={styles.tasksMobileHandle} />
          </div>

          {/* Close button – desktop only; mobile uses drag handle / backdrop */}
          <button
            className={styles.sidebarCloseBtn}
            onClick={closeTasksPanel}
            aria-label="Cerrar tareas"
          >
            <Icons.Close />
          </button>

          {/* Header */}
          <div className={styles.tasksHeader}>
            <div className={styles.tasksTitleGroup}>
              <h2 className={styles.tasksTitle}>Tareas</h2>
              {filteredDayLabel && (
                <button
                  className={styles.tasksBackBtn}
                  onClick={() => setFilteredDay(null)}
                  title="Ver todas las tareas"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  {filteredDayLabel}
                </button>
              )}
            </div>
            <button
              className={styles.tasksAddBtn}
              onClick={() => setIsAddingTask(true)}
              aria-label="Añadir tarea"
            >
              <Icons.Plus />
            </button>
          </div>

          {/* New task form */}
          {isAddingTask && (
            <div className={styles.taskForm}>
              <input
                className={styles.taskFormInput}
                type="text"
                placeholder="¿Qué tarea quieres hacer?"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') { setIsAddingTask(false); setNewTaskText(""); } }}
                autoFocus
              />
              <div className={styles.taskFormMeta}>
                <label className={styles.taskFormDateLabel}>
                  <Icons.Calendar />
                  <input
                    type="date"
                    className={styles.taskFormDateInput}
                    value={newTaskDate}
                    onChange={e => setNewTaskDate(e.target.value)}
                    placeholder="Sin fecha"
                  />
                </label>
                <label className={styles.taskFormDateLabel}>
                  <Icons.Clock />
                  <input
                    type="time"
                    className={styles.taskFormDateInput}
                    value={newTaskTime}
                    onChange={e => setNewTaskTime(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.taskFormActions}>
                <button
                  className={styles.taskFormCancel}
                  onClick={() => { setIsAddingTask(false); setNewTaskText(""); setNewTaskDate(""); setNewTaskTime(""); }}
                >
                  Cancelar
                </button>
                <button
                  className={styles.taskFormConfirm}
                  onClick={addTask}
                  disabled={!newTaskText.trim()}
                >
                  Añadir
                </button>
              </div>
            </div>
          )}

          {/* Task list */}
          <div className={styles.taskList}>
            {displayedTasks.length === 0 && !isAddingTask && (
              <div className={styles.tasksEmpty}>
                <div className={styles.tasksEmptyIcon}>
                  <Icons.Todolist />
                </div>
                <p>{filteredDay ? 'No hay tareas para este día.' : <>No hay tareas aún.<br />Pulsa <strong>+</strong> para añadir una.</>}</p>
              </div>
            )}

            {displayedTasks.map(task => {
              const isDimmed = taskMatchIds.length > 0 && !taskMatchIds.includes(task.id);
              const isEditing = editingTaskId === task.id;
              return (
                <div
                  key={task.id}
                  className={`${styles.taskCard} ${task.completed ? styles.taskCardCompleted : ''} ${isDimmed ? styles.taskCardDimmed : ''} ${isEditing ? styles.taskCardEditing : ''}`}
                  draggable={!isEditing}
                  onDragStart={!isEditing ? (e) => handleDragStart(task.id, e) : undefined}
                  onDragEnd={!isEditing ? handleDragEnd : undefined}
                >
                  {/* Drag handle */}
                  {!isEditing && (
                    <div className={styles.taskDragHandle} title="Arrastra al calendario para asignar fecha">
                      <Icons.GripVertical />
                    </div>
                  )}

                  {/* Checkbox */}
                  <button
                    className={`${styles.taskCheckbox} ${task.completed ? styles.taskCheckboxChecked : ''}`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                  >
                    {task.completed && <Icons.Check />}
                  </button>

                  {/* Content */}
                  <div className={styles.taskContent} onClick={!isEditing ? () => startEditTask(task) : undefined} style={!isEditing ? { cursor: 'pointer' } : undefined}>
                    <span className={`${styles.taskText} ${task.completed ? styles.taskTextDone : ''}`}>
                      {task.text}
                    </span>

                    {isEditing ? (
                      <div className={styles.taskEditForm}>
                        <div className={styles.taskEditRow}>
                          <label className={styles.taskFormDateLabel}>
                            <Icons.Calendar />
                            <input
                              type="date"
                              className={styles.taskFormDateInput}
                              value={editTaskDate}
                              onChange={e => setEditTaskDate(e.target.value)}
                              onClick={e => e.stopPropagation()}
                            />
                          </label>
                          <label className={styles.taskFormDateLabel}>
                            <Icons.Clock />
                            <input
                              type="time"
                              className={styles.taskFormDateInput}
                              value={editTaskTime}
                              onChange={e => setEditTaskTime(e.target.value)}
                              onClick={e => e.stopPropagation()}
                            />
                          </label>
                        </div>
                        <div className={styles.taskEditActions}>
                          <button
                            className={styles.taskFormCancel}
                            onClick={e => { e.stopPropagation(); cancelTaskEdit(); }}
                          >
                            Cancelar
                          </button>
                          <button
                            className={styles.taskFormConfirm}
                            onClick={e => { e.stopPropagation(); saveTaskEdit(task.id); }}
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {(task.dueDate || task.dueTime) && (
                          <span className={styles.taskDue}>
                            <Icons.Clock />
                            {formatDueDate(task.dueDate, task.dueTime)}
                          </span>
                        )}
                        {!task.dueDate && !task.dueTime && (
                          <span className={styles.taskDue} style={{ opacity: 0.4 }}>Sin fecha asignada</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Delete */}
                  {!isEditing && (
                    <button
                      className={styles.taskDeleteBtn}
                      onClick={() => deleteTask(task.id)}
                      aria-label="Eliminar tarea"
                    >
                      <Icons.Close />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* Mobile overlay backdrop for tasks */}
      {isTasksPanelOpen && isMobile && (
        <div className={styles.tasksBackdrop} onClick={closeTasksPanel} />
      )}
    </div>
  );
}
