import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
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
    # 1953 to include African and exclude most socialist countries
    bmk=dfi[a].loc[1500:1953].last_valid_index()
    if bmk==None:
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
    if a in ('SUN', 'RUS', 'KAZ', 'BLR'):
        ratiq=ratiq*.7
    maxx=max(ratiq.loc[startd:endd])
    vol1.append(maxx)
    minx=min(ratiq.loc[startd:endd])
    vol1.append(minx)
    qz=yournames.index(a)/(len(yournames))
    qz=round(qz, 5)
    plt.plot(ratiq.index, ratiq, color=[(1-qz), .7*(1-abs(1-(2*qz))), qz], lw='1', label=a)
volmax=max(vol1)
volmin=min(vol1)
axes.set_ylim([volmin,volmax])
plt.legend(loc='best', fontsize='xx-small', labelspacing=.1)
plt.show()
