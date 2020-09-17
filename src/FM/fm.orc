;; Author: Steven Yi
;; Description: Frequency Modulation

sr=48000
ksmps=128
0dbfs=1
nchnls=2

gisine ftgen 0, 0, 65536, 10, 1

instr 1
    ifreq = p4 
    iamp = p5

    ;; MODULATOR 
    kmod_ratio = chnget:k("modRatio")  ;; ratio of modulator to carrier frequency

    icarfreq = p4   ;; carrier frequency set to value given by user
    kmodfreq = icarfreq * kmod_ratio  ;; derived value for modulator frequency

    kindex = chnget:k("index")   ;; controls amount of energy in sidebands 

    kmod_amp = kindex * kmodfreq
              
    ;; OPERATORS
    amod = oscili(kmod_amp, kmodfreq)  ;; "Operator 1"
    acar = oscili(iamp, icarfreq + amod)  ;; "Operator 2" 

    ;; DECLICK ENVELOPE
    asig = acar * linsegr:a(0, 0.02, ampdbfs(-12), 0.02, 0)

    out(asig, asig)
endin

instr 2
    irun = chnget:i("run")
    ivals[] = fillarray(0,2,4,5,7,9,11)
    inn = ivals[int(random:i(0,7))]
    if(irun == 1) then
        schedule(1, 0, 1, cpsmidinn(72 + inn), ampdbfs(-12))
        schedule(p1, 1, 0)
    endif
endin