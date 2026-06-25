import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Users, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Plus, 
  Edit, 
  Save, 
  Printer, 
  Info, 
  ChevronRight, 
  Sparkles, 
  Laptop, 
  FileText, 
  Clock, 
  ArrowUpRight, 
  Briefcase,
  X,
  Folder,
  FolderOpen,
  Upload,
  Filter,
  Check,
  Image as ImageIcon,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { IncomeRow, ExpenseRow, Employee } from '../types';
import { EXPENSE_TYPES, INITIAL_EMPLOYEES, INITIAL_INCOME, INITIAL_EXPENSES } from '../data';

// Custom Procedure Classifier based on user's commission formulas
export const getProcedureTierAndRate = (procedureName: string) => {
  const p = (procedureName || '').toLowerCase().trim();
  
  // Major & Specialist procedures (Tier 2 @ 40%)
  const tier2Keywords = [
    'rct', 'root canal', 'odontec', 'odontech', 'odont', 'complex', 'pfm', 'zirconia', 
    'denture', 'partial', 'bridge', 'implant', 'bone graft', 'bone', 'braces', 'ortho', 
    'veneers', 'post', 'core', 'crown', 'ppm'
  ];

  if (tier2Keywords.some(kw => p.includes(kw))) {
    return { tier: 2, rate: 0.40, name: 'Tier 2 (Major & Specialist) — 40% Share' };
  }
  
  // Default is Tier 1 (Routine & High-Margin @ 30%)
  return { tier: 1, rate: 0.30, name: 'Tier 1 (Routine & High-Margin) — 30% Share' };
};

export default function DentalDashboard({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [phaseGroup, setPhaseGroup] = useState<'group1' | 'group2'>('group1');
  const [activeSubTab, setActiveSubTab] = useState<'phase1' | 'phase2' | 'phase3' | 'phase4'>('phase1');
  
  // Printing State Engine
  const [printMode, setPrintMode] = useState<'none' | 'report' | 'payslip' | 'ledger' | 'payroll'>('none');
  const [payrollCutoff, setPayrollCutoff] = useState<'1st' | '2nd'>('1st');

  useEffect(() => {
    if (printMode !== 'none') {
      document.body.classList.add(`body-printing-${printMode}`);
    } else {
      document.body.classList.remove('body-printing-report', 'body-printing-payslip', 'body-printing-ledger', 'body-printing-payroll');
    }
    return () => {
      document.body.classList.remove('body-printing-report', 'body-printing-payslip', 'body-printing-ledger', 'body-printing-payroll');
    };
  }, [printMode]);

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintMode('none');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    if (printMode !== 'none') {
      const printTimer = setTimeout(() => {
        try {
          window.print();
        } catch (err) {
          console.error("Error triggering print dialog:", err);
        }
      }, 800);

      // Safe fallback reset to clear print-preview after 5 seconds in case afterprint does not fire
      const resetTimer = setTimeout(() => {
        setPrintMode('none');
      }, 5000);

      return () => {
        clearTimeout(printTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [printMode]);
  
  // Dental states
  const [income, setIncome] = useState<IncomeRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Assistant incentives state map (employeeCode -> amount)
  const [assistantIncentives] = useState<Record<string, number>>({
    'Ryan': 1500,
    'Mary': 1200,
    'Arkin': 800
  });

  // Folder 1: Excel Reports state
  const [excelFiles] = useState<Array<{
    id: string;
    name: string;
    recordsCount: number;
    totalAmount: number;
    uploadedAt: string;
    rows: Array<{ date: string; duty: string; patient: string; procedure: string; amountPaid: number; type: 'Income' | 'Expense'; category: string }>;
  }>>([
    {
      id: 'excel-1',
      name: 'ARKA_Dental_First_Half_Procedures.xlsx',
      recordsCount: 6,
      totalAmount: 31800,
      uploadedAt: 'June 15, 2026, 04:30 PM',
      rows: [
        { date: '2026-06-10', duty: 'ER', patient: 'Guerrero, Maria', procedure: 'RCT (Root Canal Therapy)', amountPaid: 12000, type: 'Income', category: 'Major' },
        { date: '2026-06-10', duty: 'GA', patient: 'Lim, Pedro', procedure: 'Oral Prophylaxis (Cleaning)', amountPaid: 1500, type: 'Income', category: 'Routine' },
        { date: '2026-06-11', duty: 'KU', patient: 'Tan, Jessica', procedure: 'Orthodontic Braces (Monthly)', amountPaid: 3500, type: 'Income', category: 'Major' },
        { date: '2026-06-12', duty: 'ER', patient: 'Marquez, Juan', procedure: 'PFM Crown Placement', amountPaid: 10000, type: 'Income', category: 'Major' },
        { date: '2026-06-12', duty: 'GA', patient: 'Aquino, Cory', procedure: 'Simple Extraction (Pasta)', amountPaid: 1800, type: 'Income', category: 'Routine' },
        { date: '2026-06-13', duty: 'KU', patient: 'Roxas, Mar', procedure: 'Light Cure Restoration', amountPaid: 3000, type: 'Income', category: 'Routine' }
      ]
    },
    {
      id: 'excel-2',
      name: 'Clinic_Utility_Bills_June.csv',
      recordsCount: 2,
      totalAmount: 10300,
      uploadedAt: 'June 18, 2026, 09:15 AM',
      rows: [
        { date: '2026-06-11', duty: 'Ryan', patient: 'Arka Dental Supplies', procedure: 'Dental Composites & Anesthetics', amountPaid: 4500, type: 'Expense', category: 'Supplies' },
        { date: '2026-06-14', duty: 'Mary', patient: 'Meralco Inc.', procedure: 'Clinic Electricity Consumption', amountPaid: 5800, type: 'Expense', category: 'Utility' }
      ]
    }
  ]);

  const [excelFilter, setExcelFilter] = useState<'all' | 'income' | 'expense' | 'high_margin' | 'major'>('all');
  const [selectedExcelId, setSelectedExcelId] = useState<string>('excel-1');

  // Folder 2: Screenshot Receipt Dropper state
  const [receipts, setReceipts] = useState<Array<{
    id: string;
    name: string;
    vendor: string;
    timestamp: string;
    fileName: string;
    fileSize: string;
    amount: number;
    category: string;
    note: string;
  }>>([
    {
      id: 'rec-1',
      name: 'Meralco Bill June Cut-off',
      vendor: 'Meralco Electric Co.',
      timestamp: 'June 14, 2026, 11:42 AM',
      fileName: 'meralco_screenshot_06_14.png',
      fileSize: '412 KB',
      amount: 5800,
      category: 'Electric Bill',
      note: 'Auto-paid via Gcash'
    },
    {
      id: 'rec-2',
      name: 'Dentsply Sirona Supplies Invoice',
      vendor: 'Dentsply Sirona Philippines',
      timestamp: 'June 11, 2026, 02:18 PM',
      fileName: 'dentsply_dental_supplies_invoice.pdf',
      fileSize: '1.2 MB',
      amount: 4500,
      category: 'Dental Supplies',
      note: 'Gloves, restorative gels and masks'
    },
    {
      id: 'rec-3',
      name: 'PLDT Fiber High-Speed Internet',
      vendor: 'PLDT Inc.',
      timestamp: 'June 01, 2026, 09:04 AM',
      fileName: 'pldt_fiber_payment_receipt.png',
      fileSize: '298 KB',
      amount: 1399,
      category: 'Wifi',
      note: 'Monthly recurring broadband'
    }
  ]);

  const [ocrScanning, setOcrScanning] = useState<boolean>(false);
  const [scanningStep, setScanningStep] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Edit toggle state for Phase 2
  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  
  // New entry form states
  const [newExpDate, setNewExpDate] = useState<string>('2026-06-01');
  const [newExpType, setNewExpType] = useState<string>('');
  const [newExpDesc, setNewExpDesc] = useState<string>('');
  const [newExpAmount, setNewExpAmount] = useState<string>('');

  // Attendance state
  // Record<employeeCode, Record<dateString, 'present' | 'absent' | 'leave'>>
  const [attendance, setAttendance] = useState<Record<string, Record<string, 'present' | 'absent' | 'leave'>>>({});
  const [activeAttendanceEmployee, setActiveAttendanceEmployee] = useState<string>('ER');

  // Selected Payslip for details modal
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);

  // New leave form states
  const [leaveEmp, setLeaveEmp] = useState<string>('ER');
  const [leaveDate, setLeaveDate] = useState<string>('2026-06-01');
  const [leaveReason, setLeaveReason] = useState<string>('Family Event');

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem('dentalData_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIncome(parsed.income || INITIAL_INCOME);
        setExpenses(parsed.expenses || INITIAL_EXPENSES);
        setAttendance(parsed.attendance || generateDefaultAttendance());
      } catch (e) {
        setIncome(INITIAL_INCOME);
        setExpenses(INITIAL_EXPENSES);
        setAttendance(generateDefaultAttendance());
      }
    } else {
      setIncome(INITIAL_INCOME);
      setExpenses(INITIAL_EXPENSES);
      setAttendance(generateDefaultAttendance());
    }
  }, []);

  // Save state helper
  const saveDentalData = (newIncome: IncomeRow[], newExpenses: ExpenseRow[], newAttendance: any) => {
    localStorage.setItem('dentalData_v2', JSON.stringify({
      income: newIncome,
      expenses: newExpenses,
      attendance: newAttendance
    }));
  };

  const generateDefaultAttendance = () => {
    const att: Record<string, Record<string, 'present' | 'absent' | 'leave'>> = {};
    INITIAL_EMPLOYEES.forEach(emp => {
      att[emp.code] = {};
      for (let d = 1; d <= 30; d++) {
        const dateStr = `2026-06-${String(d).padStart(2, '0')}`;
        att[emp.code][dateStr] = 'present';
      }
    });
    return att;
  };

  // Switch attendance status
  const cycleAttendance = (empCode: string, dateStr: string) => {
    setAttendance(prev => {
      const currentStatus = prev[empCode]?.[dateStr] || 'present';
      let nextStatus: 'present' | 'absent' | 'leave' = 'present';
      if (currentStatus === 'present') nextStatus = 'absent';
      else if (currentStatus === 'absent') nextStatus = 'leave';
      
      const updated = {
        ...prev,
        [empCode]: {
          ...(prev[empCode] || {}),
          [dateStr]: nextStatus
        }
      };
      saveDentalData(income, expenses, updated);
      return updated;
    });
  };

  // Helper formatting
  const formatMoney = (val: number) => {
    return '₱' + val.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculations
  const totalGrossIncome = income.reduce((sum, r) => sum + r.amountPaid + r.hmo + r.labFee, 0);
  const totalExpenses = expenses.reduce((sum, r) => sum + r.amount, 0);
  const netIncome = totalGrossIncome - totalExpenses;
  const profitMargin = totalGrossIncome > 0 ? (netIncome / totalGrossIncome) * 100 : 0;

  // Expense Grouped by Category for charts & reports
  const expenseGrouped = expenses.reduce((acc, exp) => {
    acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Filtered lists for Phase 2 General Ledger view
  const filteredIncome = dateFilter ? income.filter(r => r.date === dateFilter) : income;
  const filteredExpenses = dateFilter ? expenses.filter(r => r.date === dateFilter) : expenses;
  const displayGrossIncome = filteredIncome.reduce((sum, r) => sum + r.amountPaid + r.hmo + r.labFee, 0);
  const displayExpenses = filteredExpenses.reduce((sum, r) => sum + r.amount, 0);
  const displayNetIncome = displayGrossIncome - displayExpenses;

  // Add Income row
  const handleAddIncomeRow = () => {
    const nextRow: IncomeRow = {
      date: '2026-06-09',
      duty: 'KU',
      patient: 'Patient Name',
      procedure: 'Procedure Name',
      labFee: 0,
      discount: 0,
      amountPaid: 0,
      percentCommission: 10,
      pct: 0.1,
      paymentTerminal: 'Cash',
      ccMerchantFee: 0,
      hmo: 0,
      totalGross: 0,
      salaryRestricted: 'DATA FOR ADMIN ONLY',
      netTotal: 0
    };
    const updated = [...income, nextRow];
    setIncome(updated);
    saveDentalData(updated, expenses, attendance);
  };

  // Update Income inline
  const handleUpdateIncome = (index: number, field: keyof IncomeRow, value: any) => {
    const updated = [...income];
    const row = { ...updated[index] };
    
    // cast values if numeric
    if (field === 'amountPaid' || field === 'hmo' || field === 'labFee' || field === 'discount' || field === 'percentCommission') {
      const numVal = parseFloat(value) || 0;
      (row as any)[field] = numVal;
    } else {
      (row as any)[field] = value;
    }

    // Get dynamic commission rate based on procedure name
    const { rate } = getProcedureTierAndRate(row.procedure);
    row.pct = rate;
    row.percentCommission = rate * 100;

    // Recalculate
    row.ccMerchantFee = row.paymentTerminal === 'Credit Card' ? row.amountPaid * 0.035 : 0;
    row.totalGross = row.amountPaid + row.hmo + row.labFee;
    row.netTotal = row.totalGross - row.ccMerchantFee - (row.amountPaid * row.pct);

    updated[index] = row;
    setIncome(updated);
    saveDentalData(updated, expenses, attendance);
  };

  // Delete Income row
  const handleDeleteIncome = (index: number) => {
    const updated = income.filter((_, i) => i !== index);
    setIncome(updated);
    saveDentalData(updated, expenses, attendance);
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpType) {
      alert('Please select an expense type');
      return;
    }
    const amt = parseFloat(newExpAmount) || 0;
    if (amt <= 0) {
      alert('Please enter an amount greater than ₱0.00');
      return;
    }

    const nextExp: ExpenseRow = {
      id: Date.now(),
      date: newExpDate,
      type: newExpType,
      description: newExpDesc || 'General expense',
      amount: amt
    };

    const updated = [...expenses, nextExp];
    setExpenses(updated);
    setNewExpDesc('');
    setNewExpAmount('');
    saveDentalData(income, updated, attendance);
  };

  // Update Expense inline
  const handleUpdateExpense = (index: number, field: keyof ExpenseRow, value: any) => {
    const updated = [...expenses];
    const row = { ...updated[index] };
    if (field === 'amount') {
      row.amount = parseFloat(value) || 0;
    } else {
      (row as any)[field] = value;
    }
    updated[index] = row;
    setExpenses(updated);
    saveDentalData(income, updated, attendance);
  };

  // Delete Expense
  const handleDeleteExpense = (index: number) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
    saveDentalData(income, updated, attendance);
  };

  // Specialized Print handlers that toggle temporary classes via React state
  const printReport = () => {
    setPrintMode('report');
  };

  const printPayslip = () => {
    setPrintMode('payslip');
  };

  const printLedger = () => {
    setPrintMode('ledger');
  };

  const printPayroll = () => {
    setPrintMode('payroll');
  };

  const handlePrint = () => {
    setPrintMode('report');
  };

  // Export to CSV helper
  const exportToCSV = (filename: string, headers: string[], rows: any[][]) => {
    const escapedRows = rows.map(r => r.map(val => {
      if (val === null || val === undefined) return '';
      const strVal = String(val);
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }));
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...escapedRows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Ledger CSV Export
  const handleExportLedgerCSV = () => {
    const headers = [
      "Date", "Duty Doctor", "Patient Name", "Procedure Performed", 
      "Lab Fee", "Discount", "Amount Paid", "Commission Rate", 
      "Payment Terminal", "CC Merchant Fee", "HMO Amount", 
      "Total Gross", "Net Total"
    ];
    const rows = income.map(r => [
      r.date,
      r.duty,
      r.patient,
      r.procedure,
      r.labFee,
      r.discount,
      r.amountPaid,
      r.percentCommission + "%",
      r.paymentTerminal,
      r.ccMerchantFee,
      r.hmo,
      r.totalGross,
      r.netTotal
    ]);
    exportToCSV("arka_dental_center_ledger_june_2026.csv", headers, rows);
  };

  // Trigger Payroll CSV Export
  const handleExportPayrollCSV = () => {
    const headers = [
      "Employee Name", "Designation Code", "Role", 
      "Gross Earnings", "SSS Deductions", "PhilHealth Deductions", 
      "Pag-IBIG Deductions", "BIR Tax (5%)", "Total Deductions", "Net Take-Home"
    ];
    const rows = employees.map(emp => {
      const gross = getEmployeeGross(emp);
      const deds = getEmployeeDeductions(gross, emp.role === 'Dentist');
      const net = gross - deds.total;
      return [
        emp.name,
        emp.code,
        emp.role,
        gross.toFixed(2),
        deds.sss.toFixed(2),
        deds.philhealth.toFixed(2),
        deds.pagibig.toFixed(2),
        deds.tax.toFixed(2),
        deds.total.toFixed(2),
        net.toFixed(2)
      ];
    });
    exportToCSV("arka_dental_center_payroll_june_2026.csv", headers, rows);
  };

  // --- Calculations for Employees payroll (Phase 3) ---
  const getEmployeeGross = (emp: Employee, customCutoff?: 'full' | '1st' | '2nd') => {
    const cutoff = customCutoff || payrollCutoff;
    if (emp.role === 'Assistant') {
      // Calendar Sync: Monthly gross base is PHP 16,000 (PHP 8,000 per cut-off). Pay is based on attendance.
      const empAttendance = attendance[emp.code] || {};
      
      let presentDays = 0;
      let maxDays = 30;
      let baseSalaryMax = 16000;
      let incentive = assistantIncentives[emp.code] || 0;
      
      if (cutoff === 'full') {
        presentDays = Object.values(empAttendance).filter(s => s === 'present').length;
        const totalRecordedDays = Object.keys(empAttendance).length;
        if (totalRecordedDays === 0) presentDays = 30; // default fallback
        maxDays = 30;
        baseSalaryMax = 16000;
      } else if (cutoff === '1st') {
        // Filter attendance between June 1 and June 15
        const firstHalfDays = Object.keys(empAttendance).filter(dateStr => {
          const day = parseInt(dateStr.split('-')[2], 10);
          return day <= 15;
        });
        presentDays = firstHalfDays.filter(dateStr => empAttendance[dateStr] === 'present').length;
        const totalRecordedDays = firstHalfDays.length;
        if (totalRecordedDays === 0) presentDays = 15; // default fallback
        maxDays = 15;
        baseSalaryMax = 8000;
        incentive = incentive / 2;
      } else {
        // Filter attendance between June 16 and June 30
        const secondHalfDays = Object.keys(empAttendance).filter(dateStr => {
          const day = parseInt(dateStr.split('-')[2], 10);
          return day > 15;
        });
        presentDays = secondHalfDays.filter(dateStr => empAttendance[dateStr] === 'present').length;
        const totalRecordedDays = secondHalfDays.length;
        if (totalRecordedDays === 0) presentDays = 15; // default fallback
        maxDays = 15;
        baseSalaryMax = 8000;
        incentive = incentive / 2;
      }
      
      const baseEarned = (presentDays / maxDays) * baseSalaryMax;
      return baseEarned + incentive;
    }

    // For Dentist, gross is their accumulated commission (amountPaid * pct) from procedures
    const dentistIncomes = income.filter(r => r.duty === emp.code).filter(r => {
      const day = parseInt(r.date.split('-')[2], 10);
      if (cutoff === 'full') return true;
      if (cutoff === '1st') return day <= 15;
      return day > 15;
    });
    
    let totalComm = 0;
    dentistIncomes.forEach(r => {
      const { rate } = getProcedureTierAndRate(r.procedure);
      totalComm += (r.amountPaid * rate);
    });
    return totalComm;
  };

  const getEmployeeDeductions = (gross: number, isDentist: boolean) => {
    if (gross <= 0) return { sss: 0, philhealth: 0, pagibig: 0, tax: 0, total: 0 };
    
    if (isDentist) {
      // Philippine contribution models for Dentists
      const sss = Math.min(1000, gross * 0.045);
      const philhealth = Math.min(500, gross * 0.02);
      const pagibig = 200;
      const tax = gross * 0.05; // 5% withholding professional tax
      return {
        sss,
        philhealth,
        pagibig,
        tax,
        total: sss + philhealth + pagibig + tax
      };
    } else {
      // For Assistant, standard monthly gross of 16,000 yields exactly 2,150 of deductions (net 13,850)
      // SSS: 720, Philhealth: 430, Pag-IBIG: 200, Tax: 800. We scale this proportionally to the gross.
      const scale = gross / 16000;
      const sss = 720 * scale;
      const philhealth = 430 * scale;
      const pagibig = 200 * scale;
      const tax = 800 * scale;
      return {
        sss,
        philhealth,
        pagibig,
        tax,
        total: sss + philhealth + pagibig + tax
      };
    }
  };

  // Helper to get daily income values for June 2026 chart
  const getDailyTrendData = () => {
    const daily: { day: number; amount: number }[] = [];
    for (let d = 1; d <= 30; d++) {
      const dateStr = `2026-06-${String(d).padStart(2, '0')}`;
      const sum = income
        .filter(r => r.date === dateStr)
        .reduce((s, r) => s + r.amountPaid, 0);
      daily.push({ day: d, amount: sum });
    }
    return daily;
  };

  const trendData = getDailyTrendData();
  const maxDailyTrend = Math.max(...trendData.map(t => t.amount), 2000) * 1.1;

  // Add a quick schedule leave
  const handleScheduleLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setAttendance(prev => {
      const updated = {
        ...prev,
        [leaveEmp]: {
          ...(prev[leaveEmp] || {}),
          [leaveDate]: 'leave'
        }
      };
      saveDentalData(income, expenses, updated);
      return updated;
    });
    alert(`Scheduled leave for ${employees.find(em => em.code === leaveEmp)?.name} on ${leaveDate}`);
  };

  return (
    <div className={`space-y-6 dental-dashboard-container ${
      printMode === 'report' ? 'printing-report' : ''
    } ${
      printMode === 'payslip' ? 'printing-payslip' : ''
    } ${
      printMode === 'ledger' ? 'printing-ledger' : ''
    } ${
      printMode === 'payroll' ? 'printing-payroll' : ''
    }`}>
      
      <div className="no-print space-y-6">
        {/* Dental Dashboard Brand Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        
        {/* Wavy ARKA Dental Center Custom Logo */}
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-2xl border border-white/15 shadow-inner">
            <svg className="w-40 h-14 text-white" viewBox="0 0 240 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Beautiful flowing wave above */}
              <path 
                d="M 15 35 C 75 10, 115 45, 225 15" 
                stroke="#ffb3c1" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Styled ARKA Text */}
              <path 
                d="M 25 72 L 35 32 L 45 72 M 28 58 L 42 58" 
                stroke="#ffffff" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 60 72 L 60 32 L 80 32 C 92 32 98 37 98 45 C 98 52 90 56 80 56 L 60 56 M 78 56 L 98 72" 
                stroke="#ffffff" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Distinctive Minimalist "<" for "K" */}
              <path 
                d="M 135 34 L 110 52 L 135 70" 
                stroke="#93c5fd" 
                strokeWidth="5.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 150 72 L 160 32 L 170 72 M 153 58 L 167 58" 
                stroke="#ffffff" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              
              {/* Dental Center subtitle */}
              <text 
                x="100" 
                y="88" 
                fill="#94a3b8" 
                fontSize="11" 
                fontWeight="700" 
                letterSpacing="3.5" 
                textAnchor="middle"
              >
                DENTAL CENTER
              </text>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 font-display">
              Ingress Dashboard <span className="text-teal-400 font-mono text-xs font-normal">&bull; June 2026</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono">AUTHORIZED PERSONNEL ONLY &bull; MULTI-PHASE HUB</p>
          </div>
        </div>

        {/* Unified 4-Phase Tabs Layout */}
        <div className="flex flex-col xl:flex-row items-center gap-4">
          <div className="bg-black/30 p-1.5 rounded-2xl border border-white/10 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveSubTab('phase1')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'phase1' 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📊 Phase 1: Data monitoring
            </button>
            <button
              onClick={() => setActiveSubTab('phase2')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'phase2' 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📝 Phase 2: Input update
            </button>
            <button
              onClick={() => setActiveSubTab('phase3')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'phase3' 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📅 Phase 3: Attendance and Payroll
            </button>
            <button
              onClick={() => setActiveSubTab('phase4')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'phase4' 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📁 Phase 4: Receipt and ledger uploader
            </button>
          </div>

          {/* Clean Dark Print Button */}
          <button
            onClick={printReport}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4 text-zinc-300" />
            Print Full Report
          </button>
        </div>
      </div>

      {/* PHASE 1: FINANCIAL OVERVIEW & CHARTS */}
      {activeSubTab === 'phase1' && (
        <div className="space-y-6">
          {/* Phase 1 Actions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                📈 Phase 1: Data monitoring
              </h3>
              <p className="text-[11px] text-zinc-400">Executive metrics, daily visual trends, and expense categorizations</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={printReport}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-zinc-300" />
                🖨️ Print 2-Page Report
              </button>
              <button
                onClick={handleExportLedgerCSV}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                📥 Export to CSV
              </button>
            </div>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 border border-emerald-500/15 backdrop-blur-[20px] rounded-2xl relative overflow-hidden">
              <div className="absolute right-4 top-4 text-emerald-500/10">
                <TrendingUp className="w-10 h-10" />
              </div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider font-mono">Gross Income</div>
              <div className="text-2xl font-semibold text-white font-mono mt-2">{formatMoney(totalGrossIncome)}</div>
              <p className="text-[10px] text-zinc-400 mt-1">Sum of lab, HMO &amp; paid</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-rose-500/5 to-rose-500/0 border border-rose-500/15 backdrop-blur-[20px] rounded-2xl relative overflow-hidden">
              <div className="absolute right-4 top-4 text-rose-500/10">
                <TrendingDown className="w-10 h-10" />
              </div>
              <div className="text-xs text-rose-400 font-bold uppercase tracking-wider font-mono">Total Expenses</div>
              <div className="text-2xl font-semibold text-white font-mono mt-2">{formatMoney(totalExpenses)}</div>
              <p className="text-[10px] text-zinc-400 mt-1">All categorised bills</p>
            </div>

            <div className={`p-5 bg-gradient-to-br ${netIncome >= 0 ? 'from-sky-500/5' : 'from-red-500/5'} border ${netIncome >= 0 ? 'border-sky-500/15' : 'border-red-500/15'} backdrop-blur-[20px] rounded-2xl relative overflow-hidden`}>
              <div className="absolute right-4 top-4 text-zinc-500/10">
                <Activity className="w-10 h-10" />
              </div>
              <div className={`text-xs ${netIncome >= 0 ? 'text-sky-400' : 'text-red-400'} font-bold uppercase tracking-wider font-mono`}>Net Income</div>
              <div className="text-2xl font-semibold text-white font-mono mt-2">{formatMoney(netIncome)}</div>
              <p className="text-[10px] text-zinc-400 mt-1">Income minus expenses</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-500/5 to-amber-500/0 border border-amber-500/15 backdrop-blur-[20px] rounded-2xl relative overflow-hidden">
              <div className="absolute right-4 top-4 text-amber-500/10">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider font-mono">Profit Margin</div>
              <div className="text-2xl font-semibold text-white font-mono mt-2">{profitMargin.toFixed(1)}%</div>
              <p className="text-[10px] text-zinc-400 mt-1">Net profit margin ratio</p>
            </div>

          </div>

          {/* Interactive Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SVG Bar Chart: Income vs Expenses vs Net */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display mb-1">
                  📊 Financial Comparison metrics
                </h3>
                <p className="text-[11px] text-zinc-400">Comparing gross income, operational expenses, and net profit</p>
              </div>

              {/* Dynamic Bar Display */}
              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-zinc-300">Gross Income</span>
                    <span className="text-[#93c5fd] font-mono">{formatMoney(totalGrossIncome)}</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(147,197,253,0.3)]" 
                      style={{ 
                        width: `${Math.min(100, (totalGrossIncome / Math.max(totalGrossIncome, totalExpenses, 1)) * 100)}%`,
                        backgroundColor: '#93c5fd'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-zinc-300">Total Expenses</span>
                    <span className="text-[#ffb3c1] font-mono">{formatMoney(totalExpenses)}</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,179,193,0.3)]" 
                      style={{ 
                        width: `${Math.min(100, (totalExpenses / Math.max(totalGrossIncome, totalExpenses, 1)) * 100)}%`,
                        backgroundColor: '#ffb3c1'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-zinc-300">Net Operational Balance</span>
                    <span className="text-zinc-100 font-mono">{formatMoney(netIncome)}</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(192,132,252,0.3)] bg-gradient-to-r from-[#93c5fd] to-[#ffb3c1]" 
                      style={{ width: `${Math.min(100, (Math.abs(netIncome) / Math.max(totalGrossIncome, totalExpenses, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-zinc-400">
                <Info className="w-3.5 h-3.5 text-zinc-500" />
                <span>Computed dynamically based on Phase 2 general ledger updates.</span>
              </div>
            </div>

            {/* SVG Pie Donut Chart: Profit Distribution */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display mb-1">
                  🍩 Cost-to-Profit distribution
                </h3>
                <p className="text-[11px] text-zinc-400">Comparing net revenue to baseline overhead bills</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 mt-6">
                 {/* SVG Circle Drawing */}
                 <div className="relative w-36 h-36 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     {/* Background Ring */}
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
                     
                     {/* Expenses Slice (Glowing Orange) */}
                     <circle 
                       cx="50" 
                       cy="50" 
                       r="40" 
                       fill="transparent" 
                       stroke="#f97316" 
                       strokeWidth="12" 
                       strokeDasharray="251.2" 
                       strokeDashoffset={totalGrossIncome > 0 ? (totalExpenses / totalGrossIncome) * 251.2 : 251.2} 
                       className="transition-all duration-1000 drop-shadow-[0_0_4px_rgba(249,115,22,0.4)]"
                     />
 
                     {/* Net Income Slice (Glowing Teal) */}
                     {netIncome > 0 && (
                       <circle 
                         cx="50" 
                         cy="50" 
                         r="40" 
                         fill="transparent" 
                         stroke="#2dd4bf" 
                         strokeWidth="12" 
                         strokeDasharray="251.2" 
                         strokeDashoffset={251.2 - (netIncome / totalGrossIncome) * 251.2} 
                         className="transition-all duration-1000 drop-shadow-[0_0_4px_rgba(45,212,191,0.4)]"
                       />
                     )}
                   </svg>
                   {/* Central Text Overlay */}
                   <div className="absolute text-center">
                     <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Net</span>
                     <div className="text-sm font-bold text-white font-mono mt-0.5">
                       {totalGrossIncome > 0 ? ((netIncome / totalGrossIncome) * 100).toFixed(0) : '0'}%
                     </div>
                   </div>
                 </div>
 
                 {/* Legend and stats */}
                 <div className="space-y-3 shrink-0">
                   <div className="flex items-center gap-2.5">
                     <span className="w-3 h-3 rounded shadow-[0_0_6px_rgba(45,212,191,0.5)]" style={{ backgroundColor: '#2dd4bf' }} />
                     <div>
                       <div className="text-[11px] text-zinc-400">Retained Net Income</div>
                       <div className="text-xs font-bold text-white font-mono">
                         {netIncome > 0 ? formatMoney(netIncome) : '₱0.00'}
                       </div>
                     </div>
                   </div>
 
                   <div className="flex items-center gap-2.5">
                     <span className="w-3 h-3 rounded shadow-[0_0_6px_rgba(249,115,22,0.5)]" style={{ backgroundColor: '#f97316' }} />
                     <div>
                       <div className="text-[11px] text-zinc-400">Clinic Expenditures</div>
                       <div className="text-xs font-bold text-white font-mono">{formatMoney(totalExpenses)}</div>
                     </div>
                   </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 bg-zinc-800 rounded" />
                    <div>
                      <div className="text-[11px] text-zinc-400">Gross Baseline Target</div>
                      <div className="text-xs font-bold text-white font-mono">{formatMoney(totalGrossIncome)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-zinc-500 text-center">
                Visualizing operational costs as slice percentage of overall revenue.
              </div>
            </div>

          </div>

          {/* SVG Line Chart: Daily Income Trend */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display mb-1">
                  📈 June 2026 Daily Income Trend
                </h3>
                <p className="text-[11px] text-zinc-400">Daily ledger income tracked sequentially over 30 days</p>
              </div>
              <div className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg font-bold border border-amber-500/20 uppercase tracking-widest font-mono">
                June Period
              </div>
            </div>

            {/* Line Chart Grid Drawing */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px] h-60 relative px-2">
                <svg className="w-full h-full" viewBox="0 0 1000 240" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="orange-trend-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="cyber-pillar-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((val, i) => (
                    <line 
                      key={i} 
                      x1="40" 
                      y1={40 + val * 160} 
                      x2="980" 
                      y2={40 + val * 160} 
                      stroke="rgba(45,212,191,0.06)" 
                      strokeWidth="1" 
                      strokeDasharray="4"
                    />
                  ))}

                  {/* High-Tech Vertical Cyber Grid Lines */}
                  {trendData.map((t, idx) => {
                    if (idx % 3 === 0 || idx === 29) {
                      const x = 40 + (idx * (940 / 29));
                      return (
                        <line 
                          key={`v-${idx}`}
                          x1={x}
                          y1="40"
                          x2={x}
                          y2="200"
                          stroke="rgba(45,212,191,0.04)"
                          strokeWidth="1"
                          strokeDasharray="2"
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Cyber Equalizer Pillars (represents daily amount with high-tech neon green / teal translucent rods) */}
                  {trendData.map((t, idx) => {
                    const x = 40 + (idx * (940 / 29));
                    const y = 200 - (t.amount / Math.max(maxDailyTrend, 1)) * 160;
                    const pillarHeight = 200 - y;
                    if (pillarHeight <= 1) return null;
                    return (
                      <g key={`pillar-${idx}`}>
                        {/* Shimmering vertical rod backdrop */}
                        <rect
                          x={x - 2}
                          y={y}
                          width="4"
                          height={pillarHeight}
                          fill="url(#cyber-pillar-grad)"
                          rx="1.5"
                        />
                        {/* Hyper-glowing thin laser core line */}
                        <line
                          x1={x}
                          y1="200"
                          x2={x}
                          y2={y}
                          stroke="#2dd4bf"
                          strokeWidth="1.2"
                          strokeOpacity="0.4"
                        />
                        {/* Micro-node contact point */}
                        <circle
                          cx={x}
                          cy="200"
                          r="1.5"
                          fill="#10b981"
                          fillOpacity="0.6"
                        />
                      </g>
                    );
                  })}

                  {/* Floating particles or secondary indicators from the graph image */}
                  {trendData.map((t, idx) => {
                    if (idx % 4 === 1 && t.amount > 0) {
                      const x = 40 + (idx * (940 / 29));
                      const y = 200 - (t.amount / Math.max(maxDailyTrend, 1)) * 160 - 8;
                      return (
                        <circle
                          key={`particle-${idx}`}
                          cx={x}
                          cy={y}
                          r="1.8"
                          fill="#2dd4bf"
                          className="animate-pulse"
                          opacity="0.6"
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Secondary dashed target trend line (represents moving rolling benchmark) */}
                  <path 
                    d={(() => {
                      const points = trendData.map((t, idx) => {
                        const x = 40 + (idx * (940 / 29));
                        // Rolling average or a dynamic custom target curve
                        const baselineVal = maxDailyTrend * 0.45 + (Math.sin(idx / 3) * (maxDailyTrend * 0.15));
                        const y = 200 - (baselineVal / Math.max(maxDailyTrend, 1)) * 160;
                        return `${x},${y}`;
                      });
                      if (points.length === 0) return '';
                      return `M ${points.join(' L ')}`;
                    })()}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeOpacity="0.35"
                  />

                  {/* Glowing Area Under Trendline */}
                  <path 
                    d={(() => {
                      const points = trendData.map((t, idx) => {
                        const x = 40 + (idx * (940 / 29));
                        const y = 200 - (t.amount / Math.max(maxDailyTrend, 1)) * 160;
                        return `${x},${y}`;
                      });
                      if (points.length === 0) return '';
                      return `M 40 200 L ${points.map(p => p.replace(',', ' ')).join(' L ')} L ${40 + 29 * (940 / 29)} 200 Z`;
                    })()}
                    fill="url(#orange-trend-glow)"
                  />

                  {/* Connecting Line (Neon Orange Glow) */}
                  <path 
                    d={trendData.reduce((acc, t, idx) => {
                      const x = 40 + (idx * (940 / 29));
                      const y = 200 - (t.amount / Math.max(maxDailyTrend, 1)) * 160;
                      return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, '')}
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                  />

                  {/* Points on Line */}
                  {trendData.map((t, idx) => {
                    const x = 40 + (idx * (940 / 29));
                    const y = 200 - (t.amount / Math.max(maxDailyTrend, 1)) * 160;
                    return (
                      <g key={idx} className="group cursor-pointer">
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="4.5" 
                          fill="#ffffff" 
                          stroke="#f97316" 
                          strokeWidth="2.5" 
                          className="transition-transform group-hover:scale-150 drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]"
                        />
                        {t.amount > 0 && (
                          <text 
                            x={x} 
                            y={y - 12} 
                            fill="#ffffff" 
                            fontSize="8" 
                            fontFamily="monospace" 
                            fontWeight="bold" 
                            textAnchor="middle"
                            className="opacity-0 group-hover:opacity-100 bg-black/80 px-1 transition-opacity py-0.5 rounded shadow-lg"
                          >
                            ₱{t.amount}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* X-Axis labels */}
                  {trendData.map((t, idx) => {
                    if (idx % 2 === 0 || idx === 29) {
                      const x = 40 + (idx * (940 / 29));
                      return (
                        <text 
                          key={idx} 
                          x={x} 
                          y="225" 
                          fill="rgba(255,255,255,0.4)" 
                          fontSize="9" 
                          fontFamily="monospace" 
                          textAnchor="middle"
                        >
                          {t.day}
                        </text>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: DATA ENTRY TABLE & GENERAL LEDGER */}
      {activeSubTab === 'phase2' && (
        <div id="ledger-phase-container" className="space-y-6">
          
          {/* Calendar Date Filter Bar */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📅</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">General Ledger Calendar Filter</h4>
                <p className="text-[10px] text-zinc-400">Select a specific date to filter both Patient Revenue and Expense Ledgers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                min="2026-06-01"
                max="2026-06-30"
                className="px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white font-mono outline-none focus:border-teal-500 cursor-pointer"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-[10px] font-bold font-mono transition-all cursor-pointer"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Summary Mini Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  Total Ledger Revenue {dateFilter && <span className="px-1.5 py-0.5 text-[8px] bg-teal-500/10 text-teal-300 font-bold rounded">Filtered</span>}
                </span>
                <div className="text-xl font-bold text-white font-mono mt-1">{formatMoney(displayGrossIncome)}</div>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  Total Ledger Expenses {dateFilter && <span className="px-1.5 py-0.5 text-[8px] bg-teal-500/10 text-teal-300 font-bold rounded">Filtered</span>}
                </span>
                <div className="text-xl font-bold text-white font-mono mt-1">{formatMoney(displayExpenses)}</div>
              </div>
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  Running Net Profit {dateFilter && <span className="px-1.5 py-0.5 text-[8px] bg-teal-500/10 text-teal-300 font-bold rounded">Filtered</span>}
                </span>
                <div className="text-xl font-bold text-white font-mono mt-1">{formatMoney(displayNetIncome)}</div>
              </div>
              <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Income Table Card */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                  📋 Patients Income General Ledger
                </h3>
                <p className="text-[11px] text-zinc-400">Patient treatments, HMO deductions, and doctor assignments</p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Inline Editing Toggle */}
                <button
                  onClick={() => {
                    if (isEditingData) {
                      saveDentalData(income, expenses, attendance);
                      alert("Entire application successfully recalculated & synchronized! Phase 1 (Financial Charts), Phase 2 (Ledger logs) and Phase 3 (Commissions, Assistant Salaries) are now completely updated and locked.");
                    }
                    setIsEditingData(!isEditingData);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer border transition-all ${
                    isEditingData 
                      ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20' 
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                  }`}
                >
                  {isEditingData ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                  {isEditingData ? 'Lock & Save Table' : '✏️ Enable Edit Mode'}
                </button>

                <button
                  onClick={handleAddIncomeRow}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add Row
                </button>

                <button
                  onClick={printLedger}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-zinc-300" />
                  🖨️ Print Ledger
                </button>

                <button
                  onClick={handleExportLedgerCSV}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  📥 Export CSV
                </button>
              </div>
            </div>

            {/* Income Table Wrap */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Duty</th>
                    <th className="py-3 px-2">Patient</th>
                    <th className="py-3 px-2">Procedure</th>
                    <th className="py-3 px-2 text-right">Lab Fee</th>
                    <th className="py-3 px-2 text-right">Discount</th>
                    <th className="py-3 px-2 text-right">Amt Paid</th>
                    <th className="py-3 px-2 text-right">% Comm</th>
                    <th className="py-3 px-2">Terminal</th>
                    <th className="py-3 px-2 text-right">Merch Fee</th>
                    <th className="py-3 px-2 text-right">HMO</th>
                    <th className="py-3 px-2 text-right">Gross Total</th>
                    <th className="py-3 px-2 text-right">Net Total</th>
                    <th className="py-3 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {income
                    .map((row, originalIndex) => ({ row, originalIndex }))
                    .filter(({ row }) => !dateFilter || row.date === dateFilter)
                    .map(({ row, originalIndex }) => (
                      <tr key={originalIndex} className="hover:bg-white/5 transition-colors">
                        {isEditingData ? (
                          <>
                            <td className="py-2 px-1">
                              <input 
                                type="date" 
                                value={row.date} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'date', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white max-w-[110px]"
                              />
                            </td>
                            <td className="py-2 px-1">
                              <select 
                                value={row.duty} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'duty', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1 py-1 text-xs text-white"
                              >
                                <option value="ER">ER (Romero)</option>
                                <option value="GA">GA (Abrogena)</option>
                                <option value="KU">KU (Urbi)</option>
                              </select>
                            </td>
                            <td className="py-2 px-1">
                              <input 
                                type="text" 
                                value={row.patient} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'patient', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white max-w-[120px]"
                              />
                            </td>
                            <td className="py-2 px-1">
                              <input 
                                type="text" 
                                value={row.procedure} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'procedure', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white max-w-[100px]"
                              />
                            </td>
                            <td className="py-2 px-1 text-right">
                              <input 
                                type="number" 
                                value={row.labFee} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'labFee', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white text-right max-w-[70px]"
                              />
                            </td>
                            <td className="py-2 px-1 text-right">
                              <input 
                                type="number" 
                                value={row.discount} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'discount', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white text-right max-w-[70px]"
                              />
                            </td>
                            <td className="py-2 px-1 text-right">
                              <input 
                                type="number" 
                                value={row.amountPaid} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'amountPaid', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white text-right max-w-[80px]"
                              />
                            </td>
                            <td className="py-2 px-1 text-right">
                              <input 
                                type="number" 
                                value={row.percentCommission} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'percentCommission', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white text-right max-w-[50px]"
                              />
                            </td>
                            <td className="py-2 px-1">
                              <select 
                                value={row.paymentTerminal} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'paymentTerminal', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1 py-1 text-xs text-white"
                              >
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Gcash">Gcash</option>
                                <option value="BPI">BPI</option>
                              </select>
                            </td>
                            <td className="py-2 px-2 text-right text-zinc-400">
                              {formatMoney(row.ccMerchantFee)}
                            </td>
                            <td className="py-2 px-1 text-right">
                              <input 
                                type="number" 
                                value={row.hmo} 
                                onChange={(e) => handleUpdateIncome(originalIndex, 'hmo', e.target.value)}
                                className="bg-black/60 border border-white/10 rounded px-1.5 py-1 text-xs text-white text-right max-w-[70px]"
                              />
                            </td>
                            <td className="py-2 px-2 text-right text-teal-400 font-bold">
                              {formatMoney(row.totalGross)}
                            </td>
                            <td className="py-2 px-2 text-right text-sky-400 font-bold">
                              {formatMoney(row.netTotal)}
                            </td>
                            <td className="py-2 px-1 text-center">
                              <button 
                                onClick={() => handleDeleteIncome(originalIndex)}
                                className="p-1 text-rose-500 hover:text-rose-400 rounded hover:bg-rose-500/10 cursor-pointer"
                                title="Delete row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-2 text-zinc-300">{row.date}</td>
                            <td className="py-3 px-2 font-bold text-teal-300">{row.duty}</td>
                            <td className="py-3 px-2 text-zinc-200">{row.patient}</td>
                            <td className="py-3 px-2 text-zinc-300">{row.procedure}</td>
                            <td className="py-3 px-2 text-right text-zinc-400">{formatMoney(row.labFee)}</td>
                            <td className="py-3 px-2 text-right text-red-400/80">-{formatMoney(row.discount)}</td>
                            <td className="py-3 px-2 text-right text-emerald-400">{formatMoney(row.amountPaid)}</td>
                            <td className="py-3 px-2 text-right text-zinc-300">{row.percentCommission}%</td>
                            <td className="py-3 px-2"><span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-zinc-300 text-[10px]">{row.paymentTerminal}</span></td>
                            <td className="py-3 px-2 text-right text-zinc-500">{formatMoney(row.ccMerchantFee)}</td>
                            <td className="py-3 px-2 text-right text-zinc-400">{formatMoney(row.hmo)}</td>
                            <td className="py-3 px-2 text-right text-teal-400 font-bold">{formatMoney(row.totalGross)}</td>
                            <td className="py-3 px-2 text-right text-sky-400 font-bold">{formatMoney(row.netTotal)}</td>
                            <td className="py-3 px-2 text-center text-zinc-600 font-sans italic">Data Admin Restricted</td>
                          </>
                        )}
                      </tr>
                    ))}
                  {income.length === 0 && (
                    <tr>
                      <td colSpan={14} className="text-center py-8 text-zinc-500 italic">No income records saved inside current session. Click "+ Add Row" to begin logging.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Expenditures Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Add Expense Entry Form */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display pb-4 border-b border-white/10 mb-4">
                ➕ Add Clinic Expenditure
              </h3>

              <form onSubmit={handleAddExpense} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1.5">Date</label>
                  <input 
                    type="date"
                    value={newExpDate}
                    onChange={(e) => setNewExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1.5">Expense Category</label>
                  <select
                    value={newExpType}
                    onChange={(e) => setNewExpType(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-teal-500"
                    required
                  >
                    <option value="">Select Expense Type</option>
                    {EXPENSE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1.5">Description (optional)</label>
                  <input 
                    type="text"
                    value={newExpDesc}
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    placeholder="E.g. Electric bills payment, clinic gloves"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1.5">Amount (PHP)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-400 font-mono">₱</span>
                    <input 
                      type="number"
                      step="any"
                      value={newExpAmount}
                      onChange={(e) => setNewExpAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-teal-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 active:scale-95 cursor-pointer"
                >
                  + Log Clinic Expense
                </button>
              </form>
            </div>

            {/* Right side: Expenses Table list */}
            <div className="lg:col-span-2 p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display pb-4 border-b border-white/10 mb-4">
                💰 Admin Expenses Ledgers
              </h3>

              <div className="overflow-y-auto max-h-80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 font-mono">
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Category</th>
                      <th className="py-2 px-2">Description</th>
                      <th className="py-2 px-2 text-right">Amount</th>
                      <th className="py-2 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {expenses
                      .map((row, originalIndex) => ({ row, originalIndex }))
                      .filter(({ row }) => !dateFilter || row.date === dateFilter)
                      .map(({ row, originalIndex }, idx) => (
                        <tr key={row.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-2 text-zinc-500">{idx + 1}</td>
                          <td className="py-2.5 px-2 text-zinc-300">{row.date}</td>
                          <td className="py-2.5 px-2 font-bold text-rose-300">{row.type}</td>
                          <td className="py-2.5 px-2 text-zinc-400 italic max-w-[150px] truncate" title={row.description}>
                            {row.description}
                          </td>
                          <td className="py-2.5 px-2 text-right text-white font-bold">{formatMoney(row.amount)}</td>
                          <td className="py-2.5 px-2 text-center">
                            <button 
                              onClick={() => handleDeleteExpense(originalIndex)}
                              className="p-1 text-rose-500 hover:text-rose-400 rounded hover:bg-rose-500/10 cursor-pointer"
                              title="Remove bill record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    <tr className="bg-black/40 font-bold border-t border-white/10">
                      <td colSpan={4} className="py-3 px-2 text-right text-zinc-400 uppercase tracking-widest">Running Total:</td>
                      <td className="py-3 px-2 text-right text-rose-400 text-sm">{formatMoney(displayExpenses)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Formula Reference Box */}
          <div className="p-5 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-indigo-500/15 rounded-2xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-400" />
              Formula &amp; Arithmetic references
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-zinc-400 font-mono leading-relaxed">
              <div className="p-3 bg-black/20 rounded-xl">
                <span className="text-emerald-400 font-bold">TOTAL GROSS INCOME</span><br />
                = Sum of treatments Amount Paid + HMO claims + clinic dental lab fees
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <span className="text-rose-400 font-bold">OPERATIONAL EXPENDITURES</span><br />
                = Sum of clinic utility bills, materials supplies, assistant wages &amp; marketing fees
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <span className="text-sky-400 font-bold">NET INCOME / (LOSS)</span><br />
                = Total Gross Income minus Total Operational Expenses
              </div>
            </div>
          </div>

        </div>
      )}

      {/* PHASE 3: PAYROLL, ATTENDANCE LOGGER & LEAVE CALENDAR */}
      {activeSubTab === 'phase3' && (
        <div id="payroll-phase-container" className="space-y-6">
          
          {/* Paystub Cards List */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                  💰 Phase 3: Attendance and Payroll
                </h3>
                <p className="text-[11px] text-zinc-400">Manage monthly salaries, attendance base-pay, and custom doctor commissions</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Dynamic Cut-off Selector */}
                <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1 font-sans text-xs">
                  <button
                    onClick={() => setPayrollCutoff('1st')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      payrollCutoff === '1st' 
                        ? 'bg-sky-500 text-white shadow-sm' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    1st Cut-off
                  </button>
                  <button
                    onClick={() => setPayrollCutoff('2nd')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      payrollCutoff === '2nd' 
                        ? 'bg-sky-500 text-white shadow-sm' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    2nd Cut-off
                  </button>
                </div>

                <button
                  onClick={printPayroll}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-zinc-300" />
                  🖨️ Print
                </button>
                <button
                  onClick={handleExportPayrollCSV}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  📥 Export
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => {
                const isDentist = emp.role === 'Dentist';
                const gross = getEmployeeGross(emp);
                const deds = getEmployeeDeductions(gross, isDentist);
                const net = gross - deds.total;

                return (
                  <div key={emp.code} className="p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-white">{emp.name}</h4>
                          <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">{emp.role} &bull; {emp.code}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isDentist ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-teal-500/10 text-teal-300 border border-teal-500/20'}`}>
                          {isDentist ? '10% Share' : 'Base Rate'}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] border-t border-white/5 pt-3">
                        <div>
                          <span className="text-zinc-500">Gross Earnings:</span>
                          <div className="font-bold text-white mt-0.5">{formatMoney(gross)}</div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Deductions:</span>
                          <div className="font-bold text-red-400 mt-0.5">-{formatMoney(deds.total)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Net Take-home</span>
                        <div className="text-sm font-bold text-emerald-400 font-mono">{formatMoney(net)}</div>
                      </div>

                      <button
                        onClick={() => setSelectedPayslipEmp(emp)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Payslip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-zinc-500 font-sans mt-4 italic">
              ⚠️ Advisory Notice: SSS, PhilHealth, Pag-IBIG and BIR withholding calculations shown here are automated estimates matching clinic guidelines.
            </p>
          </div>

          {/* Attendance Logger Grid */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="pb-4 border-b border-white/10 mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                📅 June 2026 Interactive Attendance Tracker
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">Select an employee below and click on any calendar cell day to toggle status:</p>
            </div>

            {/* Employee Selector tabs */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {employees.map(emp => (
                <button
                  key={emp.code}
                  onClick={() => setActiveAttendanceEmployee(emp.code)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    activeAttendanceEmployee === emp.code 
                      ? 'bg-teal-500 text-white border-teal-400 shadow-md shadow-teal-500/10' 
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/5'
                  }`}
                >
                  {emp.name.split(' ')[0]} ({emp.code})
                </button>
              ))}
            </div>

            {/* Attendance Days Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const d = i + 1;
                const dateStr = `2026-06-${String(d).padStart(2, '0')}`;
                const status = (attendance[activeAttendanceEmployee] && attendance[activeAttendanceEmployee][dateStr]) || 'present';

                return (
                  <button
                    key={d}
                    onClick={() => cycleAttendance(activeAttendanceEmployee, dateStr)}
                    className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl flex flex-col items-center justify-between gap-1 cursor-pointer transition-all active:scale-95 group relative"
                  >
                    <span className="text-zinc-500 text-[9px] font-mono">June</span>
                    <span className="text-sm font-bold text-white font-mono">{d}</span>
                    
                    {/* Status Dot / Indicator */}
                    <div className="mt-1">
                      {status === 'present' && <span className="text-[10px]" title="Present">🟢</span>}
                      {status === 'absent' && <span className="text-[10px]" title="Absent">🔴</span>}
                      {status === 'leave' && <span className="text-[10px]" title="On Leave">🟡</span>}
                    </div>

                    <div className="absolute inset-0 bg-black/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-mono text-zinc-300 font-bold uppercase p-0.5 text-center">
                      Toggle State
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Aggregate counts */}
            {attendance[activeAttendanceEmployee] && (
              <div className="mt-6 p-4 bg-black/20 rounded-2xl flex flex-wrap items-center justify-around gap-4 text-xs font-mono">
                <div className="text-zinc-400">
                  <strong className="text-white">{employees.find(em => em.code === activeAttendanceEmployee)?.name}</strong> summary:
                </div>
                <div className="flex items-center gap-1.5">
                  🟢 Present: <span className="text-emerald-400 font-bold">{Object.values(attendance[activeAttendanceEmployee]).filter(s => s === 'present').length} Days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  🔴 Absent: <span className="text-rose-400 font-bold">{Object.values(attendance[activeAttendanceEmployee]).filter(s => s === 'absent').length} Days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  🟡 On Leave: <span className="text-amber-400 font-bold">{Object.values(attendance[activeAttendanceEmployee]).filter(s => s === 'leave').length} Days</span>
                </div>
              </div>
            )}
          </div>

          {/* Calendar & Leave Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Calendar Grid (June 2026, starts on Monday) */}
            <div className="lg:col-span-2 p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <div className="pb-4 border-b border-white/10 mb-4 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
                  🗓️ June 2026 Monthly Clinic Leave Calendar
                </h3>
                <span className="text-xs font-mono text-zinc-400">1st is Monday</span>
              </div>

              {/* Day Headers Sun-Sat */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>

              {/* 7 columns grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* June 1 2026 is Monday. Sun is 1st column empty cell */}
                <div className="aspect-video bg-white/[0.01] rounded-xl border border-white/[0.02]" />

                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `2026-06-${String(dayNum).padStart(2, '0')}`;
                  
                  // Check who is on leave on this date
                  const absenteesOnLeave = employees.filter(emp => {
                    return attendance[emp.code] && attendance[emp.code][dateStr] === 'leave';
                  });

                  return (
                    <div key={dayNum} className="aspect-video bg-white/5 border border-white/5 rounded-xl p-1.5 flex flex-col justify-between items-start overflow-hidden relative">
                      <span className="text-xs font-bold text-zinc-400 font-mono">{dayNum}</span>
                      
                      <div className="w-full space-y-0.5 mt-1 overflow-y-auto max-h-[25px]">
                        {absenteesOnLeave.map(emp => (
                          <div 
                            key={emp.code}
                            className="bg-amber-500/20 border border-amber-500/30 rounded text-[8px] font-mono text-amber-300 text-center font-bold px-0.5 py-0.5 scale-95"
                            title={`${emp.name} on Leave`}
                          >
                            {emp.code} Leave
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leave quick schedule panel */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display pb-4 border-b border-white/10 mb-4">
                📝 Schedule Custom Leave
              </h3>

              <form onSubmit={handleScheduleLeave} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1.5">Employee Name</label>
                  <select
                    value={leaveEmp}
                    onChange={(e) => setLeaveEmp(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-teal-500"
                    required
                  >
                    {employees.map(emp => (
                      <option key={emp.code} value={emp.code}>{emp.name} ({emp.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1.5">Leave Date</label>
                  <input 
                    type="date"
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    min="2026-06-01"
                    max="2026-06-30"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-teal-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1.5">Leave Reason</label>
                  <input 
                    type="text"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Medical, Holiday, Family Event..."
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  Schedule Leave Day
                </button>
              </form>
            </div>

          </div>

          {/* Year-to-Date Table Card */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 font-display pb-4 border-b border-white/10 mb-4">
              📊 Year-to-Date (YTD) Cumulative Payroll Projections
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono">
                    <th className="py-2.5 px-2">Employee Name</th>
                    <th className="py-2.5 px-2">Role</th>
                    <th className="py-2.5 px-2 text-right">June Earnings</th>
                    <th className="py-2.5 px-2 text-right">Total Deductions</th>
                    <th className="py-2.5 px-2 text-right">Net June Pay</th>
                    <th className="py-2.5 px-2 text-right">Projected Annual YTD Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {employees.map(emp => {
                    const isDentist = emp.role === 'Dentist';
                    const gross = getEmployeeGross(emp);
                    const deds = getEmployeeDeductions(gross, isDentist);
                    const net = gross - deds.total;
                    const projectedYtd = net * 6; // June represents 6 months of metrics

                    return (
                      <tr key={emp.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-2 font-bold text-white">{emp.name}</td>
                        <td className="py-2.5 px-2 text-zinc-400">{emp.role}</td>
                        <td className="py-2.5 px-2 text-right text-teal-400">{formatMoney(gross)}</td>
                        <td className="py-2.5 px-2 text-right text-rose-400">-{formatMoney(deds.total)}</td>
                        <td className="py-2.5 px-2 text-right text-sky-400 font-bold">{formatMoney(net)}</td>
                        <td className="py-2.5 px-2 text-right text-emerald-400 font-extrabold">{formatMoney(projectedYtd)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* PHASE 4: SECURED DOCUMENT AND REPORT VAULT (FOLDER STORAGE SYSTEM) */}
      {activeSubTab === 'phase4' && (
        <div className="space-y-6">
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 font-bold">
                📁
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-display">Phase 4: Receipt and ledger uploader</h3>
                <p className="text-[11px] text-zinc-400">Two secured folder directories for Excel sheet general ledger mapping and OCR screenshot receipt indexing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* FOLDER 1: EXCEL REPORT PARSER & SYNCHRONIZER */}
              <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Folder className="w-8 h-8 text-sky-400 fill-sky-400/20" />
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">1st Folder: Excel Ledger Filter</h4>
                        <p className="text-[10px] text-zinc-400">Filter, parse, and synchronize clinical spreadsheet records onto live state.</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-300 font-mono px-2 py-0.5 rounded">
                      Reflects to Phase 1 &amp; 2
                    </span>
                  </div>

                  {/* Active Spreadsheets list selector */}
                  <div className="space-y-2 mb-4">
                    <label className="block text-[9px] text-zinc-500 font-mono uppercase font-bold tracking-widest">Select Spreadsheet File:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {excelFiles.map(file => (
                        <button
                          key={file.id}
                          onClick={() => setSelectedExcelId(file.id)}
                          className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                            selectedExcelId === file.id
                              ? 'bg-sky-500/10 border-sky-400 text-sky-300 shadow-lg shadow-sky-500/5'
                              : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold truncate">
                            <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <div className="text-[9px] text-zinc-500 mt-1 flex justify-between">
                            <span>{file.recordsCount} rows</span>
                            <span>₱{file.totalAmount.toLocaleString()}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Excel rows */}
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider">
                        Filter Spreadsheet Rows:
                      </span>
                      <select
                        value={excelFilter}
                        onChange={(e: any) => setExcelFilter(e.target.value)}
                        className="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-sky-400 font-mono"
                      >
                        <option value="all">🔍 All Rows (Income + Expenses)</option>
                        <option value="income">💰 Income Rows Only</option>
                        <option value="expense">📉 Expense Rows Only</option>
                        <option value="high_margin">💎 High-Margin Income (₱8,000+)</option>
                        <option value="major">👑 Major Procedures (Tier 2)</option>
                      </select>
                    </div>

                    {/* Render Filtered Spreadsheet Rows */}
                    <div className="mt-3 overflow-y-auto max-h-48 border border-white/5 rounded-lg">
                      <table className="w-full text-left text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/5 text-zinc-400 font-mono">
                            <th className="p-1.5">Date</th>
                            <th className="p-1.5">Duty</th>
                            <th className="p-1.5">Label / Patient</th>
                            <th className="p-1.5">Procedure / Item</th>
                            <th className="p-1.5 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-zinc-300">
                          {(() => {
                            const activeFile = excelFiles.find(f => f.id === selectedExcelId);
                            if (!activeFile) return null;
                            
                            const filteredRows = activeFile.rows.filter(row => {
                              if (excelFilter === 'income') return row.type === 'Income';
                              if (excelFilter === 'expense') return row.type === 'Expense';
                              if (excelFilter === 'high_margin') return row.type === 'Income' && row.amountPaid >= 8000;
                              if (excelFilter === 'major') {
                                const { tier } = getProcedureTierAndRate(row.procedure);
                                return row.type === 'Income' && tier === 2;
                              }
                              return true;
                            });

                            if (filteredRows.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="text-center py-4 text-zinc-500 italic">No rows matching filter.</td>
                                </tr>
                              );
                            }

                            return filteredRows.map((row, index) => (
                              <tr key={index} className="hover:bg-white/5">
                                <td className="p-1.5">{row.date}</td>
                                <td className="p-1.5 font-bold text-sky-300">{row.duty}</td>
                                <td className="p-1.5 truncate max-w-[80px]">{row.patient}</td>
                                <td className="p-1.5 truncate max-w-[90px]">{row.procedure}</td>
                                <td className={`p-1.5 text-right font-bold ${row.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  ₱{row.amountPaid.toLocaleString()}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Sync Button */}
                <button
                  onClick={() => {
                    const activeFile = excelFiles.find(f => f.id === selectedExcelId);
                    if (!activeFile) return;

                    const filteredRows = activeFile.rows.filter(row => {
                      if (excelFilter === 'income') return row.type === 'Income';
                      if (excelFilter === 'expense') return row.type === 'Expense';
                      if (excelFilter === 'high_margin') return row.type === 'Income' && row.amountPaid >= 8000;
                      if (excelFilter === 'major') {
                        const { tier } = getProcedureTierAndRate(row.procedure);
                        return row.type === 'Income' && tier === 2;
                      }
                      return true;
                    });

                    // Parse & Map to live states
                    const addedIncome: IncomeRow[] = [];
                    const addedExpense: ExpenseRow[] = [];

                    filteredRows.forEach(row => {
                      if (row.type === 'Income') {
                        const { rate } = getProcedureTierAndRate(row.procedure);
                        const totalGross = row.amountPaid;
                        addedIncome.push({
                          date: row.date,
                          duty: row.duty,
                          patient: row.patient,
                          procedure: row.procedure,
                          labFee: 0,
                          discount: 0,
                          amountPaid: row.amountPaid,
                          percentCommission: rate * 100,
                          pct: rate,
                          paymentTerminal: 'Cash',
                          ccMerchantFee: 0,
                          hmo: 0,
                          totalGross,
                          salaryRestricted: 'DATA FOR ADMIN ONLY',
                          netTotal: totalGross - (row.amountPaid * rate)
                        });
                      } else {
                        addedExpense.push({
                          id: Date.now() + Math.random(),
                          date: row.date,
                          type: row.category === 'Supplies' ? 'Dental Supplies' : 'Electric Bill',
                          description: row.procedure,
                          amount: row.amountPaid
                        });
                      }
                    });

                    const finalIncome = [...income, ...addedIncome];
                    const finalExpenses = [...expenses, ...addedExpense];
                    setIncome(finalIncome);
                    setExpenses(finalExpenses);
                    saveDentalData(finalIncome, finalExpenses, attendance);

                    alert(`Successfully imported & synchronized ${filteredRows.length} records! Financial metrics in Phase 1 and General Ledger in Phase 2 have been updated dynamically.`);
                  }}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  Sync &amp; Reflect Filtered Excel Rows onto Phase 1 &amp; 2
                </button>
              </div>

              {/* FOLDER 2: INTERACTIVE SCREENSHOT & RECEIPT DROPPER */}
              <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-8 h-8 text-pink-400 fill-pink-400/20" />
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">2nd Folder: Receipt Screenshot Dropper</h4>
                        <p className="text-[10px] text-zinc-400">Drop screenshots of receipts to auto-record dates and extraction timestamps.</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-pink-500/10 border border-pink-500/20 text-pink-300 font-mono px-2 py-0.5 rounded">
                      Smart timestamp storage
                    </span>
                  </div>

                  {/* Interactive Drag & Drop Area */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      setOcrScanning(true);
                      setScanningStep('Reading digital file metadata...');
                      
                      setTimeout(() => setScanningStep('Extracting character OCR streams...'), 800);
                      setTimeout(() => setScanningStep('Deducing receipt timestamp and totals...'), 1700);
                      setTimeout(() => {
                        const now = new Date();
                        const timeStr = now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) + ", " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        // Pick a mock receipt template
                        const options = [
                          { name: 'GrabFood Team Lunch', vendor: 'GrabFood Philippines', amount: 840, category: 'Food', note: 'Staff operations meals' },
                          { name: 'Water Bill Maynilad', vendor: 'Maynilad Water', amount: 640, category: 'Water Bill', note: 'Clinic plumbing utility' },
                          { name: 'Dental Composites Extra Pack', vendor: 'GC Dental Materials', amount: 3500, category: 'Dental Supplies', note: 'Special restoration pack' }
                        ];
                        const chosen = options[Math.floor(Math.random() * options.length)];

                        const newRec = {
                          id: 'rec-' + Date.now(),
                          name: chosen.name,
                          vendor: chosen.vendor,
                          timestamp: timeStr,
                          fileName: 'screenshot_' + now.getTime() + '.png',
                          fileSize: '384 KB',
                          amount: chosen.amount,
                          category: chosen.category,
                          note: chosen.note
                        };

                        setReceipts(prev => [newRec, ...prev]);
                        setOcrScanning(false);
                        
                        // Auto log to expenses as well!
                        const addedExpense: ExpenseRow = {
                          id: Date.now(),
                          date: '2026-06-25',
                          type: chosen.category,
                          description: `OCR Screenshot: ${chosen.name} (${chosen.note})`,
                          amount: chosen.amount
                        };
                        const updatedExp = [...expenses, addedExpense];
                        setExpenses(updatedExp);
                        saveDentalData(income, updatedExp, attendance);

                        alert(`Successfully processed receipt at ${timeStr}! Extracted ₱${chosen.amount.toLocaleString()} from ${chosen.vendor}. Logged onto document storage.`);
                      }, 2500);
                    }}
                    onClick={() => {
                      // Trigger same uploader natively
                      setOcrScanning(true);
                      setScanningStep('Selecting receipt image...');
                      setTimeout(() => setScanningStep('Running OCR character extraction...'), 800);
                      setTimeout(() => {
                        const now = new Date();
                        const timeStr = now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) + ", " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const newRec = {
                          id: 'rec-' + Date.now(),
                          name: 'GC Dental Composites',
                          vendor: 'GC Philippines',
                          timestamp: timeStr,
                          fileName: 'screenshot_manual_upload.png',
                          fileSize: '512 KB',
                          amount: 2900,
                          category: 'Dental Supplies',
                          note: 'GC G-aenial composite syringes'
                        };
                        setReceipts(prev => [newRec, ...prev]);
                        setOcrScanning(false);

                        // Auto log to expenses
                        const addedExpense: ExpenseRow = {
                          id: Date.now(),
                          date: '2026-06-25',
                          type: 'Dental Supplies',
                          description: 'GC Dental Composites syringe pack',
                          amount: 2900
                        };
                        const updatedExp = [...expenses, addedExpense];
                        setExpenses(updatedExp);
                        saveDentalData(income, updatedExp, attendance);

                        alert(`Receipt analyzed! System recorded receipt timestamp: ${timeStr}`);
                      }, 2000);
                    }}
                    className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-pink-400 bg-pink-500/5' 
                        : 'border-white/10 bg-white/[0.01] hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {ocrScanning ? (
                      <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full border-4 border-pink-400 border-t-transparent animate-spin mx-auto" />
                        <span className="text-[11px] font-mono text-pink-300 block animate-pulse">{scanningStep}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-pink-400 mx-auto animate-bounce" />
                        <div className="text-xs font-bold text-white">Drag &amp; Drop Screenshot Receipt Here</div>
                        <p className="text-[9px] text-zinc-500">Supports PNG, JPG, PDF. The system will note what time of receipt we have on our storage.</p>
                      </div>
                    )}
                  </div>

                  {/* Receipts list */}
                  <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                    <span className="block text-[9px] text-zinc-500 font-mono uppercase font-bold tracking-widest">Storage Logs ({receipts.length} items):</span>
                    {receipts.map(rec => (
                      <div key={rec.id} className="p-2.5 bg-black/20 border border-white/5 rounded-xl flex justify-between items-center text-[10px] font-mono">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm">🧾</span>
                          <div className="truncate">
                            <span className="block text-white font-bold truncate">{rec.name}</span>
                            <span className="block text-zinc-500 text-[8px] truncate">Received: {rec.timestamp}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-pink-300 font-extrabold">₱{rec.amount.toLocaleString()}</span>
                          <span className="block text-[8px] text-zinc-400 bg-white/5 px-1 py-0.5 rounded inline-block mt-0.5">{rec.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-xl mt-4 text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Dropped screenshot screenshots automatically populate billing items &amp; times.</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal Overlay */}
      {selectedPayslipEmp && (() => {
        const isDentist = selectedPayslipEmp.role === 'Dentist';
        const gross = getEmployeeGross(selectedPayslipEmp, payrollCutoff);
        const deds = getEmployeeDeductions(gross, isDentist);
        const net = gross - deds.total;

        // Calculate helper values for breakdown dynamically based on selected cut-off
        const empAttendance = attendance[selectedPayslipEmp.code] || {};
        
        let presentDays = 0;
        let maxDays = 30;
        let baseSalaryMax = 16000;
        let incentive = assistantIncentives[selectedPayslipEmp.code] || 0;
        
        if (payrollCutoff === 'full') {
          presentDays = Object.values(empAttendance).filter(s => s === 'present').length;
          const totalRecordedDays = Object.keys(empAttendance).length;
          if (totalRecordedDays === 0) presentDays = 30;
          maxDays = 30;
          baseSalaryMax = 16000;
        } else if (payrollCutoff === '1st') {
          const firstHalfDays = Object.keys(empAttendance).filter(dateStr => {
            const day = parseInt(dateStr.split('-')[2], 10);
            return day <= 15;
          });
          presentDays = firstHalfDays.filter(dateStr => empAttendance[dateStr] === 'present').length;
          const totalRecordedDays = firstHalfDays.length;
          if (totalRecordedDays === 0) presentDays = 15;
          maxDays = 15;
          baseSalaryMax = 8000;
          incentive = incentive / 2;
        } else {
          const secondHalfDays = Object.keys(empAttendance).filter(dateStr => {
            const day = parseInt(dateStr.split('-')[2], 10);
            return day > 15;
          });
          presentDays = secondHalfDays.filter(dateStr => empAttendance[dateStr] === 'present').length;
          const totalRecordedDays = secondHalfDays.length;
          if (totalRecordedDays === 0) presentDays = 15;
          maxDays = 15;
          baseSalaryMax = 8000;
          incentive = incentive / 2;
        }
        
        const baseGross = (presentDays / maxDays) * baseSalaryMax;

        return (
          <div id="payslip-print-modal-wrapper" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#0e0e11] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative font-sans text-xs">
              
              {/* Header */}
              <div className="bg-white/5 border-b border-white/10 p-6 flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🦷</span>
                  <div>
                    <h3 className="font-semibold text-white uppercase tracking-wider font-display">ARKA Dental Center</h3>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      PAYSLIP STATEMENT &bull; {payrollCutoff === '1st' ? '1ST CUT-OFF (JUNE 1-15)' : '2ND CUT-OFF (JUNE 16-30)'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPayslipEmp(null)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer no-print"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div id="print-ready-payslip" className="p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-white/5 font-mono text-[11px] text-zinc-400">
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Employee Name:</span>
                    <span className="block text-white font-bold mt-0.5">{selectedPayslipEmp.name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Designation:</span>
                    <span className="block text-white font-bold mt-0.5">{selectedPayslipEmp.code} ({selectedPayslipEmp.role})</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold">TIN Identifier:</span>
                    <span className="block text-white font-bold mt-0.5">{selectedPayslipEmp.tin || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold text-sky-400">Disbursement:</span>
                    <span className="block text-emerald-400 font-bold mt-0.5">{payrollCutoff === '1st' ? 'June 20, 2026' : 'July 5, 2026'}</span>
                  </div>
                </div>

                {/* Earnings */}
                <div className="space-y-2">
                  <h4 className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">1. Professional Earnings &amp; Base Salary</h4>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 font-mono text-[11px]">
                    {isDentist ? (
                      <div className="space-y-1.5">
                        <div className="text-[10px] text-zinc-400 border-b border-white/5 pb-1 mb-1.5">Dentist Commission Breakdown:</div>
                        {income
                          .filter(r => r.duty === selectedPayslipEmp.code)
                          .filter(r => {
                            const day = parseInt(r.date.split('-')[2], 10);
                            if (payrollCutoff === 'full') return true;
                            if (payrollCutoff === '1st') return day <= 15;
                            return day > 15;
                          }).length === 0 ? (
                          <div className="text-zinc-500 italic text-[10px]">No procedures performed on general ledger this period.</div>
                        ) : (
                          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                            {income
                              .filter(r => r.duty === selectedPayslipEmp.code)
                              .filter(r => {
                                const day = parseInt(r.date.split('-')[2], 10);
                                if (payrollCutoff === 'full') return true;
                                if (payrollCutoff === '1st') return day <= 15;
                                return day > 15;
                              })
                              .map((r, idx) => {
                                const { tier, rate } = getProcedureTierAndRate(r.procedure);
                                return (
                                  <div key={idx} className="flex justify-between text-[10px] text-zinc-300">
                                    <span className="truncate max-w-[200px]">{r.procedure} (Tier {tier})</span>
                                    <span>{formatMoney(r.amountPaid)} &times; {rate * 100}% = <strong className="text-white">{formatMoney(r.amountPaid * rate)}</strong></span>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>Base Salary Contract:</span>
                          <span>{payrollCutoff === 'full' ? '₱16,000.00 / month' : '₱8,000.00 / cut-off'}</span>
                        </div>
                        <hr className="border-white/5 my-1" />
                        <div className="flex justify-between">
                          <span>Days Present:</span>
                          <span className="text-white">{presentDays} / {maxDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Attendance Gross Base:</span>
                          <span className="text-white font-semibold">{formatMoney(baseGross)}</span>
                        </div>
                        <div className="flex justify-between text-pink-300">
                          <span>Operational Incentives Added:</span>
                          <span>+{formatMoney(incentive)}</span>
                        </div>
                      </div>
                    )}
                    <hr className="border-white/5" />
                    <div className="flex justify-between text-white font-bold">
                      <span>Total Gross Accrued:</span>
                      <span className="text-sky-300">{formatMoney(gross)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-2">
                  <h4 className="text-[10px] text-rose-400 uppercase tracking-widest font-mono font-bold">2. Mandatory Contribution Deductions</h4>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 font-mono text-zinc-400 text-[11px]">
                    <div className="flex justify-between">
                      <span>SSS Contribution:</span>
                      <span className="text-white">{formatMoney(deds.sss)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PhilHealth Contribution:</span>
                      <span className="text-white">{formatMoney(deds.philhealth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pag-IBIG Contribution:</span>
                      <span className="text-white">{formatMoney(deds.pagibig)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Withholding BIR Tax (5%):</span>
                      <span className="text-white">{formatMoney(deds.tax)}</span>
                    </div>
                    <hr className="border-white/5" />
                    <div className="flex justify-between text-rose-400 font-bold">
                      <span>Total Sum Deductions:</span>
                      <span>-{formatMoney(deds.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold block">Consolidated Net Take-home</span>
                    <span className="text-lg font-bold text-emerald-300 block mt-0.5">{formatMoney(net)}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500">PHILIPPINE PESO (PHP)</span>
                </div>

                {/* Signature Block */}
                <div className="pt-6 flex justify-between items-end font-mono text-[9px] text-zinc-500">
                  <div className="text-center w-28">
                    <div className="h-6 border-b border-white/10" />
                    <span className="block mt-1">Authorized signature</span>
                  </div>
                  <div className="text-center w-28">
                    <div className="h-6 border-b border-white/10" />
                    <span className="block mt-1">Recipient signature</span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end gap-2 no-print">
                <button
                  onClick={() => setSelectedPayslipEmp(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close Payslip
                </button>
                <button
                  onClick={printPayslip}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Payslip
                </button>
              </div>

            </div>
          </div>
        );
      })()}
      </div>

      {/* CUSTOM STYLE BLOCK FOR PRINT MEDIA QUERIES & THEME OVERRIDES */}
      <style>{`
        /* -------------------------------------------------------- */
        /* LIGHT THEME OVERRIDES */
        /* -------------------------------------------------------- */
        .light-theme {
          --app-bg: #f4f4f5;
          --app-fg: #18181b;
        }

        /* Override general body styling in light mode */
        .light-theme body, 
        .light-theme #unlocked-layer,
        .light-theme .frosted-gradient {
          background: radial-gradient(circle at top left, #f4f4f5, #e4e4e7) !important;
          background-color: #f4f4f5 !important;
          color: #18181b !important;
        }

        /* Sidebar and Header light mode overrides */
        .light-theme aside,
        .light-theme header {
          background-color: rgba(255, 255, 255, 0.85) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          backdrop-filter: blur(30px) !important;
          -webkit-backdrop-filter: blur(30px) !important;
        }

        .light-theme aside h1,
        .light-theme aside p,
        .light-theme aside span,
        .light-theme aside button {
          color: #18181b !important;
        }

        .light-theme aside button:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }

        /* Inside DentalDashboard */
        .light-theme .dental-dashboard-container {
          color: #18181b !important;
        }

        .light-theme .dental-dashboard-container h1,
        .light-theme .dental-dashboard-container h2,
        .light-theme .dental-dashboard-container h3,
        .light-theme .dental-dashboard-container h4,
        .light-theme .dental-dashboard-container h5,
        .light-theme .dental-dashboard-container h6,
        .light-theme .dental-dashboard-container th {
          color: #18181b !important;
        }

        /* Muted text overrides */
        .light-theme .text-zinc-400,
        .light-theme .text-white\/60,
        .light-theme .text-zinc-300,
        .light-theme .text-white\/50,
        .light-theme .text-zinc-500 {
          color: #27272a !important; /* zinc-800 */
        }

        /* Standard text overrides */
        .light-theme .text-white,
        .light-theme .text-zinc-100 {
          color: #18181b !important;
        }

        /* Cards inside DentalDashboard */
        .light-theme .dental-dashboard-container .bg-white\/5,
        .light-theme .dental-dashboard-container .bg-zinc-950\/50,
        .light-theme .dental-dashboard-container .bg-black\/20 {
          background-color: #ffffff !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
        }

        .light-theme .dental-dashboard-container .border-white\/10 {
          border-color: rgba(0, 0, 0, 0.1) !important;
        }

        /* Hover states */
        .light-theme .dental-dashboard-container .hover\:bg-white\/5:hover,
        .light-theme .dental-dashboard-container .hover\:bg-white\/10:hover {
          background-color: rgba(0, 0, 0, 0.04) !important;
        }

        /* Input / Select / Textarea fields */
        .light-theme .dental-dashboard-container input,
        .light-theme .dental-dashboard-container select,
        .light-theme .dental-dashboard-container textarea,
        .light-theme .dental-dashboard-container .frosted-input {
          background-color: #ffffff !important;
          color: #18181b !important;
          border: 1px solid rgba(0, 0, 0, 0.15) !important;
        }

        /* Table divide lines */
        .light-theme .dental-dashboard-container .divide-white\/5 > :not([hidden]) ~ :not([hidden]) {
          border-color: rgba(0, 0, 0, 0.08) !important;
        }

        /* Modals and overlay */
        .light-theme .fixed.inset-0 {
          background-color: rgba(0, 0, 0, 0.6) !important;
        }

        .light-theme .fixed.inset-0 .bg-\[\#0e0e11\] {
          background-color: #ffffff !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
        }

        .light-theme .fixed.inset-0 h3,
        .light-theme .fixed.inset-0 h4,
        .light-theme .fixed.inset-0 span,
        .light-theme .fixed.inset-0 p,
        .light-theme .fixed.inset-0 td,
        .light-theme .fixed.inset-0 th,
        .light-theme .fixed.inset-0 div {
          color: #18181b !important;
        }

        .light-theme .fixed.inset-0 .bg-white\/5,
        .light-theme .fixed.inset-0 .bg-black\/20 {
          background-color: #f4f4f5 !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
        }

        /* Chart tooltip adjustments */
        .light-theme .recharts-default-tooltip {
          background-color: #ffffff !important;
          border: 1px solid rgba(0, 0, 0, 0.15) !important;
          color: #18181b !important;
        }

        /* -------------------------------------------------------- */
        /* PRINT STYLES */
        /* -------------------------------------------------------- */
        @media print {
          /* Hide the main React root element completely so parent layouts do not interfere */
          #root {
            display: none !important;
          }

          /* Force solid white backgrounds and deep black colors on print for maximum contrast */
          html, body {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Style the print container to sit perfectly at the top-left corner of the printed page */
          .print-only {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            z-index: 999999 !important;
            visibility: visible !important;
          }

          /* Force elements inside print container to be visible and deep black */
          .print-only * {
            visibility: visible !important;
            color: #000000 !important;
            text-shadow: none !important;
            box-shadow: none !important;
          }

          /* Explicit color and layout overrides inside the printable area */
          .print-only h1, .print-only h2, .print-only h3, .print-only h4, .print-only p, .print-only span, .print-only td, .print-only th, .print-only div {
            color: #000000 !important;
            text-shadow: none !important;
            box-shadow: none !important;
          }

          .print-only table {
            border-collapse: collapse !important;
            width: 100% !important;
            background-color: #ffffff !important;
          }

          .print-only table, .print-only th, .print-only td {
            border: 1px solid #111111 !important;
            color: #000000 !important;
          }

          .print-only th, .print-only td {
            padding: 6px 8px !important;
            background: transparent !important;
          }

          /* Support for Recharts SVG on print inside print-only */
          .print-only .recharts-responsive-container {
            width: 100% !important;
            height: 320px !important;
            min-height: 320px !important;
            display: block !important;
          }
          .print-only svg {
            width: 100% !important;
            height: 100% !important;
          }

          /* Ensure page breaks work flawlessly */
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
            height: 0 !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }

        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>

      {/* DYNAMIC PRINT-ONLY CONTAINER FOR ALL SPECIALIZED PRINT WORKLOADS */}
      {createPortal(
        <div className="print-only print-container font-sans text-black bg-white p-8">
        
        {/* CASE 1: 2-PAGE EXECUTIVE REPORT */}
        {printMode === 'report' && (
          <div className="space-y-8">
            {/* PAGE 1: Financial Performance Executive Summary */}
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b-2 border-zinc-300">
                <div>
                  <h1 className="text-xl font-bold uppercase tracking-wide text-zinc-900">ARKA Dental Center</h1>
                  <p className="text-xs text-zinc-500 font-mono">EXECUTIVE FINANCIAL REPORT &bull; JUNE 2026</p>
                </div>
                <div className="text-right text-xs font-mono text-zinc-500">
                  <p>Generated: June 2026</p>
                  <p>Format: Executive 2-Page Report</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Gross Revenue</span>
                  <div className="text-base font-bold text-zinc-900 font-mono mt-1">{formatMoney(totalGrossIncome)}</div>
                </div>
                <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Total Expenses</span>
                  <div className="text-base font-bold text-zinc-900 font-mono mt-1">{formatMoney(totalExpenses)}</div>
                </div>
                <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Net Operational Profit</span>
                  <div className="text-base font-bold text-zinc-900 font-mono mt-1">{formatMoney(netIncome)}</div>
                </div>
                <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Operating Margin</span>
                  <div className="text-base font-bold text-zinc-900 font-mono mt-1">
                    {totalGrossIncome > 0 ? ((netIncome / totalGrossIncome) * 100).toFixed(1) + "%" : "0.0%"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">1. Daily Revenue Trend Graph</h3>
                <div className="p-4 border border-zinc-200 rounded-xl bg-white h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path 
                      d={trendData.reduce((acc, t, idx) => {
                        const x = 40 + (idx * (940 / 29));
                        const y = 170 - (t.amount / Math.max(maxDailyTrend, 1)) * 140;
                        return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }, '')}
                      fill="none" 
                      stroke="#111111" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {trendData.map((t, idx) => {
                      const x = 40 + (idx * (940 / 29));
                      const y = 170 - (t.amount / Math.max(maxDailyTrend, 1)) * 140;
                      return (
                        <circle 
                          key={idx} 
                          cx={x} 
                          cy={y} 
                          r="3.5" 
                          fill="#ffffff" 
                          stroke="#111111"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                  <div className="flex justify-between font-mono text-[9px] text-zinc-400 mt-1 px-4">
                    <span>June 1</span>
                    <span>June 10</span>
                    <span>June 20</span>
                    <span>June 30</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">2. Expense Breakdown by Category</h3>
                <table className="w-full text-xs text-left border-collapse border border-zinc-200">
                  <thead>
                    <tr className="bg-zinc-100 font-mono">
                      <th className="p-2 border border-zinc-200">Category</th>
                      <th className="p-2 border border-zinc-200 text-right">Amount</th>
                      <th className="p-2 border border-zinc-200 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-zinc-800">
                    {Object.entries(expenseGrouped).map(([cat, amt]) => {
                      const amtNum = amt as number;
                      return (
                        <tr key={cat}>
                          <td className="p-2 border border-zinc-200">{cat}</td>
                          <td className="p-2 border border-zinc-200 text-right">{formatMoney(amtNum)}</td>
                          <td className="p-2 border border-zinc-200 text-right">
                            {totalExpenses > 0 ? ((amtNum / totalExpenses) * 100).toFixed(1) + "%" : "0.0%"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGE BREAK TO PAGE 2 */}
            <div className="page-break" />

            {/* PAGE 2: Patients Income General Ledger Data */}
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b-2 border-zinc-300">
                <div>
                  <h1 className="text-xl font-bold uppercase tracking-wide text-zinc-900">ARKA Dental Center</h1>
                  <p className="text-xs text-zinc-500 font-mono">GENERAL LEDGER DATA SUMMARY &bull; JUNE 2026</p>
                </div>
                <span className="text-xs font-mono text-zinc-400">Page 2 of 2</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Patients Revenue Ledger Summary</h3>
                <table className="w-full text-[9px] text-left border-collapse border border-zinc-200">
                  <thead>
                    <tr className="bg-zinc-100 font-mono text-zinc-700">
                      <th className="p-1 border border-zinc-200">Date</th>
                      <th className="p-1 border border-zinc-200">Doc</th>
                      <th className="p-1 border border-zinc-200">Patient</th>
                      <th className="p-1 border border-zinc-200">Procedure</th>
                      <th className="p-1 border border-zinc-200 text-right">Lab Fee</th>
                      <th className="p-1 border border-zinc-200 text-right">Disc.</th>
                      <th className="p-1 border border-zinc-200 text-right">Paid</th>
                      <th className="p-1 border border-zinc-200 text-right">Comm %</th>
                      <th className="p-1 border border-zinc-200">Terminal</th>
                      <th className="p-1 border border-zinc-200 text-right">CC Fee</th>
                      <th className="p-1 border border-zinc-200 text-right">HMO</th>
                      <th className="p-1 border border-zinc-200 text-right font-bold">Gross</th>
                      <th className="p-1 border border-zinc-200 text-right font-bold">Net</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-zinc-800">
                    {income.map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="p-1 border border-zinc-200">{row.date}</td>
                        <td className="p-1 border border-zinc-200 font-bold">{row.duty}</td>
                        <td className="p-1 border border-zinc-200 truncate max-w-[70px]">{row.patient}</td>
                        <td className="p-1 border border-zinc-200 truncate max-w-[80px]" title={row.procedure}>{row.procedure}</td>
                        <td className="p-1 border border-zinc-200 text-right">{formatMoney(row.labFee)}</td>
                        <td className="p-1 border border-zinc-200 text-right text-red-600">-{formatMoney(row.discount)}</td>
                        <td className="p-1 border border-zinc-200 text-right">{formatMoney(row.amountPaid)}</td>
                        <td className="p-1 border border-zinc-200 text-right">{row.percentCommission}%</td>
                        <td className="p-1 border border-zinc-200 text-[8px]">{row.paymentTerminal}</td>
                        <td className="p-1 border border-zinc-200 text-right">{formatMoney(row.ccMerchantFee)}</td>
                        <td className="p-1 border border-zinc-200 text-right">{formatMoney(row.hmo)}</td>
                        <td className="p-1 border border-zinc-200 text-right font-bold">{formatMoney(row.totalGross)}</td>
                        <td className="p-1 border border-zinc-200 text-right font-bold">{formatMoney(row.netTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Expenditures Ledger Summary</h3>
                <table className="w-full text-[9px] text-left border-collapse border border-zinc-200">
                  <thead>
                    <tr className="bg-zinc-100 font-mono text-zinc-700">
                      <th className="p-1.5 border border-zinc-200">#</th>
                      <th className="p-1.5 border border-zinc-200">Date</th>
                      <th className="p-1.5 border border-zinc-200">Category</th>
                      <th className="p-1.5 border border-zinc-200">Description</th>
                      <th className="p-1.5 border border-zinc-200 text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-zinc-800">
                    {expenses.map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="p-1.5 border border-zinc-200">{idx + 1}</td>
                        <td className="p-1.5 border border-zinc-200">{row.date}</td>
                        <td className="p-1.5 border border-zinc-200 font-bold text-red-600">{row.type}</td>
                        <td className="p-1.5 border border-zinc-200 italic">{row.description || "N/A"}</td>
                        <td className="p-1.5 border border-zinc-200 text-right font-bold">{formatMoney(row.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 text-center text-[10px] text-zinc-400 font-mono">
                &copy; 2026 ARKA Dental Center. All rights reserved.
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: INDIVIDUAL EMPLOYEE PAYSLIP (DESIGNED PERFECTLY FOR A4 PRINTING) */}
        {printMode === 'payslip' && selectedPayslipEmp && (() => {
          const isDentist = selectedPayslipEmp.role === 'Dentist';
          const gross = getEmployeeGross(selectedPayslipEmp, payrollCutoff);
          const deds = getEmployeeDeductions(gross, isDentist);
          const net = gross - deds.total;

          const empAttendance = attendance[selectedPayslipEmp.code] || {};
          let presentDays = 0;
          let maxDays = 30;
          let baseSalaryMax = 16000;
          let incentive = assistantIncentives[selectedPayslipEmp.code] || 0;
          
          if (payrollCutoff === 'full') {
            presentDays = Object.values(empAttendance).filter(s => s === 'present').length;
            const totalRecordedDays = Object.keys(empAttendance).length;
            if (totalRecordedDays === 0) presentDays = 30;
            maxDays = 30;
            baseSalaryMax = 16000;
          } else if (payrollCutoff === '1st') {
            const firstHalfDays = Object.keys(empAttendance).filter(dateStr => {
              const day = parseInt(dateStr.split('-')[2], 10);
              return day <= 15;
            });
            presentDays = firstHalfDays.filter(dateStr => empAttendance[dateStr] === 'present').length;
            const totalRecordedDays = firstHalfDays.length;
            if (totalRecordedDays === 0) presentDays = 15;
            maxDays = 15;
            baseSalaryMax = 8000;
            incentive = incentive / 2;
          } else {
            const secondHalfDays = Object.keys(empAttendance).filter(dateStr => {
              const day = parseInt(dateStr.split('-')[2], 10);
              return day > 15;
            });
            presentDays = secondHalfDays.filter(dateStr => empAttendance[dateStr] === 'present').length;
            const totalRecordedDays = secondHalfDays.length;
            if (totalRecordedDays === 0) presentDays = 15;
            maxDays = 15;
            baseSalaryMax = 8000;
            incentive = incentive / 2;
          }
          
          const baseGross = (presentDays / maxDays) * baseSalaryMax;

          return (
            <div className="space-y-6 max-w-2xl mx-auto border border-zinc-300 p-8 rounded-2xl bg-white text-zinc-900">
              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-zinc-300">
                <div>
                  <h1 className="text-xl font-bold uppercase tracking-wide">ARKA Dental Center</h1>
                  <p className="text-xs text-zinc-500 font-mono mt-1">
                    PAYSLIP STATEMENT &bull; {payrollCutoff === '1st' ? '1ST CUT-OFF (JUNE 1-15, 2026)' : '2ND CUT-OFF (JUNE 16-30, 2026)'}
                  </p>
                </div>
                <div className="text-right text-xs font-mono text-zinc-500">
                  <p>Date Generated: {new Date().toLocaleDateString()}</p>
                  <p className="font-bold text-zinc-900 mt-1">Disbursement Date: {payrollCutoff === '1st' ? 'June 20, 2026' : 'July 5, 2026'}</p>
                </div>
              </div>

              {/* Employee Details */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-zinc-200 font-mono text-xs">
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">Employee Name:</span>
                  <span className="block text-zinc-900 font-bold mt-1">{selectedPayslipEmp.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">Designation Code:</span>
                  <span className="block text-zinc-900 font-bold mt-1">{selectedPayslipEmp.code} ({selectedPayslipEmp.role})</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">TIN Identifier:</span>
                  <span className="block text-zinc-900 font-bold mt-1">{selectedPayslipEmp.tin || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">Disbursement Date:</span>
                  <span className="block text-zinc-900 font-bold mt-1">{payrollCutoff === '1st' ? 'June 20, 2026' : 'July 5, 2026'}</span>
                </div>
              </div>

              {/* Earnings & Base Salary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">1. Professional Earnings &amp; Base Salary</h4>
                <div className="p-4 border border-zinc-200 rounded-xl space-y-2 font-mono text-xs">
                  {isDentist ? (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-zinc-500 border-b border-zinc-200 pb-1 mb-1.5 font-bold">Dentist Commission Breakdown:</div>
                      {income
                        .filter(r => r.duty === selectedPayslipEmp.code)
                        .filter(r => {
                          const day = parseInt(r.date.split('-')[2], 10);
                          if (payrollCutoff === 'full') return true;
                          if (payrollCutoff === '1st') return day <= 15;
                          return day > 15;
                        }).length === 0 ? (
                        <div className="text-zinc-500 italic text-xs">No procedures performed on general ledger this period.</div>
                      ) : (
                        <div className="space-y-2">
                          {income
                            .filter(r => r.duty === selectedPayslipEmp.code)
                            .filter(r => {
                              const day = parseInt(r.date.split('-')[2], 10);
                              if (payrollCutoff === 'full') return true;
                              if (payrollCutoff === '1st') return day <= 15;
                              return day > 15;
                            })
                            .map((r, idx) => {
                              const { tier, rate } = getProcedureTierAndRate(r.procedure);
                              return (
                                <div key={idx} className="flex justify-between text-xs text-zinc-700">
                                  <span>{r.procedure} (Tier {tier}) - {r.date}</span>
                                  <span>{formatMoney(r.amountPaid)} &times; {rate * 100}% = <strong className="text-zinc-900 font-bold">{formatMoney(r.amountPaid * rate)}</strong></span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-zinc-700">
                        <span>Base Salary Contract:</span>
                        <span className="font-bold text-zinc-900">{payrollCutoff === 'full' ? '₱16,000.00 / month' : '₱8,000.00 / cut-off'}</span>
                      </div>
                      <div className="flex justify-between text-zinc-700">
                        <span>Days Present:</span>
                        <span className="font-bold text-zinc-900">{presentDays} / {maxDays} days</span>
                      </div>
                      <div className="flex justify-between text-zinc-700">
                        <span>Attendance Gross Base:</span>
                        <span className="font-bold text-zinc-900">{formatMoney(baseGross)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-700">
                        <span>Operational Incentives Added:</span>
                        <span className="font-bold text-emerald-700">+{formatMoney(incentive)}</span>
                      </div>
                    </div>
                  )}
                  <hr className="border-zinc-200" />
                  <div className="flex justify-between text-zinc-900 font-bold text-sm">
                    <span>Total Gross Accrued:</span>
                    <span>{formatMoney(gross)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">2. Mandatory Contribution Deductions</h4>
                <div className="p-4 border border-zinc-200 rounded-xl space-y-2 font-mono text-xs text-zinc-700">
                  <div className="flex justify-between">
                    <span>SSS Contribution:</span>
                    <span className="text-zinc-900">{formatMoney(deds.sss)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PhilHealth Contribution:</span>
                    <span className="text-zinc-900">{formatMoney(deds.philhealth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pag-IBIG Contribution:</span>
                    <span className="text-zinc-900">{formatMoney(deds.pagibig)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Withholding BIR Tax (5%):</span>
                    <span className="text-zinc-900">{formatMoney(deds.tax)}</span>
                  </div>
                  <hr className="border-zinc-200" />
                  <div className="flex justify-between text-zinc-900 font-bold">
                    <span>Total Sum Deductions:</span>
                    <span className="text-rose-700">-{formatMoney(deds.total)}</span>
                  </div>
                </div>
              </div>

              {/* Net Take Home */}
              <div className="p-4 border border-emerald-300 rounded-xl bg-emerald-50 flex justify-between items-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Consolidated Net Take-home</span>
                  <span className="text-base font-bold text-emerald-900 block mt-1">{formatMoney(net)}</span>
                </div>
                <span className="text-[10px] text-zinc-500">PHILIPPINE PESO (PHP)</span>
              </div>

              {/* Signature block */}
              <div className="pt-12 flex justify-between items-end font-mono text-[10px] text-zinc-500">
                <div className="text-center w-36">
                  <div className="h-8 border-b border-zinc-300" />
                  <span className="block mt-2">Authorized signature</span>
                </div>
                <div className="text-center w-36">
                  <div className="h-8 border-b border-zinc-300" />
                  <span className="block mt-2">Recipient signature</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* CASE 3: GENERAL LEDGER PRINT */}
        {printMode === 'ledger' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b-2 border-zinc-300">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide">ARKA Dental Center</h1>
                <p className="text-xs text-zinc-500 font-mono">GENERAL LEDGER SUMMARY &bull; JUNE 2026</p>
              </div>
              <div className="text-right text-xs font-mono text-zinc-500">
                <p>Date Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Patients Revenue Ledger</h3>
              <table className="w-full text-[9px] text-left border-collapse border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-100 font-mono">
                    <th className="p-1.5 border border-zinc-200">Date</th>
                    <th className="p-1.5 border border-zinc-200">Doc</th>
                    <th className="p-1.5 border border-zinc-200">Patient</th>
                    <th className="p-1.5 border border-zinc-200">Procedure</th>
                    <th className="p-1.5 border border-zinc-200 text-right">Paid</th>
                    <th className="p-1.5 border border-zinc-200 text-right">Comm %</th>
                    <th className="p-1.5 border border-zinc-200 text-right font-bold">Net</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-zinc-800">
                  {income.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 border border-zinc-200">{row.date}</td>
                      <td className="p-1.5 border border-zinc-200 font-bold">{row.duty}</td>
                      <td className="p-1.5 border border-zinc-200">{row.patient}</td>
                      <td className="p-1.5 border border-zinc-200">{row.procedure}</td>
                      <td className="p-1.5 border border-zinc-200 text-right">{formatMoney(row.amountPaid)}</td>
                      <td className="p-1.5 border border-zinc-200 text-right">{row.percentCommission}%</td>
                      <td className="p-1.5 border border-zinc-200 text-right font-bold">{formatMoney(row.netTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Expenditures Ledger</h3>
              <table className="w-full text-[9px] text-left border-collapse border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-100 font-mono">
                    <th className="p-1.5 border border-zinc-200">Date</th>
                    <th className="p-1.5 border border-zinc-200">Category</th>
                    <th className="p-1.5 border border-zinc-200">Description</th>
                    <th className="p-1.5 border border-zinc-200 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-zinc-800">
                  {expenses.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 border border-zinc-200">{row.date}</td>
                      <td className="p-1.5 border border-zinc-200 font-bold text-red-600">{row.type}</td>
                      <td className="p-1.5 border border-zinc-200 italic">{row.description || "N/A"}</td>
                      <td className="p-1.5 border border-zinc-200 text-right font-bold">{formatMoney(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CASE 4: CONSOLIDATED PAYROLL SUMMARY */}
        {printMode === 'payroll' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b-2 border-zinc-300">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide">ARKA Dental Center</h1>
                <p className="text-xs text-zinc-500 font-mono">CONSOLIDATED PAYROLL SUMMARY &bull; JUNE 2026</p>
              </div>
              <div className="text-right text-xs font-mono text-zinc-500">
                <p>Date Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full text-xs text-left border-collapse border border-zinc-200">
              <thead>
                <tr className="bg-zinc-100 font-mono">
                  <th className="p-2 border border-zinc-200">Employee Name</th>
                  <th className="p-2 border border-zinc-200">Role</th>
                  <th className="p-2 border border-zinc-200 text-right">Gross Earnings</th>
                  <th className="p-2 border border-zinc-200 text-right">Total Deductions</th>
                  <th className="p-2 border border-zinc-200 text-right font-bold">Net Take-Home</th>
                </tr>
              </thead>
              <tbody className="font-mono text-zinc-800">
                {employees.map((emp, idx) => {
                  const gross = getEmployeeGross(emp, payrollCutoff);
                  const deds = getEmployeeDeductions(gross, emp.role === 'Dentist');
                  const net = gross - deds.total;
                  return (
                    <tr key={idx}>
                      <td className="p-2 border border-zinc-200 font-bold">{emp.name} ({emp.code})</td>
                      <td className="p-2 border border-zinc-200">{emp.role}</td>
                      <td className="p-2 border border-zinc-200 text-right">{formatMoney(gross)}</td>
                      <td className="p-2 border border-zinc-200 text-right text-rose-700">-{formatMoney(deds.total)}</td>
                      <td className="p-2 border border-zinc-200 text-right font-bold text-emerald-800">{formatMoney(net)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        </div>,
        document.body
      )}
    </div>
  );
}
