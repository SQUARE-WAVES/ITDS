{
   "setup": {
       "kr": 4800,
       "ksmps": 10,
       "nchnls": 2,
       "sr": 48000
   },
   "tracks": [
       {
           "name": "hey",
           "score": "f 1 0 4096 10 1\n\ni 1 0 1 440\ni 1 1 1 220\n"
       },
       {
           "name": "woah",
           "score": "f 1 0 4096 10 1\n\ni 1 0 1 660\ni 1 1 1 275\n"
       }
   ],
   "instruments": [
       {
           "number": 1,
           "code": "a1 oscili 10000, p4, 1\n   outs  a1, a1"
       },
		   {	
           "number": 102,
           "code": "a1 foscili 10000, p4, 1\n   outs  a1, a1"
       }
   ],
   "globals": {
		"aRevinput":0,
		"kKnob1":0
   },
   "name": "new style jam"
}
