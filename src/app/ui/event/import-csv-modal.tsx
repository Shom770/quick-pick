'use client';

import { useState, useRef, useCallback } from "react";
import { XMarkIcon, ArrowUpIcon, ArrowDownIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { rethinkSans } from "@/app/ui/fonts";
import { CustomColumns } from "@/app/lib/types";

const STANDARD_FIELDS = ["Total EPA", "Auto Fuel", "Teleop Fuel", "Total Tower Points"];

// ── CSV parsing ────────────────────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += line[i];
        }
    }
    result.push(current.trim());
    return result;
}

function parseCSV(text: string): { headers: string[], rows: Record<string, string>[] } {
    const lines = text.trim().split(/\r?\n/);
    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = parseCSVLine(line);
        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
    });
    return { headers, rows };
}

function findTeamNumberKey(headers: string[]): string | null {
    const normalized = (s: string) => s.toLowerCase().replace(/[\s_]/g, '');
    return headers.find(h => ['teamnumber', 'team'].includes(normalized(h))) ?? null;
}

// ── Types ──────────────────────────────────────────────────────────────────────

type Stage = 'upload' | 'configure';

type OrderItem = {
    name: string;
    isCustom: boolean;
    included: boolean;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function ImportCSVModal({
    onConfirm,
    onClose,
}: {
    onConfirm: (customColumns: CustomColumns) => void;
    onClose: () => void;
}) {
    const [stage, setStage] = useState<Stage>('upload');
    const [error, setError] = useState('');
    const [isDraggingOver, setDraggingOver] = useState(false);

    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
    const [teamNumberKey, setTeamNumberKey] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        if (!file.name.endsWith('.csv')) {
            setError('Please upload a .csv file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const { headers, rows } = parseCSV(text);
            const teamKey = findTeamNumberKey(headers);
            if (!teamKey) {
                setError('No "Team Number" column found. Make sure your CSV has a column named "Team Number" or "Team".');
                return;
            }
            const dataCols = headers.filter(h => h !== teamKey);
            if (dataCols.length === 0) {
                setError('No data columns found besides the team number column.');
                return;
            }
            setTeamNumberKey(teamKey);
            setParsedRows(rows);
            setOrderItems([
                ...STANDARD_FIELDS.map(name => ({ name, isCustom: false, included: true })),
                ...dataCols.map(name => ({ name, isCustom: true, included: true })),
            ]);
            setError('');
            setStage('configure');
        };
        reader.readAsText(file);
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggingOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const toggleItem = (name: string) => {
        setOrderItems(prev => prev.map(item =>
            item.name === name && item.isCustom ? { ...item, included: !item.included } : item
        ));
    };

    const moveItem = (name: string, dir: -1 | 1) => {
        setOrderItems(prev => {
            const idx = prev.findIndex(item => item.name === name);
            if (idx === -1) return prev;
            const newIdx = idx + dir;
            if (newIdx < 0 || newIdx >= prev.length) return prev;
            const next = [...prev];
            [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
            return next;
        });
    };

    const handleConfirm = () => {
        const included = orderItems.filter(i => i.included);
        const columnOrder = included.map(i => i.name);
        const headers = included.filter(i => i.isCustom).map(i => i.name);

        const data: Record<string, Record<string, string>> = {};
        for (const row of parsedRows) {
            const rawTeam = row[teamNumberKey] ?? '';
            const teamNum = rawTeam.replace(/\D/g, '');
            if (!teamNum) continue;
            data[teamNum] = {};
            for (const col of headers) {
                data[teamNum][col] = row[col] ?? '';
            }
        }
        onConfirm({ headers, data, columnOrder });
    };

    const customIncluded = orderItems.filter(i => i.isCustom && i.included).length;

    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-[6px]">
            <div className="relative flex flex-col w-11/12 md:w-[44rem] max-h-[85vh] bg-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
                    <div>
                        <h2 className={`${rethinkSans.className} font-extrabold text-2xl text-white`}>Import Picklist</h2>
                        <p className="text-gray-400 text-sm mt-0.5">
                            {stage === 'upload'
                                ? 'Upload a CSV file with a "Team Number" column.'
                                : `${parsedRows.length} teams found · Arrange column order below`}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 ml-4 flex-shrink-0">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                    {/* Stage 1: Upload */}
                    {stage === 'upload' && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
                            onDragLeave={() => setDraggingOver(false)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex flex-col items-center justify-center gap-3 w-full h-44 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${isDraggingOver ? 'border-blue-400 bg-blue-500/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}
                        >
                            <DocumentArrowUpIcon className="w-9 h-9 text-gray-400" />
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-gray-300 text-sm font-medium">Drop a CSV here or click to browse</p>
                                <p className="text-gray-600 text-xs">Must have a &quot;Team Number&quot; or &quot;Team&quot; column</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                            />
                        </div>
                    )}

                    {/* Stage 2: Configure */}
                    {stage === 'configure' && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Column order</p>
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                {orderItems.map((item, i) => (
                                    <div
                                        key={item.name}
                                        className={`flex items-center gap-3 px-4 h-11 ${i < orderItems.length - 1 ? 'border-b border-white/[0.06]' : ''} ${!item.isCustom ? 'bg-white/[0.025]' : ''}`}
                                    >
                                        {/* Row index */}
                                        <span className="text-xs text-gray-600 w-4 text-right flex-shrink-0 tabular-nums">{i + 1}</span>

                                        {/* Checkbox (custom) or spacer (standard) */}
                                        {item.isCustom ? (
                                            <div className="flex-shrink-0 w-4 h-4">
                                                <input
                                                    type="checkbox"
                                                    checked={item.included}
                                                    onChange={() => toggleItem(item.name)}
                                                    className="appearance-none w-4 h-4 bg-gray-700 border-2 border-gray-500 rounded-sm checked:bg-blue-500 checked:border-blue-500 focus:ring-0 cursor-pointer block"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-4 h-4 flex-shrink-0" />
                                        )}

                                        {/* Column name */}
                                        <span className={`flex-1 text-sm truncate ${item.isCustom ? (item.included ? 'text-gray-100' : 'text-gray-500') : 'text-gray-400'}`}>
                                            {item.name}
                                        </span>

                                        {/* Standard badge */}
                                        {!item.isCustom && (
                                            <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider flex-shrink-0 mr-1">
                                                standard
                                            </span>
                                        )}

                                        {/* Move buttons */}
                                        <div className="flex flex-shrink-0 -mr-1">
                                            <button
                                                onClick={() => moveItem(item.name, -1)}
                                                disabled={i === 0}
                                                className="p-1.5 text-gray-600 hover:text-white disabled:opacity-20 transition-colors rounded"
                                            >
                                                <ArrowUpIcon className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => moveItem(item.name, 1)}
                                                disabled={i === orderItems.length - 1}
                                                className="p-1.5 text-gray-600 hover:text-white disabled:opacity-20 transition-colors rounded"
                                            >
                                                <ArrowDownIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                </div>

                {/* ── Footer ── */}
                {stage === 'configure' && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 flex-shrink-0">
                        <button
                            onClick={() => { setStage('upload'); setError(''); }}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            ← Re-upload
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={customIncluded === 0}
                            className={`${rethinkSans.className} px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-extrabold text-[#0d111b] transition-colors`}
                        >
                            import {customIncluded} custom column{customIncluded !== 1 ? 's' : ''}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
