Document
  = head:Line* tail:Expression? { return (tail ? [...head, tail] : head).filter(val => !!val); }
  
Line
  = Whitespace* expr:Expression EOL { return expr; }
  / EOL { return; }
  
Expression
  = DotDirective
  / Declaration
  / Label
  / Operation
  
Whitespace
  = " "
  
EOL
  = Whitespace* Comment? [\n\r]+
  
Comment
  = ";" [^\n]*
  
DotDirective
  = "." directive:[a-zA-Z0-9]+ Whitespace+ value:Value { return { type: 'dotdir', directive: '.' + directive.join('').toLowerCase(), value, text: text(), location: location() }; }
  
Declaration
  = name:[a-zA-Z0-9_]+ Whitespace* "=" Whitespace* value:Value { return { type: 'declaration', declaration: name.join(''), value, text: text(), location: location() }; }
  
Label
  = name:[a-zA-Z0-9_]+ ":" { return { type: 'label', name: name.join(''), text: text(), location: location() }; }
  
Operation
  = code:([a-zA-Z][a-zA-Z0-9]+) Whitespace+ "#" value:Value { return { type: 'operation', code: code.flat().join('').toUpperCase(), text: text(), location: location(), addressingMode: 'immediate', value }; }
  / code:([a-zA-Z][a-zA-Z0-9]+) Whitespace+ value:Value { return { type: 'operation', code: code.flat().join('').toUpperCase(), text: text(), location: location(), addressingMode: 'absolute', value }; }
  / code:([a-zA-Z][a-zA-Z0-9]+) { return { type: 'operation', code: code.flat().join('').toUpperCase(), text: text(), location: location(), addressingMode: 'implicit' }; }
  
Value
  = "$" hex:[a-fA-F0-9]+ { return { type: 'hex', text: text(), value: parseInt(hex.join(''), 16) }; }
  / "%" binary:[01]+ { return { type: 'binary', text: text(), value: parseInt(binary.join(''), 2) }; }
  / "@" octal:[0-7]+ { return { type: 'octal', text: text(), value: parseInt(octal.join(''), 8) }; }
  / decimal:[0-9]+ { return { type: 'decimal', text: text(), value: parseInt(decimal.join(''), 10) }; }
  / [a-zA-Z][a-zA-Z0-9_]* { return { type: 'symbol', text: text() }; }
  / '"' digit:. '"' { return { type: 'ascii', text: text(), digit }; }
  / '(' [^)]* ')' { return { type: 'eval', text: text() }; }
  