import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import math
import random
import operator
import sys
sys.setrecursionlimit(10000)
xl=pd.ExcelFile("mpd2018.xlsx")
dfr=xl.parse('rgdpnapc')
dfc=xl.parse('cgdppc')
dfp=xl.parse('pop')
dfi=xl.parse('i_bm')
dfc.columns=dfc.iloc[0]
dfr.columns=dfr.iloc[0]
dfp.columns=dfp.iloc[0]
dfi.columns=dfi.iloc[0]
dfc.drop(dfc.index[0], inplace=True)
dfr.drop(dfr.index[0], inplace=True)
dfp.drop(dfp.index[0], inplace=True)
dfi.drop(dfi.index[0], inplace=True)
dfc.year=pd.to_numeric(dfc.year)
dfr.year=pd.to_numeric(dfr.year)
dfp.year=pd.to_numeric(dfp.year)
dfi.year=pd.to_numeric(dfi.year)
dfr.set_index('year', inplace=True)
dfc.set_index('year', inplace=True)
dfp.set_index('year', inplace=True)
dfi.set_index('year', inplace=True)
fig, ax = plt.subplots()
yournames=input("Enter 3-letter country codes; separate countries by space, separate lists by comma: ")
yournames=yournames.split(',')
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
    yourcos=a.split(' ')
    vol2=[]
    for q in yourcos:
        ratic=(dfc[q]*dfp[q])
        ratir=(dfr[q]*dfp[q])
        ratic=ratic.astype(np.double)
        ratir=ratir.astype(np.double)
        maskc=np.isfinite(ratic)
        maskr=np.isfinite(ratir)
        ratic=ratic[maskc]
        ratir=ratir[maskr]
        # 1953 to include African and exclude most socialist countries
        bmk=dfi[q].loc[1500:1953].last_valid_index()
        if bmk==None or q in ('TWN', 'KOR','IND'):
            ratiq=ratir
        else:
            weight1=abs(ratic.index-2011)/(2011-bmk)
            weight1=weight1.map(lambda x: 1 if x>1 else x)
            ratir=pd.concat([ratir, ratic], axis=1)
            ratir.columns=['ratir', 'ratic']
            ratir['ratir'].fillna(ratir['ratic'], inplace=True)
            ratir=ratir['ratir']
            ratiq=(ratic*weight1)+(ratir*(1-weight1))
        # arbitrary revisions go here
        if q in ('SUN', 'RUS', 'KAZ', 'GEO', 'ARM', 'TJK', 'UKR', 'SRB', 'MNE', 'MKD'):
            weight2=-1*(ratiq.index-2011)/(2011-1996)
            weight2=weight2.map(lambda x: 1 if x>1 else(0 if x<0 else x))
            ratiz=ratiq*.7
            ratiq=(ratiz*weight2)+(ratiq*(1-weight2))
        if a in ('IDN'):
            weight3=-1*(ratiq.index-2011)/(2011-1880)
            weight3=weight3.map(lambda x: 0 if x>1 else(0 if x<0 else x))
            ratiz1=ratiq*.82
            ratiq=(ratiz1*weight3)+(ratiq*(1-weight3))
        if q in ('CUB'):
            ratiq=ratiq*1.5
        if q in ('PRK'):
            ratiq=np.array([[1940,1700],[1944,1800],[1949,1700],[1951,1000],[1954,1396],[1960,1958],[1965,2011],[1970,2013],[1975,2213],[1980,2272],[1985,2553],[1989,2661],[1998,1400],[2005,2000],[2016,2500]])
            ratiq=1.1*pd.Series(index=ratiq[0:,0], data=ratiq[0:,1]) #edit here if dividing
            ratiq.index.name='PRK'
            ratiq=ratiq.astype(np.double)
            maskq=np.isfinite(ratiq)
            ratiq=ratiq[maskq]
            ratiq=ratiq*dfp['PRK']
        vol2.append(ratiq)
    ratiq=sum(vol2)
    ratiq=ratiq.astype(np.double)
    maskr=np.isfinite(ratiq)
    ratiq=ratiq[maskr]
    maxx=max(ratiq.loc[startd:endd])
    vol1.append(maxx)
    minx=min(ratiq.loc[startd:endd])
    vol1.append(minx)
    plt.plot(ratiq, color=[color1[0],color1[1],color1[2]], lw='1', label=a)
volmax=max(vol1)
volmin=min(vol1)
axes.set_ylim([volmin,volmax])
plt.legend(loc='best', fontsize='xx-small', labelspacing=.1)
plt.grid(which='minor',axis='y')
plt.grid(which='major',axis='y')
plt.grid(which='major',axis='x')
plt.ylabel("GDP (PPP), 2011 USD")
plt.show()
