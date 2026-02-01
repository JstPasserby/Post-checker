(function() {
  'use strict';

  class SocialMediaAnalyzer {
    constructor() {
      this.platform = this.detectPlatform();
      this.injectUI();
      this.setupEventListeners();
    }

    detectPlatform() {
      const hostname = window.location.hostname;
      if (hostname.includes('instagram.com')) return 'instagram';
      if (hostname.includes('tiktok.com')) return 'tiktok';
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
      if (hostname.includes('facebook.com')) return 'facebook';
      if (hostname.includes('youtube.com')) return 'youtube';
      return 'unknown';
    }

    injectUI() {
      // Create floating button
      this.floatingButton = document.createElement('div');
      this.floatingButton.id = 'pre-post-checker-button';
      this.floatingButton.innerHTML = `
        <button style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        ">
          <span style="font-size: 16px;">🛡️</span>
          Check Post Safety
        </button>
      `;
      
      document.body.appendChild(this.floatingButton);
    }

    setupEventListeners() {
      this.floatingButton.addEventListener('click', () => this.analyzeCurrentPost());
      
      // Listen for post composition events
      this.setupPlatformSpecificListeners();
    }

    setupPlatformSpecificListeners() {
      switch (this.platform) {
        case 'instagram':
          this.setupInstagramListeners();
          break;
        case 'tiktok':
          this.setupTikTokListeners();
          break;
        case 'twitter':
          this.setupTwitterListeners();
          break;
        case 'facebook':
          this.setupFacebookListeners();
          break;
        case 'youtube':
          this.setupYouTubeListeners();
          break;
      }
    }

    setupInstagramListeners() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            // Check for post composer
            const composer = document.querySelector('[contenteditable="true"]');
            if (composer && !composer.dataset.analyzerAttached) {
              composer.dataset.analyzerAttached = 'true';
              composer.addEventListener('input', (e) => this.handleContentChange(e.target));
            }
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    async analyzeCurrentPost() {
      const content = this.extractContent();
      
      if (!content.text && !content.image) {
        this.showNotification('No content found to analyze', 'warning');
        return;
      }

      try {
        this.showNotification('Analyzing content...', 'info');
        
        const response = await this.sendToAPI(content);
        
        this.showResults(response);
      } catch (error) {
        console.error('Analysis failed:', error);
        this.showNotification('Analysis failed. Please try again.', 'error');
      }
    }

    extractContent() {
      switch (this.platform) {
        case 'instagram':
          return this.extractInstagramContent();
        case 'tiktok':
          return this.extractTikTokContent();
        // ... other platforms
        default:
          return { text: '', image: null };
      }
    }

    extractInstagramContent() {
      // Find active composer
      const composer = document.querySelector('[contenteditable="true"]');
      const text = composer ? composer.innerText : '';
      
      // Find image upload
      const imageInput = document.querySelector('input[type="file"][accept^="image"]');
      const image = imageInput ? imageInput.files[0] : null;
      
      return { text, image };
    }

    async sendToAPI(content) {
      const API_URL = 'https://api.prepostchecker.com/analyze';
      
      const formData = new FormData();
      formData.append('platform', this.platform);
      formData.append('text', content.text);
      
      if (content.image) {
        formData.append('image', content.image);
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-Extension-Version': '0.1.0',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    }

    showResults(result) {
      // Create results overlay
      const overlay = document.createElement('div');
      overlay.id = 'pre-post-results';
      overlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      const riskColor = result.risk_level === 'low' ? '#10b981' :
                       result.risk_level === 'medium' ? '#f59e0b' :
                       result.risk_level === 'high' ? '#ef4444' : '#7c2d12';
      
      overlay.innerHTML = `
        <div style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Pre-Post Analysis</h3>
            <button id="close-results" style="
              background: none;
              border: none;
              font-size: 20px;
              cursor: pointer;
              color: #666;
            ">×</button>
          </div>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: ${riskColor}20;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 12px;
              font-size: 32px;
            ">
              ${result.risk_level === 'low' ? '✅' : 
                result.risk_level === 'medium' ? '⚠️' :
                result.risk_level === 'high' ? '🚨' : '⛔'}
            </div>
            <div style="font-size: 24px; font-weight: 700; color: ${riskColor}; margin-bottom: 4px;">
              ${result.risk_score}/100
            </div>
            <div style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">
              ${result.risk_level} Risk
            </div>
          </div>
          
          ${result.violations.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #dc2626;">⚠️ Issues Found</h4>
              <div style="background: #fef2f2; border-radius: 8px; padding: 16px;">
                ${result.violations.map(violation => `
                  <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #fecaca;">
                    <div style="font-weight: 600; color: #991b1b; margin-bottom: 4px;">
                      ${violation.type.replace('_', ' ')}
                    </div>
                    <div style="font-size: 14px; color: #666;">${violation.description}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div style="text-align: center; padding: 20px; background: #f0fdf4; border-radius: 8px; margin-bottom: 20px;">
              <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
              <div style="font-weight: 600; color: #059669;">No issues found!</div>
              <div style="font-size: 14px; color: #666; margin-top: 4px;">Your post looks good to go!</div>
            </div>
          `}
          
          <div style="display: flex; gap: 12px;">
            <button id="accept-suggestions" style="
              flex: 1;
              background: ${riskColor};
              color: white;
              border: none;
              border-radius: 8px;
              padding: 12px;
              font-weight: 600;
              cursor: pointer;
            ">Apply Suggestions</button>
            <button id="close-and-post" style="
              flex: 1;
              background: #e5e7eb;
              color: #374151;
              border: none;
              border-radius: 8px;
              padding: 12px;
              font-weight: 600;
              cursor: pointer;
            ">Post Anyway</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Add event listeners
      document.getElementById('close-results').addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
      
      document.getElementById('accept-suggestions').addEventListener('click', () => {
        this.applySuggestions(result.suggestions);
        document.body.removeChild(overlay);
      });
      
      document.getElementById('close-and-post').addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
    }

    applySuggestions(suggestions) {
      // Platform-specific suggestion application
      switch (this.platform) {
        case 'instagram':
          this.applyInstagramSuggestions(suggestions);
          break;
        // ... other platforms
      }
    }

    applyInstagramSuggestions(suggestions) {
      const composer = document.querySelector('[contenteditable="true"]');
      if (composer && suggestions.length > 0) {
        // Apply first suggestion (simplified)
        const originalText = composer.innerText;
        // This would use AI to rewrite the text in a real implementation
        composer.innerText = originalText + '\n\n(Edited for compliance)';
      }
    }

    showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#fef2f2' : 
                    type === 'warning' ? '#fffbeb' : 
                    '#f0f9ff'};
        color: ${type === 'error' ? '#991b1b' : 
                type === 'warning' ? '#92400e' : 
                '#0369a1'};
        border: 1px solid ${type === 'error' ? '#fecaca' : 
                          type === 'warning' ? '#fde68a' : 
                          '#bae6fd'};
        border-radius: 8px;
        padding: 12px 16px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      
      notification.innerHTML = `
        <span>${type === 'error' ? '❌' : 
                type === 'warning' ? '⚠️' : 
                'ℹ️'}</span>
        <span>${message}</span>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SocialMediaAnalyzer();
    });
  } else {
    new SocialMediaAnalyzer();
  }
})();