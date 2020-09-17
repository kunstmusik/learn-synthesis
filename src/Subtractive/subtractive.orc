;; Author: Steven Yi
;; Description: Subtractive Synthesis

sr=48000
ksmps=128
0dbfs=1
nchnls=2

gisine ftgen 0, 0, 65536, 10, 1

instr 1
    ifreq = p4 

    print ifreq

    ;; SOURCE
    iwave = chnget:i("waveform")

    if(iwave == -1) then
        asig = mpulse(1, 1/ifreq)
    elseif (iwave == -2) then
        asig = buzz(1, ifreq, (sr / 2) / ifreq, gisine)
    elseif (iwave == -3) then
        asig = random:a(-1, 1) 
    elseif (iwave == -4) then
        asig = pinker()
    else 
        asig = vco2(1, ifreq, iwave)
    endif


    ;; FILTER 
    kfiltType = chnget:i("filterType")
    kcutoff = chnget:k("filterCutoff")
    kcutoff = port(kcutoff, 0.1, chnget:i("filterCutoff"))

    kQ = chnget:k("filterQ")
    kQ = port(kQ, 0.1, chnget:i("filterQ"))
    if (kfiltType == 1)  then
        asig = zdf_2pole(asig, kcutoff, kQ)
    elseif (kfiltType == 2)  then
        asig = zdf_2pole(asig, kcutoff, kQ, 1)
    elseif (kfiltType == 3)  then
        asig = zdf_2pole(asig, kcutoff, kQ, 3)
    elseif (kfiltType == 4)  then
        asig = zdf_2pole(asig, kcutoff, kQ, 4)
    elseif (kfiltType == 5) then
        asig = zdf_ladder(asig, kcutoff, kQ)
    endif

    ;; DECLICK ENVELOPE
    asig *= linen:a(ampdbfs(-12), 0.01, p3, 0.01)

    out(asig, asig)
endin

instr 2
    irun = chnget:i("run")
    ivals[] = fillarray(0,2,4,5,7,9,11)
    inn = ivals[int(random:i(0,7))]
    if(irun == 1) then
        schedule(1, 0, 1, cpsmidinn(48 + inn))
        schedule(p1, 1, 0)
    endif
endin