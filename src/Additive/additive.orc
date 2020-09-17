;; Author: Steven Yi
;; Description: Additive Synthesis 

sr=48000
ksmps=128
0dbfs=1
ksmps=128
nchnls=2

instr 1
    ifreq = 200
    asig = oscili(chnget:k("harm1"), ifreq)
    asig += oscili(chnget:k("harm2"), ifreq * 2)
    asig += oscili(chnget:k("harm3"), ifreq * 3)
    asig += oscili(chnget:k("harm4"), ifreq * 4)
    asig += oscili(chnget:k("harm5"), ifreq * 5)
    asig += oscili(chnget:k("harm6"), ifreq * 6)
    asig += oscili(chnget:k("harm7"), ifreq * 7)
    asig += oscili(chnget:k("harm8"), ifreq * 8)
    asig += oscili(chnget:k("harm9"), ifreq * 9)
    asig += oscili(chnget:k("harm10"), ifreq * 10)
    asig += oscili(chnget:k("harm11"), ifreq * 11)
    asig += oscili(chnget:k("harm12"), ifreq * 12)
    asig += oscili(chnget:k("harm13"), ifreq * 13)
    asig += oscili(chnget:k("harm14"), ifreq * 14)
    asig += oscili(chnget:k("harm15"), ifreq * 15)
    asig += oscili(chnget:k("harm16"), ifreq * 16)

    asig *= 1/16 * expsegr:a(0.001, .05, 1, 4, .001)

    out(asig, asig)
endin