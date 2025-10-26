import React, { useState, useCallback } from 'react';

const MAX_PHRASES = 20;
const MAX_LENGTH = 28;

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2V10a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" />
    </svg>
);


const App: React.FC = () => {
    const [count, setCount] = useState<number>(5);
    const [phrases, setPhrases] = useState<string[]>([]);
    const [anniversaryDate, setAnniversaryDate] = useState<string>('');
    const [coverPhrases, setCoverPhrases] = useState<string[]>(['', '']);
    const [showInputs, setShowInputs] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<string>('');

    const handleConfirm = useCallback(() => {
        setPhrases(Array(count).fill(''));
        setShowInputs(true);
    }, [count]);

    const handleReset = useCallback(() => {
        setCount(5);
        setPhrases([]);
        setAnniversaryDate('');
        setCoverPhrases(['', '']);
        setShowInputs(false);
        setCopySuccess('');
    }, []);

    const handlePhraseChange = (index: number, value: string) => {
        if (value.length <= MAX_LENGTH) {
            const newPhrases = [...phrases];
            newPhrases[index] = value;
            setPhrases(newPhrases);
        }
    };
    
    const handleAnniversaryDateChange = (value: string) => {
        if (value.length <= MAX_LENGTH) {
            setAnniversaryDate(value);
        }
    };

    const handleCoverPhraseChange = (index: number, value: string) => {
        if (value.length <= MAX_LENGTH) {
            const newCoverPhrases = [...coverPhrases];
            newCoverPhrases[index] = value;
            setCoverPhrases(newCoverPhrases);
        }
    };

    const handleCopyAll = useCallback(() => {
        const sections: string[][] = [];

        // Section 1: Anniversary Date
        const anniversaryText = anniversaryDate.trim();
        if (anniversaryText) {
            sections.push([anniversaryText]);
        }

        // Section 2: Cover Phrases
        const coverTexts = coverPhrases
            .map(p => p.trim())
            .filter(Boolean);
        if (coverTexts.length > 0) {
            sections.push(coverTexts);
        }
        
        // Section 3: Main Phrases
        const mainTexts = phrases
            .map((phrase, index) => phrase.trim() ? `${index + 1}. ${phrase.trim()}` : null)
            .filter((p): p is string => p !== null);

        if (mainTexts.length > 0) {
            sections.push(mainTexts);
        }
        
        // Join sections with double newlines, and lines within sections with single newlines.
        const textToCopy = sections.map(section => section.join('\n')).join('\n\n');

        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopySuccess('✅ 전체 복사 완료!');
                setTimeout(() => setCopySuccess(''), 2000);
            }).catch(() => {
                setCopySuccess('❌ 복사 실패.');
                setTimeout(() => setCopySuccess(''), 2000);
            });
        } else {
            setCopySuccess('복사할 문구가 없습니다.');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    }, [anniversaryDate, coverPhrases, phrases]);

    const renderSetupScreen = () => (
        <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 text-center space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">포토북 문구 생성</h1>
            <p className="text-slate-400">생성할 문구 갯수를 정하고 입력하세요.</p>
            
            <div className="space-y-4">
                <label htmlFor="phrase-count" className="block font-medium text-lg text-slate-200">
                    문구 갯수: <span className="text-cyan-400 font-bold text-2xl">{count}</span>
                </label>
                <input
                    id="phrase-count"
                    type="range"
                    min="1"
                    max={MAX_PHRASES}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
                />
            </div>
            
            <button
                onClick={handleConfirm}
                className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 transform hover:scale-105"
            >
                입력창 생성하기
            </button>
        </div>
    );

    const renderInputScreen = () => (
        <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-scale">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">사진 문구 입력</h2>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-all duration-300"
                    aria-label="Reset"
                >
                    <ResetIcon className="w-5 h-5" />
                    다시하기
                </button>
            </div>
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Anniversary Date Section */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-200">기념일 날짜</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={anniversaryDate}
                            onChange={(e) => handleAnniversaryDateChange(e.target.value)}
                            placeholder={`예: 2024.10.26 (최대 ${MAX_LENGTH}자)`}
                            maxLength={MAX_LENGTH}
                            className="w-full bg-slate-900 border-2 border-slate-700 text-white rounded-lg p-3 pr-16 focus:border-cyan-500 focus:ring-cyan-500 outline-none transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                            {anniversaryDate.length}/{MAX_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Cover Phrase Section */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-200">표지 문구</h3>
                    <div className="space-y-4">
                        {coverPhrases.map((phrase, index) => (
                            <div key={`cover-${index}`} className="relative">
                                <input
                                    type="text"
                                    value={phrase}
                                    onChange={(e) => handleCoverPhraseChange(index, e.target.value)}
                                    placeholder={`표지 문구 ${index + 1} (최대 ${MAX_LENGTH}자)`}
                                    maxLength={MAX_LENGTH}
                                    className="w-full bg-slate-900 border-2 border-slate-700 text-white rounded-lg p-3 pr-16 focus:border-cyan-500 focus:ring-cyan-500 outline-none transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    {phrase.length}/{MAX_LENGTH}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Main Phrases Section */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-200">사진 문구 입력 ({phrases.length}개)</h3>
                    <div className="space-y-4">
                        {phrases.map((phrase, index) => (
                            <div key={index} className="relative">
                                <input
                                    type="text"
                                    value={phrase}
                                    onChange={(e) => handlePhraseChange(index, e.target.value)}
                                    placeholder={`사진 문구 ${index + 1} (최대 ${MAX_LENGTH}자)`}
                                    maxLength={MAX_LENGTH}
                                    className="w-full bg-slate-900 border-2 border-slate-700 text-white rounded-lg p-3 pr-16 focus:border-cyan-500 focus:ring-cyan-500 outline-none transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    {phrase.length}/{MAX_LENGTH}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                <button
                    onClick={handleCopyAll}
                    className="w-full flex items-center justify-center gap-3 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 transform hover:scale-105"
                >
                    <CopyIcon className="w-6 h-6" />
                    전체 복사하기
                </button>
                {copySuccess && (
                    <p className="text-center mt-4 text-green-400 animate-pulse">
                        {copySuccess}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <main className="bg-slate-900 min-h-screen w-full flex items-center justify-center p-4 font-sans">
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                .animate-fade-in-scale { animation: fade-in-scale 0.5s ease-out forwards; }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1e293b; /* slate-800 */
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569; /* slate-600 */
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #64748b; /* slate-500 */
                }
            `}</style>
            {showInputs ? renderInputScreen() : renderSetupScreen()}
        </main>
    );
};

export default App;
