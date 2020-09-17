;; Author: Steven Yi
;; Description: Frequency Modulation

sr=48000
ksmps=128
0dbfs=1
nchnls=2

gisine ftgen 0, 0, 65536, 10, 1

instr 1
    ifreq = p4 

    ;; MODULATOR 
    imodEnabled = chnget:i("modEnabled")
    kmodFreq = chnget:k("modFreq")
    kmodAmp = chnget:k("modAmp")
    kmodOffset = chnget:k("modOffset")

    ;; SOURCE (Carrier)
    iwave = chnget:i("waveform")

    if(iwave == -1) then
        asig = oscili(1, ifreq)
    else 
        asig = vco2(1, ifreq, iwave)
    endif


    if(imodEnabled == 1) then
      asig *= oscili(kmodAmp, kmodFreq) + kmodOffset
    endif

    ;; DECLICK ENVELOPE
    asig *= linen:a(ampdbfs(-12), 0.02, p3, 0.02)

    out(asig, asig)
endin

instr 2
    irun = chnget:i("run")
    ivals[] = fillarray(0,2,4,5,7,9,11)
    inn = ivals[int(random:i(0,7))]
    if(irun == 1) then
        schedule(1, 0, 1, cpsmidinn(84 + inn))
        schedule(p1, 1, 0)
    endif
endin