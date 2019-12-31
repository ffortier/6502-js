.ORG $8000

START:
  TXA
  BNE $01
  RTS         ; yes
  DEX         ; prepare for f(x-1) call
  BNE $01    ; f(1) = 1? no, continue
  RTS         ; yes
  TXA         ; save X on stack
  PHA
  JSR START  ; result of f(x-1) in accumulator
  TAY         ; let’s put f(x-1) aside
  PLA         ; get X back from stack
  TAX
  TYA         ; get f(x-1) back
  PHA         ; save that for now on stack
  DEX         ; prepare f(x-2)
  JSR START
  STA $6000   ; store f(x-2) for addition
  PLA         ; f(x-1) from stack
  CLC
  ADC $6000   ; f(x-1) + f(x-2)
  RTS

.ORG $fffc
.WORD $8000
.WORD $0000
