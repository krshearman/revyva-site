// Shared Gumroad authentication for revyva-site
// This script can be used by workbook and journal pages

// Gumroad configuration - matches the app configuration
const GUMROAD_PRODUCT_ID = 'V20f5aJqNEX4CqPFnwpt0A==';
const GUMROAD_VERIFY_ENDPOINT = 'https://revyva-app.netlify.app/api/verify-license';

// Legacy hash authentication (fallback)
const ACCESS_KEY_HASH = 'ed1e70b20c2f496bbf58638229dde8edb1c18b113434bf367ceb32d64d464580';

// Check for existing authentication
function checkExistingAuth() {
    // First check for Gumroad license
    const licenseKey = localStorage.getItem('revyva_license_key');
    const licenseData = localStorage.getItem('revyva_license_data');
    
    if (licenseKey && licenseData) {
        try {
            const parsedData = JSON.parse(licenseData);
            if (parsedData && parsedData.id) {
                console.log('Found valid Gumroad license in storage');
                return { type: 'gumroad', valid: true, data: parsedData };
            }
        } catch (e) {
            console.error('Error parsing stored license data:', e);
        }
    }
    
    // Fallback to legacy hash auth
    const hashAuth = localStorage.getItem('revyva_workbook_authed');
    if (hashAuth === 'true') {
        console.log('Found valid legacy hash authentication');
        return { type: 'legacy', valid: true };
    }
    
    return { type: 'none', valid: false };
}

// Verify Gumroad license via the app's Netlify function
async function verifyGumroadLicense(licenseKey) {
    try {
        console.log('Verifying Gumroad license via app endpoint...');
        
        const response = await fetch(GUMROAD_VERIFY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                licenseKey: licenseKey.trim(),
                productId: GUMROAD_PRODUCT_ID
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Verification endpoint error:', response.status, errorText);
            return { success: false, message: `Server error (${response.status})` };
        }
        
        const result = await response.json();
        console.log('Verification result:', result);
        
        if (result.success && result.purchase) {
            // Store license info
            localStorage.setItem('revyva_license_key', licenseKey.trim());
            localStorage.setItem('revyva_license_data', JSON.stringify(result.purchase));
            return { success: true, purchase: result.purchase };
        } else {
            return { success: false, message: result.message || 'Invalid license key' };
        }
    } catch (error) {
        console.error('License verification error:', error);
        
        // If this is a CORS error, try alternative verification
        if (error.message.includes('fetch') || error.name === 'TypeError') {
            console.log('CORS error detected, trying alternative verification...');
            return await tryAlternativeGumroadVerification(licenseKey);
        }
        
        return { success: false, message: `Network error: ${error.message}. Please try again.` };
    }
}

// Alternative Gumroad verification using direct Gumroad API
async function tryAlternativeGumroadVerification(licenseKey) {
    try {
        console.log('Trying direct Gumroad API verification...');
        
        // Try Gumroad's direct license verification endpoint
        const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'product_id': GUMROAD_PRODUCT_ID,
                'license_key': licenseKey.trim(),
                'increment_uses_count': 'false'
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Direct Gumroad API result:', result);
            
            if (result.success) {
                // Store license info
                localStorage.setItem('revyva_license_key', licenseKey.trim());
                localStorage.setItem('revyva_license_data', JSON.stringify(result.purchase));
                return { success: true, purchase: result.purchase };
            } else {
                return { success: false, message: result.message || 'Invalid license key' };
            }
        } else {
            console.log('Direct Gumroad API failed, trying JSONP approach...');
            return await tryJSONPVerification(licenseKey);
        }
        
    } catch (error) {
        console.error('Direct Gumroad API error:', error);
        console.log('Trying JSONP approach...');
        return await tryJSONPVerification(licenseKey);
    }
}

// JSONP-based verification as final fallback
async function tryJSONPVerification(licenseKey) {
    return new Promise((resolve) => {
        const callbackName = 'gumroadCallback_' + Date.now();
        
        // Create JSONP callback
        window[callbackName] = function(data) {
            delete window[callbackName];
            document.head.removeChild(script);
            
            if (data.success) {
                localStorage.setItem('revyva_license_key', licenseKey.trim());
                localStorage.setItem('revyva_license_data', JSON.stringify(data.purchase));
                resolve({ success: true, purchase: data.purchase });
            } else {
                resolve({ success: false, message: data.message || 'Invalid license key' });
            }
        };
        
        // Create script tag for JSONP
        const script = document.createElement('script');
        script.src = `https://api.gumroad.com/v2/licenses/verify?product_id=${encodeURIComponent(GUMROAD_PRODUCT_ID)}&license_key=${encodeURIComponent(licenseKey.trim())}&increment_uses_count=false&callback=${callbackName}`;
        
        script.onerror = function() {
            delete window[callbackName];
            document.head.removeChild(script);
            resolve({ 
                success: false, 
                message: 'Unable to verify Gumroad license. Please use the legacy access code or contact support.' 
            });
        };
        
        // Timeout after 30 seconds
        setTimeout(() => {
            if (window[callbackName]) {
                delete window[callbackName];
                if (script.parentNode) {
                    document.head.removeChild(script);
                }
                resolve({ 
                    success: false, 
                    message: 'License verification timeout. Please try again or use the legacy access code.' 
                });
            }
        }, 30000);
        
        document.head.appendChild(script);
    });
}

// Legacy hash verification (fallback)
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function verifyLegacyHash(accessKey) {
    try {
        console.log('Verifying legacy hash for key:', accessKey);
        const inputHash = await hashString(accessKey);
        console.log('Generated hash:', inputHash);
        console.log('Expected hash:', ACCESS_KEY_HASH);
        console.log('Hashes match:', inputHash === ACCESS_KEY_HASH);
        
        if (inputHash === ACCESS_KEY_HASH) {
            localStorage.setItem('revyva_workbook_authed', 'true');
            return { success: true, type: 'legacy' };
        } else {
            return { success: false, message: 'Invalid access key' };
        }
    } catch (error) {
        console.error('Hash verification error:', error);
        return { success: false, message: 'Verification error' };
    }
}

// Main authentication function
async function authenticateUser(inputValue) {
    console.log('Starting authentication with input:', inputValue ? 'provided' : 'empty');
    
    // Clear any error messages
    const errorElement = document.getElementById('auth-error');
    if (errorElement) errorElement.style.display = 'none';
    
    // Show loading state
    const submitButton = document.querySelector('.auth-form button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
        submitButton.textContent = 'Verifying...';
        submitButton.disabled = true;
    }
    
    try {
        // First try legacy hash authentication (for "revyva-2024-access")
        console.log('Trying legacy hash verification first...');
        const legacyResult = await verifyLegacyHash(inputValue);
        
        if (legacyResult.success) {
            console.log('Legacy verification successful');
            return { success: true, type: 'legacy' };
        } else {
            console.log('Legacy verification failed, trying Gumroad...');
        }
        
        // Then try Gumroad license verification if it looks like a license key
        if (inputValue.includes('-') && inputValue.length > 10) {
            console.log('Input looks like Gumroad license, trying Gumroad verification...');
            const result = await verifyGumroadLicense(inputValue);
            
            if (result.success) {
                console.log('Gumroad verification successful');
                return { success: true, type: 'gumroad', data: result.purchase };
            } else {
                console.log('Gumroad verification failed:', result.message);
            }
        }
        
        // If both fail
        return { success: false, message: 'Invalid license key or access code' };
        
    } finally {
        // Restore button state
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
}

// Show authentication form
function showAuthForm() {
    const overlay = document.getElementById('auth-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

// Hide authentication form
function hideAuthForm() {
    const overlay = document.getElementById('auth-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Show error message
function showAuthError(message) {
    const errorElement = document.getElementById('auth-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Initialize authentication system
function initAuth() {
    console.log('Initializing authentication system...');
    
    // Check for existing authentication
    const authStatus = checkExistingAuth();
    console.log('Current auth status:', authStatus);
    
    if (authStatus.valid) {
        console.log('User already authenticated with', authStatus.type);
        hideAuthForm();
        return;
    }
    
    // Check for pending download URL
    const pendingDownload = localStorage.getItem('revyva_pending_download');
    if (pendingDownload) {
        console.log('Found pending download URL:', pendingDownload);
    }
    
    // Show authentication form
    showAuthForm();
    
    // Set up form submission
    const authForm = document.getElementById('auth-form');
    console.log('Auth form found:', !!authForm);
    
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted');
            
            const input = document.getElementById('access-key');
            const inputValue = input ? input.value.trim() : '';
            console.log('Input value length:', inputValue.length);
            
            if (!inputValue) {
                showAuthError('Please enter your license key or access code');
                return;
            }
            
            const result = await authenticateUser(inputValue);
            console.log('Authentication result:', result);
            
            if (result.success) {
                hideAuthForm();
                
                // Handle pending downloads
                if (pendingDownload) {
                    console.log('Redirecting to pending download:', pendingDownload);
                    localStorage.removeItem('revyva_pending_download');
                    window.location.href = pendingDownload;
                    return;
                }
                
                // Call page-specific success handler
                if (typeof showWorkbooks === 'function') {
                    console.log('Calling showWorkbooks');
                    showWorkbooks();
                } else if (typeof showJournal === 'function') {
                    console.log('Calling showJournal');
                    showJournal();
                } else {
                    console.log('Authentication successful - no specific handler found');
                }
                
            } else {
                showAuthError(result.message || 'Authentication failed');
            }
        });
    } else {
        console.error('Auth form not found! Check element IDs.');
    }
}

// Export functions for use in pages
window.RevyvaAuth = {
    init: initAuth,
    checkAuth: checkExistingAuth,
    verify: authenticateUser,
    showForm: showAuthForm,
    hideForm: hideAuthForm,
    showError: showAuthError
};
