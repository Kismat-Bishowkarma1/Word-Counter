import React, { useState } from 'react'

const App = () => {
  const [text, setText] = useState('')
  const [showError, setShowError] = useState(false)
  const maxChars = 5000

  // Split logic handling multiple spaces and line breaks properly
  const cleanText = text.trim()
  const wordCount = cleanText === '' ? 0 : cleanText.split(/\s+/).length
  const charCount = text.length
  const sentenceCount = cleanText === '' ? 0 : cleanText.split(/[.!?]+/).filter(Boolean).length
  const paragraphCount = cleanText === '' ? 0 : text.split(/\n+/).filter(Boolean).length

  // Slices any input (typing or pasting) to exactly 5000 characters max
  const handleChange = (e) => {
    const inputValue = e.target.value
    if (inputValue.length > maxChars) {
      setText(inputValue.substring(0, maxChars))
      setShowError(true)
    } else {
      setText(inputValue)
      setShowError(inputValue.length === maxChars)
    }
  }

  // Explicit interceptor for paste events to gracefully slice massive text
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    
    // Combine current text with pasted text up to the max limit
    const currentText = text
    const combinedText = currentText + pastedText
    
    if (combinedText.length > maxChars) {
      setText(combinedText.substring(0, maxChars))
      setShowError(true)
    } else {
      setText(combinedText)
      setShowError(combinedText.length === maxChars)
    }
  }

  const handleClear = () => {
    setText('')
    setShowError(false)
  }

  const progressPercentage = (charCount / maxChars) * 100
  const isNearLimit = charCount >= maxChars * 0.9

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-blue-900/50 rounded-2xl p-6 shadow-xl shadow-blue-950/40">
        
        {/* Title Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">
            Word Counter
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time text analytics dashboard with auto-slicing paste.
          </p>
        </div>

        {/* Counter Display Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-blue-950 text-center">
            <div className="text-2xl font-extrabold text-blue-400">{wordCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Words</div>
          </div>
          
          <div className="bg-slate-950/80 p-3 rounded-xl border border-blue-950 text-center">
            <div className={`text-2xl font-extrabold transition-colors duration-200 ${isNearLimit ? 'text-amber-400' : 'text-indigo-400'}`}>{charCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Chars</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-blue-950 text-center">
            <div className="text-2xl font-extrabold text-cyan-400">{sentenceCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sentences</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-blue-950 text-center">
            <div className="text-2xl font-extrabold text-teal-400">{paragraphCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Paragraphs</div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 mb-6 overflow-hidden border border-blue-950">
          <div 
            className={`h-full transition-all duration-150 ${isNearLimit ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Input Interface Wrapper */}
        <div className="relative">
          <textarea
            className={`w-full h-56 bg-slate-950/50 border rounded-xl p-4 pb-12 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 text-sm leading-relaxed transition-colors duration-200 ${isNearLimit ? 'border-amber-900/50 focus:border-amber-500 focus:ring-amber-500/30' : 'border-blue-900/30 focus:border-blue-500 focus:ring-blue-500/30'}`}
            placeholder="Type or paste your text here..."
            value={text}
            onChange={handleChange}
            onPaste={handlePaste}
          />

          {/* Character Pill inside bottom-right corner */}
          <div className="absolute bottom-3 right-3">
            <div className={`text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 border ${isNearLimit ? 'text-amber-400 border-amber-900/50' : 'text-slate-400 border-blue-950/60'}`}>
              {charCount} / {maxChars} max
            </div>
          </div>
        </div>

        {/* Real-time Validation Error Banner */}
        {showError && (
          <div className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1.5 animate-pulse">
            ⚠️ The character limit is 5000. Excess text has been automatically trimmed.
          </div>
        )}

        {/* Action Panel outside the text box */}
        <div className="mt-4 pt-2 border-t border-slate-800/60 flex justify-between items-center">
          <div>
            {text && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-900/60 text-slate-300 hover:text-red-400 text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
              >
                Clear Text
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500">
            Estimated reading time: <span className="text-slate-400 font-medium">{Math.ceil(wordCount / 200)} min</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
