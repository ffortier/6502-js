PORTB = $6000
PORTA = $6001
DDRB = $6002
DDRA = $6003

E  = %10000000
RW = %01000000
RS = %00100000

  .org $8000

reset:
  lda #%11111111 ; Set all pins on port B to output
  sta DDRB
  
  lda #%11100000 ; Set top 3 pins on port A to output
  sta DDRA

  lda #%00111000 ; Set 8 bit mode, 2 line display
  sta PORTB
  lda #0 ; Clear RS/RW/E bits
  sta PORTA
  lda #E ; Set E to send instruction
  sta PORTA
  lda #0 ; Clear
  sta PORTA

  lda #%00001110 ; Cursor ON Display ON Blink OFF
  sta PORTB
  lda #0 ; Clear RS/RW/E bits
  sta PORTA
  lda #E ; Set E to send instruction
  sta PORTA
  lda #0 ; Clear
  sta PORTA

  lda #%00000110 ; Incrementing not shifting
  sta PORTB
  lda #0 ; Clear RS/RW/E bits
  sta PORTA
  lda #E ; Set E to send instruction
  sta PORTA
  lda #0 ; Clear
  sta PORTA

  lda #"H"
  sta PORTB
  lda #RS ; Clear RS/RW/E bits
  sta PORTA
  lda #(RS | E) ; Set RS + E to send character
  sta PORTA
  lda #RS ; Clear
  sta PORTA

  lda #"e"
  sta PORTB
  lda #RS ; Clear RS/RW/E bits
  sta PORTA
  lda #(RS | E) ; Set RS + E to send character
  sta PORTA
  lda #RS ; Clear
  sta PORTA

  lda #"l"
  sta PORTB
  lda #RS ; Clear RS/RW/E bits
  sta PORTA
  lda #(RS | E) ; Set RS + E to send character
  sta PORTA
  lda #RS ; Clear
  sta PORTA

  lda #"l"
  sta PORTB
  lda #RS ; Clear RS/RW/E bits
  sta PORTA
  lda #(RS | E) ; Set RS + E to send character
  sta PORTA
  lda #RS ; Clear
  sta PORTA

  lda #"o"
  sta PORTB
  lda #RS ; Clear RS/RW/E bits
  sta PORTA
  lda #(RS | E) ; Set RS + E to send character
  sta PORTA
  lda #RS ; Clear
  sta PORTA

loop:
  jmp loop

  .org $fffc
  .word $8000
  .word $0000
