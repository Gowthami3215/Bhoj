// OCR and Data Parsing Logic

window.BhojOCR = {
    /**
     * Run Tesseract OCR on an image file
     * @param {File} file 
     * @param {Function} onProgress 
     * @returns {Promise<string>} Extracted text
     */
    recognizeText: async function(file, onProgress) {
        try {
            if (typeof Tesseract === 'undefined') {
                throw new Error("Tesseract library not loaded.");
            }

            // Enforce a timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("OCR Timed Out")), 30000);
            });

            const ocrPromise = (async () => {
                // Tesseract v5 initialization
                const worker = await Tesseract.createWorker('eng', 1, {
                    logger: m => {
                        if (m.status === 'recognizing text' && onProgress) {
                            onProgress(Math.round(m.progress * 100));
                        }
                    }
                });
                
                const { data: { text } } = await worker.recognize(file);
                await worker.terminate();
                
                return text;
            })();

            return await Promise.race([ocrPromise, timeoutPromise]);
        } catch (error) {
            console.error("OCR Error:", error);
            throw error;
        }
    },

    /**
     * Extract product details from raw text
     * @param {string} text 
     * @returns {Object} Extracted data
     */
    parseText: function(text) {
        console.log("Raw OCR Text:\n", text);
        
        const data = {
            name: '',
            quantity: '',
            manufacturingDate: '',
            expiryDate: ''
        };

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // 1. Parse Dates
        const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})|((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(\d{4})/gi;
        const foundDates = [];
        let match;
        
        while ((match = dateRegex.exec(text)) !== null) {
            if (match[1]) {
                // DD/MM/YYYY format
                let day = match[1].padStart(2, '0');
                let month = match[2].padStart(2, '0');
                let year = match[3];
                if (year.length === 2) {
                    year = '20' + year; // Assume 20xx for 2-digit years
                }
                // Basic validation
                if (parseInt(month) <= 12 && parseInt(day) <= 31) {
                     foundDates.push({ raw: match[0], formatted: `${year}-${month}-${day}` });
                }
            } else if (match[4]) {
                // MMM YYYY format
                const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                let monthStr = match[4].toLowerCase().substring(0, 3);
                let monthIndex = monthNames.indexOf(monthStr) + 1;
                let month = monthIndex.toString().padStart(2, '0');
                let year = match[5];
                foundDates.push({ raw: match[0], formatted: `${year}-${month}-01` }); // Default to 1st of month
            }
        }

        // Look for keywords near dates
        const textLower = text.toLowerCase();
        let mfdFormatted = '';
        let expFormatted = '';

        // Simplistic approach: if multiple dates, earlier is MFD, later is EXP.
        // If keywords exist, use them.
        
        const mfdKeywords = ['mfd', 'mfg', 'manufactured', 'pkd'];
        const expKeywords = ['exp', 'expiry', 'use by', 'use before', 'best before'];

        // Assign dates based on keywords on the same line
        for (let line of lines) {
            let lowerLine = line.toLowerCase();
            let lineDates = [];
            
            let dMatch;
            const lineDateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/g;
            while ((dMatch = lineDateRegex.exec(line)) !== null) {
                let day = dMatch[1].padStart(2, '0');
                let month = dMatch[2].padStart(2, '0');
                let year = dMatch[3];
                if (year.length === 2) year = '20' + year;
                if (parseInt(month) <= 12 && parseInt(day) <= 31) {
                    lineDates.push(`${year}-${month}-${day}`);
                }
            }

            if (lineDates.length > 0) {
                if (mfdKeywords.some(k => lowerLine.includes(k))) {
                    mfdFormatted = lineDates[0];
                }
                if (expKeywords.some(k => lowerLine.includes(k))) {
                    expFormatted = lineDates[lineDates.length > 1 ? 1 : 0]; // if two dates on exp line, 2nd is usually exp
                }
            }
        }

        // Fallback: If no keywords matched but we have dates, guess based on chronological order
        if (!mfdFormatted && !expFormatted && foundDates.length > 0) {
            const sortedDates = foundDates.map(d => d.formatted).sort();
            if (sortedDates.length >= 2) {
                mfdFormatted = sortedDates[0];
                expFormatted = sortedDates[sortedDates.length - 1];
            } else if (sortedDates.length === 1) {
                // If only one date, assume it's expiry to be safe
                expFormatted = sortedDates[0];
            }
        }

        // Handle "Best before X days from MFD" if we have MFD but no EXP
        if (mfdFormatted && !expFormatted) {
            const daysRegex = /best before\s*(\d+)\s*days/i;
            const monthsRegex = /best before\s*(\d+)\s*months/i;
            
            let daysMatch = textLower.match(daysRegex);
            let monthsMatch = textLower.match(monthsRegex);
            
            if (daysMatch) {
                let d = new Date(mfdFormatted);
                d.setDate(d.getDate() + parseInt(daysMatch[1]));
                expFormatted = d.toISOString().split('T')[0];
            } else if (monthsMatch) {
                let d = new Date(mfdFormatted);
                d.setMonth(d.getMonth() + parseInt(monthsMatch[1]));
                expFormatted = d.toISOString().split('T')[0];
            }
        }

        data.manufacturingDate = mfdFormatted;
        data.expiryDate = expFormatted;

        // 2. Parse Quantity
        const qtyRegex = /(\d+(?:\.\d+)?)\s*(kg|g|ml|l|pieces|pcs)\b/i;
        const qtyMatch = text.match(qtyRegex);
        if (qtyMatch) {
            data.quantity = qtyMatch[0];
        }

        // 3. Parse Name (Heuristics)
        // Usually the largest text, or first few lines that don't contain numbers/dates
        for (let line of lines) {
            let lower = line.toLowerCase();
            // Skip lines with dates, typical meta info, or very short lines
            if (lower.match(/\d/) || mfdKeywords.some(k => lower.includes(k)) || expKeywords.some(k => lower.includes(k)) || lower.length < 3) {
                continue;
            }
            // Capitalize first letters for a decent name guess
            data.name = line.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            break; // take first valid looking line
        }

        return data;
    }
};
