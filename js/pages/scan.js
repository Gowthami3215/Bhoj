// Scan Food Page View

window.renderScan = function() {
    const container = document.getElementById('view-scan');

    container.innerHTML = `
        <div class="container section-padding">
            <div style="max-width: 700px; margin: 0 auto; text-align: center;" id="scan-initial-view">
                <h1 style="margin-bottom: 10px;">Scan Your Food</h1>
                <p style="color: var(--color-text-light); margin-bottom: 40px; font-size: 1.1rem;">
                    Upload a photo of your food package to automatically extract its details.
                </p>

                <div class="card" style="padding: 40px; border: 2px dashed #ccc; background-color: var(--color-bg); cursor: pointer;" id="upload-zone">
                    <div style="font-size: 4rem; color: var(--color-primary-light); margin-bottom: 20px;">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <h3 style="margin-bottom: 10px;">Upload Package Photo</h3>
                    <p style="color: var(--color-text-light); margin-bottom: 15px;">Take a photo or drag and drop an image here</p>
                    <p style="font-size: 0.85rem; color: #999; margin-bottom: 20px;">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
                    
                    <!-- Preview Container -->
                    <div id="image-preview-container" style="display: none; margin-bottom: 20px;">
                        <img id="image-preview" src="" alt="Preview" style="max-width: 100%; max-height: 300px; border-radius: var(--radius-sm); box-shadow: var(--shadow-sm); margin: 0 auto;">
                    </div>

                    <input type="file" id="file-upload" style="display: none;" accept="image/jpeg, image/png, image/webp">
                    
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn btn-outline" id="btn-choose" onclick="document.getElementById('file-upload').click(); event.stopPropagation();">
                            Choose Image
                        </button>
                        <button class="btn btn-primary" id="btn-analyze" style="display: none;" onclick="event.stopPropagation(); window.analyzeImage();">
                            Analyze Food
                        </button>
                    </div>
                </div>
                
                <p style="font-size: 0.9rem; color: #666; margin-top: 20px;">
                    <i class="fa-solid fa-lightbulb" style="color: var(--color-warning);"></i> 
                    For best results, upload a clear photo where the product name and date labels are visible.
                </p>
            </div>

            <!-- Loading State -->
            <div id="scan-loading-view" style="display: none; max-width: 600px; margin: 50px auto; text-align: center;">
                <div style="font-size: 3rem; color: var(--color-primary); margin-bottom: 20px;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                </div>
                <h3 id="loading-msg">Reading package text...</h3>
                <div style="width: 100%; background-color: #eee; height: 10px; border-radius: 5px; margin-top: 20px; overflow: hidden;">
                    <div id="loading-progress" style="width: 0%; height: 100%; background-color: var(--color-primary); transition: width 0.3s;"></div>
                </div>
                <p style="color: var(--color-text-light); margin-top: 15px;" id="loading-submsg">This may take a few moments...</p>
            </div>

            <!-- Review Form View -->
            <div id="scan-review-view" style="display: none; max-width: 700px; margin: 0 auto;">
                <h2 style="text-align: center; margin-bottom: 10px;">Review Food Details</h2>
                <p style="text-align: center; color: var(--color-text-light); margin-bottom: 30px;">
                    Please verify the extracted information. OCR can make mistakes!
                </p>

                <div id="ocr-warning" style="display: none; background-color: var(--color-warning-bg); color: #856404; padding: 15px; border-radius: var(--radius-sm); margin-bottom: 20px;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <span id="ocr-warning-text">Some information could not be detected. Please fill it in manually.</span>
                </div>

                <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 30px;">
                    <div>
                        <div class="card" style="padding: 25px;">
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px;">Food Name *</label>
                                <input type="text" id="form-name" class="form-input" placeholder="e.g. Milk, Bread" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px;">Quantity</label>
                                <input type="text" id="form-qty" class="form-input" placeholder="e.g. 500g, 1L" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px;">Manufacturing Date</label>
                                <input type="date" id="form-mfg" class="form-input" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px;">Expiry Date *</label>
                                <input type="date" id="form-exp" class="form-input" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="card" style="padding: 15px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                            <p style="font-weight: 600; margin-bottom: 10px;">Uploaded Image</p>
                            <img id="review-image" src="" alt="Uploaded Package" style="max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 4px; margin: 0 auto;">
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
                    <details>
                        <summary style="cursor: pointer; font-weight: 600; color: #555;">Show detected text (OCR Debug)</summary>
                        <pre id="ocr-raw-text" style="margin-top: 10px; font-size: 0.85rem; color: #333; white-space: pre-wrap; word-wrap: break-word;"></pre>
                    </details>
                </div>

                <div style="display: flex; gap: 15px; justify-content: flex-end; margin-top: 30px;">
                    <button class="btn btn-outline" onclick="window.resetScan()">Cancel</button>
                    <button class="btn btn-primary" onclick="window.confirmAndSave()">Confirm & Add to Pantry</button>
                </div>
            </div>
        </div>
    `;

    // State
    window.currentScanFile = null;
    window.currentScanDataUrl = null;

    // Attach Event Listeners
    setTimeout(() => {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-upload');

        if (uploadZone && fileInput) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-primary)';
                uploadZone.style.backgroundColor = '#e8f3f0';
            });

            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = '#ccc';
                uploadZone.style.backgroundColor = 'var(--color-bg)';
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = '#ccc';
                uploadZone.style.backgroundColor = 'var(--color-bg)';
                
                if (e.dataTransfer.files.length > 0) {
                    handleFileSelect(e.dataTransfer.files[0]);
                }
            });

            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    handleFileSelect(fileInput.files[0]);
                }
            });
        }
    }, 100);
};

// Handle file selection and preview
function handleFileSelect(file) {
    if (!file.type.match('image.*')) {
        alert("Please select a valid image file (JPG, PNG, WEBP).");
        return;
    }
    
    // Check size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
    }

    window.currentScanFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        window.currentScanDataUrl = e.target.result;
        
        // Show preview
        document.getElementById('image-preview-container').style.display = 'block';
        document.getElementById('image-preview').src = window.currentScanDataUrl;
        
        // Update buttons
        document.getElementById('btn-choose').innerText = "Change Image";
        document.getElementById('btn-analyze').style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
}

// Run OCR process
window.analyzeImage = async function() {
    if (!window.currentScanFile) return;

    // UI State: Loading
    document.getElementById('scan-initial-view').style.display = 'none';
    document.getElementById('scan-loading-view').style.display = 'block';
    
    const progressMsg = document.getElementById('loading-msg');
    const progressBar = document.getElementById('loading-progress');
    const subMsg = document.getElementById('loading-submsg');

    progressMsg.innerText = "Preparing image...";
    
    try {
        const text = await window.BhojOCR.recognizeText(window.currentScanFile, (progress) => {
            progressMsg.innerText = "Reading package text...";
            progressBar.style.width = `${progress}%`;
            subMsg.innerText = `OCR Progress: ${progress}%`;
        });

        progressMsg.innerText = "Finding product information...";
        progressBar.style.width = "100%";
        subMsg.innerText = "Parsing dates and names...";

        // Parse extracted text
        const parsedData = window.BhojOCR.parseText(text);
        
        // Simulate slight parsing delay for UI smoothness
        setTimeout(() => {
            showReviewForm(parsedData, text);
        }, 800);

    } catch (err) {
        alert("We couldn't read this image. Please try a clearer photo.");
        console.error(err);
        
        // Reset UI so user is not stuck on loading screen
        document.getElementById('scan-loading-view').style.display = 'none';
        document.getElementById('scan-initial-view').style.display = 'block';
    }
};

// Show Review Form prefilled with OCR data
function showReviewForm(data, rawText = "") {
    document.getElementById('scan-loading-view').style.display = 'none';
    document.getElementById('scan-review-view').style.display = 'block';
    
    document.getElementById('review-image').src = window.currentScanDataUrl;
    
    document.getElementById('form-name').value = data.name || '';
    document.getElementById('form-qty').value = data.quantity || '';
    document.getElementById('form-mfg').value = data.manufacturingDate || '';
    document.getElementById('form-exp').value = data.expiryDate || '';
    document.getElementById('ocr-raw-text').innerText = rawText || "No text detected.";

    // Warn if important data is missing
    const warningBox = document.getElementById('ocr-warning');
    const warningText = document.getElementById('ocr-warning-text');
    
    let missing = [];
    if (!data.name) missing.push("Food Name");
    if (!data.expiryDate) missing.push("Expiry Date");
    
    if (missing.length > 0) {
        warningBox.style.display = 'block';
        warningText.innerText = `We couldn't clearly detect the ${missing.join(" and ")}. Please enter it manually.`;
    } else {
        warningBox.style.display = 'none';
    }
}

// Reset scan page to initial state
window.resetScan = function() {
    window.currentScanFile = null;
    window.currentScanDataUrl = null;
    window.navigateTo('scan'); // Re-renders the page fresh
};

// Save validated data to Pantry
window.confirmAndSave = function() {
    const name = document.getElementById('form-name').value.trim();
    const qty = document.getElementById('form-qty').value.trim();
    const mfg = document.getElementById('form-mfg').value;
    const exp = document.getElementById('form-exp').value;
    
    if (!name || !exp) {
        alert("Food Name and Expiry Date are required!");
        return;
    }

    // Prepare item for localStorage
    const newItem = {
        name: name,
        quantity: qty,
        manufacturingDate: mfg,
        expiryDate: exp,
        // Optional: save downscaled image or fallback if localstorage fills up
        // We'll store it as is for the prototype, but it could cause quota errors over time
        image: window.currentScanDataUrl 
    };

    try {
        window.BhojInventory.add(newItem);
        alert("Item successfully added to your Pantry!");
        window.navigateTo('pantry');
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert("Browser storage is full! Could not save the image. Item will be saved without image.");
            newItem.image = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
            window.BhojInventory.add(newItem);
            window.navigateTo('pantry');
        } else {
            alert("Error saving item.");
            console.error(e);
        }
    }
};
