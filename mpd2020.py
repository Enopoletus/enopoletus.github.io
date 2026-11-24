import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import math
import random
import operator
import sys
from pathlib import Path
sys.setrecursionlimit(10000)
workbook = Path(__file__).with_name("mpd2020.xlsx")
dfr = pd.read_excel(workbook, sheet_name="GDP pc")
dfp = pd.read_excel(workbook, sheet_name="Population")
dfr.columns=dfr.iloc[0]
dfp.columns=dfp.iloc[0]
dfr = dfr.drop(dfr.index[0])
dfp = dfp.drop(dfp.index[0])
dfr["year"]=pd.to_numeric(dfr["year"])
dfp["year"]=pd.to_numeric(dfp["year"])
dfr = dfr.set_index('year')
dfp = dfp.set_index('year')
fig, ax = plt.subplots()
fig.subplots_adjust(right=0.88)
yournames=input("Enter 3-letter country codes; separate by space: ")
yournames=yournames.split(' ')
logorlin=input("log or linear? ")
startd=int(input("Enter start year: "))
endd=int(input("Enter end year: "))
plt.xticks(rotation=90)
axes = plt.gca()
axes.set_xlim([startd, endd])
axes.set_yscale(logorlin)
start, end = ax.get_xlim()
plt.xticks(np.arange(start, end, 10))
vol1=[]
color2=[]
for a in yournames:
    color1=[]
    def colorpick():
        red = random.random()
        blue = random.random()
        green = random.random()
        toobland=[]
        if len(color2) > 0:
             for i in color2:
                 if sum(map(abs, map(operator.sub, i, [red, green, blue]))) < 2/math.sqrt(len(yournames)):
                     toobland.append(1)
        if 0 < (red*.213)+(blue*.072)+(green*.715) < .6 and len(toobland) < 1:
            color1.append(red)
            color1.append(green)
            color1.append(blue)
            color2.append(color1)
        else:
            colorpick()
    colorpick()
    ratir=dfr[a] #divide by country here
    ratir=ratir.astype("float64")
    maskr=np.isfinite(ratir)
    ratir=ratir[maskr]
    ratiq=ratir
    if a in ('CUB'):
        ratiq=ratiq*2.3
    if a in ('IDN'):
        weight3=-1*(ratiq.index-2011)/(2011-1880)
        weight3=weight3.map(lambda x: 0 if x>1 else(0 if x<0 else x))
        ratiz1=ratiq*.82
        ratiq=(ratiz1*weight3)+(ratiq*(1-weight3))
    visible = ratiq.loc[startd:endd].dropna()
    if visible.empty:
        print(f"Skipping {a}: no data between {startd} and {endd}.")
        continue
    maxx = max(visible)
    vol1.append(maxx)
    minx = min(visible)
    vol1.append(minx)
    plt.plot(ratiq, color=[color1[0],color1[1],color1[2]], linewidth=1, label=a)
    ax.annotate(a, xy=(1.0, visible.iloc[-1]), xycoords=("axes fraction", "data"), xytext=(5, 0), textcoords="offset points", ha="left", va="center", fontsize="xx-small", color=[color1[0], color1[1], color1[2]], annotation_clip=False)
if not vol1:
    raise SystemExit(f"No data available between {startd} and {endd} for the selected countries.")
volmax=max(vol1)
volmin=min(vol1)
axes.set_ylim([0 if logorlin.strip().lower() == "linear" else volmin, volmax])
plt.legend(loc='best', fontsize='xx-small', labelspacing=.1)
plt.grid(which='minor',axis='y')
plt.grid(which='major',axis='y')
plt.grid(which='major',axis='x')
plt.ylabel("GDP per capita (PPP), 2011 USD")
plt.show()
