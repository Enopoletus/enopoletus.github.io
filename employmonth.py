import pandas as pd
import matplotlib.pyplot as plt, mpld3
import numpy as np
import scipy.signal as sp
import matplotlib.ticker as plticker
df=pd.read_csv('numbers2.csv')
df.columns=['DATE', 'EMPLOYEES']
df.DATE=pd.to_datetime(df.DATE)
df.EMPLOYEES=np.log(df.EMPLOYEES)
trend=sp.savgol_filter(df.EMPLOYEES, 707, 4)
unsp=df.EMPLOYEES-trend
unep=abs(unsp)
unyp=(sp.savgol_filter(unep, 707, 6))
uns=-(unsp)*(.5/(np.log(2)-np.log(1)))
une=abs(uns)
uny=(sp.savgol_filter(une, 707, 6))
unw=uns+uny-(uns+uny).min()
fig, ax = plt.subplots()
plt.plot(df.DATE, unw, color='blue', lw=2)
start, end = ax.get_xlim()
plt.xticks(np.arange(start, end, 1825.5))
plt.xticks(rotation=90)
axes = plt.gca()
axes.set_ylim([unw.min(), unw.max()])
axes.set_xlim([df.DATE.min(), df.DATE.max()])
plt.savefig('foom.png', bbox_inches='tight')
