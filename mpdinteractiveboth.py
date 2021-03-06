import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
xl=pd.ExcelFile("mpd2018.xlsx")
dfr=xl.parse('rgdpnapc')
dfc=xl.parse('cgdppc')
dfp=xl.parse('pop')
dfc.columns=dfc.iloc[0]
dfr.columns=dfr.iloc[0]
dfp.columns=dfp.iloc[0]
dfc.drop(dfc.index[0], inplace=True)
dfr.drop(dfr.index[0], inplace=True)
dfp.drop(dfp.index[0], inplace=True)
dfc.year=pd.to_numeric(dfc.year)
dfr.year=pd.to_numeric(dfr.year)
dfp.year=pd.to_numeric(dfp.year)
dfr.set_index('year', inplace=True)
dfc.set_index('year', inplace=True)
dfp.set_index('year', inplace=True)
fig, ax = plt.subplots()
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
for a in yournames:
    ratic=dfc[a]
    ratir=dfr[a]
    ratic=ratic.astype(np.double)
    ratir=ratir.astype(np.double)
    maskc=np.isfinite(ratic)
    maskr=np.isfinite(ratir)
    ratic=ratic[maskc]
    ratir=ratir[maskr]
    max1=max(ratir.loc[startd:endd])
    max2=max(ratic.loc[startd:endd])
    maxx=max(max1,max2)
    vol1.append(maxx)
    min1=min(ratir.loc[startd:endd])
    min2=min(ratic.loc[startd:endd])
    minx=min(min1,min2)
    vol1.append(minx)
    qz=yournames.index(a)/(len(yournames))
    qz=round(qz, 5)
    plt.plot(ratic, color=[0, qz, 1], lw='1', label=a)
    plt.plot(ratir, color=[1, qz, 0], lw='1')
volmax=max(vol1)
volmin=min(vol1)
axes.set_ylim([volmin,volmax])
plt.legend(loc='best', fontsize='xx-small', labelspacing=0.2)
plt.grid(which='minor',axis='y')
plt.grid(which='major',axis='y')
plt.grid(which='major',axis='x')
plt.ylabel("GDP per capita (PPP), 2011 USD")
plt.show()
