const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const kalkHtmlPath = path.join(__dirname, 'kalk-ncix.html');

try {
    const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    const kalkContent = fs.readFileSync(kalkHtmlPath, 'utf8');

    console.log("Reading files...");
    
    // Extract fonts from index.html
    // Note: We capture the whole line including 'const ... = "..."' to be safe
    const bookMatch = indexContent.match(/const GOTHAM_BOOK_B64 = "(.*?)";/);
    const boldMatch = indexContent.match(/const GOTHAM_BOLD_B64 = "(.*?)";/);
    const mediumMatch = indexContent.match(/const GOTHAM_MEDIUM_B64 = "(.*?)";/);

    if (!bookMatch || !boldMatch || !mediumMatch) {
        console.error("Could not find all font definitions in index.html");
        if (!bookMatch) console.error("Missing GOTHAM_BOOK_B64");
        if (!boldMatch) console.error("Missing GOTHAM_BOLD_B64");
        if (!mediumMatch) console.error("Missing GOTHAM_MEDIUM_B64");
        process.exit(1);
    }

    console.log("Found fonts in index.html");

    const fullBook = bookMatch[0];
    const fullBold = boldMatch[0];
    const fullMedium = mediumMatch[0];

    // Replace in kalk-ncix.html
    let newKalkContent = kalkContent;
    
    // Use regex to replace. We assume the format is identical (const var = "...")
    // The previous truncated content also ends with "; so it should match.
    // We need to be careful about escaping special regex characters if we were matching specific content, 
    // but here we just match the pattern.
    
    const bookRegex = /const GOTHAM_BOOK_B64 = ".*?";/;
    const boldRegex = /const GOTHAM_BOLD_B64 = ".*?";/;
    const mediumRegex = /const GOTHAM_MEDIUM_B64 = ".*?";/;

    if (!bookRegex.test(newKalkContent) || !boldRegex.test(newKalkContent) || !mediumRegex.test(newKalkContent)) {
         console.error("Could not find target variable definitions in kalk-ncix.html");
         process.exit(1);
    }

    newKalkContent = newKalkContent.replace(bookRegex, fullBook);
    newKalkContent = newKalkContent.replace(boldRegex, fullBold);
    newKalkContent = newKalkContent.replace(mediumRegex, fullMedium);

    fs.writeFileSync(kalkHtmlPath, newKalkContent, 'utf8');
    console.log("Successfully updated font definitions in kalk-ncix.html");

} catch (error) {
    console.error("Error:", error);
    process.exit(1);
}
