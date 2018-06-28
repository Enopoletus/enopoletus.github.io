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
ratic=dfc['India']
ratir=dfr['India']
ratic=ratic.astype(np.double)
ratir=ratir.astype(np.double)
maskc=np.isfinite(ratic)
maskr=np.isfinite(ratir)
ratic=ratic[maskc]
ratir=ratir[maskr]
weight1=abs(ratic.index-2011)/150
weight1=weight1.map(lambda x: 1 if x>1 else x)
ratiq=(ratic*weight1)+(ratir*(1-weight1))
print(weight1)
fig, ax = plt.subplots()
plt.plot(ratiq.index, ratiq, color='green', lw='1')
plt.plot(ratic.index, ratic, color="blue", lw='1')
plt.plot(ratir.index, ratir, color="red", lw='1')
plt.xticks(rotation=90)
axes = plt.gca()
axes.set_ylim([min(ratic.min(), ratir.min()), max(ratic.max(),ratir.max())])
axes.set_xlim([1650, 2017])
ax.set_yscale('log')
start, end = ax.get_xlim()
plt.xticks(np.arange(start, end, 10))
plt.savefig('gdpsrecon.png', bbox_inches='tight')
