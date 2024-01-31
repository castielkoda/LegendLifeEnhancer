function updateAllSecondImageTitles() {
    const elements = document.querySelectorAll('.relative.z-10[data-token-id]');
    elements.forEach(el => {
        const tokenId = el.getAttribute('data-token-id');
        const parent = el.parentNode;
        const secondImage = parent.querySelector('button img');

        if (tokenId && secondImage) {
            secondImage.title = "#"+tokenId;
        }
    });
}


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedUpdateImageTitle = debounce(updateAllSecondImageTitles, 500);
// Initial call after DOM is loaded
window.addEventListener('DOMContentLoaded', debouncedUpdateImageTitle);

// Set up a MutationObserver to react to changes in the DOM
const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length || mutation.attributeFilter && mutation.attributeFilter.includes('data-token-id')) {
            shouldUpdate = true;
            break;
        }
    }
    if (shouldUpdate) {
        debouncedUpdateImageTitle();
    }
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-token-id']
});
