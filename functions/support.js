/* eslint-disable strict */
module.exports = {
    findSubString: (str, start, end) => {
        if (!end) {
            return str.substring(str.indexOf(start) + start.length);
        }
        return str.substring(
            str.indexOf(start) + start.length,
            str.indexOf(end, str.indexOf(start) + start.length)
        );
    },
    copyStringToClipboard: (str) => {
        // Create new element
        const el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = {
          position: 'absolute',
          left: '-9999px'
        };
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }
};
