#!/usr/bin/env bash

install_vasm() {
    curl -O http://sun.hasenbraten.de/vasm/release/vasm.tar.gz
    tar -xzf vasm.tar.gz
    cd vasm
    make CPU=6502 SYNTAX=oldstyle
}

[[ -f vasm/vasm6502_oldstyle ]] || install_vasm
