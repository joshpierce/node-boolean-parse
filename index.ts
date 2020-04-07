let parseBoolean = (query: string, workingString?: string, prevLength?: number) => {
    //Check to make sure we're making progress, otherwise throw an error that the query is bogus.
    if (query.length == prevLength) { throw "Error parsing query. Parser Done Got Stuck."; }

    //Track our length for error checking above.
    prevLength = query.length;

    //Turn this on to see the string replacement in action
    console.log(` In Value: ${query}`);

    //If we're currently looking at a parenthesis at the front of the string
    //we know we just need to carry that parenthesis forward.
    if (['(', ')'].includes(query.charAt(0))) {
        workingString += query.charAt(0);
        query = query.slice(1);
    }
    //If we're looking at an operator (only thing that should start with spaces), we need to pluck out the operator and add it to our query.
    else if (query.charAt(0) === ' ') {
        if (operators.filter(x => query.toUpperCase().startsWith(x)).length >= 1) {
            workingString += query.slice(0, query.slice(1).indexOf(' ') + 2).toUpperCase();
            query = query.slice(query.slice(1).indexOf(' ') + 2);
        } else {
            throw 'Error parsing query. Keyword with spaces not wrapped in quotes.';
        }
    }
    //If we're not looking at a parenthesis or an operator, we're looking at a keyword, and we need to extract
    //that key word (including keywords encapsulated in quotes) and add it to our search string.
    else {
        if (query.startsWith('"')) {
            workingString += keywordMapper(searchFields, query.slice(0, query.slice(1).indexOf('"') + 2));
            query = query.slice(query.slice(1).indexOf('"') + 2);
        } else {
            if (query.slice(1).indexOf(' ') !== -1) {
                workingString += keywordMapper(searchFields, query.slice(0, query.slice(1).indexOf(' ') + 1));
                query = query.slice(query.slice(1).indexOf(' ') + 1);
            } else {
                workingString += keywordMapper(searchFields, query);
                query = '';
            }
        }
    }

    //Turn this on to see the string replacement in action
    console.log(`Out Value: ${workingString}`);

    //If the query doesn't 
    if (query.length == 0) {
        return workingString;
    } else {
        return parseBoolean(query, workingString, prevLength);
    }
}

let cleanupWhitespace = (str: string): string => {
    return str.replace(/[\n\r]+/g, '').replace(/[\t]+/g, '').replace(/\s+/g, ' ');;
}

let keywordMapper = (fields: string[], keyword: string) => {
    return `(${fields.map(x => `${x}:${keyword}`).join(' ')})`;
}

//Everything below this line is just operational inputs to drive the above code.
let operators = [' AND ', ' OR ', ' NOT ', ' AND NOT '];
let searchFields = ['id', 'desc'];
let userQuery = ['Mechanic AND Repair AND 747', 'Mechanic AND Repair AND (747 OR 757 OR 767)', '"Airplane Fixer Guy" AND Repair AND (747 OR 757 OR 767)'];

userQuery.map(x => {
    console.log(`\r\n\r\n\r\nStarting Input\r\n--------------------\r\n${x}`);
    console.log(`\r\nFinal Result\r\n--------------------\r\n${parseBoolean(cleanupWhitespace(x), '')}`);
});