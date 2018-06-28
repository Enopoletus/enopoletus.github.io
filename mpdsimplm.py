import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
xl=pd.ExcelFile("mpd2018.xlsx")
dfr=xl.parse('rgdpnapc')
dfc=xl.parse('cgdppc')
dfc.drop(dfc.index[0], inplace=True)
dfr.drop(dfr.index[0], inplace=True)
dfc.cgdppc=pd.to_numeric(dfc.cgdppc)
dfr.rgdpnapc=pd.to_numeric(dfr.rgdpnapc)
dfr.set_index('rgdpnapc', inplace=True)
dfc.set_index('cgdppc', inplace=True)
cgdp1=dfc['India']
rgdp1=dfr['India']
cgdp2=dfc['United Kingdom']
rgdp2=dfr['United Kingdom']
cgdp1=cgdp1.astype(np.double)
rgdp1=rgdp1.astype(np.double)
cgdp2=cgdp2.astype(np.double)
rgdp2=rgdp2.astype(np.double)
maskc1=np.isfinite(cgdp1)
maskr1=np.isfinite(rgdp1)
maskc2=np.isfinite(cgdp2)
maskr2=np.isfinite(rgdp2)
print(rgdp1.loc[2000:])
fig, ax = plt.subplots()
plt.plot(dfc.index[maskc1], cgdp1[maskc1], color='blue', lw='1')
plt.plot(dfr.index[maskr1], rgdp1[maskr1], color='red', lw='1')
plt.plot(dfc.index[maskc2], cgdp2[maskc2], color="cyan", lw='1')
plt.plot(dfr.index[maskr2], rgdp2[maskr2], color="magenta", lw='1')
plt.xticks(rotation=90)
axes = plt.gca()
axes.set_ylim([min(cgdp1.min(), rgdp1.min()), max(cgdp2.max(),rgdp2.max())])
axes.set_xlim([1650, 2017])
ax.set_yscale('log')
start, end = ax.get_xlim()
plt.xticks(np.arange(start, end, 10))
plt.savefig('countrygdps', bbox_inches='tight')
