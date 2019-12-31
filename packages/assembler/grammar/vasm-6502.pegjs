start
 = head:expressionLine* tail:expression { 
 	return [...head, tail]
    	.flat(Number.MAX_VALUE)
        .filter(value => !!value && typeof value !== 'string'); 
   }
   
expressionLine
 = expression:expression "\n" { return expression; }
 
expression
 = label endOfLine
 / whitespace* directive:directive endOfLine { return directive; }
 / whitespace* instruction:instruction endOfLine { return instruction; }
 / endOfLine

label
 = label:alphanumeric ":" { return { type: 'label', label, location: location() }; }
 / label:alphanumeric whitespace+ instruction:instruction { return [{ type: 'label', label, location: location() }, instruction]; }
 
instruction
 = opcode:opcode whitespace+ value:value { return { type: 'instruction', opcode, value, location: location() }; }
 / opcode:opcode { return { type: 'instruction', opcode, location: location() }; }
 
directive
 = "." directive:alphanumeric whitespace* value:value { return { type: 'directive', directive, value, location: location() }; }
 
alphanumeric
 = [a-zA-Z_][a-zA-Z_0-9]* { return text(); }
 
endOfLine
 = whitespace* comment?
 
whitespace
 = [ \t] {}
 
comment
 = ";" [^\n]* {}
 
value
 = "#" number:number { return { type: 'immediate', number } }
 / number:number { return { type: 'absolute', number } }
 / label:alphanumeric { return { type: 'label', label } }
 
number
 = hexNumber
 / octalNumber
 / binaryNumber
 / decimalNumber
 
hexNumber
 = "$" num:([a-fA-F0-9]+) { return parseInt(num.join(''), 16) }
 
octalNumber
 = "@" num:([0-7]+) { return parseInt(num.join(''), 8) }
 
binaryNumber
 = "%" num:([01]+) { return parseInt(num.join(''), 2) }
 
decimalNumber
 = [0-9]+ { return parseInt(text(), 10); }
 
opcode
 = [a-zA-Z][a-zA-Z][a-zA-Z][0-7]? { return text(); }
